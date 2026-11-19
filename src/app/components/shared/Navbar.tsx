"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronDown,
  ClipboardList,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  Settings,
  UserRound,
  Wrench,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { cn } from "@/lib/utils";

export type NavbarProps = {
  isLoggedIn?: boolean;
  userName?: string;
  userEmail?: string;
  userImage?: string;
  onSignIn?: () => void;
  onSignUp?: () => void;
  onLogout?: () => void;
};

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
];

const accountLinks = [
  { label: "My profile", href: "/profile", icon: UserRound },
  { label: "My jobs", href: "/jobs", icon: ClipboardList },
  { label: "Messages", href: "/messages", icon: MessageCircle },
  { label: "Settings", href: "/settings", icon: Settings },
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

export default function Navbar({
  isLoggedIn = false,
  userName = "John Doe",
  userEmail,
  userImage,
  onSignIn,
  onSignUp,
  onLogout,
}: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthPage =
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/login" ||
    pathname === "/register";

  if (isAuthPage) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex size-8.5 items-center justify-center rounded-[8px] bg-[#176b63] text-white shadow-xs transition-transform group-hover:scale-[1.02]">
            <Wrench className="size-4.5 stroke-[2.2]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#172b2b]">
            FixMate
          </span>
        </Link>

        {/* Center: Desktop Navigation Links (Centered) */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center md:flex">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname?.startsWith(link.href));

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

        {/* Right: Actions */}
        <div className="hidden items-center gap-5 md:flex">
          {isLoggedIn ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-8.5 gap-1.5 border-slate-200 text-sm font-medium"
              >
                <Plus className="size-4" />
                Post a job
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="size-8.5 text-slate-600 hover:text-[#176b63]"
                aria-label="Notifications"
              >
                <Bell className="size-4.5" />
              </Button>

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
                    {userImage ? (
                      <AvatarImage src={userImage} alt={userName} />
                    ) : null}
                    <AvatarFallback className="bg-[#176b63]/10 text-xs font-semibold text-[#176b63]">
                      {getInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-28 truncate font-medium text-[#172b2b]">
                    {userName}
                  </span>
                  <ChevronDown className="size-4 text-slate-400" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-[#172b2b]">
                        {userName}
                      </p>
                      {userEmail ? (
                        <p className="truncate text-xs text-muted-foreground">
                          {userEmail}
                        </p>
                      ) : null}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {accountLinks.map(({ label, href, icon: Icon }) => (
                      <DropdownMenuItem
                        key={href}
                        render={<Link href={href} />}
                      >
                        <Icon className="mr-2 size-4 text-muted-foreground" />
                        {label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onLogout}
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    <LogOut className="mr-2 size-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {onSignIn ? (
                <button
                  type="button"
                  onClick={onSignIn}
                  className="cursor-pointer text-[15px] font-semibold text-[#172b2b] transition-colors hover:text-[#176b63]"
                >
                  Sign In
                </button>
              ) : (
                <Link
                  href="/signin"
                  className="text-[15px] font-semibold text-[#172b2b] transition-colors hover:text-[#176b63]"
                >
                  Sign In
                </Link>
              )}

              {onSignUp ? (
                <Button
                  onClick={onSignUp}
                  className="h-9 rounded-[8px] bg-[#176b63] px-4.5 text-[14px] font-semibold text-white shadow-none transition-colors hover:bg-[#125851]"
                >
                  Sign Up
                </Button>
              ) : (
                <Button
                  render={<Link href="/signup" />}
                  className="h-9 rounded-[8px] bg-[#176b63] px-4.5 text-[14px] font-semibold text-white shadow-none transition-colors hover:bg-[#125851]"
                >
                  Sign Up
                </Button>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Trigger & Sheet */}
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

              {/* Mobile Brand */}
              <div className="mb-6 flex items-center gap-2.5">
                <div className="flex size-8.5 items-center justify-center rounded-[8px] bg-[#176b63] text-white">
                  <Wrench className="size-4.5 stroke-[2.2]" />
                </div>
                <span className="text-xl font-bold tracking-tight text-[#172b2b]">
                  FixMate
                </span>
              </div>

              {/* Mobile Nav Links */}
              <nav
                className="flex flex-col gap-3"
                aria-label="Mobile navigation"
              >
                {navLinks.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== "/" && pathname?.startsWith(link.href));

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "rounded-lg px-3 py-2 text-base transition-colors",
                        isActive
                          ? "bg-[#176b63]/10 font-semibold text-[#176b63]"
                          : "font-medium text-[#5e6d6b] hover:bg-slate-50 hover:text-[#176b63]",
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Auth / Profile Section */}
              <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center gap-3 px-2 py-1">
                      <Avatar size="sm" className="size-9">
                        {userImage ? (
                          <AvatarImage src={userImage} alt={userName} />
                        ) : null}
                        <AvatarFallback className="bg-[#176b63]/10 text-xs font-semibold text-[#176b63]">
                          {getInitials(userName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[#172b2b]">
                          {userName}
                        </p>
                        {userEmail ? (
                          <p className="truncate text-xs text-muted-foreground">
                            {userEmail}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="my-2 flex flex-col gap-1">
                      {accountLinks.map(({ label, href, icon: Icon }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <Icon className="size-4 text-muted-foreground" />
                          {label}
                        </Link>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      className="w-full gap-2 border-slate-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Plus className="size-4" />
                      Post a job
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onLogout?.();
                      }}
                      className="w-full justify-start gap-2.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <LogOut className="size-4" />
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    {onSignIn ? (
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onSignIn();
                        }}
                        className="w-full py-2.5 text-center text-[15px] font-semibold text-[#172b2b] transition-colors hover:text-[#176b63]"
                      >
                        Sign In
                      </button>
                    ) : (
                      <Link
                        href="/signin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full py-2.5 text-center text-[15px] font-semibold text-[#172b2b] transition-colors hover:text-[#176b63]"
                      >
                        Sign In
                      </Link>
                    )}

                    {onSignUp ? (
                      <Button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onSignUp();
                        }}
                        className="h-10 w-full rounded-[8px] bg-[#176b63] text-[14px] font-semibold text-white shadow-none transition-colors hover:bg-[#125851]"
                      >
                        Sign Up
                      </Button>
                    ) : (
                      <Button
                        render={<Link href="/signup" />}
                        onClick={() => setMobileMenuOpen(false)}
                        className="h-10 w-full rounded-[8px] bg-[#176b63] text-[14px] font-semibold text-white shadow-none transition-colors hover:bg-[#125851]"
                      >
                        Sign Up
                      </Button>
                    )}
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
