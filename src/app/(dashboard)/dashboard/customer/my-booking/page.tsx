import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getBookingByEmail } from "@/lib/actions/api/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { tBookingData } from "@/types";
import BookingAction from "./BookingAction";

export const metadata = {
  title: "My Bookings | FixMate",
  description:
    "Track every repair request and take action when it becomes available.",
};

type BookingRecord = tBookingData & { _id?: string };

const statusLabels: Record<string, string> = {
  requested: "Requested",
  "in-progress": "In Progress",
  completed: "Completed",
  rejected: "Rejected",
};

const statusStyles: Record<string, string> = {
  Requested: "border-[#d9e6ff] bg-[#eef4ff] text-[#2563eb]",
  "In Progress": "border-[#fae3b8] bg-[#fef6e7] text-[#c27803]",
  Completed: "border-[#c4e8de] bg-[#e8f6f2] text-[#176b63]",
  Cancelled: "border-[#f7c9c9] bg-[#fdf0f0] text-[#c0392b]",
};

const paymentLabels: Record<string, string> = {
  paid: "Paid",
  unpaid: "Unpaid",
};

const paymentStyles: Record<string, string> = {
  Paid: "border-[#c4e8de] bg-[#e8f6f2] text-[#176b63]",
  Unpaid: "border-[#f8d4d4] bg-[#fdf1f1] text-[#d64545]",
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

function getStatusLabel(status: string) {
  return statusLabels[status] ?? status;
}

function getPaymentLabel(paymentStatus: string) {
  return paymentLabels[paymentStatus] ?? paymentStatus;
}

export default async function MyBookingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const email = session?.user?.email;
  const rawBookings = email
    ? await getBookingByEmail(email).catch(() => [])
    : [];

  const bookings: BookingRecord[] = Array.isArray(rawBookings)
    ? rawBookings
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[28px] leading-tight font-semibold tracking-tight text-slate-900 sm:text-[32px]">
            My Bookings
          </h1>
          <p className="mt-2 text-[15px] text-slate-500">
            Track every repair request and take action when it becomes
            available.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex h-11 w-fit shrink-0 items-center justify-center rounded-lg bg-[#176b63] px-5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#125851] focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none"
        >
          Browse Services
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            All repair requests
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}{" "}
            in your account
          </p>
        </div>

        <div className="mt-5">
          <Table className="min-w-[980px]">
            <TableHeader>
              <TableRow className="border-y border-slate-100 bg-[#f7f8f7] hover:bg-[#f7f8f7]">
                <TableHead className="h-11 w-[29%] pl-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                  Service
                </TableHead>
                <TableHead className="h-11 w-[16%] text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                  Technician
                </TableHead>
                <TableHead className="h-11 w-[14%] text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                  Preferred Date
                </TableHead>
                <TableHead className="h-11 w-[14%] text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                  Status
                </TableHead>
                <TableHead className="h-11 w-[9%] text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                  Amount
                </TableHead>
                <TableHead className="h-11 w-[9%] text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                  Payment
                </TableHead>
                <TableHead className="h-11 w-[9%] pr-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {bookings.length > 0 ? (
                bookings.map((booking, index) => {
                  const status = getStatusLabel(booking.status);
                  const payment = getPaymentLabel(booking.paymentStatus);
                  const amount = Number.isFinite(booking.finalAmount)
                    ? booking.finalAmount
                    : booking.basePrice;

                  return (
                    <TableRow
                      key={booking._id ?? `${booking.serviceId}-${index}`}
                      className="border-slate-100 hover:bg-slate-50/60"
                    >
                      <TableCell className="py-4 pl-3">
                        <div className="flex items-center gap-3">
                          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                            <Image
                              src={
                                booking.serviceImage ||
                                "/images/hero-repair-clean.jpg"
                              }
                              alt={booking.serviceTitle}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[15px] font-semibold text-slate-900">
                              {booking.serviceTitle}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400">
                              {booking.category}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-4 text-sm text-slate-700">
                        {booking.technicianName}
                      </TableCell>

                      <TableCell className="py-4 text-sm text-slate-600">
                        {formatPreferredDate(booking.preferredDate)}
                      </TableCell>

                      <TableCell className="py-4">
                        <span
                          className={cn(
                            "inline-flex h-6 items-center rounded-full border px-2.5 text-xs font-semibold",
                            statusStyles[status] ??
                              "border-slate-200 bg-slate-50 text-slate-600",
                          )}
                        >
                          {status}
                        </span>
                      </TableCell>

                      <TableCell className="py-4 text-sm font-semibold text-slate-900">
                        {formatAmount(amount)}
                      </TableCell>

                      <TableCell className="py-4">
                        <span
                          className={cn(
                            "inline-flex h-6 items-center rounded-full border px-2.5 text-xs font-semibold",
                            paymentStyles[payment] ??
                              "border-slate-200 bg-slate-50 text-slate-600",
                          )}
                        >
                          {payment}
                        </span>
                      </TableCell>

                      <TableCell className="py-4 pr-3">
                        <BookingAction booking={booking} />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={7} className="py-16 text-center">
                    <p className="text-sm font-medium text-slate-900">
                      No repair requests yet.
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Browse services to book your first repair.
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
