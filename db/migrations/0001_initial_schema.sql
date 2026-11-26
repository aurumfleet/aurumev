-- =============================================================================
-- AURUM EV (Aurum Fleet Solutions Pvt Ltd)
-- Migration 0001: Complete Normalized PostgreSQL Schema (36 Core Entities)
-- =============================================================================

-- Helper function to auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  full_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone);

-- 2. user_roles
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_name TEXT NOT NULL CHECK (role_name IN (
    'super_admin',
    'admin',
    'operations_manager',
    'fleet_manager',
    'finance_manager',
    'marketing_manager',
    'customer_support',
    'sales_executive',
    'rider',
    'individual_customer',
    'business_owner',
    'business_staff',
    'investor'
  )),
  is_primary BOOLEAN NOT NULL DEFAULT TRUE,
  assigned_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role_name)
);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_name ON user_roles(role_name);

-- 3. role_permissions
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name TEXT NOT NULL,
  module_name TEXT NOT NULL,
  permission TEXT NOT NULL CHECK (permission IN (
    'view',
    'create',
    'edit',
    'delete',
    'approve',
    'reject',
    'export',
    'publish',
    'manage_settings'
  )),
  allowed BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (role_name, module_name, permission)
);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role_name);

-- 4. locations
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  hub_name TEXT NOT NULL,
  address TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  operating_hours TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_locations_city_active ON locations(city, is_active);

