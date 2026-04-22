import { unstable_noStore as noStore } from "next/cache";
import { getServiceClient } from "@/lib/supabase";
import { priceRules } from "@/lib/pricing";

export async function listBookings(status?: string) {
  noStore();
  const supabase = getServiceClient();
  if (!supabase) return [];

  let query = supabase
    .from("booking_requests")
    .select("id, status, pickup_date, pickup_time, pickup, dropoff, passenger_count, customer_name, customer_phone, customer_email, internal_estimate_total, internal_estimate_currency, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getBooking(id: string) {
  noStore();
  const supabase = getServiceClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("booking_requests")
    .select("*, internal_notes(*), booking_assignments(*), booking_events(*)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function listFleetAndDrivers() {
  noStore();
  const supabase = getServiceClient();
  if (!supabase) return { vehicles: [], drivers: [] };

  const [vehicles, drivers] = await Promise.all([
    supabase.from("vehicles").select("*").order("display_name"),
    supabase.from("drivers").select("*").order("display_name")
  ]);

  if (vehicles.error) throw vehicles.error;
  if (drivers.error) throw drivers.error;
  return { vehicles: vehicles.data ?? [], drivers: drivers.data ?? [] };
}

export async function listAssignments() {
  noStore();
  const supabase = getServiceClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("booking_assignments")
    .select("*, booking_requests(customer_name, pickup, dropoff), drivers(display_name), vehicles(display_name)")
    .order("starts_at", { ascending: true })
    .limit(100);
  if (error) throw error;
  return data ?? [];
}

export function listLocalPriceRules() {
  return priceRules.map((rule) => ({
    key: rule.key,
    routeKeys: rule.routeKeys,
    serviceKeys: rule.serviceKeys,
    basePrice: rule.basePrice,
    durationMinutes: rule.durationMinutes,
    includedWaitingMinutes: rule.includedWaitingMinutes
  }));
}
