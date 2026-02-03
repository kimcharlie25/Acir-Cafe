/*
  Daily Order Numbers
  
  Adds a 3-digit order number (001-999) that resets every day.
  This makes it easy for counter staff to track and recall orders.
*/

-- 1) Add order_number column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number integer;

-- 2) Create index for efficient daily order lookup
CREATE INDEX IF NOT EXISTS idx_orders_created_at_order_number 
ON orders(DATE(created_at AT TIME ZONE 'Asia/Manila'), order_number DESC);

-- 3) Function to get the next daily order number
CREATE OR REPLACE FUNCTION get_next_daily_order_number()
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  next_number integer;
  today_date date;
BEGIN
  -- Get today's date in Manila timezone
  today_date := (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila')::date;
  
  -- Get the max order number for today, or 0 if none exist
  SELECT COALESCE(MAX(order_number), 0) + 1 INTO next_number
  FROM orders
  WHERE DATE(created_at AT TIME ZONE 'Asia/Manila') = today_date;
  
  RETURN next_number;
END;
$$;

-- 4) Trigger function to auto-set order_number on INSERT
CREATE OR REPLACE FUNCTION set_order_number_on_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only set if not already provided
  IF NEW.order_number IS NULL THEN
    NEW.order_number := get_next_daily_order_number();
  END IF;
  RETURN NEW;
END;
$$;

-- 5) Create trigger (drop first if exists to avoid duplicates)
DROP TRIGGER IF EXISTS trg_set_order_number ON orders;
CREATE TRIGGER trg_set_order_number
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION set_order_number_on_insert();

-- 6) Backfill existing orders with sequential numbers per day
-- This assigns order numbers to any existing orders that don't have one
DO $$
DECLARE
  order_record RECORD;
  current_date_val date;
  current_number integer;
BEGIN
  current_date_val := NULL;
  current_number := 0;
  
  FOR order_record IN 
    SELECT id, DATE(created_at AT TIME ZONE 'Asia/Manila') as order_date
    FROM orders
    WHERE order_number IS NULL
    ORDER BY created_at ASC
  LOOP
    IF current_date_val IS DISTINCT FROM order_record.order_date THEN
      current_date_val := order_record.order_date;
      current_number := 1;
    ELSE
      current_number := current_number + 1;
    END IF;
    
    UPDATE orders SET order_number = current_number WHERE id = order_record.id;
  END LOOP;
END $$;

-- 7) Add comment for documentation
COMMENT ON COLUMN orders.order_number IS 'Daily sequential order number (001-999), resets each day at midnight Manila time';
