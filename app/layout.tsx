import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

// import { ThemeProvider } from "@/components/theme-provider";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision"
import { Analytics } from "@vercel/analytics/next"
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WanderRift - Trip Now, Regret Never",
  description: "Spontaneous adventures await. Let us craft your perfect road trip experience with AI-powered planning.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ClerkProvider>
        <html lang="en" suppressHydrationWarning>
          <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <BackgroundBeamsWithCollision className="absolute inset-0 -z-10" />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
          </body>
        </html>
      </ClerkProvider>
    </>
  );
}
