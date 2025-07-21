const nextConfig = {
  /* config options here */
  typescript: {
    // Temporarily ignore type errors during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Temporarily ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
