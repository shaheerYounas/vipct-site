export function getEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim() ? value.trim() : undefined;
}

export function getRequiredEnv(name: string): string {
  const value = getEnv(name);
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export function hasSupabaseConfig(): boolean {
  return Boolean(
    getEnv("NEXT_PUBLIC_SUPABASE_URL") &&
      getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") &&
      getEnv("SUPABASE_SERVICE_ROLE_KEY")
  );
}

export function adminEmails(): string[] {
  return (getEnv("ADMIN_EMAILS") || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function siteUrl(): string {
  return getEnv("NEXT_PUBLIC_SITE_URL") || "http://127.0.0.1:5500";
}
