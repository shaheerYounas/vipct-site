import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { adminEmails, getEnv, hasSupabaseConfig } from "@/lib/env";

export function getServiceClient(): SupabaseClient | null {
  if (!hasSupabaseConfig()) return null;
  return createClient(getEnv("NEXT_PUBLIC_SUPABASE_URL")!, getEnv("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

export async function getUserClient(): Promise<SupabaseClient | null> {
  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anon = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!url || !anon) return null;

  const cookieStore = await cookies();
  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot always set cookies; route handlers and actions can.
        }
      }
    }
  });
}

export async function getStaffUser() {
  const client = await getUserClient();
  if (!client) return { mode: "setup" as const, user: null, client: null };

  const {
    data: { user }
  } = await client.auth.getUser();

  if (!user?.email) return { mode: "anonymous" as const, user: null, client };

  const allowed = adminEmails();
  if (allowed.length && !allowed.includes(user.email.toLowerCase())) {
    return { mode: "forbidden" as const, user, client };
  }

  return { mode: "staff" as const, user, client };
}
