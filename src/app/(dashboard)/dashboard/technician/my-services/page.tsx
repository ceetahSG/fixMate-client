import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getMyServices } from "@/lib/actions/api/data";
import type { TServiceData } from "@/types";
import MyServicesTable from "./MyServicesTable";

export const metadata = {
  title: "My Services | FixMate",
  description: "Manage your listings, availability, and approval status.",
};

export default async function MyServicesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const email = session?.user?.email ?? "";
  const rawServices = await getMyServices(email).catch(() => []);
  const services: TServiceData[] = Array.isArray(rawServices)
    ? rawServices
    : [];

  return <MyServicesTable initialServices={services} />;
}
