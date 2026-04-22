import { describe, expect, it } from "vitest";
import { calculatePriceEstimate } from "@/lib/pricing";
import type { BookingRequestInput } from "@/lib/types";

const baseBooking: BookingRequestInput = {
  trip_type: "oneway",
  pickup_date: "2026-05-10",
  pickup_time: "10:00",
  pickup: "Prague",
  dropoff: "Vienna",
  passengers: 2,
  vehicle: "Sedan",
  name: "Test Customer",
  phone: "+420 111",
  email: "customer@example.com",
  language: "en",
  route: "vienna",
  service: "europe-transfer"
};

describe("pricing engine", () => {
  it("returns an internal EUR estimate for known routes", () => {
    const estimate = calculatePriceEstimate(baseBooking);
    expect(estimate.status).toBe("estimated");
    expect(estimate.currency).toBe("EUR");
    expect(estimate.total).toBe(390);
  });

  it("applies vehicle multipliers", () => {
    const estimate = calculatePriceEstimate({ ...baseBooking, vehicle: "Mercedes V-Class", passengers: 5 });
    expect(estimate.total).toBe(525);
  });

  it("adds a discounted return leg for round trips", () => {
    const estimate = calculatePriceEstimate({
      ...baseBooking,
      trip_type: "roundtrip",
      return_date: "2026-05-12",
      return_time: "12:00"
    });
    expect(estimate.total).toBe(740);
  });

  it("adds night surcharge", () => {
    const estimate = calculatePriceEstimate({ ...baseBooking, pickup_time: "23:30" });
    expect(estimate.total).toBe(450);
  });

  it("falls back to manual review for unknown routes", () => {
    const estimate = calculatePriceEstimate({ ...baseBooking, route: "custom" });
    expect(estimate.status).toBe("manual_review");
    expect(estimate.total).toBeNull();
  });
});
