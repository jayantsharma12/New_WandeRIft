-- Add start_date and end_date columns to the trips table
ALTER TABLE trips
ADD COLUMN start_date DATE,
ADD COLUMN end_date DATE;

-- Update existing trips with example dates
-- Manali (id = 1)
UPDATE trips SET start_date = '2025-08-10', end_date = '2025-08-14' WHERE id = 1;
-- Rishikesh (id = 2)
UPDATE trips SET start_date = '2025-09-05', end_date = '2025-09-08' WHERE id = 2;
-- Shimla (id = 3)
UPDATE trips SET start_date = '2025-10-01', end_date = '2025-10-06' WHERE id = 3;
-- Kasol (id = 4)
UPDATE trips SET start_date = '2025-11-15', end_date = '2025-11-21' WHERE id = 4;
-- Spiti Valley (id = 5)
UPDATE trips SET start_date = '2026-06-20', end_date = '2026-06-27' WHERE id = 5;
-- Mcleodganj (id = 6)
UPDATE trips SET start_date = '2025-07-28', end_date = '2025-08-01' WHERE id = 6;
-- Leh-Ladakh (if it exists from previous insert, otherwise it will be null)
UPDATE trips SET start_date = '2026-07-10', end_date = '2026-07-16' WHERE destination = 'Leh-Ladakh';
