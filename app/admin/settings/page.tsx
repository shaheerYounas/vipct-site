import { AdminShell } from "@/components/AdminShell";
import { requireStaff } from "@/lib/admin-auth";
import { getEnv, hasSupabaseConfig } from "@/lib/env";

export const dynamic = "force-dynamic";

const required = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "RESEND_API_KEY",
  "ADMIN_EMAILS",
  "REVALIDATE_SECRET"
];

export default async function SettingsPage() {
  await requireStaff();
  return (
    <AdminShell title="Settings">
      <div className="admin-grid">
        <article className="admin-card wide">
          <h2>Environment</h2>
          <p className="admin-muted">Supabase configured: {hasSupabaseConfig() ? "yes" : "no"}</p>
          <table className="admin-table">
            <tbody>
              {required.map((name) => (
                <tr key={name}>
                  <th>{name}</th>
                  <td>{getEnv(name) ? "set" : "missing"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </div>
    </AdminShell>
  );
}
