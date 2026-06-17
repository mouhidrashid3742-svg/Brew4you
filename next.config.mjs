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
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  }
};

export default pwaOptions(nextConfig);
