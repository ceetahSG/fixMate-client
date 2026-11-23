"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const baseUrl = process.env.BACKEND_URL || "http://localhost:5000";

export const getToken = async () => {
  const jwtToken = await auth.api.getToken();
  if (!jwtToken || !jwtToken.token) {
    throw new Error("No session found. User might not be authenticated.");
  }
  return jwtToken.token;
};

export const authFetch = async (api: string) => {
  const token = await getToken();
  const res = await fetch(api, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  return res;
};

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
