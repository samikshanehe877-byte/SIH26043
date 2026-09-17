import { NextResponse } from "next/server";
import { getAuthUser, UserRole } from "@/lib/auth";

export interface AuthenticatedRequest {
  user: Awaited<ReturnType<typeof getAuthUser>>;
}

/**
 * Use at the start of every protected route handler. The user and role are
 * obtained from the signed cookie plus the database, never from request data.
 */
export async function requireApiRole(allowedRoles: readonly UserRole[]) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!allowedRoles.includes(user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return user;
}

export async function withAuth(
  handler: (request: Request, context: { user: NonNullable<Awaited<ReturnType<typeof getAuthUser>>> }) => Promise<NextResponse>,
  allowedRoles?: UserRole[]
): Promise<NextResponse> {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return handler(new Request(""), { user });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

export function createAuthMiddleware(allowedRoles: UserRole[]) {
  return async (request: Request): Promise<{ user: NonNullable<Awaited<ReturnType<typeof getAuthUser>>> } | NextResponse> => {
    const auth = await requireApiRole(allowedRoles);
    if (auth instanceof NextResponse) return auth;

    return { user: auth };
  };
}
