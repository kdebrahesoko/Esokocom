import './_group.css';
import './_Current.css';
import { HeroCarousel } from './_CurrentHero';
import { WhoWeAreSection } from './_CurrentWho';
import { WhyEsokoSection } from './_CurrentWhy';

/**
 * Extracted real source, not a hand-rebuilt approximation. The only adaptations
 * are sandbox imports, static final counters instead of react-countup, and an
 * explicit approved-photo substitution. No unconsented image is copied.
 */
export function Current() {
  return <div className="esoko-direction current-source">
    <p className="source-notice">Current structure · approved no-face photo substituted · source animation/copy retained for reference, not a new recommendation</p>
    <HeroCarousel />
    <WhoWeAreSection />
    <WhyEsokoSection />
  </div>;
}
