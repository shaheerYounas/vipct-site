import { revalidatePath } from "next/cache";
import { AdminShell } from "@/components/AdminShell";
import { listPricingData } from "@/lib/admin-data";
import { requireStaff } from "@/lib/admin-auth";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  await requireStaff();
  const { rules, surcharges, configured } = await listPricingData();

  async function saveRule(formData: FormData) {
    "use server";
    await requireStaff();
    const supabase = getServiceClient();
    if (!supabase) return;
    await supabase.from("price_rules").upsert(
      {
        key: String(formData.get("key") || "").trim(),
        route_keys: parseList(formData.get("route_keys")),
        service_keys: parseList(formData.get("service_keys")),
        base_price: Number(formData.get("base_price") || 0),
        currency: "EUR",
        duration_minutes: Number(formData.get("duration_minutes") || 0),
        included_waiting_minutes: Number(formData.get("included_waiting_minutes") || 0),
        status: "active"
      },
      { onConflict: "key" }
    );
    revalidatePath("/admin/pricing");
  }

  async function saveVehicleRate(formData: FormData) {
    "use server";
    await requireStaff();
    const supabase = getServiceClient();
    if (!supabase) return;
    const priceRuleId = String(formData.get("price_rule_id") || "");
    if (!priceRuleId) return;
    await supabase.from("price_rule_vehicle_rates").upsert(
      {
        price_rule_id: priceRuleId,
        vehicle_type: String(formData.get("vehicle_type") || ""),
        multiplier: Number(formData.get("multiplier") || 1),
        minimum_price: Number(formData.get("minimum_price") || 0)
      },
      { onConflict: "price_rule_id,vehicle_type" }
    );
    revalidatePath("/admin/pricing");
  }

  async function saveSurcharge(formData: FormData) {
    "use server";
    await requireStaff();
    const supabase = getServiceClient();
    if (!supabase) return;
    const conditionsRaw = String(formData.get("conditions") || "{}").trim();
    await supabase.from("price_surcharges").upsert(
      {
        key: String(formData.get("key") || "").trim(),
        label: String(formData.get("label") || "").trim(),
        surcharge_type: String(formData.get("surcharge_type") || "percent"),
        value: Number(formData.get("value") || 0),
        conditions: JSON.parse(conditionsRaw || "{}"),
        status: "active"
      },
      { onConflict: "key" }
    );
    revalidatePath("/admin/pricing");
  }

  return (
    <AdminShell title="Pricing rules">
      <div className="admin-grid">
        <article className="admin-card">
          <h2>Rule editor</h2>
          <form className="admin-form" action={saveRule}>
            <input name="key" placeholder="prague-berlin" required />
            <input name="route_keys" placeholder="berlin, airport" />
            <input name="service_keys" placeholder="europe-transfer, daily-tour" />
            <input name="base_price" type="number" min="0" step="5" placeholder="EUR base price" required />
            <input name="duration_minutes" type="number" min="15" step="15" placeholder="Duration minutes" required />
            <input
              name="included_waiting_minutes"
              type="number"
              min="0"
              step="5"
              placeholder="Included waiting minutes"
              defaultValue="0"
            />
            <button className="btn primary" type="submit" disabled={!configured}>
              Save rule
            </button>
          </form>
        </article>
        <article className="admin-card">
          <h2>Vehicle rate</h2>
          <form className="admin-form" action={saveVehicleRate}>
            <select name="price_rule_id" defaultValue="">
              <option value="">Choose rule</option>
              {rules.map((rule: any) => (
                <option value={rule.id} key={rule.id || rule.key}>
                  {rule.key}
                </option>
              ))}
            </select>
            <select name="vehicle_type" defaultValue="sedan">
              <option value="sedan">sedan</option>
              <option value="v-class">v-class</option>
              <option value="minibus">minibus</option>
              <option value="coach">coach</option>
            </select>
            <input name="multiplier" type="number" min="0.1" step="0.05" defaultValue="1" />
            <input name="minimum_price" type="number" min="0" step="5" defaultValue="0" />
            <button className="btn primary" type="submit" disabled={!configured}>
              Save vehicle rate
            </button>
          </form>
        </article>
        <article className="admin-card">
          <h2>Surcharge</h2>
          <form className="admin-form" action={saveSurcharge}>
            <input name="key" placeholder="night" required />
            <input name="label" placeholder="Night surcharge" required />
            <select name="surcharge_type" defaultValue="percent">
              <option value="percent">percent</option>
              <option value="fixed">fixed</option>
            </select>
            <input name="value" type="number" min="0" step="1" defaultValue="15" />
            <textarea name="conditions" defaultValue='{"from":"22:00","to":"06:00"}' />
            <button className="btn primary" type="submit" disabled={!configured}>
              Save surcharge
            </button>
          </form>
        </article>
        <article className="admin-card wide">
          <p className="admin-muted">
            Internal estimates stay staff-only. Rules, vehicle multipliers, and surcharges below come from Supabase when
            configured, with local seed rules as a fallback.
          </p>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Rule</th>
                <th>Routes</th>
                <th>Services</th>
                <th>Base EUR</th>
                <th>Duration</th>
                <th>Vehicle rates</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule: any) => (
                <tr key={rule.id || rule.key}>
                  <td>{rule.key}</td>
                  <td>{(rule.route_keys || rule.routeKeys || []).join(", ")}</td>
                  <td>{(rule.service_keys || rule.serviceKeys || []).join(", ")}</td>
                  <td>{rule.base_price ?? rule.basePrice}</td>
                  <td>{rule.duration_minutes ?? rule.durationMinutes} min</td>
                  <td>
                    {(rule.price_rule_vehicle_rates || []).length ? (
                      <div className="admin-stack">
                        {rule.price_rule_vehicle_rates.map((rate: any) => (
                          <span key={`${rule.key}-${rate.vehicle_type}`}>
                            {rate.vehicle_type}: x{rate.multiplier}
                            {rate.minimum_price ? ` / min ${rate.minimum_price} EUR` : ""}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="admin-muted">Seed fallback</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
        <article className="admin-card wide">
          <h2>Surcharges</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Label</th>
                <th>Type</th>
                <th>Value</th>
                <th>Conditions</th>
              </tr>
            </thead>
            <tbody>
              {surcharges.map((surcharge: any) => (
                <tr key={surcharge.id || surcharge.key}>
                  <td>{surcharge.key}</td>
                  <td>{surcharge.label}</td>
                  <td>{surcharge.surcharge_type}</td>
                  <td>{surcharge.value}</td>
                  <td>
                    <pre className="preview">{JSON.stringify(surcharge.conditions || {}, null, 2)}</pre>
                  </td>
                </tr>
              ))}
              {!surcharges.length ? (
                <tr>
                  <td colSpan={5}>No surcharges configured.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </article>
      </div>
    </AdminShell>
  );
}

function parseList(value: FormDataEntryValue | null) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
