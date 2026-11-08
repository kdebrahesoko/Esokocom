import { useEffect, useRef, useState } from "react";
import { ExternalLink, Play, X } from "lucide-react";
import "./_group.css";

const videos = [
  { id: "5TRjt4fyrU0", title: "Transforming Agriculture with Technology – The Esoko Story" },
  { id: "NIzzcknUmRY", title: "Stories from the Field: Northern Ghana" },
  { id: "QJwhX5rIFmg", title: "Real Stories, Real Impact" },
] as const;

/** Isolated visual preview only. Main-app integration will use next/image. */
export function WhoIsEsoko() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const close = () => {
    const previous = activeId;
    setActiveId(null);
    requestAnimationFrame(() => previous && triggers.current[previous]?.focus());
  };

  useEffect(() => {
    if (activeId) closeRef.current?.focus();
  }, [activeId]);

  function videoPreview(video: typeof videos[number], featured = false) {
    const playing = activeId === video.id;
    return (
      <figure className={`esoko-story-preview ${featured ? "esoko-story-featured" : ""}`} key={video.id}>
        <div className="esoko-story-screen">
          {playing ? (
            <>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&playsinline=1`}
                title={video.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
              <button
                ref={closeRef}
                className="esoko-story-close"
                aria-label={`Stop video: ${video.title}`}
                onClick={close}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </>
          ) : (
            <button
              className="esoko-story-play"
              ref={element => { triggers.current[video.id] = element; }}
              aria-label={`Play video: ${video.title}`}
              onClick={() => setActiveId(video.id)}
            >
              <img
                src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                alt=""
                loading="lazy"
                width={480}
                height={360}
              />
              <span className="esoko-story-play-mark">
                <Play size={featured ? 24 : 20} fill="currentColor" aria-hidden="true" />
              </span>
            </button>
          )}
        </div>
        <figcaption>
          <h3>{video.title}</h3>
          {playing && (
            <a
              className="esoko-story-fallback"
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Watch ${video.title} on YouTube (opens in a new tab)`}
            >
              Watch on YouTube <ExternalLink size={14} aria-hidden="true" />
            </a>
          )}
        </figcaption>
      </figure>
    );
  }

  return (
    <section
      className="esoko-story-introduction"
      aria-labelledby="esoko-story-introduction-title"
      onKeyDown={event => {
        if (event.key === "Escape" && activeId) { event.preventDefault(); close(); }
      }}
    >
      <div className="esoko-story-layout">
        <div className="esoko-story-copy">
          <h2 id="esoko-story-introduction-title">Who is Esoko?</h2>
          <p>
            Esoko was founded in 2008 to use the power of mobile phones to connect
            farmers to markets. Today, we are one of Africa’s leading agritech
            companies, helping organizations that work in rural communities with
            innovative technology.
          </p>
          <a className="esoko-story-about-link" href="/esoko-next/company/">
            Learn more about Esoko
          </a>
        </div>
        <div className="esoko-story-videos">
          {videoPreview(videos[0], true)}
          <div className="esoko-story-secondary">
            {videos.slice(1).map(video => videoPreview(video))}
          </div>
        </div>
      </div>
    </section>
  );
}
