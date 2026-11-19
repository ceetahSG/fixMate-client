import { CreditCard, FileText, Search, Wrench } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Find a Service",
    description: "Browse repair services and choose a suitable technician.",
    icon: Search,
  },
  {
    step: "02",
    title: "Send a Request",
    description: "Explain your device problem and submit a repair request.",
    icon: FileText,
  },
  {
    step: "03",
    title: "Technician Fixes It",
    description: "Track the job as your technician completes the repair.",
    icon: Wrench,
  },
  {
    step: "04",
    title: "Pay After Completion",
    description: "Pay securely once the repair is finished.",
    icon: CreditCard,
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-[#edf3f0] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#176b63]">
            HOW IT WORKS
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-[34px]">
            Repair Made Simple
          </h2>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            From search to successful repair in four clear steps.
          </p>
        </div>

        {/* 4 Steps Grid with Vertical Divider Lines */}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-slate-300/60">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className={`${
                  index === 0
                    ? "lg:pr-8"
                    : index === steps.length - 1
                    ? "lg:pl-8"
                    : "lg:px-8"
                } flex flex-col justify-between`}
              >
                <div>
                  {/* Top row: Step number and Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#176b63]">
                      {item.step}
                    </span>
                    <Icon className="size-4.5 text-[#176b63]" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-8 text-base font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
