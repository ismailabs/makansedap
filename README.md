# MakanSedap

A five-page fictional Malaysian fusion restaurant concept by ISMAIL. Built with static HTML, CSS and progressive vanilla JavaScript. The 51 original menu entries, including every description, are preserved from commit `65baebd38ed82e9f42d04eb3c639ffff41dc625d`.

Public target: https://makansedap.ismailstudio.my/
Repository: https://github.com/ismailabs/makansedap
Website services: https://ismailstudio.my/

V2 website enquiries: https://wa.me/601163265610 — verified on the live Studio homepage on 19 October 2026. This opens the Studio's existing WhatsApp contact; the restaurant demo collects no messages or personal information.

## V2 editorial redesign

The current five-route design uses pandan, aubergine and lilac, with distinct page compositions and paired Studio/enquiry actions. See `docs/V2-DESIGN.md`, `docs/V2-SKILL-AUDIT.md`, `docs/V2-VISUAL-REVIEW.md` and `docs/V2-RELEASE-REPORT.md`. V2 evidence is saved separately in `qa/v2/`; prior release receipts and locked menu baselines are preserved. `node scripts/v2-extended-qa.mjs` checks category history, filtered gallery wrap/focus, booking privacy and actual 200% text at seven widths.

Author V2 styles in `site/assets/css/v2.css`, then run `node scripts/prepare-css.mjs`. The compile includes the existing font definitions and V2 styles only. `node scripts/artwork-v2.mjs` regenerates the social card from existing licensed/project imagery.

Release only the tested Git commit: use authenticated Wrangler with `deploy --var RELEASE_COMMIT:<full-source-SHA>`, then run `verify-production.mjs` with `VERIFY_COMMIT` set to that SHA, plus `asset-manifest.mjs` and `verify-assets.mjs`. The release binding is deliberately supplied at deployment rather than retaining an obsolete SHA in configuration. Capture the active deployment before a release and use an explicit prior version for rollback. `qa/v2/cloudflare-version-before.json` preserves the V2 rollback version and settings. The release report records actual source/deployment identities and results.

Inherited exception: the old `rasairon.ismailstudio.my` hostname returned authoritative NXDOMAIN before V2. This release does not alter old DNS, redirects or Workers. Legacy redirect tests remain opt-in using `CHECK_REDIRECT=1`; primary production tests do not misreport that inherited DNS failure as a V2 regression.

## Develop and verify

Use Node.js 24 and npm. Run `npm ci`, `npm run preview` (http://127.0.0.1:8000), `npm test`, `npm run audit` and `node scripts/security-smoke.mjs`. Playwright browsers must be available. Firefox currently fails to launch on this Windows host; the report records that as unavailable. The audit measures local mobile simulation, not field Core Web Vitals.

Edit authored CSS in `site/assets/css/` and run `node scripts/prepare-css.mjs` to compile the shipped stylesheet. `site/` is the complete static output. Five routes: `/`, `/menu/`, `/story/`, `/gallery/`, `/visit/`. No framework, backend, cookies, personal-data collection, analytics or actual booking. The reservation preview validates illustrative choices entirely in the browser.

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
