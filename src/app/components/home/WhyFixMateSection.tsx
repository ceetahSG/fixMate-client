import Link from "next/link";
import {
  CalendarCheck,
  CircleDollarSign,
  ClipboardCheck,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    title: "Verified Technicians",
    description: "Find skilled professionals with clear service information.",
    icon: ShieldCheck,
  },
  {
    title: "Transparent Progress",
    description: "Follow each repair from request through completion.",
    icon: ClipboardCheck,
  },
  {
    title: "Pay After Completion",
    description: "Payment is available only after the work is complete.",
    icon: CircleDollarSign,
  },
  {
    title: "Convenient Booking",
    description: "Choose a service, preferred date, and describe your problem.",
    icon: CalendarCheck,
  },
];

export default function WhyFixMateSection() {
  return (
    <section className="bg-[#176b63] py-16 text-white sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Heading, Subtitle & Action Button */}
          <div className="lg:col-span-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#84d6ca]">
              WHY FIXMATE
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[40px] lg:leading-[1.18]">
              Clarity at every stage of <br className="hidden sm:inline" />
              your repair.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-200/90 sm:text-base">
              A practical repair experience designed around transparency,
              sensible permissions, and simple next steps.
            </p>

            <div className="mt-8">
              <Link
                href="/about"
                className="inline-flex items-center rounded-lg bg-white px-5 py-2.5 text-xs font-semibold text-[#176b63] shadow-xs transition-colors hover:bg-slate-100 sm:text-sm"
              >
                Learn about FixMate
              </Link>
            </div>
          </div>

          {/* Right Column: 2x2 Features Grid */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-7">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex items-start gap-4">
                  {/* Outlined Icon Box */}
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/20 text-white">
                    <Icon className="size-5 stroke-[1.8]" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white sm:text-base">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-200/80 sm:text-[13px]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
