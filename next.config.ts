import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
        port: "",
        pathname: "/**",
      },
    ],
  },

  experimental: {
    optimizePackageImports: ['@heroui/react', 'embla-carousel-react'],
    cssChunking: true,
  }
};

export default nextConfig;
