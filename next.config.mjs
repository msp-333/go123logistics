// next.config.mjs

// Change this if your repo name changes
const repo = process.env.NEXT_PUBLIC_GH_PAGES_REPO || "go123logistics";
const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export static HTML into /out (required for GitHub Pages)
  output: "export",

  // Prefix routes & assets when deployed under /<repo>
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",

  // Use plain <img> at build time (GitHub Pages has no image optimizer)
  images: { unoptimized: true },

  // Ensure /about/ resolves to /about/index.html on GH Pages
  trailingSlash: true,

  // Optional: don’t fail CI on lint issues during export
  eslint: { ignoreDuringBuilds: true },

  // Optional: don’t fail CI on type errors during export
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
