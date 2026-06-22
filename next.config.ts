import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dxdb3dj8f/image/upload/**",
      },
    ],
  },
};

export default nextConfig;