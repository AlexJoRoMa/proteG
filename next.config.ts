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

    formats: ["image/avif", "image/webp"],
  },

  experimental: {
     optimizePackageImports: [
      '@heroui/react',
      'embla-carousel-react',
      'date-fns',
      'contentful',
      '@contentful/rich-text-react-renderer',
    ],
    cssChunking: true,
  },

  compress: true,

  productionBrowserSourceMaps: false,

  logging:{
    fetches:{
      fullUrl: false
    }
  }

};

export default nextConfig;
