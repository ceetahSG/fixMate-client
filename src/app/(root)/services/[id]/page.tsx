import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Home,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import RequestRepairDialog from "@/app/components/services/RequestRepairDialog";
import { getServiceById } from "@/lib/actions/api/data";
import {
  formatServicePrice,
  getModeLabel,
  normalizeService,
  type ApiService,
} from "@/lib/services";

export const metadata = {
  title: "Service Details | FixMate",
  description:
    "Review the repair service, pricing, technician, and service details before booking.",
};

const serviceHighlights = [
  {
    title: "Initial diagnosis",
    description: "Clear fault assessment before repair",
  },
  {
    title: "Progress updates",
    description: "Track your job through completion",
  },
  {
    title: "Transparent pricing",
    description: "Final amount confirmed by technician",
  },
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

function formatDuration(duration: string) {
  if (!/^\d+(\.\d+)?$/.test(duration)) return duration;

  return Number(duration) === 1 ? "1 hour" : `${duration} hours`;
}

type ServiceDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ServiceDetailsPage({
  params,
}: ServiceDetailsPageProps) {
  const { id } = await params;
  const rawService = await getServiceById(id).catch(() => null);

  if (!rawService?._id) {
    notFound();
  }

  const service = normalizeService(rawService as ApiService);

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#fafbf8] py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-[#176b63] focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none"
        >
          <ArrowLeft className="size-4" />
          Back to services
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_376px] lg:items-start lg:gap-10">
          <div className="space-y-6">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-slate-100">
              <Image
                src={service.image}
                alt={service.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 765px"
                className="object-cover"
              />
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8">
              <span className="inline-flex items-center rounded-full bg-[#e6f2ef] px-2.5 py-1 text-[11px] font-semibold text-[#176b63]">
                {service.category}
              </span>

              <h1 className="mt-4 text-3xl leading-tight font-semibold tracking-tight text-slate-900 sm:text-[40px]">
                {service.title}
              </h1>

              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
                {service.description}
              </p>

              <div className="mt-8">
                <h2 className="text-base font-semibold text-slate-900">
                  About this service
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                  This service includes an initial inspection, fault diagnosis,
                  and the agreed repair work. The technician will confirm any
                  price change before completing the job.
                </p>
              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-3">
                {serviceHighlights.map((highlight) => (
                  <div
                    key={highlight.title}
                    className="flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#176b63] stroke-[1.8]" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {highlight.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8">
              <div className="flex items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#e8f1ee] text-sm font-semibold text-[#3c7d72]">
                  {getInitials(service.technicianName)}
                </div>
                <div>
                  <p className="text-xs text-slate-500">Your technician</p>
                  <p className="mt-1 text-base font-medium text-slate-900">
                    {service.technicianName}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-600">
                    {service.area}
                  </p>
                </div>
              </div>

              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
                Device repair specialist focused on careful diagnostics,
                practical solutions, and clear customer communication.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-[#f1f3f2] px-2.5 py-1 text-[11px] font-medium text-slate-600">
                  Device Diagnostics
                </span>
                <span className="inline-flex items-center rounded-full bg-[#f1f3f2] px-2.5 py-1 text-[11px] font-medium text-slate-600">
                  Hardware Repair
                </span>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-xl border border-t-[3px] border-slate-200 border-t-[#176b63] bg-white shadow-2xs">
              <div className="p-6">
                <p className="text-sm text-slate-600">Service starts at</p>
                <p className="mt-1 text-4xl font-bold tracking-tight text-slate-900">
                  {formatServicePrice(service.price)}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Final amount is set after the repair
                </p>

                <div className="mt-5 space-y-5 border-t border-slate-100 pt-5">
                  <div className="flex items-start gap-3">
                    <Home className="mt-0.5 size-5 shrink-0 text-[#176b63] stroke-[1.8]" />
                    <div>
                      <p className="text-xs text-slate-500">Service mode</p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-900">
                        {getModeLabel(service.mode)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 size-5 shrink-0 text-[#176b63] stroke-[1.8]" />
                    <div>
                      <p className="text-xs text-slate-500">
                        Estimated duration
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-900">
                        {formatDuration(service.estimatedDuration)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-5 shrink-0 text-[#176b63] stroke-[1.8]" />
                    <div>
                      <p className="text-xs text-slate-500">Service area</p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-900">
                        {service.area}
                      </p>
                    </div>
                  </div>
                </div>

                <RequestRepairDialog
                  serviceId={service.id}
                  serviceTitle={service.title}
                  serviceImage={service.image}
                  category={service.category}
                  basePrice={service.price}
                  technicianName={service.technicianName}
                  technicianEmail={service.technicianEmail}
                />

                <p className="mt-3 flex items-start justify-center gap-1.5 text-center text-xs text-slate-500">
                  <ShieldCheck className="mt-0.5 size-3.5 shrink-0" />
                  Payment is only requested after completion.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
