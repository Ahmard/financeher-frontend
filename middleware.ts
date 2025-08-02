import { withAuth } from "next-auth/middleware";
import { COOKIE_NAMES } from "@/lib/constants/app";
import type { NextRequest } from "next/server";

// Routes that are accessible without authentication
const guestRoutes = ['/', '/login', '/register', '/welcome'];

// Pattern to ignore requests to static assets
const PUBLIC_FILE = /\.(.*)$/;

export default withAuth(
  function middleware(_req: NextRequest) {
    // No custom logic needed here if using `authorized` callback
  },
  {
    callbacks: {
      authorized: ({ req }) => {
        const { pathname } = req.nextUrl;

        // Allow static files (e.g., /favicon.ico, /images/logo.png)
        if (PUBLIC_FILE.test(pathname)) {
          return true;
        }

        // Allow access to guest routes or if session token exists
        const token = req.cookies.get(COOKIE_NAMES.SESSION_TOKEN)?.value;
        const hasToken = !!token;
        return hasToken || (!hasToken && guestRoutes.includes(pathname));
      },
    },
  }
);

// Optional: define config to apply middleware only to certain paths
export const config = {
  matcher: ['/((?!_next|favicon.ico|images|css|js|fonts).*)'],
};
