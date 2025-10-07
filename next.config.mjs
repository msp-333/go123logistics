// next.config.mjs
const repo = 'go123logistics';
const isProd = process.env.NODE_ENV === 'production';
const base = isProd ? `/${repo}` : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export static HTML for GitHub Pages
  output: 'export',

  // Make all routes/assets resolve under /go123logistics in prod
  basePath: base,
  assetPrefix: base + '/',

  // IMPORTANT: expose the same base to the client & SSG
  env: {
    NEXT_PUBLIC_BASE_PATH: base,
  },

  // Static export-friendly images
  images: { unoptimized: true },

  // Ensure /blog/ maps to /blog/index.html on GH Pages
  trailingSlash: true,

  // Optional: don’t fail CI on lint
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
