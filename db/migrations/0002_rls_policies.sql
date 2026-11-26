-- =============================================================================
-- AURUM EV (Aurum Fleet Solutions Pvt Ltd)
-- Migration 0002: Row-Level Security (RLS) Policies for Supabase / PostgreSQL
-- =============================================================================
-- Note: In Supabase deployments, auth.uid() matches profiles.id.
-- In direct server-side Node/Next.js connections using a session context or
-- service role, server-side authorization enforces identical tenant/user checks.

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper view/function for admin check in Supabase RLS
CREATE OR REPLACE FUNCTION is_aurum_staff(check_uid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = check_uid
      AND role_name IN (
        'super_admin', 'admin', 'operations_manager', 'fleet_manager',
        'finance_manager', 'marketing_manager', 'customer_support', 'sales_executive'
      )
  );
$$ LANGUAGE sql STABLE;

-- Customer/User own-record policies (Supabase auth.uid() compatible)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth') THEN
    EXECUTE 'CREATE POLICY profiles_self_select ON profiles FOR SELECT USING (id = auth.uid() OR is_aurum_staff(auth.uid()))';
    EXECUTE 'CREATE POLICY bookings_owner_select ON bookings FOR SELECT USING (customer_id = auth.uid() OR is_aurum_staff(auth.uid()))';
    EXECUTE 'CREATE POLICY rentals_owner_select ON rentals FOR SELECT USING (customer_id = auth.uid() OR is_aurum_staff(auth.uid()))';
    EXECUTE 'CREATE POLICY payments_owner_select ON payments FOR SELECT USING (customer_id = auth.uid() OR is_aurum_staff(auth.uid()))';
    EXECUTE 'CREATE POLICY invoices_owner_select ON invoices FOR SELECT USING (customer_id = auth.uid() OR is_aurum_staff(auth.uid()))';
    EXECUTE 'CREATE POLICY kyc_owner_select ON kyc_documents FOR SELECT USING (user_id = auth.uid() OR is_aurum_staff(auth.uid()))';
    EXECUTE 'CREATE POLICY notifications_owner_select ON notifications FOR SELECT USING (user_id = auth.uid() OR is_aurum_staff(auth.uid()))';
    EXECUTE 'CREATE POLICY business_member_select ON business_accounts FOR SELECT USING (owner_user_id = auth.uid() OR EXISTS (SELECT 1 FROM business_members bm WHERE bm.business_id = id AND bm.user_id = auth.uid() AND bm.is_active) OR is_aurum_staff(auth.uid()))';
  END IF;
END $$;
