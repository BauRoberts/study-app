import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  webpack: (config) => {
    // Enable source maps
    config.devtool = "source-map";
    return config;
  },
  images: {
    domains: [], // Add any image domains you need
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Add other config options as needed
};

export default nextConfig;
