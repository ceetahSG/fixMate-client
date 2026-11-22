import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f5f7f4] p-5 sm:p-8" aria-label="Loading">
      <div className="mx-auto max-w-7xl space-y-6">
        <Skeleton className="h-8 w-56 bg-slate-200" />
        <Skeleton className="h-4 w-80 bg-slate-200" />
        <div className="grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-32 rounded-2xl bg-slate-200" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-2xl bg-slate-200" />
      </div>
    </div>
  );
}
