import { revalidatePath } from "next/cache";
import { AdminShell, SetupNotice } from "@/components/AdminShell";
import { listDriverAvailability, listFleetAndDrivers } from "@/lib/admin-data";
import { requireStaff } from "@/lib/admin-auth";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function DriversPage() {
  const staff = await requireStaff();
  const [{ drivers }, availability] = await Promise.all([listFleetAndDrivers(), listDriverAvailability()]);

  async function addDriver(formData: FormData) {
    "use server";
    await requireStaff();
    const supabase = getServiceClient();
    if (!supabase) return;
    await supabase.from("drivers").insert({
      display_name: String(formData.get("display_name")),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      status: "active"
    });
    revalidatePath("/admin/drivers");
  }

  async function updateDriverStatus(formData: FormData) {
    "use server";
    await requireStaff();
    const supabase = getServiceClient();
    if (!supabase) return;
    await supabase
      .from("drivers")
      .update({ status: String(formData.get("status") || "active") })
      .eq("id", String(formData.get("id") || ""));
    revalidatePath("/admin/drivers");
  }

  async function addAvailabilityBlock(formData: FormData) {
    "use server";
    await requireStaff();
    const supabase = getServiceClient();
    if (!supabase) return;
    await supabase.from("driver_availability").insert({
      driver_id: String(formData.get("driver_id") || ""),
      starts_at: toIso(String(formData.get("starts_at") || "")),
      ends_at: toIso(String(formData.get("ends_at") || "")),
      availability_type: String(formData.get("availability_type") || "unavailable"),
      note: String(formData.get("note") || "")
    });
    revalidatePath("/admin/drivers");
    revalidatePath("/admin/schedule");
  }

  return (
    <AdminShell title="Drivers">
      <div className="admin-grid">
        {staff.mode === "setup" ? <SetupNotice /> : null}
        <article className="admin-card">
          <h2>Add driver</h2>
          <form className="admin-form" action={addDriver}>
            <input name="display_name" placeholder="Driver name" required />
            <input name="phone" placeholder="+420..." />
            <input name="email" type="email" placeholder="driver@example.com" />
            <button className="btn primary" type="submit">
              Add driver
            </button>
          </form>
        </article>
        <article className="admin-card">
          <h2>Availability block</h2>
          <form className="admin-form" action={addAvailabilityBlock}>
            <select name="driver_id" defaultValue="">
              <option value="">Choose driver</option>
              {drivers.map((driver: any) => (
                <option value={driver.id} key={driver.id}>
                  {driver.display_name}
                </option>
              ))}
            </select>
            <select name="availability_type" defaultValue="unavailable">
              <option value="unavailable">unavailable</option>
              <option value="holiday">holiday</option>
              <option value="available">available override</option>
            </select>
            <input name="starts_at" type="datetime-local" required />
            <input name="ends_at" type="datetime-local" required />
            <textarea name="note" placeholder="Vacation, illness, shift cap, manual blackout..." />
            <button className="btn primary" type="submit">
              Add block
            </button>
          </form>
        </article>
        <article className="admin-card wide">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver: any) => (
                <tr key={driver.id}>
                  <td>{driver.display_name}</td>
                  <td>{driver.phone}</td>
                  <td>{driver.email}</td>
                  <td>
                    <form className="admin-inline" action={updateDriverStatus}>
                      <input type="hidden" name="id" value={driver.id} />
                      <select name="status" defaultValue={driver.status}>
                        <option value="active">active</option>
                        <option value="inactive">inactive</option>
                        <option value="on-leave">on-leave</option>
                      </select>
                      <button className="btn" type="submit">
                        Save
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
        <article className="admin-card wide">
          <h2>Availability blocks</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Driver</th>
                <th>Window</th>
                <th>Type</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {availability.map((block: any) => (
                <tr key={block.id}>
                  <td>{block.drivers?.display_name || "-"}</td>
                  <td>
                    {new Date(block.starts_at).toLocaleString()}
                    <br />
                    {new Date(block.ends_at).toLocaleString()}
                  </td>
                  <td>{block.availability_type}</td>
                  <td>{block.note || "-"}</td>
                </tr>
              ))}
              {!availability.length ? (
                <tr>
                  <td colSpan={4}>No availability blocks recorded.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </article>
      </div>
    </AdminShell>
  );
}

function toIso(value: string) {
  return new Date(value).toISOString();
}
