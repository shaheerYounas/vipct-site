import { z } from "zod";

const emptyToUndefined = (value: unknown) => (value === "" || value === null ? undefined : value);

export const bookingRequestSchema = z
  .object({
    trip_type: z.enum(["oneway", "roundtrip"]).default("oneway"),
    pickup_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    pickup_time: z.string().regex(/^\d{2}:\d{2}$/),
    return_date: z.preprocess(emptyToUndefined, z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
    return_time: z.preprocess(emptyToUndefined, z.string().regex(/^\d{2}:\d{2}$/).optional()),
    pickup: z.string().trim().min(2).max(240),
    dropoff: z.string().trim().min(2).max(240),
    passengers: z.coerce.number().int().min(1).max(60),
    luggage: z.preprocess(emptyToUndefined, z.string().trim().max(180).optional()),
    vehicle: z.preprocess(emptyToUndefined, z.string().trim().max(80).optional()),
    flight_number: z.preprocess(emptyToUndefined, z.string().trim().max(80).optional()),
    child_seats: z.preprocess(emptyToUndefined, z.coerce.number().int().min(0).max(6).optional()),
    name: z.string().trim().min(2).max(140),
    phone: z.string().trim().min(5).max(80),
    email: z.string().trim().email().max(180),
    notes: z.preprocess(emptyToUndefined, z.string().trim().max(1600).optional()),
    language: z.enum(["en", "cs", "ar"]).default("en"),
    page: z.preprocess(emptyToUndefined, z.string().trim().max(240).optional()),
    url: z.preprocess(emptyToUndefined, z.string().trim().max(600).optional()),
    utm: z.preprocess(emptyToUndefined, z.string().trim().max(600).optional()),
    route: z.preprocess(emptyToUndefined, z.string().trim().max(80).optional()),
    service: z.preprocess(emptyToUndefined, z.string().trim().max(80).optional()),
    program: z.preprocess(emptyToUndefined, z.string().trim().max(80).optional()),
    source_page: z.preprocess(emptyToUndefined, z.string().trim().max(600).optional()),
    honeypot: z.preprocess(emptyToUndefined, z.string().trim().max(120).optional())
  })
  .superRefine((data, ctx) => {
    const pickup = new Date(`${data.pickup_date}T${data.pickup_time}:00`);
    if (Number.isNaN(pickup.getTime())) {
      ctx.addIssue({ code: "custom", path: ["pickup_date"], message: "Invalid pickup date/time." });
    }

    if (data.trip_type === "roundtrip") {
      if (!data.return_date) {
        ctx.addIssue({ code: "custom", path: ["return_date"], message: "Return date is required for round trips." });
      }
      if (!data.return_time) {
        ctx.addIssue({ code: "custom", path: ["return_time"], message: "Return time is required for round trips." });
      }
      if (data.return_date && data.return_time) {
        const returned = new Date(`${data.return_date}T${data.return_time}:00`);
        if (returned.getTime() < pickup.getTime()) {
          ctx.addIssue({ code: "custom", path: ["return_date"], message: "Return time must be after pickup time." });
        }
      }
    }

    if (data.honeypot) {
      ctx.addIssue({ code: "custom", path: ["honeypot"], message: "Spam check failed." });
    }
  });

export type ParsedBookingRequest = z.infer<typeof bookingRequestSchema>;

export function normalizeBookingPayload(input: unknown): ParsedBookingRequest {
  return bookingRequestSchema.parse(input);
}
