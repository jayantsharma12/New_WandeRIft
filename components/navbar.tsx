"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <img src="/eduwander-logo.png" alt="EduWander" width={160} height={64} className="h-16 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            <Link href="/" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              Home
            </Link>
            <Link href="/planner" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              Plan Trip
            </Link>
            <Link href="/destinations" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              Destinations
            </Link>
            <Link href="/reviews" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              Previous Travellers
            </Link>
            <Link href="/auth" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              Contact
            </Link>
            <ModeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ModeToggle />
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-orange-600">
                Home
              </Link>
              <Link href="/planner" className="block px-3 py-2 text-gray-700 hover:text-orange-600">
                Plan Trip
              </Link>
              <Link href="/destinations" className="block px-3 py-2 text-gray-700 hover:text-orange-600">
                Destinations
              </Link>
              <Link href="/reviews" className="block px-3 py-2 text-gray-700 hover:text-orange-600">
                Previous Travellers
              </Link>
              <Link href="/auth" className="block px-3 py-2 text-gray-700 hover:text-orange-600">
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
