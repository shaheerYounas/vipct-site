import { createClient, type User } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local", quiet: true });
config({ quiet: true });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:5500";
const generateLinks = process.argv.includes("--generate-links");
const explicitEmails = process.argv
  .slice(2)
  .filter((value) => !value.startsWith("--"))
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean);

if (!url || !serviceRole) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
}

const emails = explicitEmails.length ? explicitEmails : adminEmailsFromEnv();
if (!emails.length) {
  throw new Error("No admin emails found. Set ADMIN_EMAILS or pass email arguments to the script.");
}

const supabase = createClient(url, serviceRole, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const users = await listAllUsers();
const results = [];

for (const email of emails) {
  let user = users.find((entry) => (entry.email || "").toLowerCase() === email) || null;
  let created = false;

  if (!user) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { role: "admin", source: "admins:sync" }
    });
    if (error) throw error;
    if (!data.user) throw new Error(`Supabase did not return a user for ${email}.`);
    user = data.user;
    users.push(user);
    created = true;
  } else {
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
      email_confirm: true,
      user_metadata: { ...(user.user_metadata || {}), role: "admin", source: "admins:sync" }
    });
    if (error) throw error;
  }

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email,
      role: "admin"
    },
    { onConflict: "id" }
  );
  if (profileError) throw profileError;

  let magicLink: string | null = null;
  if (generateLinks) {
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: `${siteUrl}/auth/callback?next=/admin` }
    });
    if (error) throw error;
    magicLink = data.properties?.action_link || null;
  }

  results.push({
    email,
    userId: user.id,
    created,
    role: "admin",
    magicLink
  });
}

console.log(
  JSON.stringify(
    {
      synced: results.length,
      generateLinks,
      results
    },
    null,
    2
  )
);

function adminEmailsFromEnv(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

async function listAllUsers(): Promise<User[]> {
  const users: User[] = [];

  for (let page = 1; ; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    users.push(...data.users);
    if (data.users.length < 1000) return users;
  }
}
