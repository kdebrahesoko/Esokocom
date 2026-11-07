"use client";
export default function CareersError({ reset }: { reset: () => void }) {
  return <main className="careers-main"><h1>Careers are temporarily unavailable</h1>
    <p>Please try again shortly. No application has been submitted by loading this page.</p>
    <button onClick={reset}>Try again</button></main>;
}
