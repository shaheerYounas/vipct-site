import { redirect } from "next/navigation";
import { getEnv, siteUrl } from "@/lib/env";
import { getUserClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default function LoginPage({ searchParams }: { searchParams: Promise<{ sent?: string; error?: string }> }) {
  async function login(formData: FormData) {
    "use server";
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const allowedEmails = allowedAdminEmails();
    if (allowedEmails.length && !allowedEmails.includes(email)) {
      redirect("/admin/login?error=not_allowed");
    }
    const client = await getUserClient();
    if (!client || !getEnv("NEXT_PUBLIC_SUPABASE_URL")) redirect("/admin/login?error=config");
    const { error } = await client.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${siteUrl()}/auth/callback?next=/admin` }
    });
    if (error) redirect("/admin/login?error=auth");
    redirect("/admin/login?sent=1");
  }

  return (
    <main className="admin-shell">
      <div className="admin-main">
        <article className="admin-card wide">
          <h1>Staff login</h1>
          <p className="admin-muted">Enter an allowed staff email address to receive a Supabase magic link.</p>
          <LoginState searchParams={searchParams} />
          <form className="admin-form" action={login}>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required placeholder={primaryAdminEmail() || "info@vipct.org"} />
            <button className="btn primary" type="submit">
              Send magic link
            </button>
          </form>
        </article>
      </div>
    </main>
  );
}

async function LoginState({
  searchParams
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const params = await searchParams;
  if (params.sent) {
    return <p className="admin-muted">Magic link sent. For local Supabase, check Mailpit at http://127.0.0.1:54324.</p>;
  }

  if (params.error) {
    const message =
      params.error === "not_allowed"
        ? "This email is not in ADMIN_EMAILS. Update the allowlist and run npm run admins:sync."
        : params.error;
    return <p className="form-error">Login failed: {message}</p>;
  }

  return null;
}

function primaryAdminEmail() {
  return allowedAdminEmails()[0];
}

function allowedAdminEmails() {
  return (getEnv("ADMIN_EMAILS") || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}
