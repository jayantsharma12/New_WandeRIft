export interface Trip {
  id: number
  destination: string
  days: number
  budget: "Budget" | "Moderate" | "Luxury"
  cost: number
  rating: number
  interests: string[]
  itinerary: string[]
  reviews: Review[]
}

export interface Review {
  user: string
  rating: number
  comment: string
}

export const trips: Trip[] = [
  {
    id: 1,
    destination: "Manali",
    days: 5,
    budget: "Moderate",
    cost: 12000,
    rating: 4.5,
    interests: ["Adventure", "Nature", "Culture"],
    itinerary: [
      "Day 1: Arrival in Manali, check-in to hotel, local sightseeing including Hadimba Temple and Mall Road",
      "Day 2: Visit Solang Valley for adventure activities like paragliding and zorbing",
      "Day 3: Excursion to Rohtang Pass (subject to weather conditions) and snow activities",
      "Day 4: Visit Manikaran Sahib and hot springs, return to Manali",
      "Day 5: Departure after breakfast",
    ],
    reviews: [
      {
        user: "Rahul Sharma",
        rating: 4.5,
        comment:
          "Amazing mountain experience! The AI-generated itinerary was perfect for our student group. Loved the adventure activities in Solang Valley.",
      },
      {
        user: "Priya Patel",
        rating: 4.0,
        comment: "Great trip overall. The budget estimation was quite accurate. Would recommend for adventure lovers.",
      },
    ],
  },
  {
    id: 2,
    destination: "Rishikesh",
    days: 4,
    budget: "Budget",
    cost: 8000,
    rating: 4.2,
    interests: ["Adventure", "Spirituality", "Nature"],
    itinerary: [
      "Day 1: Arrival in Rishikesh, check-in to hostel, evening Ganga Aarti at Triveni Ghat",
      "Day 2: White water rafting adventure, visit to Beatles Ashram",
      "Day 3: Bungee jumping at Jumpin Heights, trek to Neer Garh Waterfall",
      "Day 4: Morning yoga session, departure",
    ],
    reviews: [
      {
        user: "Amit Kumar",
        rating: 4.0,
        comment:
          "Perfect adventure destination for students! The rafting experience was thrilling. Great value for money.",
      },
      {
        user: "Sneha Reddy",
        rating: 4.5,
        comment:
          "Loved the spiritual atmosphere combined with adventure activities. The AI understood exactly what we wanted!",
      },
    ],
  },
  {
    id: 3,
    destination: "Shimla",
    days: 6,
    budget: "Luxury",
    cost: 25000,
    rating: 4.8,
    interests: ["Nature", "Culture", "History"],
    itinerary: [
      "Day 1: Arrival in Shimla, heritage walk in Mall Road and Ridge",
      "Day 2: Visit to Kufri, adventure activities and scenic views",
      "Day 3: Excursion to Chail, visit Chail Palace and world's highest cricket ground",
      "Day 4: Day trip to Mashobra and Naldehra, golf course visit",
      "Day 5: Shopping at Mall Road, visit Christ Church and Jakhu Temple",
      "Day 6: Departure via toy train experience",
    ],
    reviews: [
      {
        user: "Deepak Gupta",
        rating: 5.0,
        comment:
          "Absolutely magical hill station experience! The luxury accommodations and personalized service made it special.",
      },
      {
        user: "Kavya Nair",
        rating: 4.5,
        comment: "Shimla's colonial charm is unmatched. The AI planned the perfect mix of sightseeing and relaxation.",
      },
    ],
  },
  {
    id: 4,
    destination: "Kasol",
    days: 7,
    budget: "Budget",
    cost: 15000,
    rating: 4.6,
    interests: ["Nature", "Trekking", "Culture"],
    itinerary: [
      "Day 1: Arrival in Kasol, check-in to riverside camps",
      "Day 2: Trek to Chalal village, explore local Israeli cafes",
      "Day 3: Day trip to Tosh village, mountain views and local culture",
      "Day 4: Trek to Malana village, learn about unique local customs",
      "Day 5: Visit Manikaran Sahib, hot springs and gurudwara",
      "Day 6: Free day for relaxation and exploration",
      "Day 7: Departure",
    ],
    reviews: [
      {
        user: "Rohit Mehta",
        rating: 4.5,
        comment:
          "Perfect backpacking destination! The mountain treks and local culture experience was incredible for our college group.",
      },
      {
        user: "Pooja Agarwal",
        rating: 4.8,
        comment:
          "Kasol's natural beauty and peaceful atmosphere was exactly what we needed. Great budget-friendly option for students.",
      },
    ],
  },
  {
    id: 5,
    destination: "Spiti Valley",
    days: 8,
    budget: "Moderate",
    cost: 22000,
    rating: 4.4,
    interests: ["Adventure", "Culture", "Photography"],
    itinerary: [
      "Day 1: Arrival in Shimla, overnight stay",
      "Day 2: Drive to Kalpa via Kinnaur, apple orchards visit",
      "Day 3: Travel to Tabo, visit ancient monastery",
      "Day 4: Explore Dhankar and Pin Valley",
      "Day 5: Visit Key Monastery and Kibber village",
      "Day 6: Chandratal Lake camping experience",
      "Day 7: Return journey to Manali",
      "Day 8: Departure from Manali",
    ],
    reviews: [
      {
        user: "Sanjay Verma",
        rating: 4.2,
        comment:
          "Incredible high-altitude desert experience! The monasteries and landscapes were breathtaking. Perfect for photography enthusiasts.",
      },
      {
        user: "Meera Kapoor",
        rating: 4.6,
        comment:
          "Spiti's raw beauty and Buddhist culture provided a unique learning experience. The AI planned the logistics perfectly.",
      },
    ],
  },
  {
    id: 6,
    destination: "Mcleodganj",
    days: 5,
    budget: "Budget",
    cost: 10000,
    rating: 4.3,
    interests: ["Culture", "Spirituality", "Trekking"],
    itinerary: [
      "Day 1: Arrival in Mcleodganj, visit Dalai Lama Temple",
      "Day 2: Trek to Triund, camping under stars",
      "Day 3: Explore Bhagsu Waterfall and Bhagsunag Temple",
      "Day 4: Visit Norbulingka Institute, Tibetan culture experience",
      "Day 5: Shopping at local markets, departure",
    ],
    reviews: [
      {
        user: "Arjun Singh",
        rating: 4.0,
        comment:
          "Great spiritual and cultural experience! The Triund trek was challenging but rewarding. Perfect for student groups.",
      },
      {
        user: "Riya Sharma",
        rating: 4.5,
        comment:
          "Mcleodganj's Tibetan culture and peaceful atmosphere was exactly what our college group needed for a refreshing break.",
      },
    ],
  },
]
