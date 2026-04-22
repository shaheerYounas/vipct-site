import { AdminShell } from "@/components/AdminShell";
import { listLocalPriceRules } from "@/lib/admin-data";
import { requireStaff } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  await requireStaff();
  const rules = listLocalPriceRules();
  return (
    <AdminShell title="Pricing rules">
      <div className="admin-grid">
        <article className="admin-card wide">
          <p className="admin-muted">
            V1 computes internal estimates only. These seed rules are mirrored in Supabase price_rules and can be extended
            in the admin data model.
          </p>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Rule</th>
                <th>Routes</th>
                <th>Services</th>
                <th>Base EUR</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.key}>
                  <td>{rule.key}</td>
                  <td>{rule.routeKeys.join(", ")}</td>
                  <td>{rule.serviceKeys.join(", ")}</td>
                  <td>{rule.basePrice}</td>
                  <td>{rule.durationMinutes} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </div>
    </AdminShell>
  );
}
