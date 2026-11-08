"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ExternalLink, Play, X } from "lucide-react";

const videos = [
  { id: "5TRjt4fyrU0", title: "Transforming Agriculture with Technology – The Esoko Story" },
  { id: "NIzzcknUmRY", title: "Stories from the Field: Northern Ghana" },
  { id: "QJwhX5rIFmg", title: "Real Stories, Real Impact" },
] as const;

export function StoryVideos() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [playerLoaded, setPlayerLoaded] = useState(false);
  const [failedThumbnails, setFailedThumbnails] = useState<ReadonlySet<string>>(() => new Set());
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const close = () => {
    const previous = activeId;
    setActiveId(null);
    setPlayerLoaded(false);
    requestAnimationFrame(() => previous && triggers.current[previous]?.focus());
  };

  useEffect(() => {
    if (activeId) closeRef.current?.focus();
  }, [activeId]);

  function videoPreview(video: typeof videos[number], featured = false) {
    const playing = activeId === video.id;
    const thumbnailFailed = failedThumbnails.has(video.id);
    return (
      <figure className={`esoko-story-preview ${featured ? "esoko-story-featured" : ""}`} key={video.id}>
        <div className="esoko-story-screen">
          {playing ? (
            <>
              {!playerLoaded && <span className="esoko-story-loading" role="status">Loading video player…</span>}
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&playsinline=1`}
                title={video.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                onLoad={() => setPlayerLoaded(true)}
              />
              <button
                ref={closeRef}
                className="esoko-story-close"
                aria-label={`Stop video: ${video.title}`}
                onClick={close}
                type="button"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </>
          ) : (
            <button
              className="esoko-story-play"
              ref={element => { triggers.current[video.id] = element; }}
              aria-label={`Play video: ${video.title}`}
              onClick={() => { setPlayerLoaded(false); setActiveId(video.id); }}
              type="button"
            >
              {!thumbnailFailed && (
                <Image
                  src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                  alt=""
                  fill
                  sizes={featured
                    ? "(max-width: 767px) calc(100vw - 48px), (max-width: 1023px) 60vw, (max-width: 1247px) 58vw, 644px"
                    : "(max-width: 767px) calc(100vw - 48px), (max-width: 1247px) 28vw, 310px"}
                  onError={() => setFailedThumbnails(previous => new Set([...previous, video.id]))}
                />
              )}
              <span className="esoko-story-play-mark">
                <Play size={featured ? 24 : 20} fill="currentColor" aria-hidden="true" />
              </span>
            </button>
          )}
        </div>
        <figcaption>
          <h3>{video.title}</h3>
          {thumbnailFailed && !playing && <p className="esoko-story-preview-error">Preview unavailable. Play the video or watch on YouTube.</p>}
          {(playing || thumbnailFailed) && (
            <a
              className="esoko-story-fallback"
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Watch ${video.title} on YouTube (opens in a new tab)`}
            >
              {playing ? "Player not loading? Watch on YouTube" : "Watch on YouTube"}
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          )}
        </figcaption>
      </figure>
    );
  }

  return (
    <div
      className="esoko-story-videos"
      onKeyDown={event => {
        if (event.key === "Escape" && activeId) { event.preventDefault(); close(); }
      }}
    >
      {videoPreview(videos[0], true)}
      <div className="esoko-story-secondary">
        {videos.slice(1).map(video => videoPreview(video))}
      </div>
    </div>
  );
}
