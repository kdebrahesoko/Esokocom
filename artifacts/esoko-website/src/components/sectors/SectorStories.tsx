import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'wouter';
import type { ListResponse, ResourceListItem } from '@/lib/resources';
import { resolveImageUrl } from '@/lib/resources';

interface SectorStoriesProps {
  compact?: boolean;
}

export function SectorStories({ compact = false }: SectorStoriesProps) {
  const [stories, setStories] = useState<ResourceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const base = import.meta.env.BASE_URL;

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${base}api/resources/customer-story?page=1&limit=3`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load customer stories');
        return response.json() as Promise<ListResponse>;
      })
      .then((data) => setStories(data.resources))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setStories([]);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [base]);

  if (loading) {
    return (
      <div className="grid gap-5 md:grid-cols-3" aria-label="Loading customer stories">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-72 animate-pulse rounded-3xl bg-white/70" />
        ))}
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-emerald-200 bg-white px-6 py-12 text-center md:px-12">
        <BookOpen className="mx-auto mb-5 h-11 w-11 text-emerald-600" aria-hidden="true" />
        <h3 className="text-2xl font-bold text-gray-900">Field stories are being prepared</h3>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600">
          Esoko’s resource team will publish verified customer stories here as they become available.
        </p>
        <Link
          href="/resources/customer-stories"
          className="mt-6 inline-flex items-center gap-2 font-semibold text-emerald-700 hover:text-emerald-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          Visit customer stories <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <div className={`grid gap-5 ${compact ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
      {stories.map((story) => {
        const image = resolveImageUrl(story.featuredImageUrl, base);
        return (
          <Link
            key={story.id}
            href={`/resources/customer-stories/${story.slug}`}
            className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <div className="h-48 overflow-hidden bg-emerald-50">
              {image ? (
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <BookOpen className="h-12 w-12 text-emerald-200" aria-hidden="true" />
                </div>
              )}
            </div>
            <div className="p-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Customer story</p>
              <h3 className="mt-3 text-xl font-bold leading-snug text-gray-900 group-hover:text-emerald-800">
                {story.title}
              </h3>
              {story.shortDescription && (
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600">{story.shortDescription}</p>
              )}
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                Read story <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}