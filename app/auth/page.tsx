"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-xl w-full">
        {/* New Contact Details Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-center">Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-brand-red" />
              <p className="text-muted-foreground">
                Email us at:{" "}
                <Link href="mailto:info@eduwanders.com" className="text-brand-red hover:underline">
                  info@eduwanders.com
                </Link>
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-brand-red" />
              <p className="text-muted-foreground">Phone: +91 78959 04346</p>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-brand-red mt-1" />
              <p className="text-muted-foreground">
                Address: Himachal Pradesh, India
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-brand-red" />
              <p className="text-muted-foreground">
                Website:{" "}
                <Link
                  href="https://v0-jayant-sharma-portfolio.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-red hover:underline"
                >
                  Owner's Portfolio
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>
            By contacting us, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
