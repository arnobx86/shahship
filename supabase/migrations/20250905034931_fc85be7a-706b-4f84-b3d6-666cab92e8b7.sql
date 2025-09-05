-- Add foreign key relationships between tables to fix data fetching issues

-- Add foreign key relationship from bookings to profiles (user_id)
ALTER TABLE public.bookings 
ADD CONSTRAINT fk_bookings_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add index for better performance on bookings.user_id
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);

-- Add index for better performance on profiles.user_id  
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- Update RLS policies to allow admins to view all bookings with user info
CREATE POLICY "Admins can view all bookings" 
ON public.bookings 
FOR SELECT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role IN ('admin', 'super_admin')
));

-- Update RLS policies to allow admins to view all profiles  
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT  
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.profiles p
  WHERE p.user_id = auth.uid() 
  AND p.role IN ('admin', 'super_admin')
));

-- Update RLS policies to allow admins to update any booking
CREATE POLICY "Admins can update any booking"
ON public.bookings
FOR UPDATE
TO authenticated  
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role IN ('admin', 'super_admin')
));

-- Update RLS policies to allow admins to update any profile
CREATE POLICY "Admins can update any profile"  
ON public.profiles
FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.profiles p
  WHERE p.user_id = auth.uid() 
  AND p.role IN ('admin', 'super_admin')
));