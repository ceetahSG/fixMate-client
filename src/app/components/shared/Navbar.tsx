import Link from "next/link";
import { headers } from "next/headers";
import { Wrench } from "lucide-react";
import { auth } from "@/lib/auth";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user =
    !session?.user
      ? null
      : {
          name: session.user.name,
          email: session.user.email,
          image: undefined, // session.user.image is not available in the session object
          role: "role" in session.user ? String(session.user.role ?? "") : null,
        };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex size-8.5 items-center justify-center rounded-[8px] bg-[#176b63] text-white shadow-xs transition-transform group-hover:scale-[1.02]">
            <Wrench className="size-4.5 stroke-[2.2]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#172b2b]">
            FixMate
          </span>
        </Link>

        <NavbarClient user={user} />
      </div>
    </header>
  );
}
