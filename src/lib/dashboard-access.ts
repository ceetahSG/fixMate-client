import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { dashboardPathForRole, normalizeAppRole, type AppRole } from "@/lib/roles";

/**
 * Server-side dashboard guard. This is a UX boundary only – the Express API
 * still verifies the JWT and role for every protected request.
 */
export async function requireDashboardRole(role: AppRole) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  const userRole =
    "role" in session.user ? session.user.role : "Customer";

  if (normalizeAppRole(userRole) !== role) {
    redirect(dashboardPathForRole(userRole));
  }

  return session;
}
