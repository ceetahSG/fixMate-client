import { requireDashboardRole } from "@/lib/dashboard-access";

export default async function TechnicianDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireDashboardRole("technician");
  return children;
}
