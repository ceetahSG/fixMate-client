import ServicesExplorer from "@/app/components/services/ServicesExplorer";
import { getMarketplaceServices } from "@/lib/actions/api/data";

export const metadata = {
  title: "Services | FixMate",
  description:
    "Explore trusted repair professionals and find the right service for your device.",
};

export default async function ServicesPage() {
  const services = await getMarketplaceServices();

  return <ServicesExplorer services={services} />;
}
