import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, DollarSign, MapPin, Users, Clock, Shield } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Planning",
    description: "Our advanced AI creates personalized itineraries based on your preferences and interests.",
  },
  {
    icon: DollarSign,
    title: "Smart Budget Estimation",
    description: "Get accurate cost estimates for your trip including accommodation, food, and activities.",
  },
  {
    icon: MapPin,
    title: "Local Insights",
    description: "Discover hidden gems and local favorites that only insiders know about.",
  },
  {
    icon: Users,
    title: "Community Reviews",
    description: "Read reviews from fellow travelers and share your own experiences.",
  },
  {
    icon: Clock,
    title: "Real-time Updates",
    description: "Get live updates on weather, events, and local conditions for your destination.",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "Your data is protected with enterprise-grade security and privacy measures.",
  },
]

export default function Features() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose TravelAI?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience the future of travel planning with our cutting-edge AI technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
