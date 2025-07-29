-- Add missing columns to existing bookings table for Telegram integration
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'confirmed', 'failed')),
ADD COLUMN IF NOT EXISTS payment_confirmed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS trip_destination VARCHAR(255),
ADD COLUMN IF NOT EXISTS payment_method_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS screenshot_url TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_trip_id ON bookings(trip_id);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_date ON bookings(booking_date DESC);

-- Update existing records to set payment_status based on booking_status
UPDATE bookings 
SET payment_status = CASE 
    WHEN booking_status = 'confirmed' THEN 'confirmed'
    WHEN booking_status = 'cancelled' THEN 'failed'
    ELSE 'pending'
END
WHERE payment_status IS NULL;

-- Copy payment_screenshot_url to screenshot_url for consistency
UPDATE bookings 
SET screenshot_url = payment_screenshot_url 
WHERE screenshot_url IS NULL AND payment_screenshot_url IS NOT NULL;
