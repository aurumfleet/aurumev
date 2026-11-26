# AURUM EV — Electric Mobility & Fleet Solutions Website

**Legal Company Name:** Aurum Fleet Solutions Pvt Ltd  
**Tagline:** *Driven by Trust. Powered by Tomorrow.*

A production-oriented, mobile-first public website and enquiry/booking platform built with Next.js App Router, React, TypeScript, Tailwind CSS, and PostgreSQL.

---

## Public Pages & Features

- **Homepage (`/`):** Hero showcase, Quick Journey Selector, Why Aurum EV, Interactive Fleet Showcase, Petrol vs Electric Savings Calculator (with downloadable summary), How It Works, Business Fleet Solutions, Investment Opportunities, Sustainability, Verified Testimonials, FAQ Accordion, and Footer.
- **EV Rentals (`/rentals`):** Multi-step rental booking request workflow saving requests to PostgreSQL.
- **For Riders (`/riders`):** Delivery partner mobility plans and callback request form.
- **Business Solutions (`/business`):** B2B fleet overview and bulk corporate proposal request form.
- **Invest With Us (`/invest`):** Fleet deployment overview, risk disclosures, and investor enquiry form.
- **Our Fleet (`/fleet`), How It Works (`/how-it-works`), About (`/about`), Contact (`/contact`), FAQ (`/faq`), Blog (`/blog`), Legal Policies (`/privacy-policy`, `/terms-and-conditions`, `/refund-policy`, `/rental-policy`, `/investor-disclosures`).**

---

## Quick Start

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```
