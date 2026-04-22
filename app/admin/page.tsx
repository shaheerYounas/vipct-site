import Link from "next/link";
import { AdminShell, SetupNotice } from "@/components/AdminShell";
import { getDashboardStats } from "@/lib/admin-data";
import { requireStaff } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const cards = [
  ["/admin/bookings", "Bookings", "Review quote requests, update status, add notes and assign resources."],
  ["/admin/customers", "Customers", "Track repeat clients, open requests and recent booking history."],
  ["/admin/schedule", "Schedule", "See driver and vehicle assignments with conflict warnings."],
  ["/admin/pricing", "Pricing", "Review known-route rules and internal estimate behavior."],
  ["/admin/cms", "CMS", "Manage multilingual public content collections."],
  ["/admin/fleet", "Fleet", "Manage vehicles and operational capacity records."],
  ["/admin/drivers", "Drivers", "Manage driver records and availability blocks."]
] as const;

export default async function AdminPage() {
  const staff = await requireStaff();
  const stats = await getDashboardStats();
  return (
    <AdminShell title="Operations dashboard">
      <div className="admin-grid">
        {staff.mode === "setup" ? <SetupNotice /> : null}
        <article className="admin-card">
          <h2>{stats.totalBookings}</h2>
          <p className="admin-muted">Total booking requests</p>
        </article>
        <article className="admin-card">
          <h2>{stats.pendingBookings}</h2>
          <p className="admin-muted">Need review or confirmation</p>
        </article>
        <article className="admin-card">
          <h2>{stats.pipelineEstimate.toFixed(0)} EUR</h2>
          <p className="admin-muted">Open pipeline from internal estimates</p>
        </article>
        <article className="admin-card">
          <h2>{stats.customers}</h2>
          <p className="admin-muted">Tracked customers</p>
        </article>
        <article className="admin-card">
          <h2>{stats.upcomingAssignments}</h2>
          <p className="admin-muted">Upcoming assignments</p>
        </article>
        <article className="admin-card">
          <h2>
            {stats.drivers} / {stats.vehicles}
          </h2>
          <p className="admin-muted">Drivers and vehicles in the ops pool</p>
        </article>
        {cards.map(([href, title, text]) => (
          <Link className="admin-card" href={href} key={href}>
            <h2>{title}</h2>
            <p className="admin-muted">{text}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
