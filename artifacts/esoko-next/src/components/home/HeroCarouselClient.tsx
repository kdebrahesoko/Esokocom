"use client";

import Image, { getImageProps } from "next/image";
import { Children, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight, Pause } from "lucide-react";
import type { HeroImage } from "./hero-images";

const labels = ["Sustainability, quality and efficiency", "Esoko Marketplace", "Our core service pillars"];

/** Interaction only: children are server-authored slide content. No animation library. */
export function HeroCarouselClient({ children, images }: { children: ReactNode; images: HeroImage[] }) {
  const slides = Children.toArray(children);
  const [active, setActive] = useState(0);
  const [pending, setPending] = useState<number | null>(null);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [ready, setReady] = useState<number[]>([]);
  const [failed, setFailed] = useState<number[]>([]);
  const [stopped, setStopped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);
  // null keeps SSR and the first client render identical; no timer runs until known.
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    const updateVisibility = () => setHidden(document.hidden);
    const loaded = () => setPageLoaded(true);
    updateMotion();
    updateVisibility();
    media.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    if (document.readyState === "complete") loaded();
    else window.addEventListener("load", loaded, { once: true });
    return () => {
      media.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
      window.removeEventListener("load", loaded);
    };
  }, []);

  useEffect(() => {
    if (pending !== null && ready.includes(pending)) {
      setActive(pending);
      setPending(null);
    }
  }, [pending, ready]);

  useEffect(() => {
    if (!pageLoaded || !ready.includes(active) || stopped || hovered || focused || hidden || reducedMotion !== false) return;
    const timer = window.setTimeout(() => {
      const next = (active + 1) % slides.length;
      if (!failed.includes(next)) setPending(next);
    }, 7000);
    return () => window.clearTimeout(timer);
  }, [active, pageLoaded, ready, failed, stopped, hovered, focused, hidden, reducedMotion, slides.length]);

  function moveTo(index: number) {
    setStopped(true);
    const next = (index + slides.length) % slides.length;
    if (!failed.includes(next)) setPending(next);
  }

  return (
    <section
      id="top"
      className="qsr-hero photo-hero esoko-carousel"
      aria-label="Esoko services"
      aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
      onClickCapture={event => {
        if ((event.target as Element).closest("a")) setStopped(true);
      }}
      onKeyDown={event => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          moveTo(active + (event.key === "ArrowLeft" ? -1 : 1));
        }
      }}
      onPointerDown={event => {
        if (event.pointerType !== "mouse") touchStart.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerCancel={() => { touchStart.current = null; }}
      onPointerUp={event => {
        const start = touchStart.current;
        touchStart.current = null;
        if (!start) return;
        const dx = event.clientX - start.x;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(event.clientY - start.y)) moveTo(active + (dx < 0 ? 1 : -1));
      }}
    >
      <div className="esoko-carousel-images" aria-hidden="true">
        {images.map((image, index) => {
          // Do not even create picture/source/img nodes for later slides before load.
          if (index !== 0 && !pageLoaded) return null;
          const mobile = image.mobile ? getImageProps({
            src: image.mobile.src, width: image.mobile.width, height: image.mobile.height,
            sizes: "100vw", alt: image.alt,
          }).props : null;
          return (
            <picture className={`esoko-carousel-picture${index === active ? " is-active" : ""}`} key={image.src}>
              {mobile && <source media="(max-width: 767px)" srcSet={mobile.srcSet} sizes="100vw" />}
              <Image
                className={`photo-hero-image esoko-carousel-image-${index + 1}`}
                src={image.src}
                alt={image.alt}
                fill
                sizes="100vw"
                priority={index === 0}
                loading={index === 0 ? undefined : "eager"}
                fetchPriority={index === 0 ? "high" : "low"}
                placeholder="blur"
                blurDataURL={image.blurDataURL}
                onLoad={() => setReady(previous => previous.includes(index) ? previous : [...previous, index])}
                onError={() => {
                  setFailed(previous => previous.includes(index) ? previous : [...previous, index]);
                  setPending(previous => previous === index ? null : previous);
                  setStopped(true);
                }}
              />
            </picture>
          );
        })}
      </div>
      <div className="photo-hero-shade esoko-carousel-shade" aria-hidden="true" />
      <div className="esoko-carousel-controls" role="group" aria-label="Slide controls">
        <button type="button" className="esoko-carousel-step" aria-label="Previous slide" onClick={() => moveTo(active - 1)}><ChevronLeft size={20} aria-hidden="true" /></button>
        <div className="esoko-carousel-dots" role="group" aria-label="Choose a slide">
          {labels.map((label, index) => (
            <button type="button" className={`esoko-carousel-dot${active === index ? " is-active" : ""}`}
              aria-label={`Slide ${index + 1} of 3: ${label}`} aria-current={active === index ? "true" : undefined}
              onClick={() => moveTo(index)} key={label}><span aria-hidden="true" /></button>
          ))}
        </div>
        <button type="button" className="esoko-carousel-step" aria-label="Next slide" onClick={() => moveTo(active + 1)}><ChevronRight size={20} aria-hidden="true" /></button>
        <button type="button" className="esoko-carousel-toggle"
          aria-label={reducedMotion ? "Automatic slides off for reduced motion" : stopped ? "Automatic slides paused" : "Pause automatic slides"}
          aria-pressed={stopped || reducedMotion === true}
          onClick={() => setStopped(true)}><Pause size={18} aria-hidden="true" /></button>
      </div>
      <div className="qsr-hero-inner photo-hero-inner esoko-carousel-inner">
        <div className="photo-hero-message esoko-carousel-message">
          {slides.map((slide, index) => (
            <div key={index} className={`esoko-carousel-slide${index === active ? " is-active" : ""}`}
              aria-hidden={index !== active} inert={index !== active}>{slide}</div>
          ))}
        </div>
      </div>
      <span className="hero-status" role="status">
        {failed.length > 0 ? "A hero photo could not load. Please choose another slide." : pending !== null ? "Loading slide…" : ""}
      </span>
    </section>
  );
}
