import Link from "next/link";
import { Wrench } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#112d2b] text-white">
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-8 sm:px-6 lg:px-8 lg:pt-16">
        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Column 1: Brand Info (5 cols on lg) */}
          <div className="lg:col-span-5">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex size-8.5 items-center justify-center rounded-[8px] bg-white text-[#176b63] shadow-xs">
                <Wrench className="size-4.5 stroke-[2.2]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                FixMate
              </span>
            </Link>

            {/* Sub-headline & Description */}
            <p className="mt-4 text-sm font-semibold text-white">
              Repairs handled with confidence.
            </p>
            <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-slate-300/80 sm:text-[13px]">
              FixMate connects people with skilled repair professionals for
              everyday devices and appliances.
            </p>
          </div>

          {/* Column 2: Quick Links (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold text-white">Quick Links</h4>
            <ul className="mt-3.5 space-y-2.5 text-xs text-slate-300/80 sm:text-[13px]">
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="transition-colors hover:text-white"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-white"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Categories (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold text-white">
              Popular Categories
            </h4>
            <ul className="mt-3.5 space-y-2.5 text-xs text-slate-300/80 sm:text-[13px]">
              <li>
                <Link
                  href="/services?category=smartphone"
                  className="transition-colors hover:text-white"
                >
                  Smartphone
                </Link>
              </li>
              <li>
                <Link
                  href="/services?category=laptop-pc"
                  className="transition-colors hover:text-white"
                >
                  Laptop &amp; PC
                </Link>
              </li>
              <li>
                <Link
                  href="/services?category=ac"
                  className="transition-colors hover:text-white"
                >
                  AC
                </Link>
              </li>
              <li>
                <Link
                  href="/services?category=refrigerator"
                  className="transition-colors hover:text-white"
                >
                  Refrigerator
                </Link>
              </li>
              <li>
                <Link
                  href="/services?category=tv"
                  className="transition-colors hover:text-white"
                >
                  TV
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Socials (3 cols on lg) */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-semibold text-white">Contact</h4>
            <div className="mt-3.5 space-y-1.5 text-xs text-slate-300/80 sm:text-[13px]">
              <p>hello@fixmate.example</p>
              <p>+880 1700 000000</p>
              <p>Road 11, Banani, Dhaka</p>
            </div>

            {/* Social Media Icons */}
            <div className="mt-4 flex items-center gap-2">
              <a
                href="#facebook"
                aria-label="Facebook"
                className="flex size-7.5 items-center justify-center rounded-[6px] border border-white/20 text-xs font-semibold text-white/80 transition-colors hover:border-white/50 hover:text-white"
              >
                f
              </a>
              <a
                href="#instagram"
                aria-label="Instagram"
                className="flex size-7.5 items-center justify-center rounded-[6px] border border-white/20 text-white/80 transition-colors hover:border-white/50 hover:text-white"
              >
                <svg
                  className="size-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="#linkedin"
                aria-label="LinkedIn"
                className="flex size-7.5 items-center justify-center rounded-[6px] border border-white/20 text-xs font-semibold text-white/80 transition-colors hover:border-white/50 hover:text-white"
              >
                in
              </a>
              <a
                href="#twitter"
                aria-label="X"
                className="flex size-7.5 items-center justify-center rounded-[6px] border border-white/20 text-xs font-semibold text-white/80 transition-colors hover:border-white/50 hover:text-white"
              >
                x
              </a>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-xs text-slate-400">
            &copy; 2025 FixMate. Demo product for academic and portfolio
            presentation.
          </p>
        </div>
      </div>
    </footer>
  );
}
