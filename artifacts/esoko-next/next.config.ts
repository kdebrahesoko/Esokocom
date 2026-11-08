import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  basePath: "/esoko-next",
  trailingSlash: true,
  poweredByHeader: false,
  // The development indicator loads Geist from /__nextjs_font/ outside this
  // artifact's base path. Keep app fonts unchanged and avoid that broken request.
  devIndicators: false,
  allowedDevOrigins: [
    "127.0.0.1",
    ...(process.env.REPLIT_DEV_DOMAIN ? [process.env.REPLIT_DEV_DOMAIN] : []),
  ],
  // Keep social metadata in the initial HTML for all crawlers.
  htmlLimitedBots: /.*/,
  experimental: { serverComponentsHmrCache: false },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      // Only the three approved Esoko story thumbnails; no arbitrary remote hosts.
      ...["5TRjt4fyrU0", "NIzzcknUmRY", "QJwhX5rIFmg"].map(id => ({
        protocol: "https" as const,
        hostname: "i.ytimg.com",
        pathname: `/vi/${id}/hqdefault.jpg`,
        search: "",
      })),
    ],
  },
  turbopack: {
    root: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.."),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
    ];
  },
};

export default nextConfig;
