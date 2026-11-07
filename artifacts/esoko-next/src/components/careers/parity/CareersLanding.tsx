import type { PublicJob } from "@/lib/careers";
import { CareersListing } from "../CareersViews";
import {
  CareersHeroSection, WhyJoinSection, LifeAtEsokoSection, ProgrammesSection, RecruitmentProcessSection,
  BenefitsSection, DiversitySection, MeetTeamSection, FaqSection, FinalCtaSection,
} from "./CareersSections";

type Search = Record<string, string | string[] | undefined>;

/** Original CareersPage section order, with the server-rendered published-jobs browser at S4. */
export function CareersLanding({ jobs, search }: { jobs: PublicJob[]; search: Search }) {
  return (
    <main className="esoko-home careers-landing min-h-screen flex flex-col bg-white">
      <CareersHeroSection />
      <WhyJoinSection />
      <LifeAtEsokoSection />
      <CareersListing jobs={jobs} search={search} />
      <ProgrammesSection />
      <RecruitmentProcessSection />
      <BenefitsSection />
      <DiversitySection />
      <MeetTeamSection />
      <FaqSection />
      <FinalCtaSection />
    </main>
  );
}
