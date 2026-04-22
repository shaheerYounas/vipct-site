import { revalidatePath } from "next/cache";
import { AdminShell, SetupNotice } from "@/components/AdminShell";
import { getBooking, listAssignments, listDriverAvailability, listFleetAndDrivers, listVehicleBlocks } from "@/lib/admin-data";
import { requireStaff } from "@/lib/admin-auth";
import { findAvailabilityBlockConflicts, findAvailabilityConflicts } from "@/lib/availability";
import { getServiceClient } from "@/lib/supabase";
import { buildBookingMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaff();
  const { id } = await params;
  const [booking, resources, assignments, driverAvailability, vehicleBlocks] = await Promise.all([
    getBooking(id),
    listFleetAndDrivers(),
    listAssignments(),
    listDriverAvailability(),
    listVehicleBlocks()
  ]);

  async function updateStatus(formData: FormData) {
    "use server";
    const actor = await requireStaff();
    const supabase = getServiceClient();
    if (!supabase) return;
    const status = String(formData.get("status"));
    await supabase.from("booking_requests").update({ status }).eq("id", id);
    await supabase.from("booking_events").insert({
      booking_request_id: id,
      actor_profile_id: actor.user?.id ?? null,
      event_type: "status_changed",
      payload: { status }
    });
    revalidatePath(`/admin/bookings/${id}`);
  }

  async function addNote(formData: FormData) {
    "use server";
    const actor = await requireStaff();
    const supabase = getServiceClient();
    if (!supabase) return;
    const body = String(formData.get("body") || "").trim();
    if (!body) return;
    await supabase.from("internal_notes").insert({ booking_request_id: id, actor_profile_id: actor.user?.id ?? null, body });
    await supabase.from("booking_events").insert({
      booking_request_id: id,
      actor_profile_id: actor.user?.id ?? null,
      event_type: "note_added",
      payload: { body }
    });
    revalidatePath(`/admin/bookings/${id}`);
  }

  async function assignResource(formData: FormData) {
    "use server";
    const actor = await requireStaff();
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
    await supabase.from("booking_events").insert({
      booking_request_id: id,
      actor_profile_id: actor.user?.id ?? null,
      event_type: "assignment_added",
      payload: {
        driver_id: String(formData.get("driver_id") || "") || null,
        vehicle_id: String(formData.get("vehicle_id") || "") || null,
        starts_at: String(formData.get("starts_at")),
        ends_at: String(formData.get("ends_at"))
      }
    });
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

  const assignmentConflicts = booking
    ? findAvailabilityConflicts(
        assignments.map((assignment: any) => ({
          id: assignment.id,
          bookingId: assignment.booking_request_id,
          driverId: assignment.driver_id,
          vehicleId: assignment.vehicle_id,
          startsAt: assignment.starts_at,
          endsAt: assignment.ends_at,
          bufferMinutes: assignment.buffer_minutes
        }))
      ).filter(
        (conflict) =>
          booking.booking_assignments?.some((assignment: any) => assignment.id === conflict.assignmentId) ||
          booking.booking_assignments?.some((assignment: any) => assignment.id === conflict.conflictsWithId)
      )
    : [];

  const blockConflicts = booking
    ? findAvailabilityBlockConflicts(
        assignments.map((assignment: any) => ({
          id: assignment.id,
          bookingId: assignment.booking_request_id,
          driverId: assignment.driver_id,
          vehicleId: assignment.vehicle_id,
          startsAt: assignment.starts_at,
          endsAt: assignment.ends_at,
          bufferMinutes: assignment.buffer_minutes
        })),
        [
          ...driverAvailability
            .filter((block: any) => block.availability_type !== "available")
            .map((block: any) => ({
              id: block.id,
              resourceType: "driver" as const,
              resourceId: block.driver_id,
              startsAt: block.starts_at,
              endsAt: block.ends_at,
              label: block.note || block.availability_type
            })),
          ...vehicleBlocks.map((block: any) => ({
            id: block.id,
            resourceType: "vehicle" as const,
            resourceId: block.vehicle_id,
            startsAt: block.starts_at,
            endsAt: block.ends_at,
            label: block.reason || "vehicle block"
          }))
        ]
      ).filter((conflict) => booking.booking_assignments?.some((assignment: any) => assignment.id === conflict.assignmentId))
    : [];

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
              <div className="summary-list">
                <div className="summary-row">
                  <span>Vehicle</span>
                  <span>{booking.vehicle_preference || "No preference"}</span>
                </div>
                <div className="summary-row">
                  <span>Flight</span>
                  <span>{booking.flight_number || "-"}</span>
                </div>
                <div className="summary-row">
                  <span>Attribution</span>
                  <span>{booking.utm || booking.source_page || booking.page || "-"}</span>
                </div>
              </div>
              <p>{booking.notes || "No customer notes."}</p>
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
              <h2>Customer</h2>
              <p>
                {booking.customers?.name || booking.customer_name}
                <br />
                <span className="admin-muted">
                  {booking.customers?.email || booking.customer_email}
                  <br />
                  {booking.customers?.phone || booking.customer_phone}
                </span>
              </p>
              <p className="admin-muted">Language: {booking.customers?.language || booking.language}</p>
              <h3>Past requests</h3>
              {(booking.customer_history || []).length ? (
                <div className="admin-stack">
                  {booking.customer_history.map((item: any) => (
                    <p key={item.id}>
                      {item.pickup_date} · {item.pickup} to {item.dropoff}
                      <br />
                      <span className="admin-muted">
                        {item.status}
                        {item.internal_estimate_total ? ` · ${item.internal_estimate_total} ${item.internal_estimate_currency}` : ""}
                      </span>
                    </p>
                  ))}
                </div>
              ) : (
                <p className="admin-muted">No earlier bookings for this customer.</p>
              )}
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
              <h2>Assignment warnings</h2>
              {!assignmentConflicts.length && !blockConflicts.length ? (
                <p className="admin-muted">No overlaps detected for this booking&apos;s current assignments.</p>
              ) : null}
              {assignmentConflicts.map((conflict) => (
                <p className="form-error" key={`${conflict.assignmentId}-${conflict.conflictsWithId}-${conflict.resourceType}`}>
                  {conflict.resourceType} overlap between assignments {conflict.assignmentId} and {conflict.conflictsWithId}.
                </p>
              ))}
              {blockConflicts.map((conflict) => (
                <p className="form-error" key={`${conflict.assignmentId}-${conflict.blockId}-${conflict.resourceType}`}>
                  {conflict.resourceType} assignment {conflict.assignmentId} hits blocked period {conflict.blockId}.
                </p>
              ))}
            </article>
            <article className="admin-card wide">
              <h2>Assignments</h2>
              {(booking.booking_assignments || []).length ? (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Window</th>
                      <th>Driver</th>
                      <th>Vehicle</th>
                      <th>Buffer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(booking.booking_assignments || []).map((assignment: any) => (
                      <tr key={assignment.id}>
                        <td>
                          {new Date(assignment.starts_at).toLocaleString()}
                          <br />
                          {new Date(assignment.ends_at).toLocaleString()}
                        </td>
                        <td>{assignment.drivers?.display_name || "-"}</td>
                        <td>{assignment.vehicles?.display_name || "-"}</td>
                        <td>{assignment.buffer_minutes} min</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="admin-muted">No assignment added yet.</p>
              )}
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
            <article className="admin-card wide">
              <h2>Activity timeline</h2>
              {(booking.booking_events || []).length ? (
                <div className="admin-stack">
                  {booking.booking_events.map((event: any) => (
                    <p key={event.id}>
                      <strong>{event.event_type}</strong>
                      <br />
                      <span className="admin-muted">{new Date(event.created_at).toLocaleString()}</span>
                      <br />
                      <span className="admin-muted">{JSON.stringify(event.payload)}</span>
                    </p>
                  ))}
                </div>
              ) : (
                <p className="admin-muted">No activity logged yet.</p>
              )}
            </article>
          </>
        )}
      </div>
    </AdminShell>
  );
}
