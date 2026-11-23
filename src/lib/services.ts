import type { TServiceData } from "@/types";

export type ApiService = TServiceData & {
  id?: string;
  serviceImage?: string;
  status?: string;
};

export type MarketplaceService = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  price: number;
  mode: string;
  area: string;
  technicianName: string;
  technicianEmail: string;
  estimatedDuration: string;
  approvalStatus: "Pending" | "Approved" | "Rejected";
  isAvailable: boolean;
  createdAt: string;
};

const modeLabels: Record<string, string> = {
  "In-Store": "Shop Drop-off",
  "On-Site": "Home Visit",
  Online: "Remote",
  Remote: "Remote",
};

export type ServiceApprovalStatus = "Pending" | "Approved" | "Rejected";

/**
 * The backend stores approval values in lowercase while the UI expects the
 * capitalised labels. Normalise both shapes to capitalised labels.
 */
export function normalizeApprovalStatus(
  value: unknown,
): ServiceApprovalStatus {
  const normalized = String(value ?? "").trim().toLowerCase();

  if (normalized === "approved") return "Approved";
  if (normalized === "rejected") return "Rejected";

  return "Pending";
}

export function normalizeServiceApproval<T extends { approvalStatus?: unknown; status?: unknown }>(
  service: T,
) {
  return {
    ...service,
    approvalStatus: normalizeApprovalStatus(
      service.approvalStatus ?? service.status,
    ),
  };
}

export function getModeLabel(mode: string) {
  return modeLabels[mode] ?? mode;
}

export function formatServicePrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(price) ? price : 0);
}

export function normalizeService(service: ApiService): MarketplaceService {
  return {
    id:
      service._id ??
      service.id ??
      `${service.title}-${service.technicianEmail}`,
    title: service.title,
    category: service.category,
    description: service.description,
    image:
      service.image ||
      service.serviceImage ||
      "/images/hero-repair-clean.jpg",
    price: Number(service.basePrice) || 0,
    mode: service.serviceMode || "In-Store",
    area: service.serviceArea || "Bangladesh",
    technicianName: service.technicianName || "FixMate Technician",
    technicianEmail: service.technicianEmail || "",
    estimatedDuration: service.estimatedDuration || "Varies",
    approvalStatus: normalizeApprovalStatus(
      service.approvalStatus ?? service.status,
    ),
    isAvailable: service.isAvailable !== false,
    createdAt: service.createdAt || new Date(0).toISOString(),
  };
}

export function isPublicService(service: MarketplaceService) {
  return service.approvalStatus === "Approved" && service.isAvailable;
}

export function sortByNewest(
  first: MarketplaceService,
  second: MarketplaceService,
) {
  return (
    new Date(second.createdAt).getTime() -
    new Date(first.createdAt).getTime()
  );
}
