import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Esoko Next.js | Migration Preview",
  description: "A separate Next.js foundation for the Esoko website. The existing website remains unchanged.",
  robots: { index: false, follow: false },
  icons: { icon: "/esoko-next/favicon.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
