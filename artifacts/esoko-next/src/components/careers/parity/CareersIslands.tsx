"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Linkedin, Mail, Play } from "lucide-react";
import { CAREERS_TEAM, FAQ_ITEMS, type TeamCategory } from "./CareersData";

/* ── Life at Esoko video (trigger + modal) ── */
export function LifeVideoButton({ variant }: { variant: "hero" | "card" }) {
  const [open, setOpen] = useState(false);
  const playRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const close = () => { setOpen(false); requestAnimationFrame(() => playRef.current?.focus()); };
  const closeFn = useRef(close);
  closeFn.current = close;

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => closeRef.current?.focus());
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { closeFn.current(); return; }
      if (e.key === "Tab" && dialogRef.current) {
        const nodes = dialogRef.current.querySelectorAll<HTMLElement>('button, iframe, [tabindex]:not([tabindex="-1"])');
        const first = nodes[0]; const last = nodes[nodes.length - 1];
        if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last?.focus(); } }
        else if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  return <>
    {variant === "hero" ? (
      <button
        ref={playRef}
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-full px-2"
        aria-label="Watch Life at Esoko video"
      >
        <span className="w-9 h-9 rounded-full bg-white/15 border border-white/30 flex items-center justify-center hover:bg-white/25 transition-colors">
          <Play className="w-4 h-4 fill-white text-white ml-0.5" />
        </span>
        Watch Life at Esoko
      </button>
    ) : (
      <button
        ref={playRef}
        onClick={() => setOpen(true)}
        aria-label="Watch Life at Esoko video (opens video)"
        className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center shadow-2xl hover:bg-white/30 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
      >
        <Play className="w-8 h-8 text-white fill-white ml-1" />
      </button>
    )}
    {open && (
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-10">
        <div className="absolute inset-0 bg-black/92 backdrop-blur-sm cursor-pointer" onClick={close} aria-hidden />
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Life at Esoko video" className="relative w-full max-w-5xl">
          <button
            ref={closeRef}
            onClick={close}
            aria-label="Close video"
            className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors text-sm flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
          >
            <span>Close</span><span className="text-lg leading-none" aria-hidden>✕</span>
          </button>
          <div className="aspect-video rounded-2xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10">
            <iframe
              src="https://www.youtube-nocookie.com/embed/5TRjt4fyrU0?autoplay=1&rel=0"
              title="Life at Esoko"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen className="w-full h-full" tabIndex={0}
            />
          </div>
        </div>
      </div>
    )}
  </>;
}

/* ── Meet the team: category filter + cards ── */
export function TeamGrid() {
  const [teamFilter, setTeamFilter] = useState<TeamCategory | "All">("All");
  const filteredTeam = teamFilter === "All" ? CAREERS_TEAM : CAREERS_TEAM.filter(m => m.category === teamFilter);
  return <>
    <div className="flex flex-wrap justify-center gap-2 mb-10">
      {(["All", "Leadership", "Technology", "Operations", "Agriculture"] as const).map(cat => (
        <button
          key={cat}
          onClick={() => setTeamFilter(cat)}
          aria-pressed={teamFilter === cat}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200
            ${teamFilter === cat
              ? "bg-emerald-600 text-white shadow-[0_4px_16px_rgba(5,150,105,0.4)]"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
      {filteredTeam.map(m => (
        <div
          key={m.name}
          className="group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-300"
        >
          <div className={`h-40 bg-gradient-to-br ${m.grad} relative flex items-center justify-center`}>
            <span className="text-4xl font-heading font-bold text-white/90 z-10">{m.initials}</span>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
            <div className="absolute -top-3 -left-3 w-14 h-14 rounded-full bg-white/10" />
          </div>
          <div className="p-4">
            <p className="font-heading font-bold text-gray-900 text-sm leading-snug">{m.name}</p>
            <p className="text-xs text-gray-500 mt-0.5 mb-3 leading-snug">{m.role}</p>
            <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{m.bio}</p>
            <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
              <button aria-label={`${m.name} LinkedIn`} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-blue-50 flex items-center justify-center transition-colors">
                <Linkedin className="w-3.5 h-3.5 text-gray-500 hover:text-blue-600" />
              </button>
              <button aria-label={`Email ${m.name}`} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <Mail className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </>;
}

/* ── FAQ accordion ── */
export function FaqList() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <button
            onClick={() => setOpenFaq(prev => prev === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-2xl"
            aria-expanded={openFaq === i}
            aria-controls={`careers-faq-${i}`}
          >
            <span className="font-semibold text-gray-800 text-sm pr-4">{item.q}</span>
            <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
          </button>
          <div id={`careers-faq-${i}`} hidden={openFaq !== i} className="overflow-hidden">
            <p className="text-gray-500 text-sm leading-relaxed px-6 pb-5">{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
