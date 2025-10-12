-- Add pickup and delivery code columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS pickup_code VARCHAR(10),
ADD COLUMN IF NOT EXISTS delivery_code VARCHAR(10),
ADD COLUMN IF NOT EXISTS pickup_confirmed_at TIMESTAMP;

-- Create function to generate random 6-digit code
CREATE OR REPLACE FUNCTION generate_delivery_code() 
RETURNS VARCHAR(6) AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate codes when order is ready for pickup
CREATE OR REPLACE FUNCTION set_delivery_codes()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate pickup code when order becomes ready_for_pickup
  IF NEW.status = 'ready_for_pickup' AND (OLD.status IS NULL OR OLD.status != 'ready_for_pickup') THEN
    IF NEW.pickup_code IS NULL THEN
      NEW.pickup_code := generate_delivery_code();
    END IF;
  END IF;
  
  -- Generate delivery code when order is assigned to driver
  IF NEW.status = 'assigned' AND (OLD.status IS NULL OR OLD.status != 'assigned') THEN
    IF NEW.delivery_code IS NULL THEN
      NEW.delivery_code := generate_delivery_code();
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_set_delivery_codes ON orders;
CREATE TRIGGER trigger_set_delivery_codes
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_delivery_codes();

-- Update existing orders that are ready_for_pickup or assigned to have codes
UPDATE orders 
SET pickup_code = generate_delivery_code()
WHERE status IN ('ready_for_pickup', 'assigned', 'in_transit', 'delivered') 
AND pickup_code IS NULL;

UPDATE orders 
SET delivery_code = generate_delivery_code()
WHERE status IN ('assigned', 'in_transit', 'delivered') 
AND delivery_code IS NULL;
