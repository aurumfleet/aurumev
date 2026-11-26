-- =============================================================================
-- AURUM EV (Aurum Fleet Solutions Pvt Ltd)
-- Reproducible SQL Seed Baseline (Public Settings & FAQs)
-- Note: Full development user/fleet seed is executed via `npm run db:seed`
-- =============================================================================

INSERT INTO site_settings (key, value, description)
VALUES
  (
    'contact_settings',
    '{"phone":"+91 77799 90277","whatsapp":"917779990277","supportEmail":"info@aurumfleets.com","officeAddress":"Ground Floor, B 130, Dharampal Satyapal Rd, B Block, Sector 65, Noida, Uttar Pradesh 201301","operatingHours":"Mon – Sat, 09:00 AM – 07:00 PM IST","socialLinks":{"linkedin":"","instagram":"","facebook":"","x":""}}'::jsonb,
    'Centralized contact details'
  ),
  (
    'investment_config',
    '{"financialModelApproved":false,"publicStatusMessage":"Investment model details are currently being finalized. Contact our team for information.","demoCalculatorEnabled":false,"disclosuresText":"Any investment or fleet participation opportunity offered by Aurum Fleet Solutions Pvt Ltd is subject to formal legal documentation, contractual terms, and applicable regulatory compliance."}'::jsonb,
    'Investor program disclosures and financial model flag'
  )
ON CONFLICT (key) DO NOTHING;
