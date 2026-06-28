# Website

Customer-facing marketing site for **Cedars of Lebanon** (Seattle). A single
statically-generated landing page — logo, food gallery, contact info, and an
about section. It makes no backend calls and is independent of the `dashboard`
and `server` apps.

## Stack

- Next.js 16 (App Router) + React 19
- TypeScript 6
- SCSS modules
- Node 24 LTS (see `.nvmrc`)

## Running locally

From this directory (`client/website`):

    nvm use          # selects Node 24 from .nvmrc (run `nvm install 24` once if needed)
    npm install      # first time only
    npm run dev      # starts on http://localhost:3000

Then open http://localhost:3000.

> Note: if port 3000 is already in use (e.g. OrbStack or another local app),
> start on a different port: `npm run dev -- -p 3005`.

## Other commands

    npm run build    # production build
    npm run start    # serve the production build (http://localhost:3000)
    npm run lint     # eslint via next lint

## Project layout

- `app/` — App Router entry: `layout.tsx` (HTML shell, SEO metadata, Google
  Analytics, header/footer), `page.tsx` (landing page). `Header.tsx`,
  `WebVitals.tsx`, and `CdnImage.tsx` are client components.
- `components/` — `Contact.tsx` (hours, address, social links).
- `lib/` — `gtag.ts` (Google Analytics helpers), `dollarFormatter.ts`,
  `restaurantDetails.json` (hours).
- `loader.ts` — custom `next/image` loader for CDN-hosted photos.
- `styles/` — `globals.css` plus SCSS modules.
- `old/` — retired components kept for reference; not built.

## Environment variables

- `NEXT_PUBLIC_GA_ID` — Google Analytics measurement ID. Analytics only loads
  when this is set.