-- 5. business_accounts
CREATE TABLE IF NOT EXISTS business_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  business_category TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT NOT NULL,
  gst_number TEXT,
  city TEXT NOT NULL,
  required_vehicles INTEGER NOT NULL DEFAULT 1,
  expected_duration TEXT,
  requirements TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'suspended')),
  owner_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_business_accounts_owner ON business_accounts(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_business_accounts_status ON business_accounts(verification_status);

-- 6. business_members
CREATE TABLE IF NOT EXISTS business_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES business_accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  member_role TEXT NOT NULL DEFAULT 'business_staff' CHECK (member_role IN ('business_owner', 'business_staff')),
  department TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (business_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_business_members_business ON business_members(business_id);
CREATE INDEX IF NOT EXISTS idx_business_members_user ON business_members(user_id);

-- 7. investor_profiles
CREATE TABLE IF NOT EXISTS investor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  investor_type TEXT NOT NULL DEFAULT 'individual' CHECK (investor_type IN ('individual', 'hni', 'institutional', 'corporate')),
  pan_reference TEXT,
  city TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  onboarding_notes TEXT,
  approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. customer_profiles
CREATE TABLE IF NOT EXISTS customer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  customer_type TEXT NOT NULL DEFAULT 'individual' CHECK (customer_type IN ('rider', 'individual')),
  city TEXT,
  address TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  delivery_partner_platform TEXT,
  kyc_status TEXT NOT NULL DEFAULT 'not_submitted' CHECK (kyc_status IN ('not_submitted', 'pending', 'verified', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_kyc ON customer_profiles(kyc_status);

-- 9. vehicle_models
CREATE TABLE IF NOT EXISTS vehicle_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL,
  model_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('commuter', 'delivery', 'high_speed', 'cargo', 'corporate')),
  battery_type TEXT,
  battery_capacity_kwh NUMERIC(6,2),
  claimed_range_km INTEGER,
  top_speed_kmph INTEGER,
  charging_time_hours NUMERIC(4,1),
  image_url TEXT,
  specs_verified BOOLEAN NOT NULL DEFAULT FALSE,
  description TEXT,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_vehicle_models_category ON vehicle_models(category, is_published);

-- 10. vehicles
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_code TEXT NOT NULL UNIQUE,
  model_id UUID REFERENCES vehicle_models(id) ON DELETE SET NULL,
  vehicle_name TEXT NOT NULL,
  vehicle_brand TEXT NOT NULL,
  vehicle_model TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  battery_type TEXT,
  battery_capacity TEXT,
  claimed_range TEXT,
  purchase_date DATE,
  asset_cost NUMERIC(12,2),
  chassis_number TEXT UNIQUE,
  registration_number TEXT UNIQUE,
  insurance_policy_number TEXT,
  insurance_expiry DATE,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'rented', 'under_maintenance', 'inactive', 'retired')),
  assigned_customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  investor_id UUID REFERENCES investor_profiles(id) ON DELETE SET NULL,
  specs_verified BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_vehicles_status_loc ON vehicles(status, location_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_customer ON vehicles(assigned_customer_id);

-- 11. vehicle_documents
CREATE TABLE IF NOT EXISTS vehicle_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('rc', 'insurance', 'purchase_invoice', 'fitness', 'permit', 'handover_photo', 'other')),
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  expiry_date DATE,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_vehicle_documents_vehicle ON vehicle_documents(vehicle_id);

-- 12. vehicle_maintenance
CREATE TABLE IF NOT EXISTS vehicle_maintenance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  maintenance_type TEXT NOT NULL CHECK (maintenance_type IN ('routine_service', 'battery_check', 'brake_repair', 'tire_replacement', 'accident_repair', 'inspection')),
  scheduled_date DATE NOT NULL,
  completed_date DATE,
  cost NUMERIC(10,2) DEFAULT 0,
  vendor_name TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  notes TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_vehicle_maintenance_vehicle ON vehicle_maintenance(vehicle_id, status);

-- 13. rental_plans
CREATE TABLE IF NOT EXISTS rental_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name TEXT NOT NULL,
  duration_type TEXT NOT NULL CHECK (duration_type IN ('daily', 'weekly', 'monthly', 'long_term_corporate')),
  category TEXT NOT NULL,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  base_rate NUMERIC(10,2),
  security_deposit NUMERIC(10,2),
  pricing_approved BOOLEAN NOT NULL DEFAULT FALSE,
  included_km INTEGER,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_rental_plans_active ON rental_plans(is_active, duration_type);

-- 14. bookings
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  business_id UUID REFERENCES business_accounts(id) ON DELETE SET NULL,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  vehicle_model_id UUID REFERENCES vehicle_models(id) ON DELETE SET NULL,
  allocated_vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  rental_plan_id UUID REFERENCES rental_plans(id) ON DELETE SET NULL,
  vehicle_category TEXT NOT NULL,
  duration_type TEXT NOT NULL CHECK (duration_type IN ('daily', 'weekly', 'monthly', 'long_term_corporate')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  terms_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'new_request' CHECK (status IN (
    'draft',
    'new_request',
    'pending_verification',
    'approved',
    'payment_pending',
    'confirmed',
    'active',
    'completed',
    'cancelled',
    'rejected'
  )),
  quoted_amount NUMERIC(10,2),
  deposit_amount NUMERIC(10,2),
  admin_notes TEXT,
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (end_date >= start_date)
);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle_dates ON bookings(allocated_vehicle_id, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- 15. rentals
CREATE TABLE IF NOT EXISTS rentals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_code TEXT NOT NULL UNIQUE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  business_id UUID REFERENCES business_accounts(id) ON DELETE SET NULL,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
  rental_plan_id UUID REFERENCES rental_plans(id) ON DELETE SET NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  actual_return_date DATE,
  handover_checklist JSONB DEFAULT '{}'::jsonb,
  return_checklist JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('scheduled', 'active', 'overdue', 'completed', 'terminated')),
  monthly_rate NUMERIC(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (end_date >= start_date)
);
CREATE INDEX IF NOT EXISTS idx_rentals_customer ON rentals(customer_id, status);
CREATE INDEX IF NOT EXISTS idx_rentals_vehicle_dates ON rentals(vehicle_id, start_date, end_date, status);

-- 16. vehicle_allocations
CREATE TABLE IF NOT EXISTS vehicle_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  rental_id UUID REFERENCES rentals(id) ON DELETE SET NULL,
  allocated_to_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  allocated_by_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  allocated_from DATE NOT NULL,
  allocated_until DATE NOT NULL,
  allocation_status TEXT NOT NULL DEFAULT 'reserved' CHECK (allocation_status IN ('reserved', 'handed_over', 'returned', 'released')),
  handover_notes TEXT,
  return_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_vehicle_allocations_vehicle ON vehicle_allocations(vehicle_id, allocation_status);

-- 17. payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_reference TEXT NOT NULL UNIQUE,
  idempotency_key TEXT UNIQUE,
  customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  business_id UUID REFERENCES business_accounts(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  rental_id UUID REFERENCES rentals(id) ON DELETE SET NULL,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('rental_fee', 'booking_advance', 'security_deposit', 'late_fee', 'damage_charge', 'other')),
  amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  gateway_provider TEXT NOT NULL DEFAULT 'none',
  gateway_order_id TEXT,
  gateway_payment_id TEXT,
  gateway_signature_verified BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'successful', 'failed', 'refunded', 'partially_refunded')),
  payment_method TEXT,
  paid_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_payments_customer ON payments(customer_id, status);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);

-- 18. invoices
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  business_id UUID REFERENCES business_accounts(id) ON DELETE SET NULL,
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  rental_id UUID REFERENCES rentals(id) ON DELETE SET NULL,
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'issued' CHECK (status IN ('draft', 'issued', 'paid', 'overdue', 'void')),
  due_date DATE,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_business ON invoices(business_id);

-- 19. refunds
CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  reason TEXT NOT NULL,
  gateway_refund_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
  processed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 20. agreements
CREATE TABLE IF NOT EXISTS agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_number TEXT NOT NULL UNIQUE,
  agreement_type TEXT NOT NULL CHECK (agreement_type IN ('rider_rental', 'corporate_fleet', 'investor_onboarding', 'handover_acknowledgement')),
  customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  business_id UUID REFERENCES business_accounts(id) ON DELETE SET NULL,
  rental_id UUID REFERENCES rentals(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  terms_snapshot TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_signature' CHECK (status IN ('draft', 'pending_signature', 'signed', 'expired', 'terminated')),
  signed_at TIMESTAMPTZ,
  signed_by_name TEXT,
  signed_ip TEXT,
  document_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_agreements_customer ON agreements(customer_id);

-- 21. kyc_documents
CREATE TABLE IF NOT EXISTS kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_id UUID REFERENCES business_accounts(id) ON DELETE SET NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('aadhaar_front', 'aadhaar_back', 'driving_licence', 'pan_card', 'address_proof', 'gst_certificate', 'incorporation_certificate', 'selfie', 'other')),
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size_bytes INTEGER NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  expiry_date DATE,
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  retention_until DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_user ON kyc_documents(user_id, verification_status);

