-- Add role column to profiles table for RBAC
ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'super_admin'));

-- Create pricing table for admin-managed pricing
CREATE TABLE public.pricing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shipping_method TEXT NOT NULL,
  shipping_route TEXT NOT NULL,
  price_per_cbm NUMERIC(10,2),
  price_per_kg NUMERIC(10,2),
  base_price NUMERIC(10,2),
  currency TEXT DEFAULT 'USD',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on pricing table
ALTER TABLE public.pricing ENABLE ROW LEVEL SECURITY;

-- Create policies for pricing table
CREATE POLICY "Everyone can view active pricing" 
ON public.pricing 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage pricing" 
ON public.pricing 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

-- Create admin actions log table
CREATE TABLE public.admin_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES auth.users(id),
  action_type TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin actions
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- Create policy for admin actions (only admins can view)
CREATE POLICY "Admins can view admin actions" 
ON public.admin_actions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

-- Create booking status history table
CREATE TABLE public.booking_status_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id),
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on booking status history
ALTER TABLE public.booking_status_history ENABLE ROW LEVEL SECURITY;

-- Create policies for booking status history
CREATE POLICY "Users can view their booking history" 
ON public.booking_status_history 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE id = booking_status_history.booking_id 
    AND user_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins can insert booking history" 
ON public.booking_status_history 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

-- Add trigger for updated_at on pricing table
CREATE TRIGGER update_pricing_updated_at
BEFORE UPDATE ON public.pricing
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_action_type TEXT,
  p_target_type TEXT,
  p_target_id TEXT,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_description TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  action_id UUID;
BEGIN
  INSERT INTO public.admin_actions (
    admin_id, action_type, target_type, target_id, 
    old_values, new_values, description
  ) VALUES (
    auth.uid(), p_action_type, p_target_type, p_target_id,
    p_old_values, p_new_values, p_description
  ) RETURNING id INTO action_id;
  
  RETURN action_id;
END;
$$;

-- Function to update booking status with history tracking
CREATE OR REPLACE FUNCTION public.update_booking_status(
  p_booking_id UUID,
  p_new_status TEXT,
  p_notes TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_old_status TEXT;
BEGIN
  -- Get current status
  SELECT status INTO v_old_status 
  FROM public.bookings 
  WHERE id = p_booking_id;
  
  -- Update booking status
  UPDATE public.bookings 
  SET status = p_new_status, updated_at = now()
  WHERE id = p_booking_id;
  
  -- Insert status history
  INSERT INTO public.booking_status_history (
    booking_id, old_status, new_status, changed_by, notes
  ) VALUES (
    p_booking_id, v_old_status, p_new_status, auth.uid(), p_notes
  );
  
  -- Log admin action
  PERFORM public.log_admin_action(
    'booking_status_update',
    'booking',
    p_booking_id::TEXT,
    jsonb_build_object('status', v_old_status),
    jsonb_build_object('status', p_new_status),
    p_notes
  );
END;
$$;