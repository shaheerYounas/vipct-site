export type Language = "en" | "cs" | "ar";

export type BookingStatus =
  | "new"
  | "reviewing"
  | "quoted"
  | "confirmed"
  | "assigned"
  | "completed"
  | "cancelled";

export type VehicleKey = "sedan" | "v-class" | "minibus" | "coach";

export type SitePageKind =
  | "home"
  | "services"
  | "fleet"
  | "programs"
  | "quote"
  | "contact"
  | "thankyou"
  | "route";

export interface LanguageConfig {
  label: string;
  html: Language;
  dir: "ltr" | "rtl";
}

export interface CompanySettings {
  siteUrl: string;
  company: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  ico: string;
  vat: string;
  mapUrl: string;
}

export interface LocalizedCopy {
  brandMeta: string;
  nav: string[];
  ctaQuote: string;
  ctaWhatsApp: string;
  responseTime: string;
  heroEyebrow: string;
  homeTitle: string;
  homeLead: string;
  trust: [string, string][];
  sections: Record<string, string>;
  quote: Record<string, string>;
  contactTitle: string;
  contactLead: string;
  mapOpen: string;
  thankTitle: string;
  thankLead: string;
  newQuote: string;
  backHome: string;
  openWhatsApp: string;
  fleetBest: string;
  capacity: string;
  luggage: string;
  amenities: string;
  routeCta: string;
  learnMore: string;
  footerText: string;
}

export interface CardContent {
  key: string;
  title: string;
  text: string;
  image: string;
}

export interface FleetItem extends CardContent {
  capacity: string;
  luggage: string;
  bestFor: string;
  amenities: string;
  vehicleKey: VehicleKey;
}

export interface ServiceItem extends CardContent {
  detailsHref: string;
  quoteParams: Record<string, string>;
}

export interface ProgramItem extends CardContent {
  duration: string;
  season: string;
  idealFor: string;
  vehicle: string;
}

export interface RoutePageContent {
  key: string;
  slug: string;
  image: string;
  title: string;
  description: string;
  label: string;
  duration: string;
}

export interface PublicCmsData {
  lang: Language;
  copy: LocalizedCopy;
  fleet: FleetItem[];
  services: ServiceItem[];
  programs: ProgramItem[];
  routes: RoutePageContent[];
  faqs: [string, string][];
}

export interface BookingRequestInput {
  trip_type: "oneway" | "roundtrip";
  pickup_date: string;
  pickup_time: string;
  return_date?: string;
  return_time?: string;
  pickup: string;
  dropoff: string;
  passengers: number;
  luggage?: string;
  vehicle?: string;
  flight_number?: string;
  child_seats?: number;
  name: string;
  phone: string;
  email: string;
  notes?: string;
  language: Language;
  page?: string;
  url?: string;
  utm?: string;
  route?: string;
  service?: string;
  program?: string;
  source_page?: string;
  honeypot?: string;
}

export interface PriceBreakdownLine {
  label: string;
  amount: number;
}

export interface PriceEstimate {
  status: "estimated" | "manual_review";
  currency: "EUR";
  total: number | null;
  ruleKey?: string;
  breakdown: PriceBreakdownLine[];
  notes: string[];
}

export interface AvailabilityAssignment {
  id: string;
  bookingId: string;
  driverId?: string | null;
  vehicleId?: string | null;
  startsAt: string;
  endsAt: string;
  bufferMinutes?: number;
}

export interface AvailabilityConflict {
  assignmentId: string;
  conflictsWithId: string;
  resourceType: "driver" | "vehicle";
}

export interface AvailabilityBlock {
  id: string;
  resourceType: "driver" | "vehicle";
  resourceId: string;
  startsAt: string;
  endsAt: string;
  label?: string;
}

export interface AvailabilityBlockConflict {
  assignmentId: string;
  blockId: string;
  resourceType: "driver" | "vehicle";
}
