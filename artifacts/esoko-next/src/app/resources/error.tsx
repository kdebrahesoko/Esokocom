"use client";

export default function ResourceError({ reset }: { reset: () => void }) {
  return <main className="resources-main"><h1>Resources are temporarily unavailable</h1>
    <p>We couldn’t load the public resource library. Please try again.</p>
    <button onClick={reset}>Try again</button></main>;
}
