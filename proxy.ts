import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

function dashboardForRole(role: unknown) {
  const normalizedRole = String(role ?? "Customer").trim().toLowerCase();

  if (normalizedRole === "admin") return "/dashboard/admin";
  if (normalizedRole === "technician") return "/dashboard/technician";
  return "/dashboard/customer";
}

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  const role =
    "role" in session.user
      ? String(session.user.role ?? "Customer")
      : "Customer";
  const ownDashboard = dashboardForRole(role);
  const pathname = request.nextUrl.pathname;

  if (pathname === "/dashboard") {
    return NextResponse.redirect(new URL(ownDashboard, request.url));
  }

  const normalizedRole = role.trim().toLowerCase();
  const routeRole = pathname.startsWith("/dashboard/admin")
    ? "admin"
    : pathname.startsWith("/dashboard/technician")
      ? "technician"
      : pathname.startsWith("/dashboard/customer")
        ? "customer"
        : null;

  if (routeRole && routeRole !== normalizedRole) {
    return NextResponse.redirect(new URL(ownDashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};