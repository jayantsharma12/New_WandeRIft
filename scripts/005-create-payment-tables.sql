-- Create the 'payment_methods' table for storing QR/UPI IDs
CREATE TABLE IF NOT EXISTS payment_methods (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL, -- e.g., 'UPI', 'QR_CODE', 'BANK_TRANSFER'
    name TEXT NOT NULL, -- e.g., 'Google Pay UPI', 'Paytm QR'
    value TEXT NOT NULL, -- The UPI ID or URL to the QR code image
    is_active BOOLEAN DEFAULT TRUE
);

-- Create the 'bookings' table to store user booking details
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(id),
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_phone TEXT,
    num_travelers INTEGER NOT NULL,
    payment_method_id INTEGER REFERENCES payment_methods(id), -- Link to the payment method used
    payment_screenshot_url TEXT, -- URL to the uploaded screenshot
    booking_status TEXT DEFAULT 'pending' NOT NULL, -- e.g., 'pending', 'confirmed', 'cancelled'
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS) for new tables
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies for payment_methods (read-only for public)
CREATE POLICY "Enable read access for all users" ON payment_methods
FOR SELECT USING (true);

-- Policies for bookings (insert for authenticated users, read for owner/admin)
CREATE POLICY "Enable insert for authenticated users" ON bookings
FOR INSERT WITH CHECK (true); -- For simplicity, allow all inserts for now. In a real app, you'd check auth.

-- Optional: Policy to allow users to view their own bookings
-- CREATE POLICY "Enable read access for own bookings" ON bookings
-- FOR SELECT USING (auth.uid() = user_id); -- Requires a user_id column and Supabase Auth setup
