"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <img
                src="/wander-rift-logo.png"
                alt="WanderRift"
                width={160}
                height={78}
                className="h-12 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            <Link
              href="/"
              className="text-brand-darkGrey hover:text-brand-red transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/planner"
              className="text-brand-darkGrey hover:text-brand-red transition-colors font-medium"
            >
              Plan Trip
            </Link>
            <Link
              href="/destinations"
              className="text-brand-darkGrey hover:text-brand-red transition-colors font-medium"
            >
              Destinations
            </Link>
            <Link
              href="/reviews"
              className="text-brand-darkGrey hover:text-brand-red transition-colors font-medium"
            >
              Previous Travellers
            </Link>
            <Link
              href="/auth"
              className="text-brand-darkGrey hover:text-brand-red transition-colors font-medium"
            >
              Contact
            </Link>

            {/* Auth Buttons */}
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="default" size="sm">Sign Up</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

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
              <Link
                href="/"
                className="block px-3 py-2 text-brand-darkGrey hover:text-brand-red"
              >
                Home
              </Link>
              <Link
                href="/planner"
                className="block px-3 py-2 text-brand-darkGrey hover:text-brand-red"
              >
                Plan Trip
              </Link>
              <Link
                href="/destinations"
                className="block px-3 py-2 text-brand-darkGrey hover:text-brand-red"
              >
                Destinations
              </Link>
              <Link
                href="/reviews"
                className="block px-3 py-2 text-brand-darkGrey hover:text-brand-red"
              >
                Previous Travellers
              </Link>
              <Link
                href="/auth"
                className="block px-3 py-2 text-brand-darkGrey hover:text-brand-red"
              >
                Contact
              </Link>

              {/* Mobile Auth Buttons */}
              <div className="mt-2 px-3">
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button className="w-full mb-2">Sign In</Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button className="w-full" variant="outline">Sign Up</Button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
