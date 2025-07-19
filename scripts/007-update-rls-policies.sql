-- Drop the existing policy on 'bookings' table if it exists, to avoid conflicts
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON bookings;

-- Create a new policy to allow INSERT operations for the 'anon' role on the 'bookings' table
-- This is necessary because your application is currently making unauthenticated requests
-- using the NEXT_PUBLIC_SUPABASE_ANON_KEY.
CREATE POLICY "Allow anon insert" ON bookings
FOR INSERT TO anon WITH CHECK (true);

-- Ensure read access for 'anon' on 'payment_methods' (already likely covered, but explicit is better)
DROP POLICY IF EXISTS "Enable read access for all users" ON payment_methods;
CREATE POLICY "Allow anon select" ON payment_methods
FOR SELECT TO anon USING (true);
