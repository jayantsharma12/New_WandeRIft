<<<<<<< HEAD
import { clerkMiddleware } from '@clerk/nextjs/server';
=======
// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";
>>>>>>> 14e9023 (completed with Authication)

export default clerkMiddleware();

export const config = {
  matcher: [
<<<<<<< HEAD
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
=======
    // Match all except Next.js internals and static assets
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
// This middleware will run for all routes except those specified in the matcher
// It ensures that Clerk authentication is applied to all pages and API routes
// Adjust the matcher as needed to include or exclude specific paths
>>>>>>> 14e9023 (completed with Authication)
