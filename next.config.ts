import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.3.0.60", "192.168.100.9", "26.56.34.42"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'umnchnsifnkzlqvpuwpl.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
