# Design Library

A personal library of UI and UX references. Paste a URL and Claude captures the screens, measures the real colors, fonts and tech, and writes a prompt that rebuilds that style of website or app. Paste the prompt into Claude later to get the same style with your own content.

**Live demo (read-only):** https://vishnuvishwa.github.io/design-library/
**Landing page test:** https://vishnuvishwa.github.io/design-library/landing/

## What the demo is

The demo is a static snapshot of the app with 7 sample entries. You can browse and search the library, open an entry to see its screenshots, measured tokens, breakdown and prompt, compare designs, build a combined prompt in the Brief builder, and copy prompts.

Capturing a URL, uploading screenshots, editing, and the assistant need a local server, a headless browser and a Claude login, so they only work in the local app. In the demo they explain that instead of failing.

## Layout

| Folder | What it is |
|---|---|
| `app/` | The Vite and React front end, built in demo mode (`VITE_DEMO=true`). Sample entries and screenshots are in `app/web/public`. |
| `landing/` | A marketing landing page for the product (Next.js, static export). |

## Sample entries

The screenshots, measured values and prompts in the demo are captures of other companies' public websites, kept as design references. They are inspiration only. Logos, wording and imagery belong to their owners.

## Build locally

```bash
cd app && npm ci && VITE_DEMO=true npm run build     # output: app/web/dist
cd landing && npm ci && npm run dev                  # http://localhost:3100
```

Pushes to `main` build both and publish them with GitHub Pages (`.github/workflows/pages.yml`).
