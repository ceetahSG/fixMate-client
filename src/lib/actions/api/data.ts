import "server-only";

import { authFetch, backendUrlFor } from "@/lib/auth-fetch";
import {
  isPublicService,
  normalizeApprovalStatus,
  normalizeService,
  sortByNewest,
  type ApiService,
  type MarketplaceService,
} from "@/lib/services";
import { normalizeBookingRecord, type BookingRecord } from "@/lib/booking-utils";

const normalizeServices = (data: unknown) =>
  Array.isArray(data)
    ? data.map((service) => ({
        ...service,
        approvalStatus: normalizeApprovalStatus(
          service?.approvalStatus ?? service?.status,
        ),
      }))
    : [];

const normalizeBookings = (data: unknown) =>
  Array.isArray(data)
    ? data.map((booking) => normalizeBookingRecord(booking as BookingRecord))
    : [];

// Let Next.js handle its own dynamic-rendering bailouts instead of logging
// them as service-loading failures during `next build`.
const isDynamicServerUsage = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "digest" in error &&
  (error as { digest?: unknown }).digest === "DYNAMIC_SERVER_USAGE";

/**
 * Technician-owned listings (all approval states). This is a private endpoint
 * because the public service listing only exposes approved + available items.
 */
export const getMyServices = async (_technicianEmail = "") => {
  const response = await authFetch(backendUrlFor("/api/services/mine"), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Could not load your services (${response.status}).`);
  }

  return normalizeServices(await response.json());
};

/** Public service catalogue. Intentionally unauthenticated. */
export const getServices = async (query = "") => {
  const url = query
    ? backendUrlFor(`/api/services?${query}`)
    : backendUrlFor("/api/services");
  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Could not load services (${response.status}).`);
  }

  return normalizeServices(await response.json());
};

export const getUsers = async () => {
  const response = await authFetch(backendUrlFor("/api/admin/users"), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Could not load users (${response.status}).`);
  }

  return response.json();
};

export const getMarketplaceServices = async (
  categoryName = "",
): Promise<MarketplaceService[]> => {
  try {
    const query = categoryName
      ? new URLSearchParams({ category: categoryName }).toString()
      : "";
    const data = await getServices(query);

    if (!Array.isArray(data)) return [];

    return (data as ApiService[])
      .map(normalizeService)
      .filter(isPublicService)
      .sort(sortByNewest);
  } catch (error) {
    if (isDynamicServerUsage(error)) throw error;

    console.error("Could not load marketplace services:", error);
    return [];
  }
};

export const getServiceById = async (serviceId: string) => {
  const response = await fetch(
    backendUrlFor(`/api/services/${encodeURIComponent(serviceId)}`),
  );

  if (!response.ok) {
    throw new Error(`Could not load the service (${response.status}).`);
  }

  return response.json();
};

export const getBookingByEmail = async (_email = "") => {
  const response = await authFetch(backendUrlFor("/api/bookings/my"), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Could not load bookings (${response.status}).`);
  }

  return normalizeBookings(await response.json());
};

export const getBookings = async () => {
  const response = await authFetch(backendUrlFor("/api/admin/bookings"), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Could not load bookings (${response.status}).`);
  }

  return normalizeBookings(await response.json());
};

export const getBookingByTechnicianEmail = async (_email = "") => {
  const response = await authFetch(
    backendUrlFor("/api/bookings/technician"),
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(`Could not load bookings (${response.status}).`);
  }

  return normalizeBookings(await response.json());
};

export const getPaymentHistory = async (email: string, role: string) => {
  const path =
    role.toLowerCase() === "admin" ? "/api/admin/payments" : "/api/payments";
  const response = await authFetch(backendUrlFor(path), {
    cache: "no-store",
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.message || "Could not fetch the payment history.");
  }
  return Array.isArray(result) ? result : [];
};
