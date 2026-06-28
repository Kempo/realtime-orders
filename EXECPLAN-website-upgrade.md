# Upgrade client/website to Next 16, React 19, Node 24 (App Router)

This ExecPlan is a living document. The sections Progress, Surprises & Discoveries, Decision Log, and Outcomes & Retrospective must stay up to date as work proceeds.

This document is maintained in accordance with `PLANS.md` (repo root); read that file before executing.

## Purpose / Big Picture

`client/website` is the customer-facing marketing site for the restaurant "Cedars of Lebanon" (a single landing page: logo, food gallery, contact block, about section). It is a standalone Next.js app — it makes no network calls and does not depend on `client/dashboard` or `server`.

After this change, the site runs on the current stack — Next.js 16, React 19, TypeScript 6, Node 24 LTS — and uses the modern **App Router** (an `app/` directory with `layout.tsx` + `page.tsx` and React Server Components) instead of the legacy **Pages Router** (a `pages/` directory). You observe success by running `npm run build` (clean build) and `npm run dev`, then loading `http://localhost:3000` and seeing the page render identically to today, with the nav, contact links, images, and Google Analytics all working.

Scope is limited to `client/website`. `client/dashboard` and `server` are untouched.

## Progress

- [x] (2026-06-27) Milestone 1 — Toolchain pinned: `.nvmrc` set to `24`, `yarn.lock` deleted (npm only).
- [x] (2026-06-27) Milestone 2 — Dependencies upgraded: Next 16.2.9, React 19.2.7, TS 6.0.3, `@types/node@24`, `@types/react@19`, `@types/react-dom@19` added, `@next/third-parties` added; removed `graphql`, `@stripe/stripe-js`, `luxon`, `@types/luxon`; added `engines.node >= 24`; `package-lock.json` regenerated.
- [x] (2026-06-27) Milestone 3 — App Router migration: `app/layout.tsx`, `app/page.tsx`, `app/Header.tsx` (`"use client"`), `app/WebVitals.tsx` (`"use client"`), `app/CdnImage.tsx` (`"use client"`) created; GA via `@next/third-parties` `GoogleAnalytics`; `pages/` deleted; dead `Layout.tsx`/`ItemSelection.tsx`/`TipSelection.tsx` moved to `old/`.
- [x] (2026-06-27) Milestone 4 — Config modernized: `tsconfig.json` `target: ES2017`, `moduleResolution: bundler`, `old/` excluded from type-check; Next auto-set `jsx: react-jsx`. `next.config.js` left as-is (custom loader bypasses domain allowlist).
- [x] (2026-06-27) Milestone 5 — Verified: `npm run build` clean (App Router `/`, static); `next start` on port 3007 returns 200 and renders all sections, bundled + CDN images, and `<title>`/`og` metadata.

## Surprises & Discoveries

- Observation: `client/website` makes no backend calls. The `graphql` and `@stripe/stripe-js` dependencies are unused leftovers (no `fetch`/`gql`/`apollo`/`stripe` references in `pages/` or `components/`).
  Evidence: `grep -rniE "stripe|graphql|gql|fetch\(|apollo" components pages` returns nothing.
- Observation: `components/ItemSelection.tsx` and `components/TipSelection.tsx` are dead code — nothing imports or renders them (relics of a removed ordering flow). `luxon` / `@types/luxon` are also unused.
  Evidence: `grep -rn "ItemSelection\|TipSelection" pages components | grep import` shows only each file's own style import; `grep -rn luxon pages components lib` returns nothing.
