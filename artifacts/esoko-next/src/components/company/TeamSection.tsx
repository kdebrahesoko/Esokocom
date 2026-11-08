'use client';

import { useState, useEffect, useRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { Linkedin, X, ArrowUpRight } from 'lucide-react';
import { TEAM } from './CompanyData';
import { LeadershipPortrait } from './LeadershipPortrait';

const CARD_SIZES = '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw';
const MODAL_SIZES = '(min-width: 768px) 270px, calc(100vw - 2rem)';

export function TeamSection() {
  const reduced = useReducedMotion() ?? false;
  const [selectedMember, setSelectedMember] = useState<typeof TEAM[0] | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dialogTitleId = useId();

  const closeDialog = () => {
    setSelectedMember(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  useEffect(() => {
    if (!selectedMember) return;
    requestAnimationFrame(() => closeButtonRef.current?.focus());
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeDialog(); return; }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [selectedMember]);

  return (
    <section id="team" className="scroll-mt-24 relative overflow-hidden bg-primary py-20 md:py-24">
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <motion.div
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="mb-4 inline-block rounded-full border border-white/40 px-5 py-2 text-sm font-semibold text-white">
            Our Leadership
          </span>
          <h2 className="mb-4 font-heading text-3xl font-bold text-white md:text-4xl">
            People Behind the Mission
          </h2>
          <p className="mx-auto max-w-xl text-base text-white">
            Meet the people combining technology, agriculture, finance, operations and innovation to drive Esoko forward.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((member, i) => (
            <motion.button
              type="button"
              key={member.name}
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              onClick={(event) => { triggerRef.current = event.currentTarget; setSelectedMember(member); }}
              className="group relative flex flex-col overflow-hidden rounded-xl bg-background
                transition-all duration-300 text-left w-full
                hover:-translate-y-1 hover:shadow-md
                focus:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              aria-label={`View ${member.name}'s profile`}
              data-testid={`team-member-${member.initials}`}
            >
              <div className="relative h-72 w-full shrink-0 overflow-hidden bg-muted sm:h-64 lg:h-60">
                <LeadershipPortrait member={member} sizes={CARD_SIZES} />
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-primary/0 transition-colors duration-200 group-hover:bg-primary/35">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <ArrowUpRight className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>

              <div className="flex min-h-28 flex-col justify-center p-5">
                <p className="font-heading text-lg font-bold leading-snug text-foreground">{member.name}</p>
                <p className="mt-1 text-base font-semibold leading-snug text-primary">
                  {member.role}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10" role="dialog" aria-modal="true" aria-labelledby={dialogTitleId}>
            <motion.div
              initial={reduced ? { opacity: 1 } : { opacity: 0 }} animate={{ opacity: 1 }} exit={reduced ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: reduced ? 0 : 0.2 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
              onClick={closeDialog}
            />
            <motion.div
              ref={dialogRef}
              initial={reduced ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.98 }}
              transition={reduced ? { duration: 0 } : { type: 'spring', damping: 25, stiffness: 300 }}
              className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-y-auto rounded-xl bg-background shadow-2xl md:flex-row"
            >
              <button
                type="button"
                ref={closeButtonRef}
                onClick={closeDialog}
                className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-muted transition-colors hover:bg-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Close profile"
                data-testid="modal-close"
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>

              <div className="relative h-72 shrink-0 overflow-hidden bg-muted md:h-auto md:min-h-[25rem] md:w-2/5">
                <LeadershipPortrait member={selectedMember} sizes={MODAL_SIZES} />
              </div>

              <div className="flex flex-col justify-center p-8 md:w-3/5 md:p-10">
                <h3 id={dialogTitleId} className="mb-1 font-heading text-2xl font-bold text-foreground md:text-3xl">{selectedMember.name}</h3>
                <p className="mb-6 text-base font-semibold text-primary">{selectedMember.role}</p>
                <p className="mb-8 text-base leading-relaxed text-muted-foreground">
                  View the official LinkedIn profile for approved career history and professional details.
                </p>
                {selectedMember.linkedinUrl && (
                  <a
                    href={selectedMember.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`team-link-linkedin-${selectedMember.initials}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded p-1 font-semibold text-primary transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <Linkedin className="w-5 h-5" /> Connect on LinkedIn
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
