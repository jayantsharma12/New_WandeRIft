import { Card, CardContent } from "@/components/ui/card"
import { Zap, MapPin, DollarSign, Users } from "lucide-react" // Updated icons

const features = [
  {
    icon: Zap,
    title: "Spontaneous Planning",
    description: "Last-minute trips made easy with instant bookings and flexible itineraries",
    iconColor: "text-brand-red",
    bgColor: "bg-brand-red/10",
  },
  {
    icon: MapPin,
    title: "Curated Places",
    description: "Hand-picked destinations and hidden gems discovered by fellow adventurers",
    iconColor: "text-brand-blue",
    bgColor: "bg-brand-blue/10",
  },
  {
    icon: DollarSign,
    title: "Affordable Trips",
    description: "Budget-friendly adventures without compromising on experience or quality",
    iconColor: "text-brand-green",
    bgColor: "bg-brand-green/10",
  },
  {
    icon: Users,
    title: "Traveler Community",
    description: "Connect with like-minded adventurers and share unforgettable experiences",
    iconColor: "text-brand-red",
    bgColor: "bg-brand-red/10",
  },
]

export default function WhyChooseWanderRift() {
  return (
    <section className="py-20 bg-brand-yellow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-black mb-6">WHY CHOOSE WANDERRRIFT</h2>
          <p className="text-xl text-brand-lightGrey max-w-3xl mx-auto">
            We make spontaneous travel simple, affordable, and unforgettable
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg rounded-xl">
              <CardContent className="p-8 text-center">
                <div
                  className={`mx-auto w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mb-6`}
                >
                  <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-brand-black mb-4">{feature.title}</h3>
                <p className="text-brand-lightGrey leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
