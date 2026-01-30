// next.config.mjs
const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",

  // Custom domain serves from /
  basePath: "",
  assetPrefix: "",

  env: {
    NEXT_PUBLIC_BASE_PATH: "",
  },

  images: { unoptimized: true },
  trailingSlash: true,
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
