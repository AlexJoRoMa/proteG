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
  },

  // Preload de recursos críticos para mejor performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Link',
            value: '<https://www.google.com/recaptcha/api.js>; rel=preload; as=script; crossorigin=anonymous'
          }
        ]
      }
    ]
  }
};

export default nextConfig;
