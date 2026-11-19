import Image from "next/image";
import Link from "next/link";
import { Check, ChevronRight, Search, ShieldCheck } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Right side subtle mint accent background panel (matches design screenshot) */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[36%] bg-[#eef3ef] lg:block" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Headline, Subtitle, Search Bar, CTA buttons */}
          <div className="lg:col-span-7">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#176b63]">
              <ShieldCheck className="size-3.5" />
              <span>TRUSTED LOCAL REPAIR SUPPORT</span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[46px] lg:leading-[1.14]">
              Broken Device? Get It <br className="hidden sm:inline" />
              Fixed by{" "}
              <span className="text-[#176b63]">Verified</span> <br className="hidden sm:inline" />
              <span className="text-[#176b63]">Technicians.</span>
            </h1>

            {/* Subtitle / Paragraph */}
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
              Find trusted repair professionals for your devices and home appliances.
              Track every repair and pay only after the job is completed.
            </p>

            {/* Search Input Bar */}
            <div className="mt-7 flex w-full max-w-md items-center rounded-xl border border-slate-200 bg-white p-1.5 shadow-xs transition-all focus-within:border-[#176b63] focus-within:ring-1 focus-within:ring-[#176b63]">
              <Search className="ml-2.5 size-4.5 shrink-0 text-slate-400" />
              <input
                type="text"
                placeholder="What do you need repaired?"
                className="w-full bg-transparent px-2.5 py-1 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                className="shrink-0 cursor-pointer rounded-lg bg-[#176b63] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#125851]"
              >
                Find a Service
              </button>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-5">
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#176b63] px-4.5 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#125851]"
              >
                Explore Services &rarr;
              </Link>

              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 transition-colors hover:text-[#176b63]"
              >
                How It Works <ChevronRight className="size-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Photo with Decorative Outline and Floating Badge */}
          <div className="relative flex justify-center lg:col-span-5 lg:justify-end">
            <div className="relative w-full max-w-[360px] sm:max-w-[400px]">
              {/* Subtle Decorative Outline Card behind */}
              <div className="pointer-events-none absolute -top-3 -left-3 inset-0 rounded-2xl border border-slate-200/70" />

              {/* Main Photo Card */}
              <div className="relative aspect-[4/3.8] w-full overflow-hidden rounded-2xl shadow-md">
                <Image
                  src="/images/hero-repair-clean.jpg"
                  alt="Technician repairing circuit board"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating Badge (Pay after completion) */}
              <div className="absolute -bottom-4 -left-4 z-20 flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-3.5 py-2.5 shadow-lg sm:-bottom-5 sm:-left-6 sm:px-4 sm:py-3">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#e6f4f1] text-[#176b63]">
                  <Check className="size-4 stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900 leading-tight">
                    Pay after completion
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-500 leading-tight">
                    Approve the work before paying
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
