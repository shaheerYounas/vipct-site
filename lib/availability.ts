import type { AvailabilityAssignment, AvailabilityBlock, AvailabilityBlockConflict, AvailabilityConflict } from "@/lib/types";

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

export function findAvailabilityBlockConflicts(
  assignments: AvailabilityAssignment[],
  blocks: AvailabilityBlock[]
): AvailabilityBlockConflict[] {
  const conflicts: AvailabilityBlockConflict[] = [];

  for (const assignment of assignments) {
    for (const block of blocks) {
      if (block.resourceType === "driver" && assignment.driverId && assignment.driverId === block.resourceId) {
        if (overlapsAssignmentAndBlock(assignment, block)) {
          conflicts.push({ assignmentId: assignment.id, blockId: block.id, resourceType: "driver" });
        }
      }

      if (block.resourceType === "vehicle" && assignment.vehicleId && assignment.vehicleId === block.resourceId) {
        if (overlapsAssignmentAndBlock(assignment, block)) {
          conflicts.push({ assignmentId: assignment.id, blockId: block.id, resourceType: "vehicle" });
        }
      }
    }
  }

  return conflicts;
}

function overlapsAssignmentAndBlock(assignment: AvailabilityAssignment, block: AvailabilityBlock): boolean {
  const bufferMinutes = assignment.bufferMinutes ?? 30;
  const assignmentStart = new Date(assignment.startsAt).getTime() - bufferMinutes * 60_000;
  const assignmentEnd = new Date(assignment.endsAt).getTime() + bufferMinutes * 60_000;
  const blockStart = new Date(block.startsAt).getTime();
  const blockEnd = new Date(block.endsAt).getTime();
  return assignmentStart < blockEnd && blockStart < assignmentEnd;
}
