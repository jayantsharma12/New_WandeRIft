import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CallToActionSection() {
  return (
    <section className="py-20 bg-brand-darkGrey text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">READY FOR YOUR NEXT ADVENTURE?</h2>
        <p className="text-xl text-brand-lightGrey mb-12">
          Join thousands of adventurers who've discovered the joy of spontaneous travel with WanderRift
        </p>
        <Button
          asChild
          size="lg"
          className="bg-brand-red hover:bg-brand-red/90 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Link href="/planner">Start Your Journey</Link>
        </Button>
      </div>
    </section>
  )
}
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";