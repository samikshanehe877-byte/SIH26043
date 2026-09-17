import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { AppRole, getRedirectPath, hasRequiredRole } from "@/lib/authorization";

/** Authoritative page guard: verifies the signed session, then reads role from the database. */
export async function requirePortalRole(allowedRoles: readonly AppRole[], callbackUrl: string) {
  const user = await getAuthUser();
  if (!user) {
    debugAuthorization(callbackUrl, false, undefined, undefined, allowedRoles, false);
    redirect(`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const authorized = hasRequiredRole(user.role, allowedRoles);
  debugAuthorization(callbackUrl, true, user.id, user.role, allowedRoles, authorized);
  if (authorized) {
    return user;
  }

  redirect(getRedirectPath(user.role, user.needsProfileCompletion));
}

function debugAuthorization(
  pathname: string,
  hasSession: boolean,
  userId: string | undefined,
  role: string | undefined,
  requiredRoles: readonly AppRole[],
  authorized: boolean,
) {
  if (process.env.AUTH_DEBUG === "true") {
    console.info("[authz]", { pathname, hasSession, userId, role, requiredRoles, authorized });
  }
}
