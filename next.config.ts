import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.e2b.app", "localhost"],
  headers: async () => [
    {
      // Never let the preview iframe serve stale HTML/chunks
      source: "/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      ],
    },
  ],
};

export default nextConfig;
