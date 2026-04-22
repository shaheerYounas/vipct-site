import { revalidatePath } from "next/cache";
import { AdminShell, SetupNotice } from "@/components/AdminShell";
import { listFleetAndDrivers } from "@/lib/admin-data";
import { requireStaff } from "@/lib/admin-auth";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function FleetAdminPage() {
  const staff = await requireStaff();
  const { vehicles } = await listFleetAndDrivers();

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
                  <td>{vehicle.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </div>
    </AdminShell>
  );
}
