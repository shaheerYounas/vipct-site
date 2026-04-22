import { unstable_noStore as noStore } from "next/cache";
import { getServiceClient } from "@/lib/supabase";
import { priceRules } from "@/lib/pricing";

interface BookingFilters {
  status?: string;
  search?: string;
  from?: string;
  to?: string;
}

export async function getDashboardStats() {
  noStore();
  const supabase = getServiceClient();

  if (!supabase) {
    return {
      configured: false,
      totalBookings: 0,
      pendingBookings: 0,
      quotedBookings: 0,
      assignedBookings: 0,
      customers: 0,
      drivers: 0,
      vehicles: 0,
      pipelineEstimate: 0,
      upcomingAssignments: 0
    };
  }
  const client = supabase;

  const now = new Date().toISOString();
  const pipelineStatuses = ["new", "reviewing", "quoted", "confirmed", "assigned"];

  const [
    totalBookings,
    pendingBookings,
    quotedBookings,
    assignedBookings,
    customers,
    drivers,
    vehicles,
    assignments,
    pipelineRows
  ] = await Promise.all([
    countRows("booking_requests"),
    countRows("booking_requests", (query) => query.in("status", ["new", "reviewing", "confirmed"])),
    countRows("booking_requests", (query) => query.eq("status", "quoted")),
    countRows("booking_requests", (query) => query.eq("status", "assigned")),
    countRows("customers"),
    countRows("drivers"),
    countRows("vehicles"),
    countRows("booking_assignments", (query) => query.gte("ends_at", now)),
    client.from("booking_requests").select("internal_estimate_total, status").in("status", pipelineStatuses)
  ]);

  if (pipelineRows.error) throw pipelineRows.error;

  return {
    configured: true,
    totalBookings,
    pendingBookings,
    quotedBookings,
    assignedBookings,
    customers,
    drivers,
    vehicles,
    upcomingAssignments: assignments,
    pipelineEstimate: (pipelineRows.data ?? []).reduce((sum, row) => sum + Number(row.internal_estimate_total || 0), 0)
  };

  async function countRows(table: string, apply?: (query: any) => any) {
    let query: any = client.from(table).select("*", { count: "exact", head: true });
    if (apply) query = apply(query);
    const { count, error } = await query;
    if (error) throw error;
    return count ?? 0;
  }
}

export async function listBookings(filters: BookingFilters = {}) {
  noStore();
  const supabase = getServiceClient();
  if (!supabase) return [];

  let query: any = supabase
    .from("booking_requests")
    .select(
      "id, customer_id, status, pickup_date, pickup_time, pickup, dropoff, passenger_count, route_key, service_key, vehicle_preference, customer_name, customer_phone, customer_email, internal_estimate_total, internal_estimate_currency, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.from) query = query.gte("pickup_date", filters.from);
  if (filters.to) query = query.lte("pickup_date", filters.to);
  if (filters.search) {
    const term = searchTerm(filters.search);
    query = query.or(
      `customer_name.ilike.%${term}%,customer_email.ilike.%${term}%,customer_phone.ilike.%${term}%,pickup.ilike.%${term}%,dropoff.ilike.%${term}%`
    );
  }

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
    .select(
      "*, customers(*), internal_notes(*), booking_assignments(*, drivers(display_name), vehicles(display_name)), booking_events(*), price_estimates(*)"
    )
    .eq("id", id)
    .single();
  if (error) throw error;
  if (!data) return null;

  const historyQuery: any = supabase
    .from("booking_requests")
    .select("id, status, pickup_date, pickup_time, pickup, dropoff, internal_estimate_total, internal_estimate_currency, created_at")
    .neq("id", id)
    .order("created_at", { ascending: false })
    .limit(8);

  const related = data.customer_id
    ? await historyQuery.eq("customer_id", data.customer_id)
    : await historyQuery.eq("customer_email", data.customer_email);

  if (related.error) throw related.error;

  return {
    ...data,
    internal_notes: [...(data.internal_notes ?? [])].sort(sortDescByCreatedAt),
    booking_assignments: [...(data.booking_assignments ?? [])].sort(sortAscByStartsAt),
    booking_events: [...(data.booking_events ?? [])].sort(sortDescByCreatedAt),
    price_estimates: [...(data.price_estimates ?? [])].sort(sortDescByCreatedAt),
    customer_history: related.data ?? []
  };
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
    .select("*, booking_requests(customer_name, pickup, dropoff, status), drivers(display_name), vehicles(display_name)")
    .order("starts_at", { ascending: true })
    .limit(200);
  if (error) throw error;
  return data ?? [];
}

export async function listDriverAvailability() {
  noStore();
  const supabase = getServiceClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("driver_availability")
    .select("*, drivers(display_name)")
    .order("starts_at", { ascending: true })
    .limit(200);
  if (error) throw error;
  return data ?? [];
}

export async function listVehicleBlocks() {
  noStore();
  const supabase = getServiceClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("vehicle_blocks")
    .select("*, vehicles(display_name)")
    .order("starts_at", { ascending: true })
    .limit(200);
  if (error) throw error;
  return data ?? [];
}

export async function listPricingData() {
  noStore();
  const supabase = getServiceClient();

  if (!supabase) {
    return {
      configured: false,
      rules: listLocalPriceRules().map((rule) => ({ ...rule, currency: "EUR", price_rule_vehicle_rates: [] })),
      surcharges: []
    };
  }

  const [rules, surcharges] = await Promise.all([
    supabase
      .from("price_rules")
      .select("*, price_rule_vehicle_rates(*)")
      .order("key", { ascending: true }),
    supabase.from("price_surcharges").select("*").order("key", { ascending: true })
  ]);

  if (rules.error) throw rules.error;
  if (surcharges.error) throw surcharges.error;

  return {
    configured: true,
    rules: rules.data ?? [],
    surcharges: surcharges.data ?? []
  };
}

export async function listCustomers(search?: string) {
  noStore();
  const supabase = getServiceClient();
  if (!supabase) return [];

  let customersQuery: any = supabase
    .from("customers")
    .select("id, name, email, phone, language, created_at, updated_at")
    .order("updated_at", { ascending: false })
    .limit(100);

  if (search) {
    const term = searchTerm(search);
    customersQuery = customersQuery.or(`name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`);
  }

  const { data: customers, error } = await customersQuery;
  if (error) throw error;
  if (!customers?.length) return [];

  const customerIds = customers.map((customer: any) => customer.id);
  const { data: bookings, error: bookingError } = await supabase
    .from("booking_requests")
    .select("id, customer_id, status, pickup_date, pickup, dropoff, internal_estimate_total, internal_estimate_currency, created_at")
    .in("customer_id", customerIds)
    .order("created_at", { ascending: false });

  if (bookingError) throw bookingError;

  return customers.map((customer: any) => {
    const customerBookings = (bookings ?? []).filter((booking) => booking.customer_id === customer.id);
    return {
      ...customer,
      bookingCount: customerBookings.length,
      openBookings: customerBookings.filter((booking) => !["completed", "cancelled"].includes(booking.status)).length,
      estimatedRevenue: customerBookings.reduce((sum, booking) => sum + Number(booking.internal_estimate_total || 0), 0),
      latestBooking: customerBookings[0] ?? null,
      recentBookings: customerBookings.slice(0, 3)
    };
  });
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

function searchTerm(value: string) {
  return value.trim().replace(/[,%()]/g, " ");
}

function sortDescByCreatedAt(a: any, b: any) {
  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
}

function sortAscByStartsAt(a: any, b: any) {
  return new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime();
}
