import { AdminShell, SetupNotice } from "@/components/AdminShell";
import { listCustomers } from "@/lib/admin-data";
import { requireStaff } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const staff = await requireStaff();
  const { search } = await searchParams;
  const customers = await listCustomers(search);

  return (
    <AdminShell title="Customers">
      <div className="admin-grid">
        {staff.mode === "setup" ? <SetupNotice /> : null}
        <article className="admin-card wide">
          <form className="admin-form" style={{ maxWidth: "100%", marginBottom: 16 }} method="GET">
            <div className="admin-toolbar">
              <input name="search" placeholder="Search name, email or phone" defaultValue={search} />
              <button className="btn primary" type="submit">
                Search
              </button>
            </div>
          </form>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Language</th>
                <th>Open</th>
                <th>Bookings</th>
                <th>Value</th>
                <th>Latest booking</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer: any) => (
                <tr key={customer.id}>
                  <td>
                    <strong>{customer.name}</strong>
                    <br />
                    <span className="admin-muted">
                      {customer.email || "no email"}
                      <br />
                      {customer.phone || "no phone"}
                    </span>
                  </td>
                  <td>{customer.language}</td>
                  <td>{customer.openBookings}</td>
                  <td>{customer.bookingCount}</td>
                  <td>{customer.estimatedRevenue.toFixed(0)} EUR</td>
                  <td>
                    {customer.latestBooking ? (
                      <>
                        {customer.latestBooking.pickup_date} · {customer.latestBooking.pickup} to {customer.latestBooking.dropoff}
                        <br />
                        <span className="admin-muted">{customer.latestBooking.status}</span>
                      </>
                    ) : (
                      <span className="admin-muted">No bookings yet.</span>
                    )}
                  </td>
                </tr>
              ))}
              {!customers.length ? (
                <tr>
                  <td colSpan={6}>No customers found.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </article>
      </div>
    </AdminShell>
  );
}
