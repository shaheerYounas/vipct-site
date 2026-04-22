# VIP Coach Transfers Operations App

Next.js App Router site and operations backend for VIP Coach Transfers.

The app now serves clean public URLs such as `/services`, `/quote`, `/cs/quote`, and `/ar/programs`.
Legacy `.html` URLs are still accepted and redirected so old links keep working.

Current platform features:

- Supabase-backed booking intake, staff admin, scheduling, pricing records and CMS tables.
- `POST /api/booking-requests` for quote requests.
- Staff admin under `/admin` with dashboard, bookings, customers, schedule, pricing, CMS, fleet, drivers, and settings.
- Resend email notifications with a generated WhatsApp follow-up link.
- Customer records linked automatically from booking requests.
- Booking filters, CSV export, internal notes, event timeline, and assignment conflict warnings.
- Driver availability blocks, vehicle blocks, editable pricing rules, vehicle multipliers, and surcharges.
- Local seeded CMS fallback so the public site builds before Supabase credentials are configured.

## Local Preview

Install dependencies once:

```bash
npm install
```

Start the Next.js dev server:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:5500/
```

If port `5500` is already in use, run Next directly on another port:

```bash
npx next dev -H 127.0.0.1 -p 5501
```

Useful public paths during local review:

- `/`
- `/services`
- `/fleet`
- `/programs`
- `/quote`
- `/contact`
- `/airport-transfer-prague`
- `/prague-to-vienna-transfer`
- `/cs/quote`
- `/ar/programs`

## GitHub Pages

The generated public site now targets:

```text
https://shaheeryounas.github.io/vipct-site/index.html
```

The deploy workflow lives in `.github/workflows/deploy-pages.yml` and publishes only the static artifact: root `.html` files, `assets`, the localized `en` / `cs` / `ar` folders, `robots.txt`, `sitemap.xml`, and `.nojekyll`.

Add these repository variables before enabling the Pages workflow:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

This GitHub Pages deployment covers the public static site. The full server-backed Next.js admin and API routes still need a server-capable host for complete operations mode.

## Environment

Copy `.env.example` to `.env.local` and fill:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `ADMIN_EMAILS`
- `REVALIDATE_SECRET`

In this workspace, the root-level `.env_copy.local` file is the source of truth for the app env. Sync it into `vipct-site/.env.local` with:

```bash
npm run env:sync
```

Without Supabase env vars, public pages use local seed data and booking submissions return a local `received` response. With Supabase configured, booking requests are stored in Postgres and notifications are sent through Resend.

## Admin Access

`ADMIN_EMAILS` is the allowlist for staff magic-link login.

When you add a new admin email:

1. Update `ADMIN_EMAILS` in `.env.local`.
2. Run `npm run admins:sync`.
3. Open `/admin/login` and request a magic link.
4. For local Supabase, open Mailpit at `http://127.0.0.1:54324`.

## Supabase

Apply the schema in `supabase/migrations/0001_full_operations.sql`, `supabase/migrations/0002_public_booking_intake.sql`, and `supabase/migrations/0003_public_cms_access.sql`, then run `supabase/seed.sql`.

For local Supabase after Docker Desktop is running:

```bash
npm run supabase:start
npm run db:reset:local
```

For a linked remote Supabase project:

```bash
npm run db:push
```

The static quote page uses the `submit_booking_request(jsonb)` RPC from `0002_public_booking_intake.sql`. The public CMS/browser grants in `0003_public_cms_access.sql` expose only published CMS rows to the anon role. Once those migrations are live on the hosted project, the GitHub Pages build can read published CMS data and write bookings directly to Supabase with the anon key while still falling back to FormSubmit if the RPC is unavailable.

To push the complete multilingual CMS seed from `lib/site-data.ts` into Supabase:

```bash
npm run seed:cms
```

After creating staff users with Supabase Auth, add rows to `profiles`:

```sql
insert into profiles (id, email, role)
values ('<auth-user-id>', 'staff@example.com', 'admin');
```

For local setup, the faster path is:

```bash
npm run admins:sync
```

That reads `ADMIN_EMAILS` from `.env.local`, creates any missing Supabase Auth users, and upserts matching `profiles` rows with the `admin` role. To print ready-to-use magic links for local login:

```bash
npm run admins:sync -- --generate-links
```

## CRM Surface

The current admin backend covers:

- `/admin/bookings`: filter by status/date/search, export CSV, inspect estimates, notes, events, and assignments
- `/admin/customers`: customer list with open bookings, recent activity, and estimated value
- `/admin/schedule`: assignment conflicts, driver availability blocks, and vehicle blocks
- `/admin/pricing`: route rules, vehicle multipliers, and surcharges
- `/admin/fleet`: vehicles plus maintenance/unavailable windows
- `/admin/drivers`: driver records plus availability management
- `/admin/cms`: publish CMS collections and trigger revalidation
- `/admin/settings`: environment visibility for local ops checks

## Useful Scripts

- `npm run dev` starts Next.js locally.
- `npm run build` creates a production build.
- `npm run check` runs TypeScript and unit tests.
- `npm run env:sync` copies `../.env_copy.local` into `./.env.local`.
- `npm run generate` regenerates the static multilingual site.
- `npm run pages:build` stages the GitHub Pages artifact into `.pages-dist`.
- `npm run supabase:start` starts the local Supabase stack when Docker is running.
- `npm run db:reset:local` applies migrations and `supabase/seed.sql` to local Supabase.
- `npm run db:push` applies migrations to a linked remote Supabase project.
- `npm run admins:sync` provisions auth users and `profiles` rows for every email in `ADMIN_EMAILS`.
- `npm test` runs Vitest.
- `npm run seed:cms` upserts the complete CMS seed into Supabase.
- `npm run optimize:images` keeps the legacy image optimization script available.

## Verification Snapshot

The current implementation has been verified with:

- `npm run check:js`
- `npm test`
- `npm run build`
- local Supabase migration/seed flow
- live admin login flow against the local Supabase stack
