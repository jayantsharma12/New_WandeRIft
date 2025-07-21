import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
  return (
    <section
      className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg')`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">TRIP NOW, REGRET NEVER</h1>
          <p className="text-xl md:text-2xl text-white mb-12 leading-relaxed">
            Spontaneous adventures await. Let us craft your perfect road trip experience.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-brand-red hover:bg-brand-red/90 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/planner">Plan Your Trip</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-brand-blue hover:bg-brand-blue/90 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/destinations">Explore Destinations</Link>
            </Button>
          </div>
        </div>
      </div>
      {/* Yellow bar at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-brand-yellow" />
    </section>
  )
}
