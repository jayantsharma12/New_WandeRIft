import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
  return (
    <section
      className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.pexels.com/photos/673020/pexels-photo-673020.jpeg')`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Your Next Budget Adventure Awaits
          </h1>
          <p className="text-xl md:text-2xl text-white mb-12 leading-relaxed">
            Explore breathtaking mountain experiences tailored for college students.
            <br />
            Affordable trips that create unforgettable memories.
          </p>

          <Button
            asChild
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link href="/destinations">View Upcoming Trips</Link>
          </Button>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">50+</div>
            <div className="text-white text-lg font-medium">Destinations</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">5000+</div>
            <div className="text-white text-lg font-medium">Happy Students</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">30%</div>
            <div className="text-white text-lg font-medium">Student Discount</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">4.8/5</div>
            <div className="text-white text-lg font-medium">Rating</div>
          </div>
        </div>
      </div>
    </section>
  )
}
