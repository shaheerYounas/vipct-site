import Link from "next/link";
import { AdminShell, SetupNotice } from "@/components/AdminShell";
import { getDashboardStats, listBookings } from "@/lib/admin-data";
import { requireStaff } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function BookingsPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string; search?: string; from?: string; to?: string }>;
}) {
  const staff = await requireStaff();
  const { status, search, from, to } = await searchParams;
  const [bookings, stats] = await Promise.all([listBookings({ status, search, from, to }), getDashboardStats()]);
  const exportHref = `/admin/bookings/export?${new URLSearchParams(
    Object.entries({ status: status || "", search: search || "", from: from || "", to: to || "" }).filter(([, value]) => value)
  ).toString()}`;

  return (
    <AdminShell title="Bookings">
      <div className="admin-grid">
        {staff.mode === "setup" ? <SetupNotice /> : null}
        <article className="admin-card">
          <h2>{stats.pendingBookings}</h2>
          <p className="admin-muted">Open bookings needing a human step</p>
        </article>
        <article className="admin-card">
          <h2>{stats.quotedBookings}</h2>
          <p className="admin-muted">Quotes sent and waiting on response</p>
        </article>
        <article className="admin-card">
          <h2>{stats.assignedBookings}</h2>
          <p className="admin-muted">Trips already assigned to resources</p>
        </article>
        <article className="admin-card wide">
          <form className="admin-form" style={{ maxWidth: "100%", marginBottom: 16 }} method="GET">
            <div className="admin-toolbar">
              <input name="search" placeholder="Search customer, phone, email, pickup or dropoff" defaultValue={search} />
              <select name="status" defaultValue={status || ""}>
                <option value="">all statuses</option>
                {["new", "reviewing", "quoted", "confirmed", "assigned", "completed", "cancelled"].map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
              <input name="from" type="date" defaultValue={from} />
              <input name="to" type="date" defaultValue={to} />
              <button className="btn primary" type="submit">
                Filter
              </button>
              <Link className="btn" href="/admin/bookings">
                Reset
              </Link>
              <a className="btn" href={exportHref}>
                Export CSV
              </a>
            </div>
          </form>
          <div className="actions" style={{ marginBottom: 12, flexWrap: "wrap" }}>
            {["new", "reviewing", "quoted", "confirmed", "assigned", "completed", "cancelled"].map((item) => (
              <Link className="btn" href={`/admin/bookings?status=${item}`} key={item}>
                {item}
              </Link>
            ))}
            <Link className="btn" href="/admin/bookings">
              all
            </Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Customer</th>
                <th>Route</th>
                <th>Trip</th>
                <th>Estimate</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking: any) => (
                <tr key={booking.id}>
                  <td>
                    <Link href={`/admin/bookings/${booking.id}`}>{booking.status}</Link>
                  </td>
                  <td>
                    {booking.customer_name}
                    <br />
                    <span className="admin-muted">
                      {booking.customer_email}
                      <br />
                      {booking.customer_phone}
                    </span>
                  </td>
                  <td>
                    <span>{booking.route_key || booking.service_key || "custom"}</span>
                    <br />
                    <span className="admin-muted">{booking.vehicle_preference || "vehicle TBD"}</span>
                  </td>
                  <td>
                    {booking.pickup_date} {booking.pickup_time}
                    <br />
                    {booking.pickup} to {booking.dropoff}
                  </td>
                  <td>
                    {booking.internal_estimate_total
                      ? `${booking.internal_estimate_total} ${booking.internal_estimate_currency}`
                      : "Manual"}
                  </td>
                  <td>{new Date(booking.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {!bookings.length ? (
                <tr>
                  <td colSpan={6}>No bookings found.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </article>
      </div>
    </AdminShell>
  );
}
