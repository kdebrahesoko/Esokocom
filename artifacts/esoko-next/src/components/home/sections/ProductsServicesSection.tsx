import { ArrowUpRight, ChevronRight } from "lucide-react";
import { SiteLink } from "@/components/site/SiteLink";
import { PRODUCTS, PROFESSIONAL_SERVICES } from "@/data/products-services";

const productDescriptions: Record<(typeof PRODUCTS)[number]["id"], string> = {
  insyt:
    "Collect field data, map farm boundaries and manage offline-first surveys in one place.",
  push:
    "Send programme updates through SMS, voice, IVR, USSD and WhatsApp.",
  econtent:
    "Share seasonal crop advice, weather information and market updates with farmers.",
  marketplace:
    "Connect farmers with buyers and input suppliers through a digital trading platform.",
};

/**
 * A practical overview for programme teams: products first, then the people
 * and delivery support that can help put them to work.
 */
export function ProductsServicesSection() {
  return (
    <section
      id="products-services"
      aria-labelledby="products-services-title"
      className="border-y border-border bg-muted/60 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="max-w-xl">
            <h2
              id="products-services-title"
              className="font-heading text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl"
            >
              Products &amp; Services
            </h2>
            <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground">
              From field data to farmer communication and market access, choose
              the tools and support that fit your programme.
            </p>
            <SiteLink
              href="/products-services/"
              className="mt-6 inline-flex min-h-12 items-center rounded-lg bg-brand px-5 py-3 text-xl font-bold text-background transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Explore all products
            </SiteLink>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {PRODUCTS.map((product) => {
              const Icon = product.icon;
              return (
                <article
                  key={product.id}
                  className="flex min-h-full flex-col rounded-xl border border-border bg-card p-5 sm:p-6"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-muted text-primary">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    {product.category}
                  </p>
                  <h3 className="mt-1 font-heading text-xl font-bold leading-snug text-foreground">
                    {product.name}
                  </h3>
                  <p className="mt-2 flex-1 text-base leading-6 text-muted-foreground">
                    {productDescriptions[product.id]}
                  </p>
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${product.name} platform (opens in a new tab)`}
                    className="mt-5 inline-flex min-h-11 items-center gap-2 self-start rounded-md px-1 text-base font-semibold text-foreground underline decoration-border underline-offset-4 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    Visit {product.name}
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </article>
              );
            })}
          </div>
        </div>

        <div
          id="products-professional-services"
          className="mt-14 border-t border-border pt-8 sm:mt-16 sm:pt-10"
        >
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="font-heading text-2xl font-bold leading-tight text-foreground">
                Professional services
              </h3>
              <p className="mt-2 max-w-2xl text-base leading-6 text-muted-foreground">
                Practical support for planning, delivery and communication with
                farming communities.
              </p>
            </div>
            <SiteLink
              href="/products-services/#services"
              className="inline-flex min-h-11 items-center gap-2 self-start rounded-md px-1 text-sm font-semibold text-foreground underline decoration-border underline-offset-4 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:self-auto"
            >
              View service details
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </SiteLink>
          </div>

          <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
            {PROFESSIONAL_SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <li
                  key={service.label}
                  className="flex min-h-24 items-start gap-3 border-t border-border py-4"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-card text-primary">
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <div>
                    <h4 className="font-semibold leading-5 text-foreground">
                      {service.label}
                    </h4>
                    <p className="mt-1 text-base leading-6 text-muted-foreground">
                      {service.sub}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
