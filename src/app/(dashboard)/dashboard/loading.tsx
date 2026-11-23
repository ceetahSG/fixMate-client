import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6" aria-label="Loading" aria-busy="true">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 max-w-full bg-slate-200" />
          <Skeleton className="h-4 w-80 max-w-full bg-slate-200" />
        </div>
        <Skeleton className="size-10 shrink-0 rounded-full bg-slate-200" />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-32 rounded-2xl bg-slate-200" />
        ))}
      </div>

      <Skeleton className="h-96 rounded-2xl bg-slate-200" />
    </div>
  );
}
