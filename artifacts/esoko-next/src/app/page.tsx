import Link from "next/link";

const phases = [
  { name: "Resources", note: "Available in this preview." },
  { name: "Careers", note: "Public vacancies and applications available in this preview." },
  { name: "Public pages", note: "Remaining public site content." },
  { name: "Admin CMS", note: "Content management tooling, migrated last." },
];

export default function Page() {
  return (
    <main className="shell">
      <div className="brand">
        <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
          <rect width="32" height="32" rx="8" fill="hsl(149 81% 23%)" />
          <path d="M16 24c0-7 3-11 9-13-1 7-4 11-9 13Zm0 0c0-5-2-8-7-10 0 5 2 9 7 10Z" fill="hsl(44 100% 48%)" />
        </svg>
        Esoko
      </div>

      <span className="tag">Migration preview</span>
      <h1>Esoko Next.js foundation</h1>
      <p className="lead">
        A separate Next.js App Router preview of the Esoko website. Explore the public Resources library and Careers.
      </p>

      <section className="panel notice" aria-label="Status">
        <p>The existing Esoko website remains unchanged and continues to serve all visitors.</p>
      </section>

      <section className="panel" aria-labelledby="phases-title">
        <h2 id="phases-title">Planned next phases</h2>
        <ol className="phases">
          {phases.map((p) => (
            <li key={p.name}>
              <div>
                <strong>{p.name}</strong>
                <span>{p.note}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="actions">
        <Link className="button" href="/resources/">Explore Resources</Link>{" "}
        <Link className="button" href="/careers/">Explore Careers</Link>{" "}
        <a className="button" href="/">Go to the existing website</a>
      </div>

      <p className="foot">Preview only. Not indexed by search engines.</p>
    </main>
  );
}
