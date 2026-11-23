import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { dashboardPathForRole, normalizeAppRole } from "@/lib/roles";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  const role =
    "role" in session.user ? session.user.role : "Customer";
  const ownDashboard = dashboardPathForRole(role);
  const pathname = request.nextUrl.pathname;

  if (pathname === "/dashboard") {
    return NextResponse.redirect(new URL(ownDashboard, request.url));
  }

  const routeRole = pathname.startsWith("/dashboard/admin")
    ? "admin"
    : pathname.startsWith("/dashboard/technician")
      ? "technician"
      : pathname.startsWith("/dashboard/customer")
        ? "customer"
        : null;

  if (routeRole && routeRole !== normalizeAppRole(role)) {
    return NextResponse.redirect(new URL(ownDashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
