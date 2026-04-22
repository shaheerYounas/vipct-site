import { revalidatePath } from "next/cache";
import { AdminShell, SetupNotice } from "@/components/AdminShell";
import { getBooking, listFleetAndDrivers } from "@/lib/admin-data";
import { requireStaff } from "@/lib/admin-auth";
import { getServiceClient } from "@/lib/supabase";
import { buildBookingMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaff();
  const { id } = await params;
  const [booking, resources] = await Promise.all([getBooking(id), listFleetAndDrivers()]);

  async function updateStatus(formData: FormData) {
    "use server";
    await requireStaff();
    const supabase = getServiceClient();
    if (!supabase) return;
    const status = String(formData.get("status"));
    await supabase.from("booking_requests").update({ status }).eq("id", id);
    await supabase.from("booking_events").insert({ booking_request_id: id, event_type: "status_changed", payload: { status } });
    revalidatePath(`/admin/bookings/${id}`);
  }

  async function addNote(formData: FormData) {
    "use server";
    await requireStaff();
    const supabase = getServiceClient();
    if (!supabase) return;
    const body = String(formData.get("body") || "").trim();
    if (!body) return;
    await supabase.from("internal_notes").insert({ booking_request_id: id, body });
    revalidatePath(`/admin/bookings/${id}`);
  }

  async function assignResource(formData: FormData) {
    "use server";
    await requireStaff();
    const supabase = getServiceClient();
    if (!supabase) return;
    await supabase.from("booking_assignments").insert({
      booking_request_id: id,
      driver_id: String(formData.get("driver_id") || "") || null,
      vehicle_id: String(formData.get("vehicle_id") || "") || null,
      starts_at: String(formData.get("starts_at")),
      ends_at: String(formData.get("ends_at")),
      buffer_minutes: Number(formData.get("buffer_minutes") || 30)
    });
    await supabase.from("booking_requests").update({ status: "assigned" }).eq("id", id);
    revalidatePath(`/admin/bookings/${id}`);
    revalidatePath("/admin/schedule");
  }

  const message = booking?.payload ? buildBookingMessage(booking.payload, {
    status: booking.internal_estimate_status,
    currency: booking.internal_estimate_currency || "EUR",
    total: booking.internal_estimate_total,
    breakdown: booking.internal_estimate_breakdown || [],
    notes: booking.internal_estimate_notes || []
  }) : "";

  return (
    <AdminShell title="Booking detail">
      <div className="admin-grid">
        {staff.mode === "setup" ? <SetupNotice /> : null}
        {!booking ? (
          <article className="admin-card wide">Booking not found or Supabase is not configured.</article>
        ) : (
          <>
            <article className="admin-card wide">
              <h2>
                {booking.customer_name}: {booking.pickup} to {booking.dropoff}
              </h2>
              <p className="admin-muted">
                {booking.pickup_date} {booking.pickup_time} · {booking.passenger_count} passengers · {booking.customer_phone} ·{" "}
                {booking.customer_email}
              </p>
              <p>{booking.notes}</p>
              <div className="actions">
                <a className="btn whatsapp" href={buildWhatsAppUrl(message)} target="_blank" rel="noreferrer">
                  WhatsApp follow-up
                </a>
              </div>
            </article>
            <article className="admin-card">
              <h2>Status</h2>
              <form className="admin-form" action={updateStatus}>
                <select name="status" defaultValue={booking.status}>
                  {["new", "reviewing", "quoted", "confirmed", "assigned", "completed", "cancelled"].map((status) => (
                    <option value={status} key={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <button className="btn primary" type="submit">
                  Update status
                </button>
              </form>
            </article>
            <article className="admin-card">
              <h2>Internal estimate</h2>
              <p>
                {booking.internal_estimate_total
                  ? `${booking.internal_estimate_total} ${booking.internal_estimate_currency}`
                  : "Manual review"}
              </p>
              <pre className="preview">{JSON.stringify(booking.internal_estimate_breakdown || [], null, 2)}</pre>
            </article>
            <article className="admin-card">
              <h2>Assign</h2>
              <form className="admin-form" action={assignResource}>
                <select name="driver_id" defaultValue="">
                  <option value="">No driver</option>
                  {resources.drivers.map((driver: any) => (
                    <option value={driver.id} key={driver.id}>
                      {driver.display_name}
                    </option>
                  ))}
                </select>
                <select name="vehicle_id" defaultValue="">
                  <option value="">No vehicle</option>
                  {resources.vehicles.map((vehicle: any) => (
                    <option value={vehicle.id} key={vehicle.id}>
                      {vehicle.display_name}
                    </option>
                  ))}
                </select>
                <input name="starts_at" type="datetime-local" required />
                <input name="ends_at" type="datetime-local" required />
                <input name="buffer_minutes" type="number" min="0" max="180" defaultValue="30" />
                <button className="btn primary" type="submit">
                  Assign booking
                </button>
              </form>
            </article>
            <article className="admin-card wide">
              <h2>Internal notes</h2>
              <form className="admin-form" action={addNote}>
                <textarea name="body" required placeholder="Add a staff-only note" />
                <button className="btn primary" type="submit">
                  Add note
                </button>
              </form>
              {(booking.internal_notes || []).map((note: any) => (
                <p key={note.id}>
                  {note.body}
                  <br />
                  <span className="admin-muted">{new Date(note.created_at).toLocaleString()}</span>
                </p>
              ))}
            </article>
          </>
        )}
      </div>
    </AdminShell>
  );
}
