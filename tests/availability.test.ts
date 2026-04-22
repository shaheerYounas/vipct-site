import { describe, expect, it } from "vitest";
import { findAvailabilityConflicts } from "@/lib/availability";

describe("availability conflicts", () => {
  it("flags overlapping driver assignments with buffer time", () => {
    const conflicts = findAvailabilityConflicts([
      {
        id: "a1",
        bookingId: "b1",
        driverId: "d1",
        vehicleId: "v1",
        startsAt: "2026-05-10T10:00:00.000Z",
        endsAt: "2026-05-10T11:00:00.000Z",
        bufferMinutes: 30
      },
      {
        id: "a2",
        bookingId: "b2",
        driverId: "d1",
        vehicleId: "v2",
        startsAt: "2026-05-10T11:20:00.000Z",
        endsAt: "2026-05-10T12:00:00.000Z",
        bufferMinutes: 30
      }
    ]);
    expect(conflicts).toEqual([{ assignmentId: "a1", conflictsWithId: "a2", resourceType: "driver" }]);
  });

  it("does not flag unrelated resources", () => {
    const conflicts = findAvailabilityConflicts([
      {
        id: "a1",
        bookingId: "b1",
        driverId: "d1",
        vehicleId: "v1",
        startsAt: "2026-05-10T10:00:00.000Z",
        endsAt: "2026-05-10T11:00:00.000Z"
      },
      {
        id: "a2",
        bookingId: "b2",
        driverId: "d2",
        vehicleId: "v2",
        startsAt: "2026-05-10T10:15:00.000Z",
        endsAt: "2026-05-10T11:30:00.000Z"
      }
    ]);
    expect(conflicts).toEqual([]);
  });
});
