import { tBookingData, TServiceData } from "@/types";
const baseUrl = process.env.BACKEND_URL || "http://localhost:5000";

export const addService = async (serviceData: TServiceData) => {
  const response = await fetch(`${baseUrl}/services`, {
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
  const response = await fetch(`${baseUrl}/services/${serviceId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.message || "Could not update the service.");
  }
  return result;
};

export const deleteService = async (serviceId: string) => {
  console.log("Deleting service with ID:", serviceId);
  const response = await fetch(`${baseUrl}/delete-services/${serviceId}`, {
    method: "DELETE",
  });

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
  const response = await fetch(`${baseUrl}/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.message || "Could not update the user role.");
  }
  return result;
};

export const addBooking = async (bookingData: tBookingData) => {
  const response = await fetch(`${baseUrl}/bookings`, {
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