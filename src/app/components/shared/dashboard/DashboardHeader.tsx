import Link from "next/link";
import { Home } from "lucide-react";

export type DashboardHeaderProps = {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  } | null;
};

function getInitials(name?: string | null) {
  if (!name) return "FA";
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const role = (user?.role || "Admin").toLowerCase();
  const roleTitle =
    role === "admin"
      ? "Admin"
      : role === "technician"
      ? "Technician"
      : "Customer";

  const displayName = user?.name || "Farhana Ahmed";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white px-6 shadow-2xs lg:px-8">
      {/* Left: Workspace Title */}
      <div>
        <p className="text-xs font-medium text-slate-400 leading-none">
          FixMate workspace
        </p>
        <h2 className="mt-1 text-sm font-bold text-slate-900 leading-tight">
          {roleTitle} portal
        </h2>
      </div>

      {/* Right: Public Home Link & User Profile Card */}
      <div className="flex items-center gap-5 sm:gap-6">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition-colors hover:text-[#176b63]"
        >
          <Home className="size-4 text-slate-500" />
          <span>Public Home</span>
        </Link>

        {/* User Profile Info */}
        <div className="flex items-center gap-2.5 pl-2 sm:border-l sm:border-slate-200 sm:pl-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#eaf2ef] text-xs font-bold text-[#52877f]">
            {getInitials(displayName)}
          </div>
          <div className="hidden min-w-0 flex-col leading-tight sm:flex">
            <span className="truncate text-xs font-bold text-slate-900">
              {displayName}
            </span>
            <span className="text-[11px] font-medium text-slate-400 capitalize">
              {roleTitle}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
