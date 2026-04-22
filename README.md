# VIP Coach Transfers Operations App

Next.js App Router site and operations backend for VIP Coach Transfers.

The app preserves the existing public URLs (`/en/*.html`, `/cs/*.html`, `/ar/*.html`, and root English `/*.html`) while adding:

- Supabase-backed booking intake, staff admin, scheduling, pricing records and CMS tables.
- `POST /api/booking-requests` for quote requests.
- Staff admin under `/admin`.
- Resend email notifications with a generated WhatsApp follow-up link.
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
http://127.0.0.1:5500/en/index.html
```

If port `5500` is already in use, run Next directly on another port:

```bash
npx next dev -H 127.0.0.1 -p 5501
```

## Environment

Copy `.env.example` to `.env.local` and fill:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `ADMIN_EMAILS`
- `REVALIDATE_SECRET`

Without Supabase env vars, public pages use local seed data and booking submissions return a local `received` response. With Supabase configured, booking requests are stored in Postgres and notifications are sent through Resend.

## Supabase

Apply the schema in `supabase/migrations/0001_full_operations.sql`, then run `supabase/seed.sql`.

For local Supabase after Docker Desktop is running:

```bash
npm run supabase:start
npm run db:reset:local
```

For a linked remote Supabase project:

```bash
npm run db:push
```

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

## Useful Scripts

- `npm run dev` starts Next.js locally.
- `npm run build` creates a production build.
- `npm run check` runs TypeScript and unit tests.
- `npm run supabase:start` starts the local Supabase stack when Docker is running.
- `npm run db:reset:local` applies migrations and `supabase/seed.sql` to local Supabase.
- `npm run db:push` applies migrations to a linked remote Supabase project.
- `npm run admins:sync` provisions auth users and `profiles` rows for every email in `ADMIN_EMAILS`.
- `npm test` runs Vitest.
- `npm run seed:cms` upserts the complete CMS seed into Supabase.
- `npm run optimize:images` keeps the legacy image optimization script available.
