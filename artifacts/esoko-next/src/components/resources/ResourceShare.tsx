"use client";
import { useState } from "react";

export function ResourceShare({ url }: { url: string }) {
  const [state, setState] = useState<"idle" | "ok" | "err">("idle");
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setState("ok");
    } catch {
      setState("err");
    }
    setTimeout(() => setState("idle"), 2500);
  }
  return (
    <span className="rs-copy-wrap">
      <button type="button" className="rs-share-btn" onClick={copy}>
        {state === "ok" ? "Link copied" : "Copy link"}
      </button>
      <span role="status" aria-live="polite" className={`rs-copy-msg ${state}`}>
        {state === "ok" ? "Copied to clipboard" : state === "err" ? "Could not copy. Select the address bar instead." : ""}
      </span>
    </span>
  );
}

export default ResourceShare;
