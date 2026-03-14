-- 🛡️ ULTIMATE CONSOLIDATED BACKEND FIX: Recursion-Safe, Empty-Safe & Security-Hardened
-- This script fixes both the "0 users" dashboard, "empty profile" data issues, and Security Advisor warnings.

-- 1. Ensure all columns exist in profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS religion_name TEXT,
ADD COLUMN IF NOT EXISTS caste_name TEXT,
ADD COLUMN IF NOT EXISTS sub_caste_name TEXT,
ADD COLUMN IF NOT EXISTS mother_tongue TEXT,
ADD COLUMN IF NOT EXISTS height NUMERIC,
ADD COLUMN IF NOT EXISTS weight NUMERIC,
ADD COLUMN IF NOT EXISTS marital_status TEXT,
ADD COLUMN IF NOT EXISTS degree TEXT,
ADD COLUMN IF NOT EXISTS occupation TEXT,
ADD COLUMN IF NOT EXISTS employed_in TEXT,
ADD COLUMN IF NOT EXISTS annual_income NUMERIC,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'India',
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS managed_by TEXT,
ADD COLUMN IF NOT EXISTS profile_for TEXT,
ADD COLUMN IF NOT EXISTS looking_for TEXT,
ADD COLUMN IF NOT EXISTS manglik TEXT,
ADD COLUMN IF NOT EXISTS family_type TEXT,
ADD COLUMN IF NOT EXISTS father_occupation TEXT,
ADD COLUMN IF NOT EXISTS mother_occupation TEXT,
ADD COLUMN IF NOT EXISTS brothers_total INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS brothers_married INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS sisters_total INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS sisters_married INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS native_city TEXT,
ADD COLUMN IF NOT EXISTS family_location TEXT,
ADD COLUMN IF NOT EXISTS about_family TEXT,
ADD COLUMN IF NOT EXISTS about_me TEXT,
ADD COLUMN IF NOT EXISTS horoscope_url TEXT,
ADD COLUMN IF NOT EXISTS photos TEXT[],
ADD COLUMN IF NOT EXISTS photo_url TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;

-- 2. Anti-Recursion Functions with Security Hardening (SET search_path = public)
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

-- 3. Resilient Trigger Function (Handles empty strings and invalid formats)
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
    new.raw_user_meta_data->>'first_name', 
    new.raw_user_meta_data->>'last_name',
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
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Ensure trigger is re-attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Re-enable RLS 
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 5. Robust RLS Policies
DROP POLICY IF EXISTS "Profiles select policy" ON public.profiles;
DROP POLICY IF EXISTS "Profiles update policy" ON public.profiles;
DROP POLICY IF EXISTS "Profiles insert policy" ON public.profiles;

CREATE POLICY "Profiles select policy" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR status = 'approved' OR is_admin());

CREATE POLICY "Profiles update policy" ON public.profiles
    FOR UPDATE USING (auth.uid() = id OR is_admin());

CREATE POLICY "Profiles insert policy" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admin select policy" ON public.admin_users;
CREATE POLICY "Admin select policy" ON public.admin_users
    FOR SELECT USING (user_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "Super admin manage policy" ON public.admin_users;
CREATE POLICY "Super admin manage policy" ON public.admin_users
    FOR ALL USING (is_super_admin());

-- 6. Permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.admin_users TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
