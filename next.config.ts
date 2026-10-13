import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  // Avoid Turbopack / HMR conflicts during local development
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  reactStrictMode: true,
  // next-pwa injects webpack config; Next 16 needs this acknowledged
  // Build/dev scripts use --webpack explicitly.
  turbopack: {},
};

export default withPWA(nextConfig);
