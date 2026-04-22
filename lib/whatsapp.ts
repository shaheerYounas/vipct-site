import { company } from "@/lib/site-data";
import type { BookingRequestInput, PriceEstimate } from "@/lib/types";

export function buildBookingMessage(booking: BookingRequestInput, estimate?: PriceEstimate): string {
  const lines = [
    "VIP Coach Transfers Booking Request",
    "",
    `Language: ${booking.language}`,
    `Source page: ${booking.page || "-"}`,
    `UTM: ${booking.utm || "-"}`,
    "",
    `Trip type: ${booking.trip_type}`,
    `Route key: ${booking.route || "-"}`,
    `Service key: ${booking.service || "-"}`,
    `Program key: ${booking.program || "-"}`,
    `Pickup date: ${booking.pickup_date}`,
    `Pickup time: ${booking.pickup_time}`,
    `Pickup: ${booking.pickup}`,
    `Drop-off: ${booking.dropoff}`,
    `Return date: ${booking.trip_type === "roundtrip" ? booking.return_date || "-" : "-"}`,
    `Return time: ${booking.trip_type === "roundtrip" ? booking.return_time || "-" : "-"}`,
    "",
    `Passengers: ${booking.passengers}`,
    `Luggage: ${booking.luggage || "-"}`,
    `Vehicle: ${booking.vehicle || "-"}`,
    `Flight number: ${booking.flight_number || "-"}`,
    `Child seats: ${booking.child_seats ?? "-"}`,
    "",
    `Name: ${booking.name}`,
    `Phone: ${booking.phone}`,
    `Email: ${booking.email}`,
    `Notes: ${booking.notes || "-"}`
  ];

  if (estimate?.status === "estimated") {
    lines.push("", `Internal estimate: ${estimate.total} ${estimate.currency}`);
  }

  return lines.join("\n");
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
