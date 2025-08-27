-- Fix security warnings by setting search_path for functions
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
SET search_path = public
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

-- Fix security warnings by setting search_path for functions  
CREATE OR REPLACE FUNCTION public.update_booking_status(
  p_booking_id UUID,
  p_new_status TEXT,
  p_notes TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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