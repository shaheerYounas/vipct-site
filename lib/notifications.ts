import { Resend } from "resend";
import { getEnv, siteUrl } from "@/lib/env";
import { company } from "@/lib/site-data";
import { buildBookingMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import type { BookingRequestInput, PriceEstimate } from "@/lib/types";

interface NotificationArgs {
  bookingId: string;
  booking: BookingRequestInput;
  estimate: PriceEstimate;
}

export async function sendBookingNotifications({ bookingId, booking, estimate }: NotificationArgs): Promise<void> {
  const apiKey = getEnv("RESEND_API_KEY");
  const staffEmails = (getEnv("ADMIN_EMAILS") || company.email)
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  if (!apiKey) return;

  const resend = new Resend(apiKey);
  const message = buildBookingMessage(booking, estimate);
  const adminUrl = `${siteUrl()}/admin/bookings/${bookingId}`;
  const whatsAppUrl = buildWhatsAppUrl(message);
  const from = `VIPCT <bookings@${new URL(siteUrl()).hostname.replace(/^www\./, "")}>`;

  await Promise.all([
    resend.emails.send({
      from,
      to: staffEmails,
      subject: `New VIPCT quote request: ${booking.pickup} to ${booking.dropoff}`,
      html: staffEmailHtml({ bookingId, booking, estimate, adminUrl, whatsAppUrl })
    }),
    resend.emails.send({
      from,
      to: booking.email,
      subject: "VIP Coach Transfers received your request",
      html: customerEmailHtml(booking)
    })
  ]);
}

function staffEmailHtml({
  bookingId,
  booking,
  estimate,
  adminUrl,
  whatsAppUrl
}: NotificationArgs & { adminUrl: string; whatsAppUrl: string }): string {
  const estimateLine =
    estimate.status === "estimated" ? `${estimate.total} ${estimate.currency}` : "Manual review needed";
  return `
    <h1>New booking request</h1>
    <p><strong>ID:</strong> ${bookingId}</p>
    <p><strong>Route:</strong> ${booking.pickup} to ${booking.dropoff}</p>
    <p><strong>When:</strong> ${booking.pickup_date} ${booking.pickup_time}</p>
    <p><strong>Customer:</strong> ${booking.name}, ${booking.phone}, ${booking.email}</p>
    <p><strong>Internal estimate:</strong> ${estimateLine}</p>
    <p><a href="${adminUrl}">Open in admin</a></p>
    <p><a href="${whatsAppUrl}">Open WhatsApp follow-up</a></p>
  `;
}

function customerEmailHtml(booking: BookingRequestInput): string {
  return `
    <h1>Thank you, ${booking.name}</h1>
    <p>We received your VIP Coach Transfers request for ${booking.pickup} to ${booking.dropoff} on ${booking.pickup_date}.</p>
    <p>No payment is required now. Our team will confirm the right vehicle, availability and fixed price manually.</p>
    <p>${company.phone}<br><a href="mailto:${company.email}">${company.email}</a></p>
  `;
}
