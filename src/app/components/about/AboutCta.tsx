import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutCta() {
  return (
    <section className="bg-[#f7f8f5] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 rounded-2xl bg-[#d97544] p-8 shadow-sm sm:flex-row sm:items-center sm:p-10 lg:p-12">
          {/* Left Text */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/90">
              FIND YOUR REPAIR
            </p>
            <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Start with the right service.
            </h2>
          </div>

          {/* Right Action Button */}
          <div className="shrink-0">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-xs font-semibold text-[#176b63] shadow-xs transition-colors hover:bg-slate-50 sm:text-sm"
            >
              Browse Services <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
