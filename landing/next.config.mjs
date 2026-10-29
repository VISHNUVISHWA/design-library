import path from 'node:path';

// GitHub Pages serves the site from /design-library/, so the deploy build is a static export with that base path.
// Locally (npm run dev / start) nothing changes.
const isPages = process.env.GITHUB_PAGES === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: { root: path.resolve(import.meta.dirname) },
  ...(isPages && { output: 'export', basePath: '/design-library/landing', images: { unoptimized: true } }),
};
export default nextConfig;
