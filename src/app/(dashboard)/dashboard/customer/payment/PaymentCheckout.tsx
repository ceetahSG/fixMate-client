"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  CircleCheckBig,
  Lock,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { tBookingData } from "@/types";

export type PaymentBooking = tBookingData & { _id?: string };

type PaymentCheckoutProps = {
  booking: PaymentBooking;
  amount: number;
};

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

function formatPreferredDate(value: string) {
  if (!value) return "—";

  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  const monthName = monthNames[month - 1];

  if (!year || !monthName || !day) return value;

  return `${monthName} ${day}, ${year}`;
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="gap-0 rounded-2xl border border-slate-200/80 bg-white py-0 shadow-2xs ring-0">
      <div className="border-b border-slate-100 px-6 py-5">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        ) : null}
      </div>
      <div className="px-6 py-6">{children}</div>
    </Card>
  );
}

export default function PaymentCheckout({
  booking,
  amount,
}: PaymentCheckoutProps) {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking._id,
          amount,
        }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.url) {
        throw new Error(result?.message || "Could not start Stripe checkout.");
      }

      window.location.assign(result.url);
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Could not start Stripe checkout.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_376px] lg:items-start lg:gap-8"
    >
      <div className="space-y-6">
        <SectionCard
          title="Payment method"
          description="All transactions are encrypted and securely processed."
        >
          <div className="flex items-center justify-between gap-4 rounded-xl border border-[#176b63]/25 bg-[#f4f9f7] p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white">
                <Lock className="size-4 text-[#176b63]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Stripe Checkout
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Pay with Visa, Mastercard, American Express, or supported
                  digital wallets.
                </p>
              </div>
            </div>
            <span className="text-[15px] leading-none font-bold tracking-tight text-[#635bff]">
              stripe
            </span>
          </div>

          {error ? (
            <p className="mt-4 text-sm font-medium text-red-600" role="alert">
              {error}
            </p>
          ) : null}
        </SectionCard>

        <SectionCard
          title="Billing details"
          description="We'll email your receipt to the address below."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="billing-name"
                className="flex items-center gap-2 text-slate-700"
              >
                <User className="size-3.5 text-slate-400" />
                Full name
              </Label>
              <Input
                id="billing-name"
                defaultValue={booking.customerName}
                readOnly
                className="h-11 rounded-lg border-slate-200 bg-[#f7f8f7] px-3.5 text-sm text-slate-600"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="billing-email"
                className="flex items-center gap-2 text-slate-700"
              >
                <Mail className="size-3.5 text-slate-400" />
                Email address
              </Label>
              <Input
                id="billing-email"
                type="email"
                defaultValue={booking.customerEmail}
                readOnly
                className="h-11 rounded-lg border-slate-200 bg-[#f7f8f7] px-3.5 text-sm text-slate-600"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label
                htmlFor="billing-phone"
                className="flex items-center gap-2 text-slate-700"
              >
                <Phone className="size-3.5 text-slate-400" />
                Phone number
              </Label>
              <Input
                id="billing-phone"
                type="tel"
                defaultValue={booking.customerPhone}
                readOnly
                className="h-11 rounded-lg border-slate-200 bg-[#f7f8f7] px-3.5 text-sm text-slate-600"
              />
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-500">
            These details come from your booking. Update your profile if you
            need a different billing contact.
          </p>
        </SectionCard>

        <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e8f1ee] text-[#176b63]">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Your payment is protected
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              FixMate uses Stripe to process payments. Your card details are
              encrypted and never stored on our servers.
            </p>
          </div>
        </div>
      </div>

      <aside className="lg:sticky lg:top-24">
        <Card className="gap-0 overflow-hidden rounded-2xl border border-t-[3px] border-slate-200/80 border-t-[#176b63] bg-white py-0 shadow-2xs ring-0">
          <div className="px-6 pt-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-slate-900">
                Order summary
              </h2>
              <span className="inline-flex h-6 items-center rounded-full border border-[#f8d4d4] bg-[#fdf1f1] px-2.5 text-xs font-semibold text-[#d64545]">
                Unpaid
              </span>
            </div>

            <div className="mt-5 flex items-start gap-3">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                <Image
                  src={booking.serviceImage || "/images/hero-repair-clean.jpg"}
                  alt={booking.serviceTitle}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="text-[15px] leading-snug font-semibold text-slate-900">
                  {booking.serviceTitle}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {booking.category}
                </p>
                <p className="mt-1.5 text-xs text-slate-500">
                  Technician: {booking.technicianName}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3 rounded-xl bg-[#f7f8f7] p-4">
              <div className="flex items-start gap-2.5">
                <CalendarDays className="mt-0.5 size-4 shrink-0 text-[#176b63]" />
                <div>
                  <p className="text-[11px] text-slate-500">Preferred date</p>
                  <p className="mt-0.5 text-sm font-medium text-slate-900">
                    {formatPreferredDate(booking.preferredDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#176b63]" />
                <div>
                  <p className="text-[11px] text-slate-500">Service address</p>
                  <p className="mt-0.5 text-sm font-medium text-slate-900">
                    {booking.address}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-5 bg-slate-100" />

            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500">Service amount</dt>
                <dd className="font-medium text-slate-900">
                  {formatAmount(amount)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500">Platform fee</dt>
                <dd className="font-medium text-slate-900">$0.00</dd>
              </div>
            </dl>

            <Separator className="my-4 bg-slate-100" />

            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Total due</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Including all applicable fees
                </p>
              </div>
              <p className="text-2xl leading-none font-bold tracking-tight text-slate-900">
                {formatAmount(amount)}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 bg-[#fbfcfb] p-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-lg bg-[#176b63] text-sm font-semibold text-white shadow-xs hover:bg-[#125851]"
            >
              <Lock className="size-4" />
              {isSubmitting
                ? "Redirecting to Stripe..."
                : `Pay ${formatAmount(amount)}`}
            </Button>

            <p className="mt-3 flex items-start justify-center gap-1.5 text-center text-xs leading-5 text-slate-500">
              <CircleCheckBig className="mt-0.5 size-3.5 shrink-0 text-[#176b63]" />
              You&apos;ll be redirected to Stripe to complete your payment
              securely.
            </p>

            <p className="mt-2 text-center text-[11px] leading-4 text-slate-400">
              By paying, you confirm the repair has been completed as expected.
            </p>
          </div>
        </Card>
      </aside>
    </form>
  );
}