-- 22. support_tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_id UUID REFERENCES business_accounts(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN ('vehicle_issue', 'battery_charging', 'billing_payment', 'kyc_documents', 'booking_change', 'accident_emergency', 'general')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  attachment_path TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_customer', 'resolved', 'closed')),
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON support_tickets(user_id, status);

-- 23. support_messages
CREATE TABLE IF NOT EXISTS support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_internal BOOLEAN NOT NULL DEFAULT FALSE,
  attachment_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket ON support_messages(ticket_id);

-- 24. marketing_campaigns
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('website', 'instagram', 'facebook', 'google_ads', 'whatsapp', 'referral', 'corporate_outreach', 'other')),
  utm_campaign TEXT,
  budget NUMERIC(12,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('planned', 'active', 'paused', 'completed')),
  start_date DATE,
  end_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 25. leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_code TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT,
  lead_category TEXT NOT NULL CHECK (lead_category IN ('rental', 'delivery_partner', 'individual', 'corporate', 'investor')),
  source TEXT NOT NULL DEFAULT 'website' CHECK (source IN ('website', 'instagram', 'facebook', 'google_ads', 'whatsapp', 'referral', 'manual_entry', 'business_partnerships')),
  campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE SET NULL,
  campaign_name TEXT,
  requirement TEXT,
  assigned_staff_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'follow_up', 'proposal_sent', 'converted', 'lost')),
  follow_up_date DATE,
  notes TEXT,
  converted_customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_leads_status_cat ON leads(status, lead_category);
CREATE INDEX IF NOT EXISTS idx_leads_assigned ON leads(assigned_staff_id);

-- 26. lead_activities
CREATE TABLE IF NOT EXISTS lead_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('created', 'status_change', 'call', 'email', 'whatsapp', 'note', 'follow_up_set', 'converted')),
  summary TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_lead_activities_lead ON lead_activities(lead_id);

-- 27. investor_enquiries
CREATE TABLE IF NOT EXISTS investor_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT,
  entity_type TEXT NOT NULL DEFAULT 'individual',
  indicative_interest TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'under_review', 'approved', 'declined')),
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 28. investment_records
CREATE TABLE IF NOT EXISTS investment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID NOT NULL REFERENCES investor_profiles(id) ON DELETE CASCADE,
  record_code TEXT NOT NULL UNIQUE,
  structure_title TEXT NOT NULL,
  capital_amount NUMERIC(14,2),
  linked_vehicle_count INTEGER DEFAULT 0,
  projected_revenue NUMERIC(14,2),
  operating_expenses NUMERIC(14,2),
  projected_net_income NUMERIC(14,2),
  actual_received_income NUMERIC(14,2) DEFAULT 0,
  investor_distributions NUMERIC(14,2) DEFAULT 0,
  is_model_approved BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'active', 'paused', 'closed')),
  verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_investment_records_investor ON investment_records(investor_id);

-- 29. investor_reports
CREATE TABLE IF NOT EXISTS investor_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID REFERENCES investor_profiles(id) ON DELETE CASCADE,
  report_title TEXT NOT NULL,
  report_period TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('monthly_statement', 'fleet_utilization', 'distribution_summary', 'annual_disclosure')),
  summary TEXT,
  document_path TEXT,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  published_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 30. notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'in_app' CHECK (channel IN ('in_app', 'email', 'sms', 'whatsapp')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  delivery_status TEXT NOT NULL DEFAULT 'delivered' CHECK (delivery_status IN ('delivered', 'queued', 'not_configured', 'failed')),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);

-- 31. website_pages
CREATE TABLE IF NOT EXISTS website_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  draft_content JSONB,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  revision INTEGER NOT NULL DEFAULT 1,
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 32. blog_posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT NOT NULL,
  cover_image_url TEXT,
  category TEXT DEFAULT 'Electric Mobility',
  seo_title TEXT,
  seo_description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);

-- 33. faqs
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL DEFAULT 'General' CHECK (category IN ('General', 'Rentals', 'Delivery Partners', 'Business Fleet', 'Investment', 'KYC & Payments')),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 34. testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_category TEXT NOT NULL CHECK (customer_category IN ('Delivery Partner', 'Individual Rider', 'Corporate Partner', 'Fleet Partner')),
  review_text TEXT NOT NULL,
  photo_url TEXT,
  city TEXT,
  approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 35. site_settings
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 36. audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  actor_email TEXT,
  actor_role TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  before_state JSONB,
  after_state JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
