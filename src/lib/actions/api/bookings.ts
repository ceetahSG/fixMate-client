"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { authFetch, backendUrlFor } from "@/lib/auth-fetch";

export type BookingStatusUpdate =
  | "accepted"
  | "rejected"
  | "completed"
  | "in-progress";

export async function deleteBooking(bookingId: string) {
  const response = await authFetch(
    backendUrlFor(`/api/bookings/${encodeURIComponent(bookingId)}/cancel`),
    {
      method: "PATCH",
    },
  );

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.message || "Could not delete the booking.");
  }

  revalidatePath("/dashboard/customer/my-booking");
  return result;
}

export const updateBookingStatus = async (
  bookingId: string,
  status: BookingStatusUpdate,
) => {
  const response = await authFetch(
    backendUrlFor(`/api/bookings/${encodeURIComponent(bookingId)}/status`),
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    },
  );

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.message || "Could not update the booking status.");
  }

  revalidatePath("/dashboard/customer/my-booking");
  revalidatePath("/dashboard/technician/manage-request");
  return { ...result, status };
};
