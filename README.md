# MakanSedap

A five-page fictional Malaysian fusion restaurant concept by ISMAIL. Built with static HTML, CSS and progressive vanilla JavaScript. The 51 original menu entries, including every description, are preserved from commit `65baebd38ed82e9f42d04eb3c639ffff41dc625d`.

Public target: https://makansedap.ismailstudio.my/
Repository: https://github.com/ismailabs/makansedap
Website services: https://ismailstudio.my/

## Develop and verify

Use Node.js 24 and npm. Run `npm ci`, `npm run preview` (http://127.0.0.1:8000), `npm test`, `npm run audit` and `node scripts/security-smoke.mjs`. Playwright browsers must be available. Firefox currently fails to launch on this Windows host; the report records that as unavailable. The audit measures local mobile simulation, not field Core Web Vitals.

Edit authored CSS in `site/assets/css/` and run `node scripts/prepare-css.mjs` to compile the shipped stylesheet. `site/` is the complete static output. Five routes: `/`, `/menu/`, `/story/`, `/gallery/`, `/visit/`. No framework, backend, cookies, personal-data collection, analytics or actual booking. The reservation preview validates illustrative choices entirely in the browser.

## Content and assets

`qa/menu-contract.json` is the original category/name/price authority. `qa/menu-descriptions-baseline.json` was extracted before editing and also locks descriptions. `qa/baseline/menu-original.html` retains the original HTML. Never regenerate these baselines from redesigned output. The original snapshot contains historical brand/noindex values and is not deployed.

The concept board in `MakanSedap-Codex-Handoff/assets/` supplies visual inspiration only. Its fictional menu/business details are excluded. Production photography is locally stored AI-generated concept imagery retained from the original repository. Fonts are self-hosted under OFL; see `ASSET-CREDITS.md` and bundled licences.

## Hosting

The existing old host uses Cloudflare Worker `rasairon`, not Pages. The new site uses Worker `makansedap` with static assets and security headers (`scripts/worker.mjs`, `wrangler.jsonc`). `site/_headers` also supports static hosting. Cloudflare custom domains manage DNS and TLS. A Cloudflare Single Redirect rule matches only `rasairon.ismailstudio.my` and preserves path and query. It was enabled after the new host passed verification. The old Worker and its DNS remain intact; `scripts/redirect-worker.mjs` is a tested fallback, not the deployed redirect.

`node scripts/upload-assets.mjs` accepts a short-lived Cloudflare asset session over hidden stdin; it does not store credentials. Run `node scripts/asset-manifest.mjs` before the connector upload flow. `node scripts/verify-assets.mjs` checks every manifest endpoint against production. Normal CLI releases can use authenticated Wrangler; set RELEASE_COMMIT to the source commit for each release (the config records this release). Do not commit credentials or API session tokens. The connector-driven release uses the documented static-asset upload API because this host has no Wrangler login.

Indexability is deliberate in this approved rebrand: index/follow metadata, per-route canonical/OG URLs, sitemap and robots. No business schema, fabricated address, opening hours, certification, reviews or real bookings. Fictional disclosures are visible on every page.

## Evidence and continuation

See `docs/MAKANSEDAP-IMPLEMENTATION.md`, `docs/RELEASE-REPORT.md`, `qa/results.json`, `qa/lighthouse-summary.json`, `qa/comparisons/`, and `qa/production-verification.json`. Historical October 15 reports apply only to the original release.

Startup prompt: “Read the MakanSedap handoff, README, implementation guide and latest release report. Verify Git state and Cloudflare configuration. Preserve the two locked menu baselines and fictional/privacy boundaries; use actual HTTP/browser evidence for changes.”
