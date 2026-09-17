import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAllowedRolesForPath } from "@/lib/authorization";

const authRoutes = ["/signin", "/signup"];

/**
 * Next 16 request gate. It deliberately does not trust a role from a cookie:
 * the layouts and API handlers perform the authoritative signed-session + DB
 * role check. This gate only sends unauthenticated browser requests to signin.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requiredRoles = getAllowedRolesForPath(pathname);
  const hasSessionCookie = Boolean(request.cookies.get("auth_session")?.value);

  if (requiredRoles && !hasSessionCookie) {
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (authRoutes.includes(pathname) && hasSessionCookie) {
    // The server page/API checks remain authoritative; avoid using a cookie
    // claim to choose a privileged destination here.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/citizen/:path*",
    "/student/:path*",
    "/mentor/:path*",
    "/university/:path*",
    "/industry/:path*",
    "/government/:path*",
    "/admin/:path*",
    "/signin",
    "/signup",
  ],
};
