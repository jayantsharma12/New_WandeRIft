import CallToActionSection from "@/components/call-to-action-section"
import Hero from "@/components/hero"
import SearchSection from "@/components/search-section"
import TopDestinations from "@/components/top-destinations"
import TravelerStories from "@/components/traveler-stories"
import WhyChooseWanderRift from "@/components/why-choose-us"

export default function Home() {
  return (
    <div>
      <Hero />
      <SearchSection />
      <TopDestinations />
      <TravelerStories />
      <WhyChooseWanderRift />
      <CallToActionSection />
    </div>
  )
}
