import type { Metadata } from "next";
import "./home.css";
import { HashScroll } from "@/components/home/HashScroll";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { WhoWeAreSection } from "@/components/home/sections/WhoWeAreSection";
import { WhyEsokoSection } from "@/components/home/sections/WhyEsokoSection";
import { SolutionsSection } from "@/components/home/sections/SolutionsSection";
import { PlatformDemoSection } from "@/components/home/sections/PlatformDemoSection";
import { SectorsSection } from "@/components/home/sections/SectorsSection";
import { ImpactSection } from "@/components/home/sections/ImpactSection";
import { TrustSection } from "@/components/home/sections/TrustSection";
import { CustomerStoriesSection } from "@/components/home/sections/CustomerStoriesSection";
import { DeveloperSection } from "@/components/home/sections/DeveloperSection";
import { ResourcesSection } from "@/components/home/sections/ResourcesSection";
import { LeadershipSection } from "@/components/home/sections/LeadershipSection";
import { PartnersSection } from "@/components/home/sections/PartnersSection";
import { CareersSection } from "@/components/home/sections/CareersSection";
import { ContactHandoffSection } from "@/components/home/sections/ContactHandoffSection";
import { FloatingCTA } from "@/components/home/FloatingCTA";

export const metadata: Metadata = {
  title: "Esoko | Digital Tools for African Agriculture",
  description:
    "Esoko connects farmers to opportunity with field data collection, farmer messaging in local languages, marketplace access and climate intelligence across Africa.",
};

// Server entry: shared header/footer come from the root layout.
export default function HomePage() {
  return (
    <div className="esoko-home min-h-screen w-full bg-background flex flex-col font-sans">
      <HashScroll />
      <main id="main-content" className="flex-1">
        <HeroCarousel />
        <WhoWeAreSection />
        <WhyEsokoSection />
        <SolutionsSection />
        <PlatformDemoSection />
        <SectorsSection />
        <ImpactSection />
        <TrustSection />
        <CustomerStoriesSection />
        <DeveloperSection />
        <ResourcesSection />
        <LeadershipSection />
        <PartnersSection />
        <CareersSection />
        <ContactHandoffSection />
      </main>
      <FloatingCTA />
    </div>
  );
}
