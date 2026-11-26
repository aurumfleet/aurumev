# AURUM EV — Public API Reference

- `GET /api/health` — Database health check.
- `GET /api/public/catalog` — Active locations, published vehicle models, active rental plans, FAQs, verified testimonials, published blog posts, and contact/investment settings.
- `POST /api/leads` — Logs public rental/rider/general enquiries into `leads` + `lead_activities`.
- `POST /api/bookings` — Logs EV rental booking requests in `new_request` status into `bookings` + `leads`.
- `POST /api/business/register` — Logs B2B corporate fleet proposal requests into `business_accounts` + `leads`.
- `POST /api/investor/enquiries` — Logs investor information enquiries into `investor_enquiries` + `leads`.
