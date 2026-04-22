import { AdminShell, SetupNotice } from "@/components/AdminShell";
import { listAssignments, listDriverAvailability, listVehicleBlocks } from "@/lib/admin-data";
import { requireStaff } from "@/lib/admin-auth";
import { findAvailabilityBlockConflicts, findAvailabilityConflicts } from "@/lib/availability";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const staff = await requireStaff();
  const [assignments, driverAvailability, vehicleBlocks] = await Promise.all([
    listAssignments(),
    listDriverAvailability(),
    listVehicleBlocks()
  ]);
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
  const blockConflicts = findAvailabilityBlockConflicts(
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
          {blockConflicts.map((conflict) => (
            <p className="form-error" key={`${conflict.assignmentId}-${conflict.blockId}-${conflict.resourceType}`}>
              {conflict.resourceType} block conflict: assignment {conflict.assignmentId} overlaps blocked period {conflict.blockId}
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
        <article className="admin-card wide">
          <h2>Driver availability blocks</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Driver</th>
                <th>Window</th>
                <th>Type</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {driverAvailability.map((block: any) => (
                <tr key={block.id}>
                  <td>{block.drivers?.display_name || "-"}</td>
                  <td>
                    {new Date(block.starts_at).toLocaleString()}
                    <br />
                    {new Date(block.ends_at).toLocaleString()}
                  </td>
                  <td>{block.availability_type}</td>
                  <td>{block.note || "-"}</td>
                </tr>
              ))}
              {!driverAvailability.length ? (
                <tr>
                  <td colSpan={4}>No driver availability blocks found.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </article>
        <article className="admin-card wide">
          <h2>Vehicle blocks</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Window</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {vehicleBlocks.map((block: any) => (
                <tr key={block.id}>
                  <td>{block.vehicles?.display_name || "-"}</td>
                  <td>
                    {new Date(block.starts_at).toLocaleString()}
                    <br />
                    {new Date(block.ends_at).toLocaleString()}
                  </td>
                  <td>{block.reason || "-"}</td>
                </tr>
              ))}
              {!vehicleBlocks.length ? (
                <tr>
                  <td colSpan={3}>No vehicle blocks found.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </article>
      </div>
    </AdminShell>
  );
}
