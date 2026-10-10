import { useEffect } from 'react';
import { Navbar } from '@/components/nav/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { TrustSection } from '@/components/sections/TrustSection';
import { WhoWeAreSection } from '@/components/sections/WhoWeAreSection';
import { WhyEsokoSection } from '@/components/sections/WhyEsokoSection';
import { SolutionsSection } from '@/components/sections/SolutionsSection';
import { PlatformDemoSection } from '@/components/sections/PlatformDemoSection';
import { SectorsSection } from '@/components/sections/SectorsSection';
import { ImpactSection } from '@/components/sections/ImpactSection';
import { CustomerStoriesSection } from '@/components/sections/CustomerStoriesSection';
import { DeveloperSection } from '@/components/sections/DeveloperSection';
import { ResourcesSection } from '@/components/sections/ResourcesSection';
import { LeadershipSection } from '@/components/sections/LeadershipSection';
import { PartnersSection } from '@/components/sections/PartnersSection';
import { CareersSection } from '@/components/sections/CareersSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Footer } from '@/components/Footer';
import { FloatingCTA } from '@/components/FloatingCTA';

export default function HomePage() {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;

    requestAnimationFrame(() => {
      document.getElementById(decodeURIComponent(id))?.scrollIntoView({
        behavior: 'auto',
        block: 'start',
      });
    });
  }, []);

  return (
    <div className="min-h-screen w-full bg-background flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />
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
        <ContactSection />
      </main>

      <Footer />
      <FloatingCTA />
    </div>
  );
}
