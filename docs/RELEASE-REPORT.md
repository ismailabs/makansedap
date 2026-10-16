# MakanSedap release report — 17 October 2026 (MYT)

## Verified local candidate

Five static routes redesigned from RASA & IRON to MakanSedap. The original 51 category/name/price/description records compare exactly to the locked pre-edit snapshots. New wordmark, warm charcoal/botanical/terracotta palette, photography-led hero, menu cards, gallery categories, responsive layouts, social artwork and indexable metadata are implemented. Fictional status, no real restaurant operation, no claimed halal certification, no actual reservation/payment and ISMAIL website-service links remain clear.

- `npm ci`: 145 packages installed, 146 audited, zero vulnerabilities reported.
- `npm test`: 65 passed, zero failed; Chromium 156.0.8078.4, WebKit passed. Firefox could not launch (`spawn UNKNOWN`), recorded as unavailable.
- 45 route/width renders: 320, 375, 390, 568, 768, 860, 1024, 1440 and 1920px. No horizontal overflow.
- Ten axe WCAG A/AA scans: zero reported violations. Keyboard navigation, focus/return, all menu filters/deep links, gallery filters/modal, booking validation, zero transmission/storage, no-JS, reduced motion and 200% root text sizing at 768px passed. Automated checks do not constitute accessibility certification or physical-device testing.
- `node scripts/security-smoke.mjs`: exact configured CSP on all five routes and interactions passed.
- `node scripts/worker-test.mjs`: asset passthrough, security headers and exact-host 301 path/query redirects passed.
- Wrangler 4.151.1 dry-run: configuration and Worker bundle succeeded; 1.12 KiB before final release binding header, 1 ms API-reported startup for preview.
- `npm run audit`: Lighthouse 13.5 local simulated mobile. Home/Menu/Story/Gallery/Visit performance 71/92/97/97/95. Accessibility, best practices and SEO 100 for every page. LCP 2.67/3.20/2.44/2.58/1.96 seconds. CLS 0/0/0.0215/0.0136/0.0001.
- Three unchanged homepage follow-ups: performance 69/94/96, TBT 1095/0/0 ms. All runs retained; the spread limits performance conclusions. No field Core Web Vitals claim.

## Visual evidence

Full-page 390px and 1440px screenshots for every route are in `qa/screenshots/`. Actual viewport and interaction captures are in `qa/inspection/`. Five `qa/comparisons/*.jpg` boards compare original desktop/mobile, current desktop/mobile and the relevant concept-board panel. This is an informed qualitative comparison, not pixel parity. The concept is intentionally adapted to protected menu content and truthful demo UX.

## Hosting and rollback authority

The old public root and menu returned 200 with the original RASA & IRON content before migration (`qa/baseline/production-before.json`). Cloudflare account inspection found no Pages projects; actual old hosting is Worker `rasairon`. Original deployment `9b06e465-8895-4ab1-82dd-1ee1d82f5480`, version `67ffe593-936a-4d64-96f9-d9c9d53d9965`, stays available for rollback. Repository baseline SHA `65baebd38ed82e9f42d04eb3c639ffff41dc625d` is saved on `codex/makansedap-baseline-20261017`.

Local Wrangler is not logged in. Release uses the authorized Cloudflare connector and documented static-asset upload API. Short-lived upload/completion tokens are held in process/session memory, not evidence files. The first upload returned Cloudflare HTTP 500; multipart upload was retried with the documented field format and all three buckets completed.

## Production verification — passed

Live website: https://makansedap.ismailstudio.my/ . Original repository renamed in place to https://github.com/ismailabs/makansedap with stable GitHub repository ID 1420535711, public visibility, main branch and original history preserved. Source release commit is 656d42ed315de9f96bde042c725ed8012f941bd2. Local HEAD, origin/main and advertised remote main matched this SHA after the source push. The final evidence commit adds deployment receipts, report/configuration details and verification helpers; it does not change deployed site content.

Cloudflare Worker makansedap version c3ae4573-1b31-452b-b929-3db6536ea0b8, deployment e7fd8c66-3543-4933-b826-b7b4ced05f0a at 100 percent. Managed custom domain enabled with certificate ID 828cfc34-876c-4f38-ab84-e6a2db8a3997. HTTPS requests passed normal certificate validation. X-Release-Commit reports the source SHA above. All five production HTML bodies match local release source byte for byte; the 51 menu records match the locked baseline exactly. Ten production browser/axe checks passed at 390px and 1440px, with no overflow, broken assets, page exceptions or HTTP asset errors. Menu filtering, filtered gallery next/focus return and reservation preview work under production CSP. Production robots, sitemap, favicon and social card match source; canonical/OG metadata points to the new domain and neither HTML nor HTTP responses block indexing.

The exact-host Single Redirect rule 3d27793c06ee42c29b0f68965b48c1bc in ruleset c786f5605c6342cebe1e12ffa18a99ca returns 301 for rasairon.ismailstudio.my only, targeting the new HTTPS host with original path and query. Verified root, all four inner pages, a multi-parameter menu URL, HTTP old-host URL, image path and encoded-query unknown path. Valid routes follow to 200 without loops; unknown new routes return 404. No old Worker/DNS replacement was needed. Original rasairon deployment remains unchanged and ready for rollback by disabling this one redirect rule.

All 85 manifest asset endpoints verified: 80 served files match expected byte length and content hash; five explicit index.html URLs correctly redirect to clean routes whose full HTML was independently matched. See qa/production-assets.json. Production evidence is in qa/production-verification.json, qa/cloudflare-release.json and ten qa/production/ screenshots. Source-stage Gitleaks scan found no leaks; final evidence-stage scan is recorded separately.

Rollback: disable only the migration rule identified above to restore old-host content immediately. Original Worker version 67ffe593-936a-4d64-96f9-d9c9d53d9965 remains active. The recovery branch and original HTML/menu/QA snapshots remain available. New hostname can stay online during investigation; no deletion or force push is needed.

## Changed files

Changes cover the five HTML routes, authored/compiled CSS, vanilla interaction script, icons/social artwork, robots/sitemap/security headers, package identity, QA/production verification and comparison scripts, Cloudflare Worker/config, README, implementation/release guides, and committed handoff/evidence assets. The original qa/menu-contract.json is unchanged. A complete changed-path list is in qa/makansedap-changed-files.txt.

## Scope and limits

No unrelated services, zone-wide security changes, credentials, force pushes, real booking/submission or real restaurant data were introduced. Existing AI-generated photography and local OFL fonts were retained with provenance. Old handoff/baseline documentation remains historical. Firefox, physical devices, manual screen-reader use and long-term field performance remain unverified. Search indexing itself takes time and is not guaranteed by valid metadata.
