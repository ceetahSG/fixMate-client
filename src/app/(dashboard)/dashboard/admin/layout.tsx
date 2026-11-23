import { requireDashboardRole } from "@/lib/dashboard-access";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireDashboardRole("admin");
  return children;
}
