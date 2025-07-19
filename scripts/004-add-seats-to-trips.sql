-- Add total_seats and booked_seats columns to the trips table
ALTER TABLE trips
ADD COLUMN total_seats INTEGER DEFAULT 10, -- Default to 10 seats
ADD COLUMN booked_seats INTEGER DEFAULT 0; -- Default to 0 booked seats

-- Update existing trips with example seat data
UPDATE trips SET total_seats = 15, booked_seats = 5 WHERE id = 1; -- Manali
UPDATE trips SET total_seats = 12, booked_seats = 3 WHERE id = 2; -- Rishikesh
UPDATE trips SET total_seats = 8, booked_seats = 2 WHERE id = 3; -- Shimla
UPDATE trips SET total_seats = 20, booked_seats = 10 WHERE id = 4; -- Kasol
UPDATE trips SET total_seats = 10, booked_seats = 7 WHERE id = 5; -- Spiti Valley
UPDATE trips SET total_seats = 18, booked_seats = 6 WHERE id = 6; -- Mcleodganj
