"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#f5f7f4] px-5 py-16">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-[#fff3df] text-[#c27803] shadow-sm">
          <AlertTriangle className="size-10" />
        </div>
        <p className="mt-8 text-sm font-bold tracking-[0.2em] text-[#c27803] uppercase">Something went wrong</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#172b2b] sm:text-5xl">
          We could not finish that repair.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-500">
          An unexpected error interrupted this page. Try again or return to FixMate home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#176b63] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#125851] focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none"
          >
            <RefreshCw className="size-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition-colors hover:border-[#176b63] hover:text-[#176b63] focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none"
          >
            <Home className="size-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
