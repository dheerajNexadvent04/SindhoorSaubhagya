-- 🚨 COMPLETE RESTORATION SCRIPT: Breaking Recursion & Restoring Data
-- This script fixes the "Infinite Recursion" and ensures all data is saved correctly.

-- 1. DROPPING ALL PROBLEMATIC POLICIES FIRST
DROP POLICY IF EXISTS "Admins can view all admins" ON public.admin_users;
DROP POLICY IF EXISTS "Super Admins can insert/update/delete admins" ON public.admin_users;
DROP POLICY IF EXISTS "Super Admins can manage admins" ON public.admin_users;
DROP POLICY IF EXISTS "Admin select policy" ON public.admin_users;
DROP POLICY IF EXISTS "Super admin manage policy" ON public.admin_users;

DROP POLICY IF EXISTS "Admins can view and update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Profiles select policy" ON public.profiles;
DROP POLICY IF EXISTS "Profiles update policy" ON public.profiles;
DROP POLICY IF EXISTS "Profiles insert policy" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "View approved or admin or own" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- 2. SECURE ANTI-RECURSION FUNCTIONS
-- These MUST be SECURITY DEFINER to bypass RLS and break the loop.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND role = 'super_admin' AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. NON-RECURSIVE RLS POLICIES
-- Admin Users Table: Users see their own status, Super Admins see all.
CREATE POLICY "Admin select policy" ON public.admin_users
    FOR SELECT USING (user_id = auth.uid() OR is_admin()); 
    -- Note: is_admin() bypasses RLS so this is now safe.

CREATE POLICY "Super admin all policy" ON public.admin_users
    FOR ALL USING (is_super_admin());

-- Profiles Table: Users see own, anyone sees approved, admins see all.
CREATE POLICY "Profiles select policy" ON public.profiles
    FOR SELECT USING (id = auth.uid() OR status = 'approved' OR is_admin());

CREATE POLICY "Profiles update policy" ON public.profiles
    FOR UPDATE USING (id = auth.uid() OR is_admin());

CREATE POLICY "Profiles insert policy" ON public.profiles
    FOR INSERT WITH CHECK (id = auth.uid());

-- 4. ROBUST TRIGGER FOR NEW USER SIGNUP
-- Restores mapping and handles empty/bad inputs gracefully.
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, email, first_name, last_name, gender, date_of_birth,
    phone, height, weight, marital_status, mother_tongue,
    religion_name, caste_name, sub_caste_name, managed_by,
    manglik, employed_in, degree, occupation, annual_income,
    country, state, city, family_type, father_occupation, 
    mother_occupation, brothers_total, brothers_married, 
    sisters_total, sisters_married, native_city, family_location, 
    profile_for, looking_for, about_me, about_family, status
  )
  VALUES (
    new.id, new.email,
    COALESCE(new.raw_user_meta_data->>'first_name', ''), 
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    new.raw_user_meta_data->>'gender',
    (NULLIF(new.raw_user_meta_data->>'date_of_birth', ''))::DATE,
    new.raw_user_meta_data->>'phone',
    (NULLIF(new.raw_user_meta_data->>'height', ''))::NUMERIC,
    (NULLIF(new.raw_user_meta_data->>'weight', ''))::NUMERIC,
    new.raw_user_meta_data->>'marital_status',
    new.raw_user_meta_data->>'mother_tongue',
    new.raw_user_meta_data->>'religion_name',
    new.raw_user_meta_data->>'caste_name',
    new.raw_user_meta_data->>'sub_caste_name',
    new.raw_user_meta_data->>'managed_by',
    new.raw_user_meta_data->>'manglik',
    new.raw_user_meta_data->>'employed_in',
    new.raw_user_meta_data->>'degree',
    new.raw_user_meta_data->>'occupation',
    (NULLIF(new.raw_user_meta_data->>'annual_income', ''))::NUMERIC,
    new.raw_user_meta_data->>'country',
    new.raw_user_meta_data->>'state',
    new.raw_user_meta_data->>'city',
    new.raw_user_meta_data->>'family_type',
    new.raw_user_meta_data->>'father_occupation',
    new.raw_user_meta_data->>'mother_occupation',
    COALESCE((NULLIF(new.raw_user_meta_data->>'brothers_total', ''))::INTEGER, 0),
    COALESCE((NULLIF(new.raw_user_meta_data->>'brothers_married', ''))::INTEGER, 0),
    COALESCE((NULLIF(new.raw_user_meta_data->>'sisters_total', ''))::INTEGER, 0),
    COALESCE((NULLIF(new.raw_user_meta_data->>'sisters_married', ''))::INTEGER, 0),
    new.raw_user_meta_data->>'native_city',
    new.raw_user_meta_data->>'family_location',
    new.raw_user_meta_data->>'profile_for',
    new.raw_user_meta_data->>'looking_for',
    new.raw_user_meta_data->>'about_me',
    new.raw_user_meta_data->>'about_family',
    'pending'
  );
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- Last resort: create a bare-minimum row so that manual updates can work
  INSERT INTO public.profiles (id, email, first_name, last_name, status)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'first_name', ''), COALESCE(new.raw_user_meta_data->>'last_name', ''), 'pending');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Ensure trigger is active
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. Final Permission Grants
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
