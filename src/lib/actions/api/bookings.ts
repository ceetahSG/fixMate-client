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
