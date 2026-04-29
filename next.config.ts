import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const securityHeaders = [
  // Don't reveal which technology serves the response.
  { key: "X-Powered-By", value: "" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Reasonable defaults; tighten further once external integrations are known.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // HSTS — only meaningful behind HTTPS, but harmless under HTTP.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  // Compress body responses (Nginx will also gzip; this is the in-Node fallback).
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Sharp pipeline produces WebP under /uploads — Next/Image still optimizes
    // these for responsive sizing.
    remotePatterns: [],
    // Allow large uploads from the admin (capped by Sharp pipeline at 10 MB).
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2400],
  },
  experimental: {
    optimizePackageImports: ["motion", "lucide-react"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      // Cache static uploads aggressively — filenames are content-addressed
      // (random hex) so they never need busting.
      {
        source: "/uploads/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
