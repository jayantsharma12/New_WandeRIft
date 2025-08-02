import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import AIChatAssistant from "@/components/AIChatAssistant";
import { ClerkProvider } from "@clerk/nextjs";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
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
    <ClerkProvider
      appearance={{
        elements: {
          // Hide Clerk branding
          footer: "hidden",
          footerAction: "hidden",
          footerActionLink: "hidden",
          footerPages: "hidden",
          // Optional: customize other elements to match your brand
          card: "shadow-lg border-0",
          headerTitle: "text-2xl font-bold text-brand-black",
          headerSubtitle: "text-muted-foreground",
          socialButtonsBlockButton: "border border-gray-300 hover:bg-gray-50",
          formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
          formFieldInput: "border border-gray-300 rounded-md",
        },
        layout: {
          // Additional layout customizations
          showOptionalFields: false,
          socialButtonsPlacement: "top",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            {/* AI Chat Assistant - Available on all pages */}
            <AIChatAssistant />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}