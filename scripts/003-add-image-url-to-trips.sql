-- Add image_url column to the trips table
ALTER TABLE trips
ADD COLUMN image_url TEXT;

-- Update existing trips with placeholder image URLs
-- You can replace these with actual image URLs from Google Images or other sources later
UPDATE trips SET image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' WHERE id = 1; -- Manali
UPDATE trips SET image_url = 'https://images.unsplash.com/photo-1587502537000-9122121234?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' WHERE id = 2; -- Rishikesh
UPDATE trips SET image_url = 'https://images.unsplash.com/photo-1596496199197-9122121234?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' WHERE id = 3; -- Shimla
UPDATE trips SET image_url = 'https://images.unsplash.com/photo-1596496199197-9122121234?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' WHERE id = 4; -- Kasol
UPDATE trips SET image_url = 'https://images.unsplash.com/photo-1596496199197-9122121234?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' WHERE id = 5; -- Spiti Valley
UPDATE trips SET image_url = 'https://images.unsplash.com/photo-1596496199197-9122121234?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' WHERE id = 6; -- Mcleodganj
