"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import ServiceCard from "@/app/components/shared/ServiceCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getModeLabel,
  type MarketplaceService,
} from "@/lib/services";

type ServicesExplorerProps = {
  services: MarketplaceService[];
  initialCategory?: string;
};

type SortOption = "newest" | "price-low" | "price-high";

const sortLabels: Record<SortOption, string> = {
  newest: "Newest",
  "price-low": "Price: Low to High",
  "price-high": "Price: High to Low",
};

export default function ServicesExplorer({
  services,
  initialCategory = "",
}: ServicesExplorerProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory || "all");
  const [mode, setMode] = useState("all");
  const [sort, setSort] = useState<SortOption>("newest");

  const categories = useMemo(
    () =>
      Array.from(new Set(services.map((service) => service.category))).sort(
        (first, second) => first.localeCompare(second),
      ),
    [services],
  );

  const modes = useMemo(
    () =>
      Array.from(
        new Set(services.map((service) => getModeLabel(service.mode))),
      ).sort((first, second) => first.localeCompare(second)),
    [services],
  );

  const filteredServices = useMemo(() => {
    const search = query.trim().toLowerCase();
    const results = services.filter((service) => {
      const matchesSearch =
        !search ||
        [service.title, service.category, service.technicianName, service.area]
          .join(" ")
          .toLowerCase()
          .includes(search);
      const matchesCategory =
        category === "all" || service.category === category;
      const matchesMode =
        mode === "all" || getModeLabel(service.mode) === mode;

      return matchesSearch && matchesCategory && matchesMode;
    });

    return results.sort((first, second) => {
      if (sort === "price-low") return first.price - second.price;
      if (sort === "price-high") return second.price - first.price;

      return (
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime()
      );
    });
  }, [services, query, category, mode, sort]);

  function clearFilters() {
    setQuery("");
    setCategory("all");
    setMode("all");
    setSort("newest");
    router.replace("/services");
  }

  function changeCategory(value: string | null) {
    const nextCategory = value ?? "all";
    setCategory(nextCategory);

    if (nextCategory === "all") {
      router.replace("/services");
      return;
    }

    router.replace(
      `/services?category=${encodeURIComponent(nextCategory)}`,
    );
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#fafbf8] py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-[11px] font-bold tracking-[0.18em] text-[#176b63] uppercase">
            Repair marketplace
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-[34px]">
            Find the Right Repair Service
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Explore repair professionals and find the right service for your
            device.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs">
          <div className="grid gap-3 lg:flex lg:items-center">
            <div className="relative min-w-0 lg:flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by service title or category"
                aria-label="Search services"
                className="h-10 rounded-lg border-slate-300 bg-white pl-9 text-sm shadow-xs placeholder:text-slate-400"
              />
            </div>

            <Select
              value={category}
              onValueChange={changeCategory}
            >
              <SelectTrigger
                aria-label="Filter by category"
                className="h-10 w-full rounded-lg border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 shadow-xs lg:w-[250px]"
              >
                <SelectValue>
                  {(value) =>
                    value === "all" || !value ? "All Categories" : value
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent
                align="start"
                alignItemWithTrigger={false}
                className="max-h-72 rounded-lg border border-slate-200"
              >
                <SelectItem value="all" className="py-2">
                  All Categories
                </SelectItem>
                {categories.map((option) => (
                  <SelectItem key={option} value={option} className="py-2">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={mode}
              onValueChange={(value) => setMode(value ?? "all")}
            >
              <SelectTrigger
                aria-label="Filter by service mode"
                className="h-10 w-full rounded-lg border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 shadow-xs lg:w-[215px]"
              >
                <SelectValue>
                  {(value) =>
                    value === "all" || !value ? "All Modes" : value
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent
                align="start"
                alignItemWithTrigger={false}
                className="rounded-lg border border-slate-200"
              >
                <SelectItem value="all" className="py-2">
                  All Modes
                </SelectItem>
                {modes.map((option) => (
                  <SelectItem key={option} value={option} className="py-2">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={sort}
              onValueChange={(value) =>
                setSort((value ?? "newest") as SortOption)
              }
            >
              <SelectTrigger
                aria-label="Sort services"
                className="h-10 w-full rounded-lg border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 shadow-xs lg:w-[200px]"
              >
                <SelectValue>
                  {(value) => sortLabels[(value as SortOption) ?? "newest"]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent
                align="start"
                alignItemWithTrigger={false}
                className="rounded-lg border border-slate-200"
              >
                {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                  <SelectItem key={option} value={option} className="py-2">
                    {sortLabels[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-10 w-fit shrink-0 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-semibold text-slate-900 transition-colors hover:text-[#176b63] focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none"
            >
              <X className="size-4" />
              Clear
            </button>
          </div>
        </div>

        {filteredServices.length > 0 ? (
          <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
            <p className="text-sm font-medium text-slate-900">
              No services match your filters.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try a different search term or clear the filters.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
