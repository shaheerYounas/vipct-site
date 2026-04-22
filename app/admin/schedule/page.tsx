import { AdminShell, SetupNotice } from "@/components/AdminShell";
import { listAssignments } from "@/lib/admin-data";
import { requireStaff } from "@/lib/admin-auth";
import { findAvailabilityConflicts } from "@/lib/availability";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const staff = await requireStaff();
  const assignments = await listAssignments();
  const conflicts = findAvailabilityConflicts(
    assignments.map((assignment: any) => ({
      id: assignment.id,
      bookingId: assignment.booking_request_id,
      driverId: assignment.driver_id,
      vehicleId: assignment.vehicle_id,
      startsAt: assignment.starts_at,
      endsAt: assignment.ends_at,
      bufferMinutes: assignment.buffer_minutes
    }))
  );
  return (
    <AdminShell title="Schedule">
      <div className="admin-grid">
        {staff.mode === "setup" ? <SetupNotice /> : null}
        <article className="admin-card wide">
          <h2>Conflict warnings</h2>
          {!conflicts.length ? <p className="admin-muted">No driver or vehicle overlaps found.</p> : null}
          {conflicts.map((conflict) => (
            <p className="form-error" key={`${conflict.assignmentId}-${conflict.conflictsWithId}-${conflict.resourceType}`}>
              {conflict.resourceType} conflict: {conflict.assignmentId} overlaps {conflict.conflictsWithId}
            </p>
          ))}
        </article>
        <article className="admin-card wide">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Booking</th>
                <th>Driver</th>
                <th>Vehicle</th>
                <th>Buffer</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment: any) => (
                <tr key={assignment.id}>
                  <td>
                    {new Date(assignment.starts_at).toLocaleString()}
                    <br />
                    {new Date(assignment.ends_at).toLocaleString()}
                  </td>
                  <td>
                    {assignment.booking_requests?.customer_name}
                    <br />
                    <span className="admin-muted">
                      {assignment.booking_requests?.pickup} to {assignment.booking_requests?.dropoff}
                    </span>
                  </td>
                  <td>{assignment.drivers?.display_name || "-"}</td>
                  <td>{assignment.vehicles?.display_name || "-"}</td>
                  <td>{assignment.buffer_minutes} min</td>
                </tr>
              ))}
              {!assignments.length ? (
                <tr>
                  <td colSpan={5}>No assignments found.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </article>
      </div>
    </AdminShell>
  );
}
