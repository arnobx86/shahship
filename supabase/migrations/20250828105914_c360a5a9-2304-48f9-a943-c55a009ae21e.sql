-- Create dynamic pricing table for admin control
CREATE TABLE public.dynamic_pricing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shipping_method TEXT NOT NULL,
  weight_from DECIMAL NOT NULL,
  weight_to DECIMAL,
  price_per_kg DECIMAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BDT',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.dynamic_pricing ENABLE ROW LEVEL SECURITY;

-- Policies for dynamic pricing
CREATE POLICY "Everyone can view active pricing" 
ON public.dynamic_pricing 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage pricing" 
ON public.dynamic_pricing 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role IN ('admin', 'super_admin')
));

-- Insert default pricing data
INSERT INTO public.dynamic_pricing (shipping_method, weight_from, weight_to, price_per_kg) VALUES
('Air', 1.0, 1.99, 760),
('Air', 2.0, 2.99, 750),
('Air', 3.0, 3.99, 740),
('Air', 4.0, 4.99, 730),
('Air', 5.0, NULL, 720),
('Sea', 1.0, NULL, 200),
('Hand Carry', 1.0, NULL, 1000);

-- Update bookings table to use the new status system
ALTER TABLE public.bookings 
DROP CONSTRAINT IF EXISTS bookings_status_check;

ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_status_check 
CHECK (status IN (
  'placed',
  'received_china_warehouse',
  'processing_delivery', 
  'on_way_delivery',
  'on_way_bd_airport',
  'received_bd_seaport',
  'completed'
));

-- Create trigger for dynamic pricing timestamps
CREATE TRIGGER update_dynamic_pricing_updated_at
BEFORE UPDATE ON public.dynamic_pricing
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to get pricing for calculator
CREATE OR REPLACE FUNCTION public.get_shipping_price(
  p_shipping_method TEXT,
  p_weight DECIMAL
)
RETURNS DECIMAL
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_price DECIMAL;
BEGIN
  SELECT price_per_kg INTO v_price
  FROM public.dynamic_pricing
  WHERE shipping_method = p_shipping_method
    AND is_active = true
    AND weight_from <= p_weight
    AND (weight_to IS NULL OR weight_to >= p_weight)
  ORDER BY weight_from DESC
  LIMIT 1;
  
  RETURN COALESCE(v_price, 0);
END;
$$;