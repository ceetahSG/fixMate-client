import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ServiceCard from "@/app/components/shared/ServiceCard";
import type { MarketplaceService } from "@/lib/services";

type PopularServicesSectionProps = {
  services: MarketplaceService[];
};

export default function PopularServicesSection({
  services,
}: PopularServicesSectionProps) {
  return (
    <section className="bg-[#fafbf8] py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-bold tracking-[0.18em] text-[#176b63] uppercase">
              Popular right now
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-[34px]">
              Popular Repair Services
            </h2>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Get professional help for your everyday repair needs.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex h-11 w-fit shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:border-[#176b63]/40 hover:text-[#176b63] focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none"
          >
            View All Services
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {services.length > 0 ? (
          <div className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="mt-9 rounded-xl border border-slate-200 bg-white px-6 py-14 text-center text-sm text-slate-500">
            Popular services are being updated. Please check back shortly.
          </div>
        )}
      </div>
    </section>
  );
}
