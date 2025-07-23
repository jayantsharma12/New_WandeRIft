import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react" // Import social icons

export default function Footer() {
  return (
    <footer className="bg-brand-darkGrey text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/wander-rift-logo.png" alt="WanderRift Logo" width={120} height={48} className="h-12 w-auto" />
              <span className="font-bold text-xl text-white">WanderRift</span>
            </div>
            <p className="mb-4 text-brand-lightGrey">Making spontaneous adventures accessible to everyone.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Destinations</h3>
            <ul className="space-y-2 text-brand-lightGrey">
              <li>
                <Link href="/destinations" className="hover:text-white">
                  West Coast
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="hover:text-white">
                  East Coast
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="hover:text-white">
                  National Parks
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="hover:text-white">
                  Desert Routes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2 text-brand-lightGrey">
              <li>
                <Link href="#" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Press
                </Link>
              </li>
              <li>
                <Link href="/auth" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Follow Us</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-white hover:text-brand-blue">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-white hover:text-brand-red">
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-white hover:text-brand-blue">
                <Twitter className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-lightGrey/30 mt-8 pt-8 text-center text-brand-lightGrey">
          <p>&copy; 2022 WanderRift. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
