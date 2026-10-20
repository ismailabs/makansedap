# MakanSedap

A five-page fictional Malaysian fusion restaurant concept by ISMAIL. Built with static HTML, CSS and progressive vanilla JavaScript. The 51 original menu entries, including every description, are preserved from commit `65baebd38ed82e9f42d04eb3c639ffff41dc625d`.

Public target: https://makansedap.ismailstudio.my/
Repository: https://github.com/ismailabs/makansedap
Website services: https://ismailstudio.my/

V2 website enquiries: https://wa.me/601163265610 — verified on the live Studio homepage on 19 October 2026. This opens the Studio's existing WhatsApp contact; the restaurant demo collects no messages or personal information.

## V3 — The Living Malaysian Table

The five routes now share a cinematic culinary direction: dark food/ingredient Home opening, bounded reversible scroll transformation, immediate category staging around the exact menu, Roots/Fire/Table essay, mixed-scale visual journal, imaginary-table progress and a Studio finale. Native scrolling and all content work without the motion module. Reduced motion has a complete static fallback.

Author styles in `site/assets/css/v3.css`; `npm run build` compiles fonts + V3 only and bundles pinned same-origin GSAP/ScrollTrigger. Historical V2 authored CSS and evidence are preserved. `npm test`, `npm run test:extended`, `npm run test:v3`, `npm run test:security`, `npm run test:worker` and `npm run test:focus` cover the functional, motion, privacy and security contracts. `npm run audit` accepts QA_ROOT, AUDIT_RUNS and AUDIT_ROUTES; SITE_ROOT can point to a preserved baseline copy for controlled comparison. New receipts live under `qa/v3/`.

See `qa/v3/final-report.md` for actual gate/release status, deployed source identity, rollback authority and evidence limits. No deployment success should be inferred merely from this README. `qa/v3/skill-usage.md`, `design-implementation-plan.md` and `asset-provenance.json` document design, skill decisions and rights.

Inherited exception: `rasairon.ismailstudio.my` returned authoritative NXDOMAIN before V2. This release does not alter old DNS, redirects or Workers. Legacy redirect tests remain opt-in using CHECK_REDIRECT=1; historical redirect receipts are not current proof.

## Develop and verify

Use Node.js 24 and npm. Run `npm ci`, `npm run preview` (http://127.0.0.1:8000), `npm test`, `npm run audit` and `node scripts/security-smoke.mjs`. Playwright browsers must be available. Firefox currently fails to launch on this Windows host; the report records that as unavailable. The audit measures local mobile simulation, not field Core Web Vitals.

Edit authored V3 CSS in `site/assets/css/v3.css` and run `npm run build` to compile the shipped stylesheet. `site/` is the complete static output. Five routes: `/`, `/menu/`, `/story/`, `/gallery/`, `/visit/`. No framework, backend, cookies, personal-data collection, analytics or actual booking. The reservation preview validates illustrative choices entirely in the browser.

## Content and assets

`qa/menu-contract.json` is the original category/name/price authority. `qa/menu-descriptions-baseline.json` was extracted before editing and also locks descriptions. `qa/baseline/menu-original.html` retains the original HTML. Never regenerate these baselines from redesigned output. The original snapshot contains historical brand/noindex values and is not deployed.

The concept board in `MakanSedap-Codex-Handoff/assets/` supplies visual inspiration only. Its fictional menu/business details are excluded. Production photography is locally stored AI-generated concept imagery retained from the original repository. Fonts are self-hosted under OFL; see `ASSET-CREDITS.md` and bundled licences.

## Hosting

The existing old host uses Cloudflare Worker `rasairon`, not Pages. The new site uses Worker `makansedap` with static assets and security headers (`scripts/worker.mjs`, `wrangler.jsonc`). `site/_headers` also supports static hosting. Cloudflare custom domains manage DNS and TLS. A Cloudflare Single Redirect rule matches only `rasairon.ismailstudio.my` and preserves path and query. It was enabled after the new host passed verification. The old Worker and its DNS remain intact; `scripts/redirect-worker.mjs` is a tested fallback, not the deployed redirect.

`node scripts/upload-assets.mjs` accepts a short-lived Cloudflare asset session over hidden stdin; it does not store credentials. Run `node scripts/asset-manifest.mjs` before the connector upload flow. `node scripts/verify-assets.mjs` checks every manifest endpoint against production. Normal CLI releases can use authenticated Wrangler; supply --var RELEASE_COMMIT:<full-source-SHA> for each release. Do not commit credentials or API session tokens. The connector-driven release uses the documented static-asset upload API because this host has no Wrangler login.

Indexability is deliberate in this approved rebrand: index/follow metadata, per-route canonical/OG URLs, sitemap and robots. No business schema, fabricated address, opening hours, certification, reviews or real bookings. Fictional disclosures are visible on every page.

## Evidence and continuation

See `docs/MAKANSEDAP-IMPLEMENTATION.md`, `docs/RELEASE-REPORT.md`, `qa/results.json`, `qa/lighthouse-summary.json`, `qa/comparisons/`, and `qa/production-verification.json`. Historical October 15 reports apply only to the original release.

Startup prompt: “Read the MakanSedap handoff, README, implementation guide and latest release report. Verify Git state and Cloudflare configuration. Preserve the two locked menu baselines and fictional/privacy boundaries; use actual HTTP/browser evidence for changes.”
