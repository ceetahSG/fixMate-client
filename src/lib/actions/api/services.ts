"use server";

import { tBookingData, TServiceData } from "@/types";
import "server-only";

import { authFetch, backendUrlFor } from "@/lib/auth-fetch";

export const addService = async (serviceData: TServiceData) => {
  const response = await authFetch(backendUrlFor("/api/services"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serviceData),
  });
  return response.json();
};

export const updateService = async (
  serviceId: string,
  updatedData: Partial<TServiceData>,
) => {
  const response = await authFetch(
    backendUrlFor(`/api/services/${encodeURIComponent(serviceId)}`),
    {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
    },
  );

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.message || "Could not update the service.");
  }
  return result;
};

export const updateServiceApproval = async (
  serviceId: string,
  approvalStatus: "Approved" | "Rejected",
) => {
  const response = await authFetch(
    backendUrlFor(
      `/api/admin/services/${encodeURIComponent(serviceId)}/approval`,
    ),
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ approvalStatus }),
    },
  );

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.message || "Could not update service approval.");
  }
  return result;
};

export const deleteService = async (serviceId: string) => {
  const response = await authFetch(
    backendUrlFor(`/api/services/${encodeURIComponent(serviceId)}`),
    {
    method: "DELETE",
    },
  );

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result?.message || "Could not delete the service.");
  }
  return result;
};

export const updateUsers = async (
  userId: string,
  updatedData: Partial<{ role: "Customer" | "Technician" | "Admin" }>,
) => {
  const response = await authFetch(
    backendUrlFor(`/api/admin/users/${encodeURIComponent(userId)}/role`),
    {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
    },
  );

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.message || "Could not update the user role.");
  }
  return result;
};

export const addBooking = async (bookingData: tBookingData) => {
  const existingResponse = await authFetch(backendUrlFor("/api/bookings/my"), {
    cache: "no-store",
  });

  if (existingResponse.ok) {
    const existing = await existingResponse.json().catch(() => []);
    const activeStatuses = new Set([
      "pending",
      "requested",
      "accepted",
      "in progress",
      "in-progress",
    ]);
    const alreadyBooked =
      Array.isArray(existing) &&
      existing.some(
        (booking) =>
          String(booking?.serviceId) === String(bookingData.serviceId) &&
          activeStatuses.has(String(booking?.status).trim().toLowerCase()),
      );

    if (alreadyBooked) {
      throw new Error("You have already booked this service.");
    }
  }

  const response = await authFetch(backendUrlFor("/api/bookings"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.message || "Could not submit the booking.");
  }
  return result;
};

export const confirmPayment = async (sessionId: string) => {
  const response = await authFetch(backendUrlFor("/api/payments/confirm"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId }),
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.message || "Could not confirm the payment.");
  }
  return result;
};

export async function updateProfile(profile: {
  name?: string;
  phone?: string;
  address?: string;
  image?: string;
}) {
  const response = await authFetch(backendUrlFor("/api/users/profile"), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profile),
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.message || "Could not update your profile.");
  }
  return result;
}
