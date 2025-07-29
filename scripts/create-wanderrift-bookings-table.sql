-- Create WanderRift bookings table
CREATE TABLE IF NOT EXISTS wanderrift_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id INTEGER NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_phone VARCHAR(20) NOT NULL,
  num_travelers INTEGER NOT NULL DEFAULT 1,
  payment_method_id INTEGER NOT NULL,
  payment_method_name VARCHAR(255),
  screenshot_url TEXT,
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'confirmed', 'failed')),
  trip_destination VARCHAR(255),
  payment_confirmed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wanderrift_bookings_trip_id ON wanderrift_bookings(trip_id);
CREATE INDEX IF NOT EXISTS idx_wanderrift_bookings_payment_status ON wanderrift_bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_wanderrift_bookings_created_at ON wanderrift_bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wanderrift_bookings_user_phone ON wanderrift_bookings(user_phone);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_wanderrift_bookings_updated_at 
    BEFORE UPDATE ON wanderrift_bookings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (optional)
ALTER TABLE wanderrift_bookings ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users (adjust as needed)
CREATE POLICY "Enable all operations for authenticated users" ON wanderrift_bookings
    FOR ALL USING (true);
