create extension if not exists pgcrypto;

create type booking_status as enum ('new', 'reviewing', 'quoted', 'confirmed', 'assigned', 'completed', 'cancelled');
create type cms_status as enum ('draft', 'published', 'archived');
create type staff_role as enum ('admin', 'staff');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role staff_role not null default 'staff',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function is_staff()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from profiles
    where profiles.id = auth.uid()
      and profiles.role in ('admin', 'staff')
  );
$$;

create table customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  language text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table booking_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete set null,
  status booking_status not null default 'new',
  trip_type text not null,
  pickup_date date not null,
  pickup_time time not null,
  return_date date,
  return_time time,
  pickup text not null,
  dropoff text not null,
  passenger_count integer not null check (passenger_count between 1 and 60),
  luggage text,
  vehicle_preference text,
  flight_number text,
  child_seats integer not null default 0 check (child_seats between 0 and 6),
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  notes text,
  language text not null default 'en',
  page text,
  url text,
  utm text,
  route_key text,
  service_key text,
  program_key text,
  source_page text,
  payload jsonb not null default '{}'::jsonb,
  internal_estimate_status text not null default 'manual_review',
  internal_estimate_total numeric(10, 2),
  internal_estimate_currency text not null default 'EUR',
  internal_estimate_breakdown jsonb not null default '[]'::jsonb,
  internal_estimate_notes jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table booking_events (
  id uuid primary key default gen_random_uuid(),
  booking_request_id uuid not null references booking_requests(id) on delete cascade,
  actor_profile_id uuid references profiles(id) on delete set null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table internal_notes (
  id uuid primary key default gen_random_uuid(),
  booking_request_id uuid not null references booking_requests(id) on delete cascade,
  actor_profile_id uuid references profiles(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create table vehicles (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  vehicle_type text not null,
  seats integer not null,
  luggage_capacity text,
  plate_number text,
  status text not null default 'active',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table drivers (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  phone text,
  email text,
  status text not null default 'active',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table driver_availability (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references drivers(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  availability_type text not null default 'available',
  note text,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table vehicle_blocks (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table booking_assignments (
  id uuid primary key default gen_random_uuid(),
  booking_request_id uuid not null references booking_requests(id) on delete cascade,
  driver_id uuid references drivers(id) on delete set null,
  vehicle_id uuid references vehicles(id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  buffer_minutes integer not null default 30,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table price_rules (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  route_keys text[] not null default '{}',
  service_keys text[] not null default '{}',
  base_price numeric(10, 2) not null,
  currency text not null default 'EUR',
  duration_minutes integer not null,
  included_waiting_minutes integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table price_rule_vehicle_rates (
  id uuid primary key default gen_random_uuid(),
  price_rule_id uuid not null references price_rules(id) on delete cascade,
  vehicle_type text not null,
  multiplier numeric(8, 3) not null default 1,
  minimum_price numeric(10, 2) not null default 0,
  unique(price_rule_id, vehicle_type)
);

create table price_surcharges (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  surcharge_type text not null,
  value numeric(10, 2) not null,
  conditions jsonb not null default '{}'::jsonb,
  status text not null default 'active'
);

create table price_estimates (
  id uuid primary key default gen_random_uuid(),
  booking_request_id uuid not null references booking_requests(id) on delete cascade,
  status text not null,
  currency text not null default 'EUR',
  total numeric(10, 2),
  rule_key text,
  breakdown jsonb not null default '[]'::jsonb,
  notes jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table cms_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  language text not null,
  status cms_status not null default 'draft',
  title text not null,
  description text,
  content jsonb not null default '{}'::jsonb,
  seo jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(slug, language)
);

create table cms_blocks (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references cms_pages(id) on delete cascade,
  block_key text not null,
  sort_order integer not null default 0,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table cms_collections (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  language text not null,
  status cms_status not null default 'draft',
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(key, language)
);

create table media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_bucket text not null default 'cms-media',
  storage_path text not null,
  alt_text text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create index booking_requests_status_idx on booking_requests(status);
create index booking_requests_pickup_idx on booking_requests(pickup_date, pickup_time);
create index booking_assignments_driver_time_idx on booking_assignments(driver_id, starts_at, ends_at);
create index booking_assignments_vehicle_time_idx on booking_assignments(vehicle_id, starts_at, ends_at);
create index cms_collections_public_idx on cms_collections(language, key) where status = 'published';
create index cms_pages_public_idx on cms_pages(language, slug) where status = 'published';

alter table profiles enable row level security;
alter table customers enable row level security;
alter table booking_requests enable row level security;
alter table booking_events enable row level security;
alter table internal_notes enable row level security;
alter table vehicles enable row level security;
alter table drivers enable row level security;
alter table driver_availability enable row level security;
alter table vehicle_blocks enable row level security;
alter table booking_assignments enable row level security;
alter table price_rules enable row level security;
alter table price_rule_vehicle_rates enable row level security;
alter table price_surcharges enable row level security;
alter table price_estimates enable row level security;
alter table cms_pages enable row level security;
alter table cms_blocks enable row level security;
alter table cms_collections enable row level security;
alter table media_assets enable row level security;
alter table site_settings enable row level security;

create policy "profiles staff read" on profiles for select using (is_staff());

create policy "public published cms collections" on cms_collections
  for select using (status = 'published');
create policy "public published cms pages" on cms_pages
  for select using (status = 'published');

create policy "staff all customers" on customers for all using (is_staff()) with check (is_staff());
create policy "staff all booking_requests" on booking_requests for all using (is_staff()) with check (is_staff());
create policy "staff all booking_events" on booking_events for all using (is_staff()) with check (is_staff());
create policy "staff all internal_notes" on internal_notes for all using (is_staff()) with check (is_staff());
create policy "staff all vehicles" on vehicles for all using (is_staff()) with check (is_staff());
create policy "staff all drivers" on drivers for all using (is_staff()) with check (is_staff());
create policy "staff all driver_availability" on driver_availability for all using (is_staff()) with check (is_staff());
create policy "staff all vehicle_blocks" on vehicle_blocks for all using (is_staff()) with check (is_staff());
create policy "staff all booking_assignments" on booking_assignments for all using (is_staff()) with check (is_staff());
create policy "staff all price_rules" on price_rules for all using (is_staff()) with check (is_staff());
create policy "staff all price_rule_vehicle_rates" on price_rule_vehicle_rates for all using (is_staff()) with check (is_staff());
create policy "staff all price_surcharges" on price_surcharges for all using (is_staff()) with check (is_staff());
create policy "staff all price_estimates" on price_estimates for all using (is_staff()) with check (is_staff());
create policy "staff all cms_pages" on cms_pages for all using (is_staff()) with check (is_staff());
create policy "staff all cms_blocks" on cms_blocks for all using (is_staff()) with check (is_staff());
create policy "staff all cms_collections" on cms_collections for all using (is_staff()) with check (is_staff());
create policy "staff all media_assets" on media_assets for all using (is_staff()) with check (is_staff());
create policy "staff all site_settings" on site_settings for all using (is_staff()) with check (is_staff());
