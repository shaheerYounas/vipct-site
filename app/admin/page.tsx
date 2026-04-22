import Link from "next/link";
import { AdminShell, SetupNotice } from "@/components/AdminShell";
import { requireStaff } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const cards = [
  ["/admin/bookings", "Bookings", "Review quote requests, update status, add notes and assign resources."],
  ["/admin/schedule", "Schedule", "See driver and vehicle assignments with conflict warnings."],
  ["/admin/pricing", "Pricing", "Review known-route rules and internal estimate behavior."],
  ["/admin/cms", "CMS", "Manage multilingual public content collections."],
  ["/admin/fleet", "Fleet", "Manage vehicles and operational capacity records."],
  ["/admin/drivers", "Drivers", "Manage driver records and availability blocks."]
] as const;

export default async function AdminPage() {
  const staff = await requireStaff();
  return (
    <AdminShell title="Operations dashboard">
      <div className="admin-grid">
        {staff.mode === "setup" ? <SetupNotice /> : null}
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
