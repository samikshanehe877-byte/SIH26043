import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { AppRole, getAllowedRolesForPath, getRedirectPath as roleRedirectPath, hasRequiredRole, PORTAL_ROLES } from "./authorization";
import { verifySessionToken } from "./session";

export type UserRole = AppRole;

export interface SessionData {
  userId: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  accountStatus: string;
  profilePhoto?: string | null;
  location?: string | null;
  regionId?: string | null;
  universityId?: string | null;
  industryId?: string | null;
  /** University name (faculty) or company name (industry staff); used as their alert/volunteer identity. */
  organizationName?: string | null;
  needsProfileCompletion?: boolean;
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("auth_session");

  if (!sessionCookie) {
    return null;
  }

  try {
    const payload = verifySessionToken(sessionCookie.value);
    return payload ? { userId: payload.userId } : null;
  } catch {
    return null;
  }
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const session = await getSession();
  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      accountStatus: true,
      profilePhoto: true,
      location: true,
      regionId: true,
      phone: true,
      createdAt: true,
    },
  });

  if (!user || user.accountStatus !== "ACTIVE") {
    return null;
  }

  let universityId: string | undefined;
  let industryId: string | undefined;
  let organizationName: string | undefined;
  let needsProfileCompletion = false;

  if (user.role === "FACULTY") {
    const faculty = await prisma.universityFaculty.findUnique({
      where: { userId: user.id },
      include: { university: { select: { name: true } } },
    });
    if (!faculty) {
      needsProfileCompletion = true;
    } else {
      universityId = faculty.universityId;
      organizationName = faculty.university.name;
    }
  } else if (["INDUSTRY_EMPLOYEE", "INDUSTRY_MENTOR", "INDUSTRY_EXPERT"].includes(user.role)) {
    const employee = await prisma.industryEmployee.findUnique({
      where: { userId: user.id },
      include: { industry: { select: { companyName: true } } },
    });
    if (!employee) {
      needsProfileCompletion = true;
    } else {
      industryId = employee.industryId;
      organizationName = employee.industry.companyName;
    }
  }

  return {
    ...user,
    role: user.role as UserRole,
    universityId,
    industryId,
    organizationName,
    needsProfileCompletion,
  };
}

export function hasRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return hasRequiredRole(userRole, allowedRoles);
}

export function requireRole(userRole: UserRole | undefined, allowedRoles: UserRole[]): void {
  if (!hasRequiredRole(userRole, allowedRoles)) {
    throw new Error("FORBIDDEN");
  }
}

export const ROLE_ROUTES = PORTAL_ROLES;

export { getAllowedRolesForPath };

export function getRedirectPath(role: UserRole, needsProfileCompletion?: boolean): string {
  return roleRedirectPath(role, needsProfileCompletion);
}
