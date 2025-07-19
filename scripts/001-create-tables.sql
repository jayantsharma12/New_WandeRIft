-- Create the 'trips' table
CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
    destination TEXT NOT NULL,
    days INTEGER NOT NULL,
    budget TEXT NOT NULL,
    cost INTEGER NOT NULL,
    rating NUMERIC(2, 1) NOT NULL,
    interests TEXT[] NOT NULL,
    itinerary TEXT[] NOT NULL
);

-- Create the 'reviews' table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(id),
    user_name TEXT NOT NULL,
    rating NUMERIC(2, 1) NOT NULL,
    comment TEXT NOT NULL
);

-- Enable Row Level Security (RLS) for public access (optional, but good practice)
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON trips
FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON reviews
FOR SELECT USING (true);
