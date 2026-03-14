-- 1. Create a secure function to check admin status (Bypasses RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
    AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop existing problematic policies on admin_users
DROP POLICY IF EXISTS "Admins can view all admins" ON public.admin_users;
DROP POLICY IF EXISTS "Super Admins can insert/update/delete admins" ON public.admin_users;

-- 3. Re-create Admin policies using the function
CREATE POLICY "Admins can view all admins" ON public.admin_users
    FOR SELECT
    USING (is_admin());

-- Note: The super admin check might still recurse if we aren't careful, 
-- but since is_admin() is optimized, let's fix this one too for safety:

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
    AND role = 'super_admin'
    AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP POLICY IF EXISTS "Super Admins can manage admins" ON public.admin_users;
CREATE POLICY "Super Admins can manage admins" ON public.admin_users
    FOR ALL
    USING (is_super_admin());


-- 4. Fix Profile Policies (Use is_admin() instead of direct query)
DROP POLICY IF EXISTS "Admins can view and update all profiles" ON public.profiles;

CREATE POLICY "Admins can view and update all profiles" ON public.profiles
    FOR ALL
    USING (is_admin());

-- 5. Fix Master/Photos Policies (Ensure they use the function too)
DROP POLICY IF EXISTS "Admins manage religions" ON public.master_religions;
CREATE POLICY "Admins manage religions" ON public.master_religions
    FOR ALL
    USING (is_admin());

DROP POLICY IF EXISTS "Admins manage castes" ON public.master_castes;
CREATE POLICY "Admins manage castes" ON public.master_castes
    FOR ALL
    USING (is_admin());

DROP POLICY IF EXISTS "Admins can view and update all photos" ON public.profile_photos;
CREATE POLICY "Admins can view and update all photos" ON public.profile_photos
    FOR ALL
    USING (is_admin());
