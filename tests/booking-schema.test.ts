import { describe, expect, it } from "vitest";
import { normalizeBookingPayload } from "@/lib/booking-schema";

const validPayload = {
  trip_type: "oneway",
  pickup_date: "2026-05-10",
  pickup_time: "10:30",
  pickup: "Prague Airport",
  dropoff: "Prague hotel",
  passengers: 3,
  name: "Test Customer",
  phone: "+420 111 222 333",
  email: "customer@example.com",
  language: "en"
};

describe("booking validation", () => {
  it("accepts the current quote form payload", () => {
    expect(normalizeBookingPayload(validPayload)).toMatchObject({
      pickup: "Prague Airport",
      passengers: 3,
      language: "en"
    });
  });

  it("requires return date and time for round trips", () => {
    expect(() => normalizeBookingPayload({ ...validPayload, trip_type: "roundtrip" })).toThrow();
  });

  it("rejects passenger counts outside vehicle planning bounds", () => {
    expect(() => normalizeBookingPayload({ ...validPayload, passengers: 99 })).toThrow();
  });

  it("rejects honeypot spam submissions", () => {
    expect(() => normalizeBookingPayload({ ...validPayload, honeypot: "filled" })).toThrow();
  });
});
