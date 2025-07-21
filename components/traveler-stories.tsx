import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

const travelerStories = [
  {
    name: "Sarah M.",
    title: "Adventure Seeker",
    avatar:
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    quote:
      "WanderRift turned my spontaneous weekend idea into the most incredible Pacific Coast adventure. Everything was perfectly planned!",
    bgColor: "bg-brand-red",
  },
  {
    name: "Mike T.",
    title: "Road Trip Enthusiast",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    quote:
      "The community aspect is amazing. I've made lifelong friends through WanderRift trips. The experiences are truly unforgettable.",
    bgColor: "bg-brand-green",
  },
  {
    name: "Emma L.",
    title: "Solo Traveler",
    avatar:
      "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    quote:
      "As a solo female traveler, I felt completely safe and supported. The curated destinations exceeded all my expectations!",
    bgColor: "bg-brand-blue",
  },
]

export default function TravelerStories() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-black mb-4">TRAVELER STORIES</h2>
          <p className="text-xl text-brand-lightGrey">Discover breathtaking routes and unforgettable experiences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {travelerStories.map((story, index) => (
            <Card key={index} className={`${story.bgColor} text-white rounded-xl shadow-lg border-0`}>
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={story.avatar || "/placeholder.svg"} alt={story.name} />
                    <AvatarFallback>
                      {story.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold">{story.name}</h3>
                    <p className="text-sm opacity-90">{story.title}</p>
                  </div>
                </div>
                <p className="text-lg leading-relaxed">{`"${story.quote}"`}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
