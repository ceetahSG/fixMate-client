import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardRootPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  const role =
    "role" in session.user
      ? String(session.user.role ?? "Customer").toLowerCase()
      : "customer";

  if (role === "admin") {
    redirect("/dashboard/admin");
  } else if (role === "technician") {
    redirect("/dashboard/technician");
  } else {
    redirect("/dashboard/customer");
  }
}
