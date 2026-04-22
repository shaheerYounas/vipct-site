import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { normalizeBookingPayload } from "@/lib/booking-schema";
import { calculatePriceEstimate } from "@/lib/pricing";
import { getServiceClient } from "@/lib/supabase";
import { sendBookingNotifications } from "@/lib/notifications";

const rateLimit = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many booking requests. Please try again shortly." }, { status: 429 });
  }

  const json = await request.json().catch(() => null);
  let parsed;
  try {
    parsed = normalizeBookingPayload(json);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid booking request.", issues: error.issues }, { status: 400 });
    }
    throw error;
  }
  const estimate = calculatePriceEstimate(parsed);
  const supabase = getServiceClient();

  if (!supabase) {
    const localId = `local-${crypto.randomUUID()}`;
    return NextResponse.json({
      id: localId,
      status: "received",
      nextUrl: `/${parsed.language}/thankyou.html`,
      storage: "not_configured"
    });
  }

  const { data: booking, error } = await supabase
    .from("booking_requests")
    .insert({
      status: "new",
      trip_type: parsed.trip_type,
      pickup_date: parsed.pickup_date,
      pickup_time: parsed.pickup_time,
      return_date: parsed.return_date ?? null,
      return_time: parsed.return_time ?? null,
      pickup: parsed.pickup,
      dropoff: parsed.dropoff,
      passenger_count: parsed.passengers,
      luggage: parsed.luggage ?? null,
      vehicle_preference: parsed.vehicle ?? null,
      flight_number: parsed.flight_number ?? null,
      child_seats: parsed.child_seats ?? 0,
      customer_name: parsed.name,
      customer_phone: parsed.phone,
      customer_email: parsed.email,
      notes: parsed.notes ?? null,
      language: parsed.language,
      page: parsed.page ?? null,
      url: parsed.url ?? null,
      utm: parsed.utm ?? null,
      route_key: parsed.route ?? null,
      service_key: parsed.service ?? null,
      program_key: parsed.program ?? null,
      source_page: parsed.source_page ?? null,
      payload: parsed,
      internal_estimate_status: estimate.status,
      internal_estimate_total: estimate.total,
      internal_estimate_currency: estimate.currency,
      internal_estimate_breakdown: estimate.breakdown,
      internal_estimate_notes: estimate.notes
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: "The booking request could not be stored." }, { status: 500 });
  }

  await supabase.from("booking_events").insert({
    booking_request_id: booking.id,
    event_type: "created",
    payload: { source: "public_api", estimate }
  });

  await supabase.from("price_estimates").insert({
    booking_request_id: booking.id,
    status: estimate.status,
    currency: estimate.currency,
    total: estimate.total,
    rule_key: estimate.ruleKey ?? null,
    breakdown: estimate.breakdown,
    notes: estimate.notes
  });

  sendBookingNotifications({ bookingId: booking.id, booking: parsed, estimate }).catch((notificationError) => {
    console.error("Booking notification failed", notificationError);
  });

  return NextResponse.json({
    id: booking.id,
    status: "received",
    nextUrl: `/${parsed.language}/thankyou.html`
  });
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const current = rateLimit.get(key);
  if (!current || current.resetAt < now) {
    rateLimit.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  current.count += 1;
  return current.count <= 8;
}
