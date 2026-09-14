import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/student",
  "/mentor",
  "/university",
  "/industry",
  "/government",
  "/admin",
];

const authRoutes = ["/signin", "/signup"];

const roleRoutes: Record<string, string[]> = {
  "/student": ["STUDENT"],
  "/mentor": ["MENTOR", "FACULTY"],
  "/university": ["FACULTY", "MENTOR", "STUDENT"],
  "/industry": ["INDUSTRY_EMPLOYEE", "INDUSTRY_MENTOR", "INDUSTRY_EXPERT"],
  "/government": ["GOVERNMENT_OFFICER", "ADMIN"],
  "/admin": ["ADMIN"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("auth_session");

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (!sessionCookie) {
    if (isProtectedRoute) {
      const signInUrl = new URL("/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  }

  let sessionData;
  try {
    sessionData = JSON.parse(sessionCookie.value);
  } catch {
    if (isProtectedRoute) {
      const signInUrl = new URL("/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  }

  if (isAuthRoute) {
    const redirectPath = getRedirectPath(sessionData.role);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  if (isProtectedRoute) {
    const allowedRoles = roleRoutes[pathname.split("/")[1]] || [];
    if (allowedRoles.length > 0 && !allowedRoles.includes(sessionData.role)) {
      const redirectPath = getRedirectPath(sessionData.role);
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  return NextResponse.next();
}

function getRedirectPath(role: string): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "GOVERNMENT_OFFICER":
      return "/government";
    case "STUDENT":
      return "/student";
    case "MENTOR":
      return "/mentor";
    case "FACULTY":
      return "/university";
    case "INDUSTRY_EMPLOYEE":
    case "INDUSTRY_MENTOR":
    case "INDUSTRY_EXPERT":
      return "/industry";
    case "CITIZEN":
    default:
      return "/";
  }
}

export const config = {
  matcher: [
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