import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // Ensure app directory features are enabled
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com", // your external images
        pathname: "/**",
      },
    ],
  },
  webpack: (config, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          fs: false,
          path: false,
          os: false,
        },
      };
    }
    return config;
  },
};

export default nextConfig;
