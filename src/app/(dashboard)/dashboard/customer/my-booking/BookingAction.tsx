"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteBooking } from "@/lib/actions/api/bookings";
import type { tBookingData } from "@/types";
import { toast } from "@/components/ui/toast";

type BookingRecord = tBookingData & { _id?: string };

export default function BookingAction({
  booking,
}: {
  booking: BookingRecord;
}) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [actionError, setActionError] = useState("");

  async function handleCancel() {
    setActionError("");
    setIsCancelling(true);

    try {
      await deleteBooking(booking._id ?? "");
      toast.add({
        title: "Booking cancelled",
        description: "The repair request has been cancelled.",
        type: "success",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not cancel the booking.";
      setActionError(
        message,
      );
      toast.add({ title: "Could not cancel booking", description: message, type: "error" });
    } finally {
      setIsCancelling(false);
    }
  }

  if (booking.status === "requested") {
    return (
      <div className="space-y-1">
        <Button
          onClick={handleCancel}
          type="button"
          variant="outline"
          disabled={!booking._id || isCancelling}
          className="h-10 rounded-lg border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 shadow-xs hover:bg-slate-50"
        >
          {isCancelling ? "Cancelling..." : "Cancel"}
        </Button>
        {actionError ? (
          <p className="max-w-28 text-xs text-red-600">{actionError}</p>
        ) : null}
      </div>
    );
  }

  if (booking.status === "completed" && booking.paymentStatus === "unpaid") {
    return (
      <Link
        href={`/dashboard/customer/payment?bookingId=${encodeURIComponent(
          booking._id ?? "",
        )}`}
        className="inline-flex h-10 items-center justify-center rounded-lg bg-[#176b63] px-5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#125851] focus-visible:ring-2 focus-visible:ring-[#176b63]/30 focus-visible:outline-none"
      >
        Pay Now
      </Link>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      aria-label={`More actions for ${booking.serviceTitle}`}
      className="size-8 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"
    >
      <MoreHorizontal className="size-4" />
    </Button>
  );
}
