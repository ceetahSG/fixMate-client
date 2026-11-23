# FixMate

FixMate is a repair-services marketplace where customers can discover technicians, request repairs, track bookings, and pay through Stripe. Technicians manage their service listings and incoming requests, while admins review services, users, bookings, and transactions.

This repository contains the **Next.js frontend**. Service data, booking state, role enforcement for API requests, and payment session creation live in a separate **Express backend** that this app calls over HTTP.

## Tech stack

- Next.js 16 (App Router) and React 19
- TypeScript
- Tailwind CSS 4 and shadcn/ui (`base-nova` style)
- Better Auth with the MongoDB adapter and JWT plugin
- Next.js Server Actions for backend mutations
- Stripe Checkout (started through the Express API)
- ImgBB for service image uploads

## Features

### Public site

- Landing, about, and service catalogue pages
- Search, category/mode filters, and sorting on `/services`
- Service detail pages at `/services/[id]`
- Sign up as **Customer** or **Technician**; sign in with email/password

### Customer dashboard

- Book a service and prevent duplicate active bookings
- View and cancel bookings
- Pay for accepted bookings through Stripe Checkout
- View payment history and update profile details

### Technician dashboard

- Add, edit, and delete service listings
- Upload service images to ImgBB
- Manage incoming repair requests and update their status
- View assigned bookings

### Admin dashboard

- Review and approve/reject technician services
- Manage users and roles
- View all bookings and transactions

## Getting started

### Prerequisites

- Node.js 20.9 or newer
- npm
- A MongoDB database
- A running instance of the FixMate Express API (default: `http://localhost:5000`)
- Stripe and ImgBB credentials

### Install

```bash
npm install
```

### Configure environment

Create a `.env.local` file in the project root. All `.env*` files are ignored by Git.

```env
# Better Auth / MongoDB
MONGODB_URI="mongodb://localhost:27017"
BETTER_AUTH_SECRET="replace-with-a-long-random-secret"
BETTER_AUTH_URL="http://localhost:3000"

# Express backend used for services, bookings, users, and payments
BACKEND_URL="http://localhost:5000"

# Browser-side Better Auth base URL (optional; defaults to http://localhost:3000)
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000"

# Service image uploads
IMGBB_API_KEY="your-imgbb-api-key"

# Stripe keys used by the separate payments backend
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

Notes:

- `MONGODB_URI` is used by Better Auth; this app writes auth data to the `fixMateDb` database.
- `BETTER_AUTH_URL` is also used as the origin for Stripe success/cancel redirects.
- `NEXT_PUBLIC_API_BASE_URL` is read by the browser auth client and falls back to `http://localhost:3000`.
- The Stripe keys are not read directly by this frontend; they are listed here because the payments backend needs them.
- Only service images from `i.ibb.co` are allowed by the configured Next.js `remotePatterns`.

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Make sure the Express backend is running before using bookings, payments, admin screens, or any other data-backed feature.

## Scripts

```bash
npm run dev     # Start the development server
npm run build   # Create a production build
npm run start   # Serve the production build
npm run lint    # Run ESLint
```

## How it works

### Authentication and authorization

- `src/lib/auth.ts` configures Better Auth with email/password, a custom `role` field, a JWT plugin, and a 7-day cookie cache.
- `src/lib/auth-client.ts` provides the browser-side auth client.
- `src/lib/auth-fetch.ts` is a server-only helper that gets the Better Auth JWT and attaches it as a Bearer token to Express API requests.
- `src/proxy.ts` protects `/dashboard` routes and redirects users away from dashboards that do not match their role. In Next.js 16 this file replaces the older `middleware.ts` convention.
- `src/lib/dashboard-access.ts` adds a server-side guard inside dashboard layouts.
- The Express API remains the source of truth and verifies the JWT and role for protected requests.

Roles used by the UI are `customer`, `technician`, and `admin`. Public signup offers only **Customer** and **Technician**; admin access is assigned outside the public signup flow.

### Backend integration

Server-side data helpers live in `src/lib/actions/api/`:

- `data.ts` — read operations for services, bookings, users, and payments
- `services.ts` — create/update/delete services, approvals, bookings, payments, and profiles
- `bookings.ts` — cancel bookings and update booking status

All calls are proxied through `BACKEND_URL`. Public service reads are unauthenticated; the marketplace only displays services whose approval status is `Approved` and whose `isAvailable` flag is true.

### Route handlers

| Endpoint | Purpose |
| --- | --- |
| `/api/auth/[...all]` | Better Auth request handler |
| `/api/stripe/checkout` | Starts a Stripe Checkout session via the Express API |
| `/api/stripe/verify` | Handles the Stripe success redirect and confirms payment |
| `/api/upload/imgbb` | Uploads a service image and returns its public URL |

## Project structure

```text
src/
├── app/
│   ├── (auth)/              # Sign in and sign up pages
│   ├── (dashboard)/         # Role-specific dashboard pages
│   │   └── dashboard/
│   │       ├── admin/
│   │       ├── customer/
│   │       └── technician/
│   ├── (root)/              # Public pages: home, about, services
│   ├── api/                 # Auth, Stripe, and ImgBB route handlers
│   ├── components/          # Feature and shared components
│   └── layout.tsx
├── components/ui/           # shadcn/ui primitives
├── lib/
│   ├── actions/api/         # Server-side Express API calls
│   ├── auth.ts              # Better Auth server config
│   ├── auth-client.ts       # Browser auth client
│   ├── auth-fetch.ts        # Authenticated backend fetch helper
│   └── services.ts          # Service normalization and formatting
├── proxy.ts                 # Dashboard route protection
└── types/                   # Shared TypeScript types
```

## Deployment

Deploy with any platform that supports Node.js 20.9+ and Next.js 16, such as Vercel. Set all environment variables in the deployment environment and confirm that the deployed app can reach the Express backend, MongoDB, Stripe, and ImgBB.

## Troubleshooting

- **The service catalogue is empty.** Confirm `BACKEND_URL` is reachable and that services are both `Approved` and available.
- **Dashboard routes redirect to `/signin`.** Check `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, and MongoDB connectivity.
- **Image uploads fail.** Verify `IMGBB_API_KEY` and that the uploaded file is a valid image.
- **Stripe checkout fails.** Confirm the backend Stripe keys and that `BETTER_AUTH_URL` matches the origin Stripe should redirect back to.
