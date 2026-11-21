import HeroSection from "../components/home/HeroSection";
import PopularServicesSection from "../components/home/PopularServicesSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import CategoriesSection from "../components/home/CategoriesSection";
import WhyFixMateSection from "../components/home/WhyFixMateSection";
import CtaBannerSection from "../components/home/CtaBannerSection";
import { getMarketplaceServices } from "@/lib/actions/api/data";

export default async function Home() {
  const services = await getMarketplaceServices();

  return (
    <>
      <HeroSection />
      <PopularServicesSection services={services.slice(0, 6)} />
      <HowItWorksSection />
      <CategoriesSection />
      <WhyFixMateSection />
      <CtaBannerSection />
    </>
  );
}
