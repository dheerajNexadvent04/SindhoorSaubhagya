-- 0. Clean up previous attempts (if any) to avoid "column does not exist" errors
DROP TABLE IF EXISTS public.admin_users CASCADE;

-- 1. Create Admin Users Table
CREATE TABLE public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL, -- Stored for easy lookup
    role VARCHAR(50) DEFAULT 'moderator', -- 'super_admin', 'admin', 'moderator'
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 2. Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies for Admin Users
-- Only admins can view admin_users table (to see other admins)
CREATE POLICY "Admins can view all admins" ON public.admin_users
    FOR SELECT
    USING (
        auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = TRUE)
    );

-- Super Admins can manage admins
CREATE POLICY "Super Admins can insert/update/delete admins" ON public.admin_users
    FOR ALL
    USING (
        auth.uid() IN (SELECT user_id FROM public.admin_users WHERE role = 'super_admin' AND is_active = TRUE)
    );

-- 4. Update Profiles Table RLS (Critical for the "Verify" flow)
-- Allow Admins to View ALL Profiles (even unapproved ones)
CREATE POLICY "Admins can view and update all profiles" ON public.profiles
    FOR ALL
    USING (
        auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = TRUE)
    );

-- 5. Profile Photos Admin Policy
CREATE POLICY "Admins can view and update all photos" ON public.profile_photos
    FOR ALL
    USING (
        auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = TRUE)
    );

-- 6. SEED SUPREME ADMIN (example template)
-- Replace <ADMIN_EMAIL> with your real admin email before running this query.
INSERT INTO public.admin_users (user_id, email, role, is_active)
SELECT id, email, 'super_admin', true
FROM auth.users
WHERE email = '<ADMIN_EMAIL>'
ON CONFLICT (user_id) DO UPDATE
SET role = 'super_admin', is_active = true;

