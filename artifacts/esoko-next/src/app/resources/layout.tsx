import type { ReactNode } from "react";
import Link from "next/link";
import "./resources.css";

export default function ResourcesLayout({ children }: { children: ReactNode }) {
  return <div className="resources-site">
    <header className="resources-nav"><Link href="/resources/" className="resources-brand">Esoko<span>Resources</span></Link>
      <nav aria-label="Main"><Link href="/resources/">Explore resources</Link><a href="/">Existing website ↗</a></nav>
      <span className="preview-label">Migration preview · noindex</span></header>
    {children}
    <footer className="resources-footer"><strong>Esoko</strong><p>Knowledge for a more connected agricultural future.</p>
      <a href="/">Visit the existing website</a><small>Parallel preview. Resources are fetched from the existing public API.</small></footer>
  </div>;
}
