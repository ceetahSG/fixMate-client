"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardCheck,
  CreditCard,
  FileText,
  Home,
  LayoutGrid,
  LogOut,
  Menu,
  Plus,
  UserRound,
  Users,
  Wrench,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export type DashboardUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

type DashboardSidebarProps = {
  user?: DashboardUser | null;
};

function getInitials(name?: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = (user?.role || "Customer").toLowerCase();
  const displayRole =
    role === "admin"
      ? "Admin"
      : role === "technician"
        ? "Technician"
        : "Customer";

  const displayName = user?.name || "";

  // Navigation Items per Role matching the designs exactly
  const customerNavItems = [
    {
      label: "Overview",
      href: `/dashboard/customer`,
      icon: LayoutGrid,
    },
    {
      label: "My Bookings",
      href: "/dashboard/customer/bookings",
      icon: ClipboardCheck,
    },
    {
      label: "Payment History",
      href: "/dashboard/customer/payments",
      icon: CreditCard,
    },
    {
      label: "Update Profile",
      href: "/dashboard/profile",
      icon: UserRound,
    },
  ];

  const adminNavItems = [
    {
      label: "Overview",
      href: "/dashboard/admin",
      icon: LayoutGrid,
    },
    {
      label: "Manage Users",
      href: "/dashboard/admin/manage-users",
      icon: Users,
    },
    {
      label: "Service Approval",
      href: "/dashboard/admin/service-approval",
      icon: ClipboardCheck,
    },
    {
      label: "All Bookings",
      href: "/dashboard/admin/all-bookings",
      icon: FileText,
    },
    {
      label: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: CreditCard,
    },
    {
      label: "Update Profile",
      href: "/dashboard/profile",
      icon: UserRound,
    },
  ];

  const technicianNavItems = [
    {
      label: "Overview",
      href: "/dashboard/technician",
      icon: LayoutGrid,
    },
    {
      label: "Add Service",
      href: "/dashboard/technician/add-service",
      icon: Plus,
    },
    {
      label: "My Services",
      href: "/dashboard/technician/my-services",
      icon: Wrench,
    },
    {
      label: "Manage Requests",
      href: "/dashboard/technician/requests",
      icon: ClipboardCheck,
    },
    {
      label: "Update Profile",
      href: "/dashboard/profile",
      icon: UserRound,
    },
  ];

  const navItems =
    role === "admin"
      ? adminNavItems
      : role === "technician"
        ? technicianNavItems
        : customerNavItems;

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    }
    setMobileOpen(false);
    router.push("/signin");
    router.refresh();
  };

  const isItemActive = (href: string) => {
    if (href === "/dashboard") {
      return (
        pathname === "/dashboard" ||
        pathname === "/dashboard/customer" ||
        pathname === "/dashboard/technician" ||
        pathname === "/dashboard/admin"
      );
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Reusable Sidebar Inner Content
  const sidebarContent = (
    <div className="flex h-full min-h-screen w-full flex-col justify-between bg-[#133b37] text-white">
      <div>
        {/* Top: FixMate Logo */}
        <div className="border-b border-[#24504b]/70 p-5">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex size-8.5 items-center justify-center rounded-[8px] bg-white text-[#176b63] shadow-xs transition-transform group-hover:scale-[1.02]">
              <Wrench className="size-4.5 stroke-[2.2]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              FixMate
            </span>
          </Link>
        </div>

        {/* User Profile Card */}
        <div className="border-b border-[#24504b]/70 p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#eaf2ef] font-bold text-xs text-[#52877f] shadow-xs">
              {getInitials(displayName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white tracking-tight">
                {displayName}
              </p>
              <p className="text-xs font-medium text-[#6eb3aa] capitalize">
                {displayRole}
              </p>
            </div>
          </div>
        </div>

        {/* Role-based Navigation Links */}
        <nav className="space-y-1.5 p-3" aria-label="Dashboard navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all",
                  active
                    ? "bg-[#24504b] text-white shadow-xs"
                    : "text-[#bcd1cd] hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon
                  className={cn(
                    "size-4.5 shrink-0 transition-colors",
                    active
                      ? "text-white stroke-[2]"
                      : "text-[#bcd1cd] stroke-[1.8]",
                  )}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions: Back to Home & Sign Out */}
      <div className="border-t border-[#24504b]/70 p-3 space-y-1">
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#bcd1cd] transition-colors hover:bg-white/5 hover:text-white"
        >
          <Home className="size-4.5 shrink-0 stroke-[1.8]" />
          <span>Back to Home</span>
        </Link>

        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold text-[#bcd1cd] transition-colors hover:bg-white/5 hover:text-white"
        >
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#0a1e1c] text-white">
            <LogOut className="size-3.5 stroke-[2]" />
          </div>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden h-screen w-64 shrink-0 overflow-y-auto lg:sticky lg:top-0 lg:block xl:w-72">
        {sidebarContent}
      </aside>

      {/* Mobile Top Header with Hamburger Button */}
      <div className="flex h-16 w-full items-center justify-between border-b border-slate-200 bg-[#133b37] px-4 text-white lg:hidden">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-[8px] bg-white text-[#176b63]">
            <Wrench className="size-4 stroke-[2.2]" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            FixMate
          </span>
        </Link>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <button
                type="button"
                className="flex size-9 items-center justify-center rounded-lg border border-white/20 text-white hover:bg-white/10"
                aria-label="Open dashboard navigation"
              />
            }
          >
            <Menu className="size-5" />
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-72 p-0 border-r-0 bg-[#133b37]"
          >
            <SheetTitle className="sr-only">Dashboard Navigation</SheetTitle>
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
