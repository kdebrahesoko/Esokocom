import { BookOpen, Calendar, Headphones, Video, FileText, Users, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import type { ResourceListItem } from '@/lib/resources';
import { resolveImageUrl, formatResourceDate, API_TYPE_TO_PUBLIC, TYPE_LABELS } from '@/lib/resources';

/* ── Type metadata ─────────────────────────────────────────────── */
const TYPE_ICON: Record<string, React.ElementType> = {
  Blog:              BookOpen,
  Event:             Calendar,
  Podcast:           Headphones,
  Webinar:           Video,
  'Research Report': FileText,
  'Customer Story':  Users,
};

const TYPE_BADGE_CLASS: Record<string, string> = {
  Blog:              'bg-blue-50 text-blue-700 border-blue-100',
  Event:             'bg-purple-50 text-purple-700 border-purple-100',
  Podcast:           'bg-amber-50 text-amber-700 border-amber-100',
  Webinar:           'bg-rose-50 text-rose-700 border-rose-100',
  'Research Report': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Customer Story':  'bg-orange-50 text-orange-700 border-orange-100',
};

const TYPE_PLACEHOLDER_CLASS: Record<string, string> = {
  Blog:              'from-blue-50 to-blue-100',
  Event:             'from-purple-50 to-purple-100',
  Podcast:           'from-amber-50 to-amber-100',
  Webinar:           'from-rose-50 to-rose-100',
  'Research Report': 'from-emerald-50 to-emerald-100',
  'Customer Story':  'from-orange-50 to-orange-100',
};

const TYPE_ICON_CLASS: Record<string, string> = {
  Blog:              'text-blue-300',
  Event:             'text-purple-300',
  Podcast:           'text-amber-300',
  Webinar:           'text-rose-300',
  'Research Report': 'text-emerald-300',
  'Customer Story':  'text-orange-300',
};

/* ── Skeleton ──────────────────────────────────────────────────── */
export function ResourceCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="aspect-video bg-gray-100 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-5 w-full bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 w-20 bg-gray-100 rounded animate-pulse mt-4" />
      </div>
    </div>
  );
}

/* ── Card ──────────────────────────────────────────────────────── */
interface ResourceCardProps {
  resource: ResourceListItem;
  index?: number;
  /** 'grid' = standard card; 'featured' = larger with excerpt; 'compact' = list row */
  variant?: 'grid' | 'featured' | 'compact';
}

export function ResourceCard({ resource, index = 0, variant = 'grid' }: ResourceCardProps) {
  const base = import.meta.env.BASE_URL;
  const imgSrc = resolveImageUrl(resource.featuredImageUrl, base);
  const pubSlug = API_TYPE_TO_PUBLIC[resource.typeSlug] ?? resource.typeSlug;
  const href = `/resources/${pubSlug}/${resource.slug}`;
  const Icon = TYPE_ICON[resource.contentType] ?? BookOpen;
  const badgeClass = TYPE_BADGE_CLASS[resource.contentType] ?? 'bg-gray-50 text-gray-700 border-gray-100';
  const placeholderGrad = TYPE_PLACEHOLDER_CLASS[resource.contentType] ?? 'from-gray-50 to-gray-100';
  const iconClass = TYPE_ICON_CLASS[resource.contentType] ?? 'text-gray-300';
  const label = TYPE_LABELS[pubSlug] ?? resource.contentType;

  if (variant === 'compact') {
    return (
      <Link href={href}>
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: index * 0.05 }}
          className="group flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition-all"
        >
          {/* Thumbnail */}
          <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
            {imgSrc ? (
              <img src={imgSrc} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${placeholderGrad} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${iconClass}`} />
              </div>
            )}
          </div>
          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-400 mb-1">{label}</p>
            <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-emerald-700 transition-colors">{resource.title}</h4>
            <p className="text-xs text-gray-400 mt-1">{formatResourceDate(resource.publishedAt)}</p>
          </div>
        </motion.div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={href}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: index * 0.07 }}
          className="group relative bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
        >
          {/* Image */}
          <div className="aspect-[16/9] overflow-hidden">
            {imgSrc ? (
              <img src={imgSrc} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${placeholderGrad} flex items-center justify-center`}>
                <Icon className={`w-16 h-16 ${iconClass}`} />
              </div>
            )}
            {/* Featured badge */}
            {resource.featured && (
              <div className="absolute top-4 left-4 bg-brand text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                Featured
              </div>
            )}
          </div>
          {/* Content */}
          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badgeClass}`}>{label}</span>
              {resource.categoryName && (
                <span className="text-xs text-gray-400 truncate">{resource.categoryName}</span>
              )}
            </div>
            <h3 className="font-heading font-bold text-gray-900 text-xl mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">{resource.title}</h3>
            {resource.shortDescription && (
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">{resource.shortDescription}</p>
            )}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-gray-400">{formatResourceDate(resource.publishedAt)}</span>
              <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                Read more <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  // variant === 'grid' (default)
  return (
    <Link href={href}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col h-full"
      >
        {/* Image */}
        <div className="aspect-video overflow-hidden bg-gray-100">
          {imgSrc ? (
            <img src={imgSrc} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${placeholderGrad} flex items-center justify-center`}>
              <Icon className={`w-10 h-10 ${iconClass}`} />
            </div>
          )}
        </div>
        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${badgeClass}`}>{label}</span>
            {resource.categoryName && (
              <span className="text-xs text-gray-400 truncate">{resource.categoryName}</span>
            )}
          </div>
          <h3 className="font-heading font-semibold text-gray-900 text-base mb-1.5 line-clamp-2 group-hover:text-emerald-700 transition-colors">{resource.title}</h3>
          {resource.shortDescription && (
            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">{resource.shortDescription}</p>
          )}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-gray-400">{formatResourceDate(resource.publishedAt)}</span>
            {resource.tags[0] && (
              <span className="text-xs text-emerald-600 font-medium truncate max-w-[120px]">{resource.tags[0].name}</span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
