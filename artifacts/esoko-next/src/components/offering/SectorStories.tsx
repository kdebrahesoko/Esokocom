import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";
import { SiteLink as Link } from "@/components/site/SiteLink";
import { getResources } from "@/lib/resource-api";
import { resolveImageUrl } from "@/lib/resources";

/** The existing public endpoint is sufficient; never invent or expose draft stories. */
export async function SectorStories({ compact = false }: { compact?: boolean }) {
  const { resources } = await getResources({}, "customer-stories");
  const stories = resources.slice(0, 3);
  if (!stories.length) return (
    <div className="rounded-3xl border border-dashed border-emerald-200 bg-white px-6 py-12 text-center md:px-12">
      <BookOpen className="mx-auto mb-5 h-11 w-11 text-emerald-600" aria-hidden="true" />
      <h3 className="text-2xl font-bold text-gray-900">Field stories are being prepared</h3>
      <p className="mx-auto mt-3 max-w-2xl text-gray-600">Esoko’s resource team will publish verified customer stories here as they become available.</p>
      <Link href="/resources/customer-stories" className="mt-6 inline-flex items-center gap-2 font-semibold text-emerald-700 hover:text-emerald-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
        Visit customer stories <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
  return (
    <div className={`grid gap-5 ${compact ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
      {stories.map(story => {
        // Root API images bypass the artifact-local optimizer: /api belongs
        // to the shared proxy, not Next. No broad remote-host allowlist.
        const image = resolveImageUrl(story.featuredImageUrl, "/");
        return (
          <Link key={story.id} href={`/resources/customer-stories/${story.slug}`} className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
            <div className="relative h-48 overflow-hidden bg-emerald-50">
              {image ? <Image src={image} alt="" fill sizes="(max-width: 767px) 100vw, 33vw" unoptimized className="object-cover transition duration-500 group-hover:scale-105" /> :
                <div className="flex h-full items-center justify-center"><BookOpen className="h-12 w-12 text-emerald-200" aria-hidden="true" /></div>}
            </div>
            <div className="p-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Customer story</p>
              <h3 className="mt-3 text-xl font-bold leading-snug text-gray-900 group-hover:text-emerald-800">{story.title}</h3>
              {story.shortDescription && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600">{story.shortDescription}</p>}
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">Read story <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
