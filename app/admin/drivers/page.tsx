import { revalidatePath } from "next/cache";
import { AdminShell, SetupNotice } from "@/components/AdminShell";
import { listFleetAndDrivers } from "@/lib/admin-data";
import { requireStaff } from "@/lib/admin-auth";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function DriversPage() {
  const staff = await requireStaff();
  const { drivers } = await listFleetAndDrivers();

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
                  <td>{driver.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </div>
    </AdminShell>
  );
}
