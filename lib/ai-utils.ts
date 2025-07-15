export interface ItineraryDay {
  activities: {
    time: string
    activity: string
    cost?: number
  }[]
}

export function generateItinerary(
  destination: string,
  days: number,
  budget: string,
  interests: string[],
): ItineraryDay[] {
  // This is a mock AI function - in a real app, you'd call OpenAI API
  const itinerary: ItineraryDay[] = []

  const budgetMultiplier = budget === "Budget" ? 0.7 : budget === "Luxury" ? 1.5 : 1.0
  const baseActivities = getBaseActivities(destination, interests)

  for (let day = 1; day <= days; day++) {
    const dayActivities = baseActivities[day - 1] || getDefaultDayActivities(day, destination)

    itinerary.push({
      activities: dayActivities.map((activity) => ({
        ...activity,
        cost: activity.cost ? Math.round(activity.cost * budgetMultiplier) : undefined,
      })),
    })
  }

  return itinerary
}

export function calculateBudget(days: number, budget: string, interestCount: number, travelers = 1): number {
  const baseRate = budget === "Budget" ? 1500 : budget === "Luxury" ? 4000 : 2500
  const interestFactor = interestCount * 200
  const multiplier = budget === "Budget" ? 0.8 : budget === "Luxury" ? 1.8 : 1.2

  const totalCost = days * baseRate + interestFactor * multiplier
  return Math.round(totalCost * travelers)
}

function getBaseActivities(destination: string, interests: string[]) {
  const activityMap: Record<string, any[][]> = {
    Manali: [
      [
        { time: "10:00 AM", activity: "Arrival and hotel check-in" },
        { time: "2:00 PM", activity: "Visit Hadimba Temple", cost: 50 },
        { time: "4:00 PM", activity: "Explore Mall Road and local markets", cost: 500 },
        { time: "7:00 PM", activity: "Dinner at local restaurant", cost: 800 },
      ],
      [
        { time: "9:00 AM", activity: "Breakfast at hotel", cost: 300 },
        { time: "10:30 AM", activity: "Travel to Solang Valley", cost: 600 },
        { time: "12:00 PM", activity: "Paragliding and adventure sports", cost: 2500 },
        { time: "3:00 PM", activity: "Lunch at valley restaurant", cost: 600 },
        { time: "6:00 PM", activity: "Return to hotel", cost: 600 },
      ],
    ],
    Goa: [
      [
        { time: "11:00 AM", activity: "Arrival and beach resort check-in" },
        { time: "3:00 PM", activity: "Lunch at beachside shack", cost: 800 },
        { time: "5:00 PM", activity: "Relax at Baga Beach", cost: 200 },
        { time: "8:00 PM", activity: "Seafood dinner and beach walk", cost: 1200 },
      ],
      [
        { time: "9:00 AM", activity: "Breakfast at resort", cost: 400 },
        { time: "10:30 AM", activity: "North Goa tour - Calangute Beach", cost: 300 },
        { time: "1:00 PM", activity: "Lunch at Anjuna Beach", cost: 700 },
        { time: "3:00 PM", activity: "Shopping at local markets", cost: 1500 },
        { time: "7:00 PM", activity: "Sunset at Chapora Fort", cost: 100 },
      ],
    ],
  }

  return activityMap[destination] || getDefaultActivities()
}

function getDefaultDayActivities(day: number, destination: string) {
  return [
    { time: "9:00 AM", activity: `Day ${day} - Morning exploration of ${destination}`, cost: 500 },
    { time: "12:00 PM", activity: "Lunch at local restaurant", cost: 600 },
    { time: "2:00 PM", activity: "Afternoon sightseeing and activities", cost: 800 },
    { time: "6:00 PM", activity: "Evening leisure time", cost: 300 },
    { time: "8:00 PM", activity: "Dinner and local experience", cost: 1000 },
  ]
}

function getDefaultActivities() {
  return [
    [
      { time: "10:00 AM", activity: "Arrival and check-in" },
      { time: "2:00 PM", activity: "Local sightseeing", cost: 500 },
      { time: "6:00 PM", activity: "Evening exploration", cost: 400 },
      { time: "8:00 PM", activity: "Welcome dinner", cost: 800 },
    ],
  ]
}

// Mock OpenAI API call function
export async function generateAIItinerary(prompt: string) {
  // In a real application, you would use the AI SDK here:
  /*
  import { generateText } from 'ai'
  import { openai } from '@ai-sdk/openai'
  
  const { text } = await generateText({
    model: openai('gpt-4o'),
    prompt: prompt,
  })
  
  return text
  */

  // For now, return a mock response
  return "AI-generated itinerary based on your preferences..."
}
