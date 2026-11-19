import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "Technician Dashboard | FixMate",
};

export default async function TechnicianDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Technician Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Welcome back, {session?.user?.name || "Technician"}.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Account Status
        </p>
        <p className="mt-2 text-2xl font-bold text-slate-900">Active</p>
        <p className="mt-1 text-xs font-medium text-[#176b63]">Role: Technician</p>
      </div>
    </div>
  );
}
