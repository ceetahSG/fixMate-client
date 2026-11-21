import ServicesExplorer from "@/app/components/services/ServicesExplorer";
import { getMarketplaceServices } from "@/lib/actions/api/data";

export const metadata = {
  title: "Services | FixMate",
  description:
    "Explore trusted repair professionals and find the right service for your device.",
};

export default async function ServicesPage({
  searchParams,
}: {
  searchParams:
    | Promise<{ [key: string]: string | string[] | undefined }>
    | { [key: string]: string | string[] | undefined };
}) {
  const search = await searchParams;
  const categoryParam =
    typeof search.category === "string" ? search.category : "";
  const categoryAliases: Record<string, string> = {
    smartphone: "Smartphone",
    "laptop-pc": "Laptop & PC",
    ac: "AC",
    refrigerator: "Refrigerator",
    tv: "TV",
    "washing-machine": "Washing Machine",
    electrical: "Electrical",
  };
  const category =
    categoryAliases[categoryParam.toLowerCase()] ?? categoryParam;
  const services = await getMarketplaceServices(category);

  return (
    <ServicesExplorer
      key={category || "all"}
      services={services}
      initialCategory={category}
    />
  );
}
