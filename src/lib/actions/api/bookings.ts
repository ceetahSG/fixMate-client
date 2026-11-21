"use server";

import { revalidatePath } from "next/cache";

const baseUrl = process.env.BACKEND_URL || "http://localhost:5000";

export async function deleteBooking(bookingId: string) {
  const response = await fetch(`${baseUrl}/bookings/${bookingId}`, {
    method: "DELETE",
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.message || "Could not delete the booking.");
  }

  revalidatePath("/dashboard/customer/my-booking");
  return result;
}

export const updateBookingStatus = async (
  bookingId: string,
  status: "accepted" | "rejected" | "completed" | "in-progress",
) => {
  const response = await fetch(`${baseUrl}/bookings/${bookingId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.message || "Could not update the booking status.");
  }

  revalidatePath("/dashboard/customer/my-booking");
  revalidatePath("/dashboard/technician/manage-request");
  return result;
};
