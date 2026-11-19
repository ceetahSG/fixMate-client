import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DashboardSidebar from "@/app/components/shared/dashboard/DashboardSidebar";
import DashboardHeader from "@/app/components/shared/dashboard/DashboardHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  const user = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role:
      "role" in session.user
        ? String(session.user.role ?? "Customer")
        : "Customer",
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f7f4] lg:flex-row">
      <DashboardSidebar user={user} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader user={user} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-5 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
