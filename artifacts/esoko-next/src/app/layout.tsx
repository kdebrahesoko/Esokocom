import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader, SiteFooter } from "@/components/site/SiteChrome";
import "./globals.css";

export const metadata: Metadata = {
  title: "Esoko | Connecting Farmers to Opportunity",
  description: "Digital tools for field data, farmer advisory, market access and resilient agriculture across Africa.",
  robots: { index: false, follow: false },
  icons: { icon: "/esoko-next/favicon.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>
    <a className="site-skip-link" href="#site-content">Skip to content</a>
    <SiteHeader />
    <div id="site-content" tabIndex={-1}>{children}</div>
    <SiteFooter />
  </body></html>;
}
