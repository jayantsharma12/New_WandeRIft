export interface ItineraryDay {
  activities: {
    time: string
    activity: string
    cost?: number
  }[]
}
