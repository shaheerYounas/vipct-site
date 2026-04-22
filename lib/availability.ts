import type { AvailabilityAssignment, AvailabilityConflict } from "@/lib/types";

export function findAvailabilityConflicts(assignments: AvailabilityAssignment[]): AvailabilityConflict[] {
  const conflicts: AvailabilityConflict[] = [];
  for (let i = 0; i < assignments.length; i += 1) {
    for (let j = i + 1; j < assignments.length; j += 1) {
      const current = assignments[i];
      const other = assignments[j];
      if (current.driverId && current.driverId === other.driverId && overlapsWithBuffer(current, other)) {
        conflicts.push({
          assignmentId: current.id,
          conflictsWithId: other.id,
          resourceType: "driver"
        });
      }
      if (current.vehicleId && current.vehicleId === other.vehicleId && overlapsWithBuffer(current, other)) {
        conflicts.push({
          assignmentId: current.id,
          conflictsWithId: other.id,
          resourceType: "vehicle"
        });
      }
    }
  }
  return conflicts;
}

export function overlapsWithBuffer(a: AvailabilityAssignment, b: AvailabilityAssignment): boolean {
  const aBuffer = a.bufferMinutes ?? 30;
  const bBuffer = b.bufferMinutes ?? 30;
  const aStart = new Date(a.startsAt).getTime() - aBuffer * 60_000;
  const aEnd = new Date(a.endsAt).getTime() + aBuffer * 60_000;
  const bStart = new Date(b.startsAt).getTime() - bBuffer * 60_000;
  const bEnd = new Date(b.endsAt).getTime() + bBuffer * 60_000;
  return aStart < bEnd && bStart < aEnd;
}
