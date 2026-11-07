import Link from "next/link";
import { jobIsExpired, type PublicJob } from "@/lib/careers";
import ApplicationForm from "./ApplicationForm";

type Search = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? "";
const unique = (values: string[]) => [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));

function JobCard({ job }: { job: PublicJob }) {
  return <Link href={`/careers/${job.id}/`} className={`cs-card${job.featured ? " cs-card--featured" : ""}`}>
    <div className="cs-badges">
      <span className="cs-badge">{job.department}</span>
      {job.featured && <span className="cs-badge cs-badge--gold">Featured</span>}
      {jobIsExpired(job) && <span className="cs-badge cs-badge--warn">Deadline passed</span>}
    </div>
    <h3>{job.title}</h3>
    <div className="cs-meta"><span>{job.location}</span><span>{job.type}</span>{job.experience && <span>{job.experience}</span>}</div>
    {job.about && <p>{job.about}</p>}
    {job.deadline && <div className="cs-meta"><span>Deadline: {job.deadline}</span></div>}
    <span className="cs-more">View role →</span>
  </Link>;
}

function Select({ name, label, value, options }: { name: string; label: string; value: string; options: string[] }) {
  return <label className="cs-field">{label}
    <select name={name} defaultValue={options.includes(value) ? value : ""}>
      <option value="">All</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </label>;
}

export function CareersListing({ jobs, search }: { jobs: PublicJob[]; search: Search }) {
  const q = one(search.q), department = one(search.department), location = one(search.location), type = one(search.type);
  const filtered = jobs.filter(j => {
    if (q && !`${j.title} ${j.department} ${j.skills.join(" ")}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (department && j.department !== department) return false;
    if (location && j.location !== location) return false;
    if (type && j.type !== type) return false;
    return true;
  });
  const active = Boolean(q || department || location || type);
  const featured = active ? [] : filtered.filter(j => j.featured);
  const rest = active ? filtered : filtered.filter(j => !j.featured);

  return <main className="cs-main">
    <section className="cs-intro">
      <span className="cs-eyebrow">Careers at Esoko</span>
      <h1>Explore Opportunities</h1>
      <p>Find a role where your skills create meaningful impact across African agriculture.</p>
    </section>
    <form className="cs-filters" method="get" action="/esoko-next/careers/" role="search" aria-label="Filter vacancies">
      <label className="cs-field cs-field--grow">Search
        <input type="search" name="q" defaultValue={q} placeholder="Search by title, department, or skill…" />
      </label>
      <Select name="department" label="Department" value={department} options={unique(jobs.map(j => j.department))} />
      <Select name="location" label="Location" value={location} options={unique(jobs.map(j => j.location))} />
      <Select name="type" label="Job type" value={type} options={unique(jobs.map(j => j.type))} />
      <div className="cs-actions">
        <button type="submit" className="cs-btn">Apply filters</button>
        {active && <Link href="/careers/" className="cs-btn cs-btn--ghost">Clear all</Link>}
      </div>
    </form>
    <p className="cs-count" role="status">{filtered.length} {filtered.length === 1 ? "position" : "positions"} found</p>
    {filtered.length === 0 ? <div className="cs-empty">
      <h2>{jobs.length === 0 ? "No open positions right now" : "No positions match your filters"}</h2>
      <p>{jobs.length === 0 ? "There are no published vacancies at the moment. Please check back later." : "Try a different search or clear the filters."}</p>
      {active && <Link href="/careers/" className="cs-btn">Clear filters</Link>}
    </div> : <>
      {featured.length > 0 && <section className="cs-section" aria-labelledby="featured-h">
        <h2 id="featured-h">Featured roles</h2>
        <div className="cs-grid">{featured.map(j => <JobCard key={j.id} job={j} />)}</div>
      </section>}
      {rest.length > 0 && <section className="cs-section" aria-labelledby="all-h">
        <h2 id="all-h">{featured.length ? "More open positions" : "Open positions"}</h2>
        <div className="cs-grid">{rest.map(j => <JobCard key={j.id} job={j} />)}</div>
      </section>}
    </>}
  </main>;
}

function List({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return <section><h2>{title}</h2><ul className="cs-list">{items.map((t, i) => <li key={i}>{t}</li>)}</ul></section>;
}

export function CareerDetail({ job, related }: { job: PublicJob; related: PublicJob[] }) {
  const expired = jobIsExpired(job);
  const others = related.filter(r => r.id !== job.id).slice(0, 4);
  return <main className="cs-main">
    <nav className="cs-crumbs" aria-label="Breadcrumb"><Link href="/careers/">Careers</Link><span aria-hidden="true">/</span><span aria-current="page">{job.title}</span></nav>
    <header className="cs-job-head">
      <div className="cs-badges">
        <span className="cs-badge">{job.department}</span>
        {job.type && <span className="cs-badge cs-badge--gold">{job.type}</span>}
        {job.experience && <span className="cs-badge cs-badge--gold">{job.experience}</span>}
      </div>
      <h1>{job.title}</h1>
      <div className="cs-meta"><span>{job.location}</span>{job.deadline && <span>Deadline: {job.deadline}</span>}</div>
      {expired && <div className="cs-notice" role="note"><p>The displayed deadline ({job.deadline}) has passed, but this role is still listed as published. Please contact Esoko to confirm the deadline. You can still submit an application below.</p></div>}
      <div><a href="#apply" className="cs-btn">Apply now</a></div>
    </header>
    <div className="cs-layout">
      <div className="cs-body">
        {job.about && <section><h2>About the Role</h2><p>{job.about}</p></section>}
        <List title="What You'll Do" items={job.responsibilities} />
        <List title="What We're Looking For" items={job.requirements} />
        <List title="Nice to Have" items={job.niceToHave} />
        <List title="What We Offer" items={job.benefits} />
        <section id="apply" className="cs-apply" aria-labelledby="apply-h">
          <h2 id="apply-h">Apply for this Role</h2>
          <p>Fill in the form below. CV upload is optional but recommended.</p>
          <ApplicationForm key={job.id} jobId={job.id} questions={job.applicationQuestions} />
        </section>
      </div>
      <aside className="cs-aside">
        <div className="cs-panel">
          <h2>Quick Facts</h2>
          <dl className="cs-dl">
            <div><dt>Department</dt><dd>{job.department}</dd></div>
            <div><dt>Location</dt><dd>{job.location}</dd></div>
            <div><dt>Type</dt><dd>{job.type}</dd></div>
            {job.experience && <div><dt>Level</dt><dd>{job.experience}</dd></div>}
            {job.salaryRange && <div><dt>Salary</dt><dd>{job.salaryRange}</dd></div>}
            <div><dt>Deadline</dt><dd>{job.deadline || "Open"}</dd></div>
          </dl>
        </div>
        {job.skills.length > 0 && <div className="cs-panel"><h2>Key Skills</h2>
          <ul className="cs-chips">{job.skills.map((s, i) => <li key={i}>{s}</li>)}</ul></div>}
        {others.length > 0 && <div className="cs-panel"><h2>More Positions</h2>
          <ul className="cs-related">{others.map(r => <li key={r.id}><Link href={`/careers/${r.id}/`}><strong>{r.title}</strong><span>{r.department} · {r.location}</span></Link></li>)}</ul>
          <Link href="/careers/" className="cs-link">View all openings →</Link></div>}
      </aside>
    </div>
  </main>;
}
