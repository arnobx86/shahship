-- Fix infinite recursion in RLS policies by creating security definer functions

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.user_id = $1
      AND profiles.role IN ('admin', 'super_admin')
  )
$$;

-- Create new RLS policies using the security definer function
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    auth.uid() = user_id OR public.is_admin()
  );

CREATE POLICY "Admins can update any profile"
  ON public.profiles  
  FOR UPDATE
  USING (
    auth.uid() = user_id OR public.is_admin()
  );

-- Update existing admin policies to use the new function
DROP POLICY IF EXISTS "Admins can view admin actions" ON public.admin_actions;
CREATE POLICY "Admins can view admin actions"
  ON public.admin_actions
  FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert booking history" ON public.booking_status_history;
CREATE POLICY "Admins can insert booking history"
  ON public.booking_status_history
  FOR INSERT
  WITH CHECK (public.is_admin());

-- Update booking policies
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update any booking" ON public.bookings;

CREATE POLICY "Admins can view all bookings"
  ON public.bookings
  FOR SELECT
  USING (
    auth.uid() = user_id OR public.is_admin()
  );

CREATE POLICY "Admins can update any booking"
  ON public.bookings
  FOR UPDATE
  USING (
    auth.uid() = user_id OR public.is_admin()
  );

-- Fix booking status history policy
DROP POLICY IF EXISTS "Users can view their booking history" ON public.booking_status_history;
CREATE POLICY "Users can view their booking history"
  ON public.booking_status_history
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE bookings.id = booking_status_history.booking_id 
        AND bookings.user_id = auth.uid()
    ) OR public.is_admin()
  );