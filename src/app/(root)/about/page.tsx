import AboutCta from "@/app/components/about/AboutCta";
import AboutHero from "@/app/components/about/AboutHero";
import AboutJourney from "@/app/components/about/AboutJourney";
import AboutPillars from "@/app/components/about/AboutPillars";
import AboutPlatform from "@/app/components/about/AboutPlatform";

export const metadata = {
  title: "About | FixMate",
  description:
    "Better repairs begin with a clearer process. FixMate brings customers and repair professionals together in one transparent service experience.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutPlatform />
      <AboutJourney />
      <AboutPillars />
      <AboutCta />
    </>
  );
}
