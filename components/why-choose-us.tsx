import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Users, Shield, Clock, Heart, Award } from "lucide-react"

const features = [
  {
    icon: MapPin,
    title: "50+ Destinations",
    description: "Carefully curated mountain destinations perfect for student adventures and learning experiences.",
  },
  {
    icon: Users,
    title: "Student-Focused",
    description:
      "All our trips are designed specifically for college students with affordable pricing and group activities.",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "Your safety is our priority with experienced guides and comprehensive safety measures.",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description: "Trip schedules designed around academic calendars and student availability.",
  },
  {
    icon: Heart,
    title: "Memorable Experiences",
    description: "Create lifelong memories with fellow students through adventure and cultural immersion.",
  },
  {
    icon: Award,
    title: "Expert Guides",
    description: "Local expert guides who know the best spots and can teach you about local culture and history.",
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Why Choose Us</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We specialize in creating unforgettable mountain adventures for students, combining affordability with
            exceptional experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
