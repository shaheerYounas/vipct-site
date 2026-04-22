import Link from "next/link";
import { AdminShell, SetupNotice } from "@/components/AdminShell";
import { listBookings } from "@/lib/admin-data";
import { requireStaff } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function BookingsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const staff = await requireStaff();
  const { status } = await searchParams;
  const bookings = await listBookings(status);
  return (
    <AdminShell title="Bookings">
      <div className="admin-grid">
        {staff.mode === "setup" ? <SetupNotice /> : null}
        <article className="admin-card wide">
          <div className="actions" style={{ marginBottom: 12 }}>
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
                    <span className="admin-muted">{booking.customer_email}</span>
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
                  <td colSpan={5}>No bookings found.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </article>
      </div>
    </AdminShell>
  );
}
