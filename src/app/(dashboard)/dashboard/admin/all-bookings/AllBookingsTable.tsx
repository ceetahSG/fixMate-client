"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Eye, MoreHorizontal, Search, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { BookingRecord } from "./page";

type BookingStatus = "Requested" | "In Progress" | "Completed" | "Cancelled";
type StatusFilter = BookingStatus | "All";

const statusStyles: Record<BookingStatus, string> = {
  Requested: "border-[#d6e4ff] bg-[#eef4ff] text-[#2563eb]",
  "In Progress": "border-[#fae3b8] bg-[#fef6e7] text-[#c27803]",
  Completed: "border-[#c4e8de] bg-[#e8f6f2] text-[#176b63]",
  Cancelled: "border-[#f7c9c9] bg-[#fdf0f0] text-[#c0392b]",
};

const statusOptions: StatusFilter[] = [
  "All",
  "Requested",
  "In Progress",
  "Completed",
  "Cancelled",
];

function getStatusLabel(status: string): BookingStatus {
  if (status === "completed") return "Completed";
  if (status === "in-progress" || status === "accepted") return "In Progress";
  if (status === "cancelled" || status === "canceled" || status === "rejected") {
    return "Cancelled";
  }

  return "Requested";
}

function getAmount(booking: BookingRecord) {
  const finalAmount = Number(booking.finalAmount);
  if (Number.isFinite(finalAmount) && finalAmount > 0) return finalAmount;

  const basePrice = Number(booking.basePrice);
  return Number.isFinite(basePrice) ? basePrice : 0;
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function AllBookingsTable({
  bookings,
}: {
  bookings: BookingRecord[];
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [activeBooking, setActiveBooking] = useState<BookingRecord | null>(null);

  const filteredBookings = useMemo(() => {
    const search = query.trim().toLowerCase();

    return bookings.filter((booking) => {
      const status = getStatusLabel(booking.status);
      const matchesSearch =
        !search ||
        booking.serviceTitle.toLowerCase().includes(search) ||
        booking.category.toLowerCase().includes(search) ||
        booking.customerName.toLowerCase().includes(search) ||
        booking.technicianName.toLowerCase().includes(search);

      return (
        matchesSearch &&
        (statusFilter === "All" || status === statusFilter)
      );
    });
  }, [bookings, query, statusFilter]);

  function clearFilters() {
    setQuery("");
    setStatusFilter("All");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          All Platform Bookings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          A read-only view of repair activity across FixMate.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-[375px]">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search bookings"
              aria-label="Search bookings"
              className="h-10 rounded-lg border-slate-300 bg-white pl-9 text-sm shadow-xs placeholder:text-slate-400"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter((value ?? "All") as StatusFilter)
            }
          >
            <SelectTrigger
              aria-label="Filter by status"
              className="h-10 w-full rounded-lg border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 shadow-xs sm:w-[140px]"
            >
              <SelectValue>
                {(value) => (value === "All" ? "All Statuses" : value)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false}>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status} className="py-2">
                  {status === "All" ? "All Statuses" : status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <button
            type="button"
            onClick={clearFilters}
            className="w-fit rounded-md px-1 py-2 text-sm font-semibold text-slate-900 transition-colors hover:text-[#176b63] focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none sm:ml-3"
          >
            Clear Filters
          </button>
        </div>

        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow className="border-y border-slate-100 bg-[#f7f8f7] hover:bg-[#f7f8f7]">
              <TableHead className="h-11 w-[45%] pl-6 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                Service
              </TableHead>
              <TableHead className="h-11 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                Customer
              </TableHead>
              <TableHead className="h-11 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                Status
              </TableHead>
              <TableHead className="h-11 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                Amount
              </TableHead>
              <TableHead className="h-11 pr-6 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking, index) => {
                const status = getStatusLabel(booking.status);
                const bookingId = booking._id ?? `${booking.serviceId}-${index}`;

                return (
                  <TableRow
                    key={bookingId}
                    className="border-slate-100 hover:bg-slate-50/60"
                  >
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-2.5">
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          <Image
                            src={booking.serviceImage || "/images/hero-repair.jpg"}
                            alt={booking.serviceTitle}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">
                            {booking.serviceTitle}
                          </p>
                          <p className="text-xs text-slate-400">
                            {booking.category} · {booking.technicianName}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-sm text-slate-700">
                      {booking.customerName}
                    </TableCell>
                    <TableCell className="py-4">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                          statusStyles[status],
                        )}
                      >
                        {status}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 font-semibold text-slate-900">
                      {formatAmount(getAmount(booking))}
                    </TableCell>
                    <TableCell className="py-4 pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          aria-label={`Actions for ${booking.serviceTitle}`}
                          className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none"
                        >
                          <MoreHorizontal className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" sideOffset={6}>
                          <DropdownMenuItem
                            onClick={() => setActiveBooking(booking)}
                            className="gap-2 px-2 py-2 text-slate-700"
                          >
                            <Eye className="size-4 text-slate-500" />
                            View details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={5}
                  className="py-16 text-center text-sm text-slate-500"
                >
                  No bookings match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={activeBooking !== null}
        onOpenChange={(open) => !open && setActiveBooking(null)}
      >
        <DialogContent
          showCloseButton={false}
          className="w-[calc(100%-2rem)] max-w-[460px] gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl ring-0"
        >
          {activeBooking ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <DialogTitle className="text-base font-semibold text-slate-900">
                  Booking details
                </DialogTitle>
                <DialogClose className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">
                  <X className="size-4.5" />
                  <span className="sr-only">Close</span>
                </DialogClose>
              </div>

              <div className="space-y-4 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <Image
                      src={activeBooking.serviceImage || "/images/hero-repair.jpg"}
                      alt={activeBooking.serviceTitle}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">
                      {activeBooking.serviceTitle}
                    </p>
                    <p className="text-xs text-slate-400">
                      {activeBooking.category}
                    </p>
                  </div>
                </div>

                <dl className="divide-y divide-slate-100 rounded-lg border border-slate-200 text-sm">
                  <div className="flex items-center justify-between px-4 py-3">
                    <dt className="text-slate-500">Booking ID</dt>
                    <dd className="font-medium text-slate-900">
                      {activeBooking._id ?? "Unavailable"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <dt className="text-slate-500">Customer</dt>
                    <dd className="font-medium text-slate-900">
                      {activeBooking.customerName}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <dt className="text-slate-500">Status</dt>
                    <dd>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                          statusStyles[getStatusLabel(activeBooking.status)],
                        )}
                      >
                        {getStatusLabel(activeBooking.status)}
                      </span>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <dt className="text-slate-500">Amount</dt>
                    <dd className="font-semibold text-slate-900">
                      {formatAmount(getAmount(activeBooking))}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="flex items-center justify-end border-t border-slate-200 px-6 py-5">
                <DialogClose className="inline-flex h-10 items-center justify-center rounded-lg bg-[#176b63] px-5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#125851]">
                  Close
                </DialogClose>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}