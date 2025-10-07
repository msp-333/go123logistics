// next.config.mjs
const repo = 'go123logistics';
const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build to static HTML in /out
  output: 'export',

  // Needed for GitHub Project Pages (username.github.io/<repo>)
  basePath: isProd ? `/${repo}` : '',
  assetPrefix: isProd ? `/${repo}/` : '',

  // Make next/image use plain <img> tags for static export
  images: { unoptimized: true },

  // Ensures /about/index.html is served on GH Pages
  trailingSlash: true,

  // Optional: don’t fail CI on lint issues
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
