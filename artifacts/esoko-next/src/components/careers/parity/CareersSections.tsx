import Image from "next/image";
import { ArrowRight, CheckCircle2, ChevronDown, Clock } from "lucide-react";
import { CONTACT_HREF } from "@/lib/site-links";
import { PROGRAMMES } from "./CareersData";
import {
  ASSET_BASE, BENEFITS, DI_HIGHLIGHTS, HERO_STATS, MOSAIC_IMAGES, PROCESS_STEPS, TESTIMONIALS, WHY_JOIN,
} from "./CareersStatic";
import { FaqList, LifeVideoButton, TeamGrid } from "./CareersIslands";

/* Server-rendered parity of the original esoko-website CareersPage marketing sections. */

const ORANGE_BTN = "inline-flex items-center justify-center bg-[#D9531E] hover:bg-[#C84B16] text-white rounded-full px-8 h-13 text-base font-semibold shadow-[0_8px_32px_rgba(217,83,30,0.45)] transition-colors";
const OUTLINE_BTN = "inline-flex items-center justify-center rounded-full px-8 h-13 text-base font-semibold border border-white/30 text-white hover:bg-white/10 bg-transparent transition-colors";

/* ══ S1 HERO ══ */
export function CareersHeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: "#051c0e" }}>
      <div className="absolute inset-0">
        <Image src={`${ASSET_BASE}/hero-slide-1.jpg`} alt="Esoko team at work" fill priority sizes="100vw" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#051c0e]/85 via-[#051c0e]/65 to-[#051c0e]/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#051c0e]/50 via-transparent to-[#051c0e]/30" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center py-40 md:py-52">
        <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-emerald-400 mb-6 bg-emerald-400/10 px-5 py-2 rounded-full border border-emerald-400/20">
          Careers at Esoko
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white max-w-5xl mx-auto leading-[1.06] mb-6">
          Build Technology That<br className="hidden md:block" />{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-[#D9531E] bg-clip-text text-transparent">
            Transforms Africa
          </span>
        </h1>

        <p className="text-lg md:text-xl text-white/65 max-w-2xl mx-auto mb-10 leading-relaxed">
          Join Esoko and help create digital solutions that connect millions of farmers, empower communities, and build a sustainable agricultural future.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a href="#open-positions" className={ORANGE_BTN}>View Open Positions <ArrowRight className="ml-2 w-4 h-4" /></a>
          <a href={CONTACT_HREF} className={`${OUTLINE_BTN} hover:border-white/50`}>Join Talent Community</a>
          <LifeVideoButton variant="hero" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto border-t border-white/10 pt-10">
          {HERO_STATS.map(s => (
            <div key={s.label} className="flex flex-col items-center">
              <p className="text-3xl md:text-4xl font-heading font-bold text-white">{s.display ?? `${s.num.toLocaleString("en-US")}${s.unit}`}</p>
              <p className="text-white/50 text-xs mt-1 text-center">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2" aria-hidden="true">
        <ChevronDown className="w-6 h-6 text-white/30 motion-safe:animate-bounce" />
      </div>
    </section>
  );
}

/* ══ S2 WHY JOIN ══ */
export function WhyJoinSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-600 mb-4 bg-emerald-50 px-5 py-2 rounded-full border border-emerald-100">
            Why Esoko
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">Why Join Esoko?</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Work with passionate people solving meaningful challenges across agriculture, technology, and sustainability.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_JOIN.map(c => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                className="group relative bg-white border border-gray-100 rounded-3xl p-7 shadow-[0_4px_24px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)] hover:border-gray-200 cursor-default"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.grad} flex items-center justify-center mb-5 shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading font-bold text-gray-900 text-lg mb-2">{c.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{c.desc}</p>
                <div className={`absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 pointer-events-none bg-gradient-to-br ${c.grad} group-hover:opacity-[0.04]`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ══ S3 LIFE AT ESOKO ══ */
export function LifeAtEsokoSection() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #061a0d 0%, #0a2010 100%)" }}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-4 bg-emerald-400/10 px-5 py-2 rounded-full border border-emerald-400/20">
            Our Culture
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Life at Esoko</h2>
          <p className="text-white/50 max-w-xl mx-auto">
            From Accra to the field, we are building something extraordinary — together.
          </p>
        </div>

        <div className="grid grid-cols-3 grid-rows-2 gap-3 h-[420px] mb-16 rounded-3xl overflow-hidden">
          {MOSAIC_IMAGES.map((img, i) => (
            <div key={i} className={`relative overflow-hidden ${img.cls}`}>
              <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 33vw, 50vw" className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-7 hover:border-white/20 transition-colors">
              <p className="text-white/80 text-sm leading-relaxed italic mb-6">&quot;{t.quote}&quot;</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.grad} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-xs font-bold">{t.initials}</span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{t.name}</p>
                  <p className="text-white/40 text-xs">{t.role} · {t.dept}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative mx-auto max-w-4xl group">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)] border border-white/15 transition-transform duration-500 group-hover:scale-[1.012]">
            <Image src={`${ASSET_BASE}/hero-slide-2.jpg`} alt="Life at Esoko" fill sizes="(min-width: 1024px) 896px, 100vw" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <LifeVideoButton variant="card" />
            </div>
            <div className="absolute bottom-6 left-7 pointer-events-none">
              <p className="text-white font-heading font-bold text-xl">Life at Esoko</p>
              <p className="text-white/50 text-sm">See what drives us every day</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══ S5 INTERNSHIP & GRADUATE ══ */
export function ProgrammesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#D9531E]/80 mb-4 bg-orange-50 px-5 py-2 rounded-full border border-orange-100">
            Early Careers
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
            Start Your Technology Journey With Esoko
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Develop your skills while contributing to meaningful digital agriculture solutions that change lives.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROGRAMMES.map(p => (
            <div
              key={p.id}
              className="relative bg-white border border-gray-100 rounded-3xl p-7 shadow-[0_4px_24px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-300"
            >
              <span className={`text-xs font-semibold px-3 py-1 rounded-full mb-4 inline-block ${p.type === "Internship" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}`}>
                {p.type}
              </span>
              <h3 className="font-heading font-bold text-gray-900 text-lg mb-1">{p.title}</h3>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                <Clock className="w-3.5 h-3.5" /> {p.duration}
              </div>
              <p className="text-sm text-gray-500 mb-4"><span className="font-medium text-gray-700">Eligibility:</span> {p.eligibility}</p>
              <ul className="space-y-1.5 mb-6">
                {p.outcomes.map(o => (
                  <li key={o} className="flex items-start gap-2 text-xs text-gray-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" /> {o}
                  </li>
                ))}
              </ul>
              <a href="#open-positions" className="inline-flex items-center justify-center w-full h-9 text-sm font-medium rounded-xl border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors">
                Apply Now
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══ S6 RECRUITMENT PROCESS ══ */
export function RecruitmentProcessSection() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #061a0d 0%, #0a2010 100%)" }}>
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-4 bg-emerald-400/10 px-5 py-2 rounded-full border border-emerald-400/20">
            The Process
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Our Recruitment Process</h2>
          <p className="text-white/50 max-w-xl mx-auto">Simple, transparent, and respectful of your time — typically 3 to 5 weeks end to end.</p>
        </div>
        <div className="overflow-x-auto hide-scrollbar pb-6">
          <div className="relative flex items-start min-w-max px-6 md:px-12 gap-0">
            <div className="absolute top-8 left-20 right-20 h-px bg-white/10" aria-hidden="true" />
            <div className="absolute top-8 left-20 right-20 h-px bg-gradient-to-r from-emerald-500 to-[#D9531E]" aria-hidden="true" />
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.num} className="relative flex flex-col items-center w-40 flex-shrink-0">
                <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-4
                  ${i === 6 ? "bg-gradient-to-br from-[#D9531E] to-[#C84B16] shadow-[0_0_24px_rgba(217,83,30,0.5)]" : "bg-white/10 border border-white/20 backdrop-blur-sm"}`}>
                  <span className={`font-heading font-bold text-sm ${i === 6 ? "text-white" : "text-emerald-400"}`}>{step.num}</span>
                </div>
                <h3 className={`text-sm font-bold text-center mb-1.5 ${i === 6 ? "text-[#D9531E]" : "text-white"}`}>{step.title}</h3>
                <p className="text-white/40 text-[11px] text-center leading-relaxed px-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══ S7 BENEFITS ══ */
export function BenefitsSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-600 mb-4 bg-emerald-50 px-5 py-2 rounded-full border border-emerald-100">
            Perks & Benefits
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">We Take Care of Our Team</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Competitive, comprehensive benefits to support your work, health, and growth.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {BENEFITS.map(b => {
            const Icon = b.icon;
            return (
              <div key={b.label} className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-emerald-100 hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] transition-all duration-300 hover:-translate-y-0.5 group">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center mb-3 transition-colors">
                  <Icon className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="font-semibold text-gray-800 text-sm mb-1">{b.label}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ══ S8 DIVERSITY & INCLUSION ══ */
export function DiversitySection() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0">
        <Image src={`${ASSET_BASE}/hero-slide-4.jpg`} alt="Diverse Esoko team" fill sizes="100vw" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#042B10]/97 via-[#042B10]/85 to-[#042B10]/70" />
      </div>
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-2xl">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-5 bg-emerald-400/10 px-5 py-2 rounded-full border border-emerald-400/20">
            Diversity & Inclusion
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6 leading-[1.1]">
            Innovation Happens When<br className="hidden md:block" /> Everyone Belongs
          </h2>
          <p className="text-white/65 text-lg leading-relaxed mb-10">
            Esoko values diverse perspectives and creates an inclusive environment where people from different backgrounds can contribute, grow, and succeed. Our team of 30+ nationalities is our greatest strength.
          </p>
          <div className="flex flex-wrap gap-3">
            {DI_HIGHLIGHTS.map(h => (
              <span key={h} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-5 py-2 rounded-full">
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══ S9 MEET THE TEAM ══ */
export function MeetTeamSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-600 mb-4 bg-emerald-50 px-5 py-2 rounded-full border border-emerald-100">
            The People
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">Meet Our Team</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Talented people from across Africa and beyond — united by a mission to transform agriculture.</p>
        </div>
        <TeamGrid />
      </div>
    </section>
  );
}

/* ══ S10 FAQ ══ */
export function FaqSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-600 mb-4 bg-emerald-50 px-5 py-2 rounded-full border border-emerald-100">
            FAQs
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">Common Questions</h2>
          <p className="text-gray-500">Everything you need to know about working at Esoko.</p>
        </div>
        <FaqList />
      </div>
    </section>
  );
}

/* ══ FINAL CTA ══ */
export function FinalCtaSection() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0">
        <Image src={`${ASSET_BASE}/hero-slide-5.jpg`} alt="Future of African agriculture" fill sizes="100vw" className="w-full h-full object-cover animate-hero-zoom" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#042B10]/90 via-[#042B10]/80 to-[#042B10]/95" />
      </div>
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-6 bg-emerald-400/10 px-5 py-2 rounded-full border border-emerald-400/20">
            Join the Mission
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6 leading-[1.1]">
            Ready to Build the<br className="hidden md:block" /> Future of Agriculture?
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
            Your next role could help feed millions. Take a look at our open positions and find where you belong.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#open-positions" className={ORANGE_BTN}>Browse Jobs <ArrowRight className="ml-2 w-4 h-4" /></a>
            <a href={CONTACT_HREF} className={OUTLINE_BTN}>Submit Your CV</a>
            <a href={CONTACT_HREF} className="inline-flex items-center justify-center rounded-full px-8 h-13 text-base font-semibold border border-emerald-400/40 text-emerald-400 hover:bg-emerald-400/10 bg-transparent transition-colors">
              Join Talent Community
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
