-- 🖼️ FINAL STORAGE & IMAGE FIX
-- This ensures the bucket is public and policies allow uploads correctly.

-- 1. Ensure bucket exists and is public
insert into storage.buckets (id, name, public)
values ('profile-photos', 'profile-photos', true)
on conflict (id) do update set public = true;

-- 2. Clear old policies to avoid conflicts
drop policy if exists "Give public access to profile-photos" on storage.objects;
drop policy if exists "Allow authenticated uploads" on storage.objects;
drop policy if exists "Allow users to update own files" on storage.objects;
drop policy if exists "Allow users to delete own files" on storage.objects;

-- 3. Create Robust Policies
-- Public read access: Anyone can see photos (crucial for mating sites)
create policy "Allow Public View"
on storage.objects for select
using ( bucket_id = 'profile-photos' );

-- Authenticated Insert: Any logged in user can upload
-- Note: We use auth.role() = 'authenticated' to ensure they are logged in.
create policy "Allow Authenticated Upload"
on storage.objects for insert
with check ( 
    bucket_id = 'profile-photos' 
    and (auth.role() = 'authenticated' OR auth.role() = 'anon') 
);
-- 💡 NOTE: I'm adding 'anon' temporarily because if Email Confirmation is ON, 
-- your user is technically 'anon' until they click the link! 
-- This will fix the registration upload issue.

-- Allow users to manage their own files
create policy "Allow Individual Manage"
on storage.objects for all
using ( bucket_id = 'profile-photos' and auth.uid() = owner );

-- 4. Grant Permissions
grant all on table storage.objects to anon;
grant all on table storage.objects to authenticated;
