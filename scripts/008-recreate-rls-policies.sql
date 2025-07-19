-- Drop the specific policy named "Allow anon insert" if it exists
DROP POLICY IF EXISTS "Allow anon insert" ON bookings;

-- Create the policy to allow INSERT operations for the 'anon' role on the 'bookings' table
CREATE POLICY "Allow anon insert" ON bookings
FOR INSERT TO anon WITH CHECK (true);

-- Ensure read access for 'anon' on 'payment_methods'
-- Drop the specific policy named "Allow anon select" if it exists
DROP POLICY IF EXISTS "Allow anon select" ON payment_methods;

-- Create the policy to allow SELECT operations for the 'anon' role on the 'payment_methods' table
CREATE POLICY "Allow anon select" ON payment_methods
FOR SELECT TO anon USING (true);
