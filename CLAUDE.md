# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

- **Next.js 16** (App Router, TypeScript) — hosted on Vercel
- **Supabase** — PostgreSQL database + Storage for event images
- **Resend** — transactional emails
- **Tailwind CSS** — styling (brand colors: `#D2A2FF` purple, `#0042C2` blue)

## Commands

```bash
npm run dev       # Dev server at http://localhost:3000
npm run build     # Production build
npm run lint      # ESLint
npx tsc --noEmit  # Type check only
```

## Environment setup

Copy `.env.local.example` to `.env.local` and fill in all values. Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_JWT_SECRET`, `ADMIN_PASSWORD`, `RESEND_API_KEY`, `ADMIN_EMAIL`, `NEXT_PUBLIC_BASE_URL`.

Run `supabase/migrations/001_initial.sql` in the Supabase SQL editor to create the schema, RLS policies, and the `event-images` storage bucket.

## Architecture

All data pages use `export const dynamic = 'force-dynamic'` — no static pre-rendering since all data comes from Supabase at request time.

**Auth**: Single-admin, password-based. On login, a signed JWT (via `jose`) is stored as an `httpOnly` cookie named `platzfrei_admin`. `proxy.ts` (Next.js 16 middleware) checks this cookie and redirects unauthenticated users away from `/admin/*`. All mutations use `SUPABASE_SERVICE_ROLE_KEY` via `lib/supabase/server.ts`.

**Email flow**:
- Booking created → confirmation email to participant + notification to admin
- Participant cancels via token link → confirmation to participant; if confirmed slot, first waitlist entry is auto-promoted and notified
- Admin cancels event → all confirmed + waitlist participants are notified

**Data model** (two tables):
- `events`: title, description, image_url, start/end datetime, location, max_spots, price, status (`active`|`cancelled`)
- `bookings`: event_id, name, email, status (`confirmed`|`waitlist`|`cancelled`), `cancellation_token` (UUID used in storno links)

**Image uploads** go to Supabase Storage bucket `event-images` via `/api/admin/upload` (admin-only, service role).

**CSV export** of participants at `/api/events/[id]/bookings/export` (admin-only).

**iframe embedding**: Public pages allow embedding via `Content-Security-Policy: frame-ancestors *` set in `next.config.ts`. Admin routes are excluded.

## Key files

| File | Purpose |
|---|---|
| `proxy.ts` | Route protection for `/admin/*` (Next.js 16 middleware) |
| `lib/auth.ts` | JWT sign/verify, cookie name, session check |
| `lib/supabase/server.ts` | Service-role client for server components and API routes |
| `lib/resend.ts` | Lazy Resend instance (`getResend()`) + env accessors as functions |
| `lib/emails/*.ts` | Plain HTML + text email templates |
| `supabase/migrations/001_initial.sql` | Full schema, RLS, storage setup |
| `app/agb/page.tsx` | AGB placeholder — replace prose with real text |
