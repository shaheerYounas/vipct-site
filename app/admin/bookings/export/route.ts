import { NextRequest, NextResponse } from "next/server";
import { listBookings } from "@/lib/admin-data";
import { getStaffUser } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const staff = await getStaffUser();
  if (staff.mode === "anonymous") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (staff.mode === "forbidden") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const bookings = await listBookings({
    status: request.nextUrl.searchParams.get("status") || undefined,
    search: request.nextUrl.searchParams.get("search") || undefined,
    from: request.nextUrl.searchParams.get("from") || undefined,
    to: request.nextUrl.searchParams.get("to") || undefined
  });

  const header = [
    "id",
    "status",
    "customer_name",
    "customer_email",
    "customer_phone",
    "pickup_date",
    "pickup_time",
    "pickup",
    "dropoff",
    "route_key",
    "service_key",
    "vehicle_preference",
    "internal_estimate_total",
    "internal_estimate_currency",
    "created_at"
  ];

  const lines = [header.join(",")].concat(
    bookings.map((booking: any) =>
      [
        booking.id,
        booking.status,
        booking.customer_name,
        booking.customer_email,
        booking.customer_phone,
        booking.pickup_date,
        booking.pickup_time,
        booking.pickup,
        booking.dropoff,
        booking.route_key || "",
        booking.service_key || "",
        booking.vehicle_preference || "",
        booking.internal_estimate_total || "",
        booking.internal_estimate_currency || "",
        booking.created_at
      ]
        .map(csvValue)
        .join(",")
    )
  );

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="vipct-bookings.csv"'
    }
  });
}

function csvValue(value: unknown) {
  const normalized = String(value ?? "");
  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  return normalized;
}
