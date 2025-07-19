-- Insert data into the 'trips' table
INSERT INTO trips (destination, days, budget, cost, rating, interests, itinerary) VALUES
('Manali', 5, 'Moderate', 12000, 4.5, ARRAY['Adventure', 'Nature', 'Culture'], ARRAY[
    'Day 1: Arrival in Manali, check-in to hotel, local sightseeing including Hadimba Temple and Mall Road',
    'Day 2: Visit Solang Valley for adventure activities like paragliding and zorbing',
    'Day 3: Excursion to Rohtang Pass (subject to weather conditions) and snow activities',
    'Day 4: Visit Manikaran Sahib and hot springs, return to Manali',
    'Day 5: Departure after breakfast'
]),
('Rishikesh', 4, 'Budget', 8000, 4.2, ARRAY['Adventure', 'Spirituality', 'Nature'], ARRAY[
    'Day 1: Arrival in Rishikesh, check-in to hostel, evening Ganga Aarti at Triveni Ghat',
    'Day 2: White water rafting adventure, visit to Beatles Ashram',
    'Day 3: Bungee jumping at Jumpin Heights, trek to Neer Garh Waterfall',
    'Day 4: Morning yoga session, departure'
]),
('Shimla', 6, 'Luxury', 25000, 4.8, ARRAY['Nature', 'Culture', 'History'], ARRAY[
    'Day 1: Arrival in Shimla, heritage walk in Mall Road and Ridge',
    'Day 2: Visit to Kufri, adventure activities and scenic views',
    'Day 3: Excursion to Chail, visit Chail Palace and world''s highest cricket ground',
    'Day 4: Day trip to Mashobra and Naldehra, golf course visit',
    'Day 5: Shopping at Mall Road, visit Christ Church and Jakhu Temple',
    'Day 6: Departure via toy train experience'
]),
('Kasol', 7, 'Budget', 15000, 4.6, ARRAY['Nature', 'Trekking', 'Culture'], ARRAY[
    'Day 1: Arrival in Kasol, check-in to riverside camps',
    'Day 2: Trek to Chalal village, explore local Israeli cafes',
    'Day 3: Day trip to Tosh village, mountain views and local culture',
    'Day 4: Trek to Malana village, learn about unique local customs',
    'Day 5: Visit Manikaran Sahib, hot springs and gurudwara',
    'Day 6: Free day for relaxation and exploration',
    'Day 7: Departure'
]),
('Spiti Valley', 8, 'Moderate', 22000, 4.4, ARRAY['Adventure', 'Culture', 'Photography'], ARRAY[
    'Day 1: Arrival in Shimla, overnight stay',
    'Day 2: Drive to Kalpa via Kinnaur, apple orchards visit',
    'Day 3: Travel to Tabo, visit ancient monastery',
    'Day 4: Explore Dhankar and Pin Valley',
    'Day 5: Visit Key Monastery and Kibber village',
    'Day 6: Chandratal Lake camping experience',
    'Day 7: Return journey to Manali',
    'Day 8: Departure from Manali'
]),
('Mcleodganj', 5, 'Budget', 10000, 4.3, ARRAY['Culture', 'Spirituality', 'Trekking'], ARRAY[
    'Day 1: Arrival in Mcleodganj, visit Dalai Lama Temple',
    'Day 2: Trek to Triund, camping under stars',
    'Day 3: Explore Bhagsu Waterfall and Bhagsunag Temple',
    'Day 4: Visit Norbulingka Institute, Tibetan culture experience',
    'Day 5: Shopping at local markets, departure'
]);

-- Insert data into the 'reviews' table
-- Manali reviews (trip_id = 1)
INSERT INTO reviews (trip_id, user_name, rating, comment) VALUES
(1, 'Rahul Sharma', 4.5, 'Amazing mountain experience! The AI-generated itinerary was perfect for our student group. Loved the adventure activities in Solang Valley.'),
(1, 'Priya Patel', 4.0, 'Great trip overall. The budget estimation was quite accurate. Would recommend for adventure lovers.');

-- Rishikesh reviews (trip_id = 2)
INSERT INTO reviews (trip_id, user_name, rating, comment) VALUES
(2, 'Amit Kumar', 4.0, 'Perfect adventure destination for students! The rafting experience was thrilling. Great value for money.'),
(2, 'Sneha Reddy', 4.5, 'Loved the spiritual atmosphere combined with adventure activities. The AI understood exactly what we wanted!');

-- Shimla reviews (trip_id = 3)
INSERT INTO reviews (trip_id, user_name, rating, comment) VALUES
(3, 'Deepak Gupta', 5.0, 'Absolutely magical hill station experience! The luxury accommodations and personalized service made it special.'),
(3, 'Kavya Nair', 4.5, 'Shimla''s colonial charm is unmatched. The AI planned the perfect mix of sightseeing and relaxation.');

-- Kasol reviews (trip_id = 4)
INSERT INTO reviews (trip_id, user_name, rating, comment) VALUES
(4, 'Rohit Mehta', 4.5, 'Perfect backpacking destination! The mountain treks and local culture experience was incredible for our college group.'),
(4, 'Pooja Agarwal', 4.8, 'Kasol''s natural beauty and peaceful atmosphere was exactly what we needed. Great budget-friendly option for students.');

-- Spiti Valley reviews (trip_id = 5)
INSERT INTO reviews (trip_id, user_name, rating, comment) VALUES
(5, 'Sanjay Verma', 4.2, 'Incredible high-altitude desert experience! The monasteries and landscapes were breathtaking. Perfect for photography enthusiasts.'),
(5, 'Meera Kapoor', 4.6, 'Spiti''s raw beauty and Buddhist culture provided a unique learning experience. The AI planned the logistics perfectly.');

-- Mcleodganj reviews (trip_id = 6)
INSERT INTO reviews (trip_id, user_name, rating, comment) VALUES
(6, 'Arjun Singh', 4.0, 'Great spiritual and cultural experience! The Triund trek was challenging but rewarding. Perfect for student groups.'),
(6, 'Riya Sharma', 4.5, 'Mcleodganj''s Tibetan culture and peaceful atmosphere was exactly what our college group needed for a refreshing break.');
