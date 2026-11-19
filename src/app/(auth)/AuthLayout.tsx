"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Wrench } from "lucide-react";

type AuthLayoutProps = {
  eyebrow?: string;
  heading: string;
  description?: string;
  children: React.ReactNode;
};

export default function AuthLayout({
  eyebrow = "REPAIRS, MADE DEPENDABLE",
  heading,
  description = "Discover skilled technicians, follow every repair, and keep the entire process in one place.",
  children,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white lg:flex-row">
      {/* Left Column: Atmospheric Brand & Hero Visual */}
      <div className="relative hidden w-full flex-col justify-between overflow-hidden bg-[#091f1b] p-10 lg:flex lg:w-1/2 lg:p-14 xl:p-16">
        {/* Background Image & Teal Atmospheric Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/images/auth-bg-clean.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#051714] via-[#09221e]/85 to-[#0a2723]/90" />

        {/* Top: Logo with White Icon Box & White Text */}
        <div className="relative z-10">
          <Link href="/" className="group inline-flex items-center gap-2.5">
            <div className="flex size-8.5 items-center justify-center rounded-[8px] bg-white text-[#176b63] shadow-md transition-transform group-hover:scale-[1.02]">
              <Wrench className="size-4.5 stroke-[2.2]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              FixMate
            </span>
          </Link>
        </div>

        {/* Middle: Value Proposition */}
        <div className="relative z-10 my-auto max-w-md py-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#71c3b8]">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white lg:text-[34px] lg:leading-[1.25]">
            {heading}
          </h1>
          <p className="mt-3 text-sm font-normal leading-relaxed text-slate-300/90">
            {description}
          </p>
        </div>

        {/* Bottom: Location & Brand Origin */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400">
          <span>FixMate · Dhaka, Bangladesh</span>
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div className="flex flex-1 flex-col justify-between overflow-y-auto bg-white p-6 sm:p-10 lg:p-14 xl:p-16">
        {/* Top: Back to home link */}
        <div className="w-full">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-[#176b63]"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </Link>
        </div>

        {/* Center: Main form container */}
        <div className="my-auto w-full max-w-[420px] mx-auto py-8">
          {children}
        </div>

        {/* Bottom spacer for layout balance */}
        <div className="hidden sm:block sm:h-6" />
      </div>
    </div>
  );
}
