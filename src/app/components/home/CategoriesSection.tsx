import Link from "next/link";
import {
  AirVent,
  ChevronRight,
  Laptop,
  Plug,
  Refrigerator,
  Smartphone,
  Tv,
  WashingMachine,
} from "lucide-react";

const categories = [
  {
    id: "smartphone",
    name: "Smartphone",
    description: "Screens, batteries & more",
    icon: Smartphone,
  },
  {
    id: "laptop-pc",
    name: "Laptop & PC",
    description: "Hardware and performance",
    icon: Laptop,
  },
  {
    id: "ac",
    name: "AC",
    description: "Cooling and installation",
    icon: AirVent,
  },
  {
    id: "refrigerator",
    name: "Refrigerator",
    description: "Cooling system repairs",
    icon: Refrigerator,
  },
  {
    id: "tv",
    name: "TV",
    description: "Display and sound issues",
    icon: Tv,
  },
  {
    id: "washing-machine",
    name: "Washing Machine",
    description: "Cleaning and maintenance",
    icon: WashingMachine,
  },
  {
    id: "electrical",
    name: "Electrical",
    description: "Safe home electrical work",
    icon: Plug,
  },
];

export default function CategoriesSection() {
  return (
    <section className="bg-[#f7f8f5] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#176b63]">
            BROWSE BY DEVICE
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-[34px]">
            Find Repair Services by Category
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={`/services?category=${cat.id}`}
                className="group flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs transition-all hover:border-[#176b63]/50 hover:shadow-xs sm:p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#eef5f3] text-[#176b63]">
                    <Icon className="size-5 stroke-[1.8]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-[#176b63]">
                      {cat.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <ChevronRight className="size-4 shrink-0 text-slate-400 transition-all group-hover:translate-x-0.5 group-hover:text-[#176b63]" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
