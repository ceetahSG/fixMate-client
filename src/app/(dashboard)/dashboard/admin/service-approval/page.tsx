import { getServices } from "@/lib/actions/api/data";
import type { TServiceData } from "@/types";
import ServiceApprovalBoard from "./ServiceApprovalBoard";

export const metadata = {
  title: "Service Approval | FixMate",
};

export default async function ServiceApprovalPage() {
  const rawServices = await getServices().catch(() => []);
  const services: TServiceData[] = Array.isArray(rawServices)
    ? rawServices
    : [];

  return <ServiceApprovalBoard initialServices={services} />;
}
