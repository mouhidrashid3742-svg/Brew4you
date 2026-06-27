import withPWA from "next-pwa";

const isDev = process.env.NODE_ENV === "development";

const pwaOptions = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: isDev
});

const nextConfig = {
  reactStrictMode: true,
  turbopack: {},
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ],
    unoptimized: true
  }
};

export default pwaOptions(nextConfig);
