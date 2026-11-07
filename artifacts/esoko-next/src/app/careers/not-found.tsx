import Link from "next/link";
export default function JobNotFound() {
  return <main className="careers-main"><h1>Vacancy unavailable</h1>
    <p>This vacancy is not currently listed publicly or is no longer accepting applications.</p>
    <Link href="/careers/">Browse published vacancies</Link></main>;
}
