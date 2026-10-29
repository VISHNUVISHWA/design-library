# Design Library landing page

A marketing landing page for **Design Library**, a personal tool that captures websites, measures how they are built, and keeps a prompt that rebuilds the design.

Live: https://vishnuvishwa.github.io/design-library/

This page is a design test. It was built from a prompt written for a warm, restrained product-landing style (product UI as the hero, hairlines instead of boxes, a sans and serif mix, one dark closing section). It takes inspiration from reference sites and does not copy their logos, wording or imagery. The company names in the logo strip are placeholders.

## Stack

Next.js (App Router) and TypeScript, plain CSS variables, `next/font` for Inter, Source Serif 4 and JetBrains Mono. No animation library: CSS keyframes and one IntersectionObserver.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3100
```

## Deploy

Pushes to `main` build a static export and publish it with GitHub Pages (see `.github/workflows/pages.yml`). The deploy build sets `GITHUB_PAGES=true`, which turns on `output: 'export'` and the `/design-library` base path.
