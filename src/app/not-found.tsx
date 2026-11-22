"use client";

import Link from "next/link";
import { ArrowLeft, Home, Wrench } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#f5f7f4] px-5 py-16">
      <div className="w-full max-w-xl text-center">
        <div className="relative mx-auto mb-8 flex size-36 items-center justify-center rounded-[2.5rem] border border-[#cfe3dc] bg-white shadow-sm">
          <div className="absolute -top-3 -right-3 flex size-12 rotate-12 items-center justify-center rounded-2xl bg-[#176b63] text-white shadow-lg">
            <Wrench className="size-6" />
          </div>
          <div className="flex size-20 items-center justify-center rounded-full bg-[#e6f2ee] text-[#176b63]">
            <span className="text-4xl font-bold">?</span>
          </div>
        </div>
        <p className="text-sm font-bold tracking-[0.2em] text-[#176b63] uppercase">404 error</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#172b2b] sm:text-5xl">
          This page needs a repair.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-500">
          The page you are looking for may have moved or is no longer available.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center gap-2 rounded-lg bg-[#176b63] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#125851] focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none"
        >
          <Home className="size-4" />
          Back to Home
        </Link>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mt-4 flex w-full items-center justify-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-[#176b63]"
        >
          <ArrowLeft className="size-4" />
          Go back
        </button>
      </div>
    </main>
  );
}
