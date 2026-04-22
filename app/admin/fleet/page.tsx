import { revalidatePath } from "next/cache";
import { AdminShell, SetupNotice } from "@/components/AdminShell";
import { listFleetAndDrivers, listVehicleBlocks } from "@/lib/admin-data";
import { requireStaff } from "@/lib/admin-auth";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function FleetAdminPage() {
  const staff = await requireStaff();
  const [{ vehicles }, vehicleBlocks] = await Promise.all([listFleetAndDrivers(), listVehicleBlocks()]);

  async function addVehicle(formData: FormData) {
    "use server";
    await requireStaff();
    const supabase = getServiceClient();
    if (!supabase) return;
    await supabase.from("vehicles").insert({
      display_name: String(formData.get("display_name")),
      vehicle_type: String(formData.get("vehicle_type")),
      seats: Number(formData.get("seats")),
      luggage_capacity: String(formData.get("luggage_capacity") || ""),
      status: "active"
    });
    revalidatePath("/admin/fleet");
  }

  async function updateVehicleStatus(formData: FormData) {
    "use server";
    await requireStaff();
    const supabase = getServiceClient();
    if (!supabase) return;
    await supabase
      .from("vehicles")
      .update({ status: String(formData.get("status") || "active") })
      .eq("id", String(formData.get("id") || ""));
    revalidatePath("/admin/fleet");
  }

  async function addVehicleBlock(formData: FormData) {
    "use server";
    await requireStaff();
    const supabase = getServiceClient();
    if (!supabase) return;
    await supabase.from("vehicle_blocks").insert({
      vehicle_id: String(formData.get("vehicle_id") || ""),
      starts_at: toIso(String(formData.get("starts_at") || "")),
      ends_at: toIso(String(formData.get("ends_at") || "")),
      reason: String(formData.get("reason") || "")
    });
    revalidatePath("/admin/fleet");
    revalidatePath("/admin/schedule");
  }

  return (
    <AdminShell title="Fleet">
      <div className="admin-grid">
        {staff.mode === "setup" ? <SetupNotice /> : null}
        <article className="admin-card">
          <h2>Add vehicle</h2>
          <form className="admin-form" action={addVehicle}>
            <input name="display_name" placeholder="Mercedes V-Class 01" required />
            <select name="vehicle_type" defaultValue="v-class">
              <option value="sedan">sedan</option>
              <option value="v-class">v-class</option>
              <option value="minibus">minibus</option>
              <option value="coach">coach</option>
            </select>
            <input name="seats" type="number" min="1" max="80" required />
            <input name="luggage_capacity" placeholder="5-7 bags" />
            <button className="btn primary" type="submit">
              Add vehicle
            </button>
          </form>
        </article>
        <article className="admin-card">
          <h2>Vehicle block</h2>
          <form className="admin-form" action={addVehicleBlock}>
            <select name="vehicle_id" defaultValue="">
              <option value="">Choose vehicle</option>
              {vehicles.map((vehicle: any) => (
                <option value={vehicle.id} key={vehicle.id}>
                  {vehicle.display_name}
                </option>
              ))}
            </select>
            <input name="starts_at" type="datetime-local" required />
            <input name="ends_at" type="datetime-local" required />
            <textarea name="reason" placeholder="Maintenance, detailing, service inspection..." />
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
                <th>Type</th>
                <th>Seats</th>
                <th>Luggage</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle: any) => (
                <tr key={vehicle.id}>
                  <td>{vehicle.display_name}</td>
                  <td>{vehicle.vehicle_type}</td>
                  <td>{vehicle.seats}</td>
                  <td>{vehicle.luggage_capacity}</td>
                  <td>
                    <form className="admin-inline" action={updateVehicleStatus}>
                      <input type="hidden" name="id" value={vehicle.id} />
                      <select name="status" defaultValue={vehicle.status}>
                        <option value="active">active</option>
                        <option value="maintenance">maintenance</option>
                        <option value="inactive">inactive</option>
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
          <h2>Vehicle blocks</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Window</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {vehicleBlocks.map((block: any) => (
                <tr key={block.id}>
                  <td>{block.vehicles?.display_name || "-"}</td>
                  <td>
                    {new Date(block.starts_at).toLocaleString()}
                    <br />
                    {new Date(block.ends_at).toLocaleString()}
                  </td>
                  <td>{block.reason || "-"}</td>
                </tr>
              ))}
              {!vehicleBlocks.length ? (
                <tr>
                  <td colSpan={3}>No vehicle blocks recorded.</td>
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
