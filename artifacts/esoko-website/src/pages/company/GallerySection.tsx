import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { GALLERY_IMAGES } from './CompanyData';

const CATEGORIES = ['ALL', 'FIELD WORK', 'FARMERS', 'TECHNOLOGY', 'COMMUNITIES', 'IMPACT'];

export function GallerySection({ reduced }: { reduced: boolean }) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const filteredImages = GALLERY_IMAGES.filter(
    img => activeCategory === 'ALL' || img.category === activeCategory
  );

  const openLightbox = (index: number, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex(prev => (prev === null ? null : (prev + 1) % filteredImages.length));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex(prev => (prev === null ? null : (prev === 0 ? filteredImages.length - 1 : prev - 1)));
  };

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => closeButtonRef.current?.focus());
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') setLightboxIndex(prev => (prev === null ? null : (prev + 1) % filteredImages.length));
      if (e.key === 'ArrowLeft') setLightboxIndex(prev => (prev === null ? null : (prev === 0 ? filteredImages.length - 1 : prev - 1)));
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, filteredImages.length]);

  return (
    <section id="gallery" className="scroll-mt-24 py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-600 mb-4 bg-emerald-50 px-5 py-2 rounded-full border border-emerald-100">
            Esoko In The Field
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
            People. Places. Technology. Impact.
          </h2>
          <p className="text-gray-500 leading-relaxed max-w-2xl mx-auto">
            A closer look at the field teams, farming communities, and technology
            that make Esoko’s work tangible.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              data-testid={`gallery-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                activeCategory === cat
                  ? 'bg-[#042B10] text-white shadow-md'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[240px]">
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, i) => {
              // Create an asymmetric pattern based on index
              const isLarge = i % 5 === 0;
              const isPortrait = i % 5 === 3;
              const isWide = i % 5 === 4;
              
              let spanClass = 'md:col-span-2 md:row-span-1';
              if (isLarge) spanClass = 'md:col-span-2 md:row-span-2';
              else if (isPortrait) spanClass = 'md:col-span-1 md:row-span-2';
              else if (isWide) spanClass = 'md:col-span-3 md:row-span-1';
              else spanClass = 'md:col-span-1 md:row-span-1';

              return (
                <motion.button
                  type="button"
                  key={image.src}
                  layout
                  initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className={`group relative overflow-hidden rounded-2xl bg-gray-100 cursor-pointer ${spanClass}`}
                  onClick={(event) => openLightbox(i, event.currentTarget)}
                  aria-label={`Open image: ${image.alt}`}
                  data-testid={`gallery-image-${i}`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="inline-block text-[10px] font-bold tracking-wider text-white mb-1.5 uppercase bg-emerald-600/80 px-2 py-0.5 rounded backdrop-blur-sm">
                        {image.category}
                      </span>
                      <p className="text-white text-sm font-medium leading-snug drop-shadow-md">
                        {image.alt}
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Maximize2 className="w-4 h-4 text-white" />
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Image gallery lightbox"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 md:p-6 text-white absolute top-0 left-0 right-0 z-10">
              <p className="text-sm font-medium opacity-70">
                {lightboxIndex + 1} / {filteredImages.length}
              </p>
              <button
                ref={closeButtonRef}
                onClick={closeLightbox}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                aria-label="Close lightbox"
                data-testid="lightbox-close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image */}
            <div className="flex-1 relative flex items-center justify-center p-4 md:p-12 overflow-hidden" onClick={closeLightbox}>
              <button
                onClick={prevImage}
                className="absolute left-4 md:left-8 w-12 h-12 rounded-full bg-black/50 border border-white/10 hover:bg-black/80 flex items-center justify-center text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 z-10"
                aria-label="Previous image"
                data-testid="lightbox-prev"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <motion.img
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={filteredImages[lightboxIndex].src}
                alt={filteredImages[lightboxIndex].alt}
                className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-sm"
                onClick={(e) => e.stopPropagation()}
              />

              <button
                onClick={nextImage}
                className="absolute right-4 md:right-8 w-12 h-12 rounded-full bg-black/50 border border-white/10 hover:bg-black/80 flex items-center justify-center text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 z-10"
                aria-label="Next image"
                data-testid="lightbox-next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Caption Footer */}
            <div className="p-6 md:p-8 text-center absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
              <span className="inline-block text-[10px] font-bold tracking-wider text-emerald-400 mb-2 uppercase">
                {filteredImages[lightboxIndex].category}
              </span>
              <p className="text-white text-lg md:text-xl font-heading font-medium max-w-2xl mx-auto">
                {filteredImages[lightboxIndex].alt}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
