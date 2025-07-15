import Hero from "@/components/hero"
import SearchSection from "@/components/search-section"
import FeaturedTrips from "@/components/featured-trips"
import WhyChooseUs from "@/components/why-choose-us"

export default function Home() {
  return (
    <div>
      <Hero />
      <SearchSection />
      <FeaturedTrips />
      <WhyChooseUs />
    </div>
  )
}
