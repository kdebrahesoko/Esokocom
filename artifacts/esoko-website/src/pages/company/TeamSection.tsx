import { useState, useEffect, useRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, X, ArrowUpRight } from 'lucide-react';
import { TEAM } from './CompanyData';
import { LeadershipPortrait } from './LeadershipPortrait';

export function TeamSection({ reduced }: { reduced: boolean }) {
  const [selectedMember, setSelectedMember] = useState<typeof TEAM[0] | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dialogTitleId = useId();

  const closeDialog = () => {
    setSelectedMember(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  // Keyboard navigation for modal
  useEffect(() => {
    if (!selectedMember) return;
    requestAnimationFrame(() => closeButtonRef.current?.focus());
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDialog();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
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
    <section id="team" className="scroll-mt-24 py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #061a0d 0%, #0d2416 60%, #061a0d 100%)' }}>
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <motion.div
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-4 bg-emerald-400/10 px-5 py-2 rounded-full border border-emerald-400/20">
            Our Leadership
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            People Behind the Mission
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-base">
            Meet the people combining technology, agriculture, finance, operations and innovation to drive Esoko forward.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((member, i) => (
            <motion.button
              key={member.name}
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
               onClick={(event) => {
                 triggerRef.current = event.currentTarget;
                 setSelectedMember(member);
               }}
              className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden
                transition-all duration-300 text-left w-full
                hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] hover:border-emerald-500/30
                focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500"
              aria-label={`View ${member.name}'s profile`}
              data-testid={`team-member-${member.initials}`}
            >
              {/* The fixed-height frame reserves space while portraits load. */}
              <div className={`relative h-80 sm:h-64 lg:h-56 bg-gradient-to-br ${member.grad} flex items-center justify-center overflow-hidden`}>
                <LeadershipPortrait member={member} />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#042B10]/0 group-hover:bg-[#042B10]/40 transition-colors duration-300 z-20 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Decorative circles */}
                <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
                <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-white/10" />
                <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#042B10]/80 to-transparent z-10" />
              </div>

              <div className="p-6">
                <p className="font-heading font-bold text-white text-lg leading-snug group-hover:text-emerald-400 transition-colors">{member.name}</p>
                <p className={`text-xs font-semibold mt-1 bg-gradient-to-r ${member.grad} bg-clip-text text-transparent opacity-90 group-hover:opacity-100`}>
                  {member.role}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Leadership Profile Modal */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10" role="dialog" aria-modal="true" aria-labelledby={dialogTitleId}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
              onClick={closeDialog}
            />
            
            <motion.div
              ref={dialogRef}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl max-h-[calc(100dvh-2rem)] bg-white rounded-3xl shadow-2xl overflow-y-auto flex flex-col md:flex-row"
            >
              <button
                 ref={closeButtonRef}
                onClick={closeDialog}
                className="absolute top-4 right-4 w-8 h-8 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center transition-colors z-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#042B10]"
                aria-label="Close profile"
                data-testid="modal-close"
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>

              {/* A taller mobile frame keeps each supplied face visible. */}
              <div className={`md:w-2/5 h-72 md:h-auto md:min-h-[25rem] shrink-0 overflow-hidden bg-gradient-to-br ${selectedMember.grad} relative flex items-center justify-center`}>
                <LeadershipPortrait member={selectedMember} eager />
                <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-white/10" />
              </div>

              {/* Modal Content */}
              <div className="md:w-3/5 p-8 md:p-10 flex flex-col justify-center">
                <h3 id={dialogTitleId} className="font-heading font-bold text-gray-900 text-2xl md:text-3xl mb-1">{selectedMember.name}</h3>
                <p className="text-emerald-600 font-semibold text-sm mb-6">{selectedMember.role}</p>
                
                <p className="text-gray-600 text-base leading-relaxed mb-8">
                  View the official LinkedIn profile for approved career history and professional details.
                </p>

                {selectedMember.linkedinUrl && (
                  <a
                    href={selectedMember.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                   data-testid={`team-link-linkedin-${selectedMember.initials}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#0077b5] hover:text-[#005e93] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0077b5] rounded p-1 -ml-1"
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
