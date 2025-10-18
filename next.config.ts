import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Ensures the build works in standalone mode (needed for Render)
  output: "standalone",

  // ✅ Optional: if you want to serve images from external URLs (uncomment if needed)
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "ik.imagekit.io",
  //       port: "",
  //     },
  //   ],
  // },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
