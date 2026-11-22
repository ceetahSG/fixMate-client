import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen bg-[#f5f7f4]" aria-label="Loading">
      <Skeleton className="hidden w-64 rounded-none bg-[#1a4540] lg:block" />
      <main className="flex-1 space-y-6 p-5 sm:p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 bg-slate-200" />
            <Skeleton className="h-4 w-80 bg-slate-200" />
          </div>
          <Skeleton className="size-10 rounded-full bg-slate-200" />
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-32 rounded-2xl bg-slate-200" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-2xl bg-slate-200" />
      </main>
    </div>
  );
}
