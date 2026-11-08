import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { SIKAFIELDS_URL } from "@/lib/site-config";
import { NEXT_BASE_PATH } from "@/lib/site-links";

/** Static Server Component. Library imagery does not identify a SikaFields site. */
export function SikaFieldsFeature() {
  return (
    <section id="sikafields" aria-labelledby="sikafields-title"
      className="scroll-mt-24 border-b border-border bg-background py-16 text-foreground md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
          <div className="min-w-0 md:order-2">
            <p className="mb-4 text-base font-semibold text-primary">SikaFields</p>
            <h2 id="sikafields-title"
              className="mb-6 max-w-[12em] font-heading text-4xl font-bold leading-[1.12] tracking-[-0.035em] md:text-5xl">
              Transform farming into climate action.
            </h2>
            <p className="mb-8 max-w-[60ch] text-base leading-[1.7] text-muted-foreground">
              Built on Esoko’s field experience, SikaFields helps smallholder farmers
              take part in carbon projects through farm mapping, field monitoring
              and digital tools—connecting climate action with farmer livelihoods.
            </p>
            <a href={SIKAFIELDS_URL} target="_blank" rel="noopener noreferrer"
              aria-label="Explore SikaFields (opens in a new tab)"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg border border-primary bg-background px-6 py-3 text-base font-semibold text-primary transition-colors duration-150 hover:bg-primary hover:text-background focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand motion-reduce:transition-none">
              Explore SikaFields <ExternalLink size={18} aria-hidden="true" />
            </a>
            <span className="mt-3 block text-sm text-muted-foreground">sikafields.net · opens in a new tab</span>
          </div>
          <figure className="m-0 min-w-0 md:order-1">
            <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-muted">
              <Image
                src={`${NEXT_BASE_PATH}/site-assets/company-gallery/hands-holding-maize-kernels.webp`}
                alt="Cupped hands holding maize kernels."
                fill
                sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1279px) calc((100vw - 112px) / 2), 584px"
                loading="lazy"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-sm leading-[1.6] text-muted-foreground">
              Agricultural detail from Esoko’s image library.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
