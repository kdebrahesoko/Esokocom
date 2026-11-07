import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, FileText, Headphones, Sparkles, Users, Video } from "lucide-react";
import type { ResourceListItem } from "@/lib/resources";
import { API_TYPE_TO_PUBLIC, TYPE_LABELS, estimateReadTime, formatResourceDate } from "@/lib/resources";
import { resourceHref, resourceImage } from "@/lib/resource-urls";

/* Server-rendered parity of the original esoko-website ResourcesPage hero, featured and Browse by Type sections. */

// Only the six canonical DB content types are shown as browsable category cards (original rule).
export const CATEGORY_CARDS = [
  { slug: 'blog',             icon: BookOpen,   grad: 'from-blue-500 to-blue-700',      iconColor: 'text-blue-100',    desc: 'Insights on African agriculture, technology, and impact',  unit: 'Article' },
  { slug: 'events',           icon: Calendar,   grad: 'from-purple-500 to-purple-700',  iconColor: 'text-purple-100',  desc: 'Conferences, field days, and partner summits',              unit: 'Event'   },
  { slug: 'podcasts',         icon: Headphones, grad: 'from-amber-500 to-orange-600',   iconColor: 'text-amber-100',   desc: 'Conversations with farmers, policymakers, and innovators',  unit: 'Episode' },
  { slug: 'webinars',         icon: Video,      grad: 'from-rose-500 to-rose-700',      iconColor: 'text-rose-100',    desc: 'Live and on-demand learning from Esoko experts',            unit: 'Session' },
  { slug: 'research',         icon: FileText,   grad: 'from-emerald-500 to-green-700',  iconColor: 'text-emerald-100', desc: 'Data-driven analysis of African food systems',              unit: 'Report'  },
  { slug: 'customer-stories', icon: Users,      grad: 'from-teal-500 to-teal-700',      iconColor: 'text-teal-100',    desc: 'How organisations are transforming agriculture with Esoko',  unit: 'Story'   },
] as const;

export type TypeCounts = Partial<Record<string, number>>;

/* ══ HERO ══ */
export function ResourcesHero() {
  return (
    <section className="esoko-home relative min-h-[72vh] flex items-center overflow-hidden" style={{ background: "linear-gradient(135deg, #021208 0%, #041f0e 40%, #062c12 70%, #082f14 100%)" }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-brand/5 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>
      <div className="container mx-auto px-4 md:px-6 py-28 relative z-10 text-center">
        <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-emerald-400 mb-5 bg-emerald-400/10 px-5 py-2 rounded-full border border-emerald-400/20">
          Knowledge Hub
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-white max-w-4xl mx-auto leading-[1.1] mb-5">
          Resources<span className="block text-emerald-400">Insights. Ideas. Knowledge.</span>
        </h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Explore Esoko&apos;s latest insights, research, events, webinars, podcasts, guides, and stories shaping the future of digital agriculture across Africa.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="#featured-insights" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-7 py-3.5 rounded-full transition-colors shadow-lg hover:shadow-emerald-900/40">
            Explore Latest Insights <ArrowRight className="w-4 h-4" />
          </a>
          <a href="#browse-by-type" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-7 py-3.5 rounded-full border border-white/20 transition-colors">
            Browse All Resources
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Large featured card ── */
function FeaturedHeroCard({ resource }: { resource: ResourceListItem }) {
  const imgSrc = resourceImage(resource.featuredImageUrl);
  const readTime = estimateReadTime(resource.body);
  const typeKey = API_TYPE_TO_PUBLIC[resource.typeSlug] ?? resource.typeSlug;
  return (
    <Link href={resourceHref(resource)} className="group grid grid-cols-1 md:grid-cols-5 bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 no-underline">
      <div className="md:col-span-3 relative min-h-[240px] md:min-h-[340px] overflow-hidden bg-gradient-to-br from-emerald-800 to-green-900">
        {/* eslint-disable-next-line @next/next/no-img-element -- CMS image hosts are dynamic */}
        <img src={imgSrc} alt={resource.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 md:to-black/30" />
        {resource.featured && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-brand text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow">
            <Sparkles className="w-3 h-3" /> Featured
          </div>
        )}
      </div>
      <div className="md:col-span-2 p-7 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {resource.categoryName && (
              <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                {resource.categoryName}
              </span>
            )}
            <span className="text-xs text-gray-400">{TYPE_LABELS[typeKey] ?? TYPE_LABELS[resource.typeSlug] ?? resource.contentType}</span>
          </div>
          <h3 className="text-xl font-heading font-bold text-gray-900 group-hover:text-emerald-700 transition-colors leading-snug mb-3 line-clamp-3">
            {resource.title}
          </h3>
          {resource.shortDescription && (
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-5">{resource.shortDescription}</p>
          )}
        </div>
        <div>
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-5">
            <span>Esoko</span>
            <span>·</span>
            <span>{formatResourceDate(resource.publishedAt)}</span>
            <span>·</span>
            <span>{readTime} min read</span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 group-hover:gap-2.5 transition-all">
            Read Article <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ══ FEATURED INSIGHTS ══ (smaller cards are rendered by the existing server ResourceCard) */
export function FeaturedInsightsSection({ featured, renderCard }: {
  featured: ResourceListItem[];
  renderCard: (r: ResourceListItem) => React.ReactNode;
}) {
  return (
    <section id="featured-insights" className="py-16 bg-white scroll-mt-20" aria-labelledby="rs-featured">
      <div className="container mx-auto px-4 md:px-6">
        <div className="esoko-home flex items-center justify-between mb-8">
          <div>
            <h2 id="rs-featured" className="text-2xl font-heading font-bold text-gray-900">Featured Insights</h2>
            <p className="text-sm text-gray-400 mt-0.5">Hand-picked by the Esoko team</p>
          </div>
          <Link href="/resources/blog/" className="text-sm text-emerald-600 font-semibold hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {featured.length === 0 ? (
          <div className="esoko-home text-center py-20 border border-dashed border-gray-200 rounded-3xl bg-gray-50">
            <Sparkles className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">New insights are coming soon.</p>
            <p className="text-gray-400 text-sm mt-1">Published content will appear here automatically.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="esoko-home"><FeaturedHeroCard resource={featured[0]} /></div>
            {featured.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featured.slice(1, 4).map(renderCard)}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ══ BROWSE BY TYPE ══ */
export function BrowseByTypeSection({ counts }: { counts: TypeCounts }) {
  return (
    <section id="browse-by-type" className="esoko-home py-16 bg-gray-50 border-y border-gray-100 scroll-mt-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">Browse by Type</h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Dive into the format that works best for you — from short reads to in-depth research.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {CATEGORY_CARDS.map(card => {
            const Icon = card.icon;
            const count = counts[card.slug];
            const hasCount = count !== undefined && count > 0;
            return (
              <Link key={card.slug} href={`/resources/${card.slug}/`} className="group flex flex-col h-full bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.grad} flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-shadow flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                <p className="text-sm font-bold text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors">
                  {TYPE_LABELS[card.slug]}
                </p>
                <p className="text-xs text-gray-400 leading-relaxed flex-1 mb-3">{card.desc}</p>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  {hasCount ? (
                    <>
                      {count} {card.unit}{count !== 1 ? "s" : ""}
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  ) : (
                    <span className="text-gray-300 font-medium">Coming Soon</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
