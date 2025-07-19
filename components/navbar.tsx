"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X } from "lucide-react"
<<<<<<< HEAD
=======
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs"
>>>>>>> 14e9023 (completed with Authication)

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<<<<<<< HEAD
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <img src="/eduwander-logo.png" alt="EduWander" width={160} height={64} className="h-16 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
=======
        <div className="flex justify-between items-center h-20">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <img
                src="/eduwander-logo.png"
                alt="EduWander"
                width={160}
                height={64}
                className="h-16 w-auto"
              />
            </Link>
          </div>

          {/* Center: Desktop Nav */}
>>>>>>> 14e9023 (completed with Authication)
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

<<<<<<< HEAD
          {/* Mobile menu button */}
=======
          {/* Right: Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline">Sign in</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button>Sign up</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
>>>>>>> 14e9023 (completed with Authication)
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
<<<<<<< HEAD
=======

            <div className="px-4 pb-4 flex flex-col gap-2">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="outline" className="w-full">Sign in</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="w-full">Sign up</Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
>>>>>>> 14e9023 (completed with Authication)
          </div>
        )}
      </div>
    </nav>
  )
}
