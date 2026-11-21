import {
  isPublicService,
  normalizeService,
  sortByNewest,
  type ApiService,
  type MarketplaceService,
} from "@/lib/services";

const baseUrl = process.env.BACKEND_URL || "http://localhost:5000";

export const getMyServices = async (technicianEmail: string) => {
  const response = await fetch(`${baseUrl}/services/${technicianEmail}`);
  return response.json();
};

export const getServices = async () => {
  const response = await fetch(`${baseUrl}/services`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Could not load services (${response.status}).`);
  }

  return response.json();
};

export const getUsers = async () => {
  const response = await fetch(`${baseUrl}/users`);
  return response.json();
};

export const getMarketplaceServices = async (): Promise<
  MarketplaceService[]
> => {
  try {
    const data = await getServices();

    if (!Array.isArray(data)) return [];

    return (data as ApiService[])
      .map(normalizeService)
      .filter(isPublicService)
      .sort(sortByNewest);
  } catch (error) {
    console.error("Could not load marketplace services:", error);
    return [];
  }
};

export const getServiceById = async (serviceId: string) => {
  const response = await fetch(`${baseUrl}/services/${serviceId}`);
  return response.json();
};
