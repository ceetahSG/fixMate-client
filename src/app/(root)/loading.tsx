import { Skeleton } from "@/components/ui/skeleton";

export default function PublicLoading() {
  return (
    <div className="min-h-[70vh] bg-white" aria-label="Loading">
      <Skeleton className="h-[46vh] w-full rounded-none bg-slate-100" />
      <div className="mx-auto max-w-7xl space-y-5 px-5 py-10 sm:px-8">
        <Skeleton className="h-8 w-64 bg-slate-200" />
        <Skeleton className="h-4 w-full max-w-xl bg-slate-200" />
        <div className="grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-36 rounded-2xl bg-slate-200" />
          ))}
        </div>
      </div>
    </div>
  );
}
