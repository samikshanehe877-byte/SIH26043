/**
 * Central authorization policy. Keep this dependency-free: it is shared by
 * server code and Next's proxy.
 */
export const ALL_ROLES = [
  "CITIZEN",
  "STUDENT",
  "FACULTY",
  "MENTOR",
  "INDUSTRY_EMPLOYEE",
  "INDUSTRY_MENTOR",
  "INDUSTRY_EXPERT",
  "GOVERNMENT_OFFICER",
  "ADMIN",
] as const;

export type AppRole = (typeof ALL_ROLES)[number];

export const PORTAL_ROLES: Record<string, readonly AppRole[]> = {
  "/citizen": ["CITIZEN"],
  "/student": ["STUDENT"],
  "/mentor": ["MENTOR"],
  "/university": ["FACULTY"],
  "/industry": ["INDUSTRY_EMPLOYEE", "INDUSTRY_MENTOR", "INDUSTRY_EXPERT"],
  "/government": ["GOVERNMENT_OFFICER", "ADMIN"],
  "/admin": ["ADMIN"],
};

export function getAllowedRolesForPath(pathname: string): readonly AppRole[] | undefined {
  return Object.entries(PORTAL_ROLES).find(
    ([route]) => pathname === route || pathname.startsWith(`${route}/`),
  )?.[1];
}

export function hasRequiredRole(role: string | undefined, allowedRoles: readonly AppRole[]): boolean {
  return !!role && allowedRoles.includes(role as AppRole);
}

export function getRedirectPath(role: string | undefined, needsProfileCompletion = false): string {
  if (needsProfileCompletion && role === "FACULTY") return "/complete-profile/university";
  if (needsProfileCompletion && ["INDUSTRY_EMPLOYEE", "INDUSTRY_MENTOR", "INDUSTRY_EXPERT"].includes(role ?? "")) {
    return "/complete-profile/industry";
  }

  switch (role) {
    case "ADMIN": return "/admin";
    case "GOVERNMENT_OFFICER": return "/government";
    case "STUDENT": return "/student";
    case "MENTOR": return "/mentor";
    case "FACULTY": return "/university";
    case "INDUSTRY_EMPLOYEE":
    case "INDUSTRY_MENTOR":
    case "INDUSTRY_EXPERT": return "/industry";
    default: return "/";
  }
}
