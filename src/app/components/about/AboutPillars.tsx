import { ShieldCheck, UserRound, Wrench } from "lucide-react";

const pillars = [
  {
    icon: UserRound,
    title: "For customers",
    description:
      "Simple booking, visible progress, and payment at the right time.",
  },
  {
    icon: Wrench,
    title: "For technicians",
    description:
      "Focused tools for service listings and repair request management.",
  },
  {
    icon: ShieldCheck,
    title: "Built for trust",
    description:
      "Approval workflows and clear role permissions protect the experience.",
  },
];

export default function AboutPillars() {
  return (
    <section className="bg-[#f7f8f5] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="flex flex-col">
                <Icon className="size-5 text-[#176b63] stroke-[1.8]" />
                <h3 className="mt-3 text-base font-semibold text-slate-900">
                  {pillar.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
