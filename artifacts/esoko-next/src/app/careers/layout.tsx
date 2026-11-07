import Link from "next/link";
import type { ReactNode } from "react";
import "./careers.css";
export default function CareersLayout({ children }: { children: ReactNode }) {
  return <div className="careers-site">
    <header className="careers-nav"><Link href="/careers/" className="careers-brand">Esoko <span>Careers</span></Link>
      <nav aria-label="Main"><Link href="/careers/">Vacancies</Link><Link href="/resources/">Resources</Link><a href="/">Existing website ↗</a></nav>
      <span className="careers-preview">Migration preview · noindex</span></header>
    {children}
    <footer className="careers-footer"><strong>Esoko</strong><p>Technology and agriculture, working together.</p><a href="/">Visit the existing website</a></footer>
  </div>;
}
