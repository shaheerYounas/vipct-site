import Link from "next/link";
import type React from "react";

const adminLinks = [
  ["/admin", "Dashboard"],
  ["/admin/bookings", "Bookings"],
  ["/admin/customers", "Customers"],
  ["/admin/schedule", "Schedule"],
  ["/admin/pricing", "Pricing"],
  ["/admin/cms", "CMS"],
  ["/admin/fleet", "Fleet"],
  ["/admin/drivers", "Drivers"],
  ["/admin/settings", "Settings"]
] as const;

export function AdminShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <header className="site-header">
        <div className="container nav">
          <Link className="brand" href="/admin">
            <span className="brand-mark">
              <img src="/assets/optimized/logo-gold.webp" width={46} height={46} alt="" />
            </span>
            <span>
              <span className="brand-name">VIPCT Admin</span>
              <span className="brand-meta">Operations</span>
            </span>
          </Link>
          <nav className="nav-links" aria-label="Admin">
            {adminLinks.map(([href, label]) => (
              <Link href={href} key={href}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="admin-main">
        <div className="section-head">
          <h1>{title}</h1>
          <p>Staff-only operations for bookings, CMS, pricing and scheduling.</p>
        </div>
        {children}
      </main>
    </div>
  );
}

export function SetupNotice() {
  return (
    <article className="admin-card wide">
      <h2>Supabase is not configured</h2>
      <p className="admin-muted">
        Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY,
        ADMIN_EMAILS and REVALIDATE_SECRET to enable live admin data.
      </p>
    </article>
  );
}
