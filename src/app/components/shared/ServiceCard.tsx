import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";
import {
  formatServicePrice,
  getModeLabel,
  type MarketplaceService,
} from "@/lib/services";

type ServiceCardProps = {
  service: MarketplaceService;
};

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs transition-shadow hover:shadow-sm">
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <span className="absolute top-2 left-2 inline-flex items-center rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-slate-900 shadow-xs backdrop-blur">
          {service.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Home className="size-4 shrink-0 text-slate-400" />
            {getModeLabel(service.mode)}
          </span>
          <span className="truncate">{service.area}</span>
        </div>

        <h3 className="mt-4 line-clamp-2 text-[19px] leading-snug font-semibold text-slate-900">
          {service.title}
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          By {service.technicianName}
        </p>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-500">Starting from</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              {formatServicePrice(service.price)}
            </p>
          </div>

          <Link
            href={`/services/${service.id}`}
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 shadow-xs transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
