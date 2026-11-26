# AURUM EV — Electric Mobility & Fleet Solutions Website

**Legal Company Name:** Aurum Fleet Solutions Pvt Ltd  
**Tagline:** *Driven by Trust. Powered by Tomorrow.*

A production-oriented, mobile-first public website and enquiry/booking platform built with Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, and PostgreSQL.

---

## Public Pages & Features

- **Homepage (`/`):** 3D interactive Hero showcase, Quick Journey Selector, Role Operations Tabs, Fleet Lineup Carousel, Ecosystem Advantages, Petrol vs Electric Savings Calculator (with downloadable summary), Active Hubs, Live Enquiry Form, Sustainability Disclosures, and FAQ Accordion.
- **EV Rentals (`/rentals`):** Multi-step rental booking request workflow saving requests to PostgreSQL.
- **For Riders (`/riders`):** Delivery partner mobility plans and callback request form.
- **Business Solutions (`/business`):** B2B fleet overview and bulk corporate proposal request form.
- **Invest With Us (`/invest`):** Fleet deployment overview, risk disclosures, locked simulator, and investor enquiry form.
- **Service Hubs (`/locations`), Our Fleet (`/fleet`), How It Works (`/how-it-works`), About (`/about`), Contact (`/contact`), FAQ (`/faq`), Blog (`/blog` & `/blog/[slug]`), Legal Policies (`/privacy-policy`, `/terms-and-conditions`, `/refund-policy`, `/rental-policy`, `/cancellation-policy`, `/investor-disclosures`).**

---

## Local Quick Start

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

---

## Production Deployment (Vercel + Managed PostgreSQL / Supabase)

1. Import the repository (`https://github.com/aurumfleet/aurumev`) into **Vercel**.
2. Set environment variables in Vercel Project Settings:
   - `DATABASE_URL` = your managed PostgreSQL connection string (e.g., Supabase / Neon `postgresql://...`). *(SSL is automatically negotiated for remote hosts.)*
   - `NEXT_PUBLIC_APP_URL` = your production URL (e.g., `https://aurumev.com` — also falls back to `VERCEL_PROJECT_PRODUCTION_URL` / `VERCEL_URL` automatically).
   - Optional: `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_GA4_MEASUREMENT_ID`, `NEXT_PUBLIC_GTM_ID`.
3. Deploy — `db/migrations/*.sql` are traced into the build and automatically run on first database request if migrations haven't been executed manually (`npm run db:migrate && npm run db:seed`).

---

## Verification

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```
