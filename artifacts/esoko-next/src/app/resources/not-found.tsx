import Link from "next/link";
export default function ResourceNotFound() {
  return <main className="resources-main"><h1>Resource not found</h1>
    <p>This resource is not available in the public library.</p>
    <Link href="/resources/">Back to Resources</Link></main>;
}
