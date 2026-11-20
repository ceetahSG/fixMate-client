"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  Wrench,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export type NavbarUser = {
  name: string;
  email: string;
  image?: string | null;
  role?: string | null;
};

type NavbarClientProps = {
  user: NavbarUser | null;
};

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function NavbarClient({ user }: NavbarClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    setMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const roleLabel = user?.role || "Customer";
  let dashboardHref = "";

  if (roleLabel.toLowerCase() === "admin") {
    dashboardHref = "/dashboard/admin";
  } else if (roleLabel.toLowerCase() === "technician") {
    dashboardHref = "/dashboard/technician";
  } else {
    dashboardHref = "/dashboard/customer";
  }

  return (
    <>
      <div className="absolute left-1/2 hidden -translate-x-1/2 items-center md:flex">
        <NavigationMenu>
          <NavigationMenuList className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink
                    render={<Link href={link.href} />}
                    className={cn(
                      "p-0 text-[15px] transition-colors hover:bg-transparent focus:bg-transparent data-active:bg-transparent",
                      isActive
                        ? "font-semibold text-[#176b63]"
                        : "font-medium text-[#5e6d6b] hover:text-[#176b63]",
                    )}
                  >
                    {link.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="hidden items-center gap-5 md:flex">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg p-1.5 text-sm font-medium outline-none transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-300"
                />
              }
            >
              <Avatar size="sm" className="size-8">
                {user.image ? (
                  <AvatarImage src={user.image} alt={user.name} />
                ) : null}
                <AvatarFallback className="bg-[#176b63]/10 text-xs font-semibold text-[#176b63]">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <span className="flex flex-col items-start leading-tight">
                <strong className="max-w-28 truncate text-sm font-semibold text-[#172b2b]">
                  {user.name}
                </strong>
              </span>
              <ChevronDown className="size-4 text-slate-400" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-[230px] rounded-xl border-slate-200 p-2 shadow-[0_10px_30px_rgba(15,23,42,0.12)]"
            >
              <div className="flex items-center justify-between px-2 py-2">
                <strong className="text-sm font-semibold text-[#172b2b]">
                  {user.name}
                </strong>
                <span className="rounded-full bg-[#edf7f5] px-2 py-0.5 text-[11px] font-semibold text-[#176b63]">
                  {roleLabel}
                </span>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                render={<Link href={dashboardHref} />}
                className="cursor-pointer gap-2.5 rounded-md px-2.5 py-2.5"
              >
                <LayoutDashboard className="size-4" />
                {roleLabel} Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem
                render={<Link href="/dashboard/update-profile" />}
                className="cursor-pointer gap-2.5 rounded-md px-2.5 py-2.5"
              >
                <UserRound className="size-4" />
                Update Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => void handleLogout()}
                className="cursor-pointer gap-2.5 rounded-md px-2.5 py-2.5 text-slate-700"
              >
                <LogOut className="size-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link
              href="/signin"
              className="text-[15px] font-semibold text-[#172b2b] transition-colors hover:text-[#176b63]"
            >
              Sign In
            </Link>
            <Button
              render={<Link href="/signup" />}
              className="h-9 rounded-[8px] bg-[#176b63] px-4.5 text-[14px] font-semibold text-white shadow-none transition-colors hover:bg-[#125851]"
            >
              Sign Up
            </Button>
          </>
        )}
      </div>

      <div className="flex items-center md:hidden">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-9 text-[#172b2b] hover:bg-slate-100"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              />
            }
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[300px] bg-white p-6 sm:w-[350px]"
          >
            <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
            <div className="mb-6 flex items-center gap-2.5">
              <div className="flex size-8.5 items-center justify-center rounded-[8px] bg-[#176b63] text-white">
                <Wrench className="size-4.5 stroke-[2.2]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#172b2b]">
                FixMate
              </span>
            </div>
            <nav className="flex flex-col gap-3" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-base transition-colors",
                    pathname === link.href ||
                      (link.href !== "/" && pathname.startsWith(link.href))
                      ? "bg-[#176b63]/10 font-semibold text-[#176b63]"
                      : "font-medium text-[#5e6d6b] hover:bg-slate-50 hover:text-[#176b63]",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-2 py-1">
                    <Avatar size="sm" className="size-9">
                      {user.image ? (
                        <AvatarImage src={user.image} alt={user.name} />
                      ) : null}
                      <AvatarFallback className="bg-[#176b63]/10 text-xs font-semibold text-[#176b63]">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#172b2b]">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500">{roleLabel}</p>
                    </div>
                  </div>
                  <Link
                    href={dashboardHref}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <LayoutDashboard className="size-4" />
                    {roleLabel} Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <UserRound className="size-4" />
                    Update Profile
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() => void handleLogout()}
                    className="w-full justify-start gap-2.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="size-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center text-[15px] font-semibold text-[#172b2b]"
                  >
                    Sign In
                  </Link>
                  <Button
                    render={<Link href="/signup" />}
                    onClick={() => setMobileMenuOpen(false)}
                    className="h-10 w-full rounded-[8px] bg-[#176b63] text-[14px] font-semibold text-white"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