- Observation: a custom `next/image` `loader` function cannot be passed as a prop from a Server Component in the App Router (functions can't cross the server→client boundary). Resolved by isolating it in a `"use client"` wrapper, `app/CdnImage.tsx`, keeping `app/page.tsx` a Server Component.
  Evidence: the two CDN images (`restaurant.jpeg`, `takeout.jpeg`) render via `https://d7xe6a0v1wpai.cloudfront.net/...` in the served HTML.
- Observation: port 3000 was already occupied by another local app (redirects `/` → `/dashboard/`), so `npm run dev` failed with `EADDRINUSE`. Verified instead with `next start -p 3007` against the production build.
  Evidence: dev log showed `EADDRINUSE :::3000`; `curl localhost:3007` returned HTTP 200 with full page content.

## Decision Log

- Decision: Scope = `client/website` only. Leave `client/dashboard` (unused) and `server` (old Apollo 2 / Prisma 2 GraphQL backend) as-is.
  Rationale: User confirmed only the customer-facing site needs updating; the website is fully isolated (no code or runtime dependency on the others).
  Date/Author: 2026-06-27 / aaron + Claude.

- Decision: Go to latest — Next 16.2.9, React 19.2.7, TypeScript 6.0.3.
  Rationale: User chose "Latest" over staying on Next 15. The site is one static page, so React 19 / Next 16 breaking changes (async request APIs, etc.) do not apply.
  Date/Author: 2026-06-27 / aaron + Claude.

- Decision: Migrate Pages Router → App Router.
  Rationale: User chose to modernize to App Router, the Next 16 default.
  Date/Author: 2026-06-27 / aaron + Claude.

- Decision: Target Node 24 LTS; record in `.nvmrc`.
  Rationale: User chose Node 24 LTS; matches the locally installed `v24.15.0`.
  Date/Author: 2026-06-27 / aaron + Claude.

- Decision: Standardize on npm. Delete `yarn.lock`, keep `package-lock.json`.
  Rationale: User chose npm; the website currently has both lockfiles, which is ambiguous and risky.
  Date/Author: 2026-06-27 / aaron + Claude.

- Decision: Remove unused dependencies `graphql` and `@stripe/stripe-js`. Move dead components `ItemSelection.tsx` / `TipSelection.tsx` into the existing `client/website/old/` folder and drop unused `luxon` / `@types/luxon`.
  Rationale: Per `CLAUDE.md` "Surgical changes" these are flagged, not silently deleted. The repo already uses an `old/` folder for deprecated components (commit `e428503`). User may veto any of these individually.
  Date/Author: 2026-06-27 / aaron + Claude.

- Decision: `components/Layout.tsx` (its `next/head` SEO + header/footer) is split into `app/layout.tsx` (server: HTML shell, `metadata`, footer) and `app/Header.tsx` (client: interactive nav). The now-orphaned `Layout.tsx` is moved to `old/`.
  Rationale: The migration itself orphaned `Layout.tsx` (only `pages/_app.js` consumed it); `CLAUDE.md` says to clean up orphans your own change creates. App Router needs SEO as a `metadata` export, not `next/head`.
  Date/Author: 2026-06-27 / aaron + Claude.

- Decision: Exclude `old/` from TypeScript checking (`tsconfig.json` `exclude`).
  Rationale: `old/` is the dead-code folder; under React 19 types its retired files could raise type errors. Excluding avoids scope-creep fixes to code that is not shipped.
  Date/Author: 2026-06-27 / aaron + Claude.

- Decision: Preserve Google Analytics web-vitals reporting via a `useReportWebVitals` + `sendGAEvent` client component (`app/WebVitals.tsx`) rather than dropping it.
  Rationale: The old `reportWebVitals` in `pages/_app.js` reported vitals to GA; keeping behavior identical. `@next/third-parties` provides `sendGAEvent`.
  Date/Author: 2026-06-27 / aaron + Claude.

## Outcomes & Retrospective

Achieved: `client/website` now runs on Next.js 16.2.9, React 19.2.7, TypeScript 6.0.3, targets Node 24 LTS (`.nvmrc`), and uses the App Router. `npm run build` is clean and the production build renders the page identically — all sections, bundled images (Next-optimized), CDN images (custom loader), and SEO metadata. Stack matches the original goal: latest Next/React, current Node, single (npm) lockfile.

Gaps / follow-ups:
- Google Analytics is wired (`GoogleAnalytics` mounts when `NEXT_PUBLIC_GA_ID` is set) but live event firing was not verified in a browser — confirm in a real deploy with the env var present.
- `next start`/`dev` default port 3000 collides with another local app; deploy/CI should set the port explicitly or it is a non-issue in production.
- `old/` retains retired components (`Layout.tsx`, `ItemSelection.tsx`, `TipSelection.tsx`, plus pre-existing `menu.tsx`/`order.tsx`); delete whenever desired.
- `npm audit` reported 2 moderate advisories in the fresh tree; not addressed here (out of scope).

Lessons: the only non-trivial App Router gotcha for this static site was the `next/image` custom-loader server→client boundary, solved with a small client wrapper. Everything else was a faithful file move plus metadata/GA modernization.

## Context and Orientation

Working directory for all commands: `client/website` (relative to repo root `/Users/aaronchen/Desktop/realtime-orders`).

Current state of `client/website`:

- Router: **Pages Router**. Files: `pages/_app.js` (wraps every page in `components/Layout.tsx`, imports `styles/globals.css`, defines `reportWebVitals` for Google Analytics), `pages/_document.js` (custom `<Html>`/`<Head>`/`<body>` that injects the Google Analytics gtag.js `<script>` tags), `pages/index.tsx` (the landing page), `pages/api/hello.js` (unused Next.js starter boilerplate).
- Components (`components/`): `Layout.tsx` (header nav + footer + `Contact`; uses `next/head`, `next/link`, `next/image`, `onClick` handlers calling `lib/gtag.ts`), `Contact.tsx` (static address / social links), `ItemSelection.tsx` and `TipSelection.tsx` (dead code; use `useRef` + `onClick`/`onChange`).
- Libraries (`lib/`): `gtag.ts` (Google Analytics helpers; reads `process.env.NEXT_PUBLIC_GA_ID`), `dollarFormatter.ts`, `restaurantDetails.json` (hours, consumed by `Layout.tsx`).
- `loader.ts`: a custom Next/Image loader pointing at a CloudFront/Cloudinary CDN; passed as the `loader` prop on some `<Image>` tags in `pages/index.tsx`.
- `styles/`: `globals.css` plus SCSS modules (`*.module.scss`). `sass` is a dependency.
- Config: `next.config.js` (`module.exports = { images: {} }`), `tsconfig.json` (`target: es5`, `moduleResolution: node`).
- Lockfiles: BOTH `package-lock.json` and `yarn.lock` exist.

Current `package.json` (abridged): `next ^15.3.4`, `react ^18.3.1`, `react-dom ^18.3.1`, `graphql ^15.5.0`, `@stripe/stripe-js ^1.13.1`, `luxon ^3.0.3`, `sass ^1.32.8`; dev: `typescript ^4.9.5`, `@types/react ^17`, `@types/node ^14`, `@types/luxon ^3`.

Term definitions:

- **App Router**: Next.js routing based on an `app/` directory where folders map to routes; `layout.tsx` defines shared UI/HTML shell and `page.tsx` defines a route's content. Components are React Server Components by default; any component using browser-only features (state, refs, event handlers, `window`) must start with the `"use client"` directive.
- **Server Component**: A React component rendered on the server with no client-side JS by default. Cannot use hooks like `useRef`/`useState` or DOM event handlers.

## Plan of Work

Milestone 1 — Toolchain.
Create `client/website/.nvmrc` containing `24`. Delete `client/website/yarn.lock`. (Keep `package-lock.json`; it is regenerated in Milestone 2.)

Milestone 2 — Dependencies.
Edit `client/website/package.json`:
- `dependencies`: set `next` to `^16.2.9`, `react` to `^19.2.7`, `react-dom` to `^19.2.7`; keep `sass`; add `@next/third-parties` (latest) for Google Analytics; remove `graphql`, `@stripe/stripe-js`, and (pending user confirmation) `luxon`.
- `devDependencies`: set `typescript` to `^6.0.3`, `@types/react` to `^19`, `@types/react-dom` to `^19`, `@types/node` to `^24`; remove `@types/luxon` if `luxon` is removed.
- Add an `engines` field: `"engines": { "node": ">=24" }`.
- Add a `lint` script (`next lint`) if not present.
Then run `npm install` to regenerate `package-lock.json`.

Milestone 3 — App Router migration.
Create `client/website/app/`:
- `app/layout.tsx` (Server Component): exports `metadata` (title/description previously in `next/head`), renders the `<html><body>` shell, imports `styles/globals.css`, renders the persistent header/footer (migrated from `components/Layout.tsx`) around `{children}`, and mounts `<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />` from `@next/third-parties/google`. This replaces both `pages/_app.js` and `pages/_document.js`.
- `app/page.tsx`: the landing page body migrated from `pages/index.tsx` (image gallery, contact, about, takeout sections). Stays a Server Component (no hooks used).
- The header nav in `Layout` uses `onClick` to fire GA events; extract that interactive nav into a small `"use client"` component (e.g. `app/Nav.tsx` or `components/Nav.tsx`) so `app/layout.tsx` can stay a Server Component. `Contact.tsx` is static and needs no directive.
- Web vitals: replace the old `reportWebVitals` export with the `useReportWebVitals` hook from `next/web-vitals` inside a tiny `"use client"` component, OR rely on `@next/third-parties` GA + Next's built-in vitals — choose the simplest that preserves current GA reporting.
- Delete the `pages/` directory once `app/` is verified equivalent: `pages/_app.js`, `pages/_document.js`, `pages/index.tsx`, `pages/api/hello.js`.
- Move dead components `components/ItemSelection.tsx` and `components/TipSelection.tsx` into `client/website/old/` (pending user confirmation).

Milestone 4 — Config.
- `tsconfig.json`: set `target` to `ES2017` (Next 16 minimum/recommended), `moduleResolution` to `bundler`, keep `strict: false` (matching current setting to avoid a strictness sweep — out of scope). Let `next dev`/`next build` regenerate `next-env.d.ts`.
- `next.config.js`: review the empty `images` block; if the CloudFront/Cloudinary domain needs to be allowed for `next/image`, add it under `images.remotePatterns`. Otherwise leave as-is. Consider renaming to `next.config.ts` only if trivial; otherwise keep `.js` (surgical).

Milestone 5 — Verification (see Validation and Acceptance).

## Concrete Steps

Run all commands from `client/website`.

Milestone 1:

    cd client/website
    printf '24\n' > .nvmrc
    rm yarn.lock

Milestone 2 (after editing package.json per Plan of Work):

    npm install
    # expected: package-lock.json updated, node_modules installed, no peer-dep errors that block install

Verify versions:

    npx next --version    # expected: Next.js v16.2.9 (or newer 16.x)
    node -p "require('react').version"   # expected: 19.x

Milestones 3–4 are file edits (no special commands).

Milestone 5:

    npm run build
    # expected: "✓ Compiled successfully" and a route list showing "/" (and no "/api/hello"); no type errors.

    npm run dev
    # then open http://localhost:3000 and verify the acceptance checklist below.

## Validation and Acceptance

The change is accepted when ALL of the following hold:

1. `npm run build` completes with no TypeScript or build errors, and the printed route list shows the App Router `/` route (an `app/` build, not `pages/`).
2. `npm run dev` serves `http://localhost:3000` and the page is visually identical to the pre-upgrade site: logo, tagline, four-image gallery, "Try us out" + Contact block, store image, About section, takeout image.
3. The header nav links work and (with `NEXT_PUBLIC_GA_ID` set) fire Google Analytics events; the gtag script loads (verify a `googletagmanager.com/gtag/js` request in the browser Network tab).
4. The CDN-loaded images (`restaurant.jpeg`, `takeout.jpeg` via `loader.ts`) and the bundled images render without broken links.
5. `npx next --version` reports 16.x and React resolves to 19.x.
6. No `pages/` directory remains; `app/layout.tsx` and `app/page.tsx` exist.

Evidence to capture in Artifacts and Notes: the `npm run build` route-list output and a confirmation note (or screenshot) of the rendered page.

## Idempotence and Recovery

All work happens on a feature branch; the upgrade is one or more commits that can be reverted with `git revert`/`git reset`. Steps are rerunnable: re-running `npm install` is safe; the `app/` migration is additive until the final deletion of `pages/`, so both routers can briefly coexist for comparison (Next will error on a route defined in both — migrate one route, `/`, so resolve by deleting `pages/index.tsx` before final build). If the build fails, roll back by restoring `pages/` from git and reverting `package.json`.

Recommended: create the branch before starting —

    git checkout -b upgrade/website-next16

## Artifacts and Notes

`npm run build` (key output):

    ▲ Next.js 16.2.9 (Turbopack)
    ✓ Compiled successfully in 973ms
      Running TypeScript ...
      - jsx was set to react-jsx (next.js uses the React automatic runtime)
    ✓ Generating static pages using 4 workers (3/3)
    Route (app)
    ┌ ○ /
    └ ○ /_not-found
    ○  (Static)  prerendered as static content

Runtime check (`next start -p 3007`):

    status: 200
    content: "Serving the best gyros, shawarmas, and falafels since 1976.", "Try us out", "About Us", "TAKEOUT & DINE-IN"
    CDN images: d7xe6a0v1wpai.cloudfront.net/restaurant.jpeg, d7xe6a0v1wpai.cloudfront.net/takeout.jpeg
    title: <title>Cedars of Lebanon | Seattle's Best Gyro and Falafels</title>

Installed versions: next 16.2.9, react 19.2.7, react-dom 19.2.7, typescript 6.0.3.

## Interfaces and Dependencies

At completion, `client/website` must contain:

- `app/layout.tsx` — default-exported React component rendering `<html><body>`, exporting a `metadata` object, mounting Google Analytics.
- `app/page.tsx` — default-exported Server Component for the `/` route.
- A client component for the interactive nav (`"use client"`), and a client component or hook for web-vitals GA reporting.
- `.nvmrc` containing `24`; `package.json` with `next@^16`, `react@^19`, `react-dom@^19`, `typescript@^6`, `@types/react@^19`, `@types/node@^24`, `@next/third-parties`, and an `engines.node >= 24` field.
- A single lockfile: `package-lock.json` (no `yarn.lock`).
- `tsconfig.json` with `target: ES2017`, `moduleResolution: bundler`.

Unchanged/preserved: `lib/gtag.ts` (GA env contract `NEXT_PUBLIC_GA_ID`), `loader.ts` (CDN image loader), `styles/` (globals + SCSS modules), `components/Contact.tsx`, `public/` assets.
