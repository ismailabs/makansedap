# MakanSedap V2 release — 19 October 2026 (MYT)

## Candidate and scope

Five public routes rebuilt as a Malaysian supper-table editorial experience, with distinct compositions, responsive layouts, existing generated imagery and local OFL fonts. Studio portfolio and the exact verified WhatsApp website-enquiry destination appear together on every route. No dependencies, analytics, backend, personal-data collection, payments or actual reservations were added.

Source baseline: `bfbb3dedaffa6adbe6725ceda63a3d795a0ec854`, retained on `codex/makansedap-v2-baseline-20261019`. Pre-existing local old-handoff deletions and untracked skill/handoff folders are preserved outside the staged redesign. Original `qa/` evidence and both locked menu baselines remain unchanged; new evidence lives under `qa/v2/`.

## Verified local gates

- `npm ci`: 145 packages installed, 146 audited, zero reported vulnerabilities.
- CSS prepared with `node scripts/prepare-css.mjs`; two authored sources, one shipped request.
- `npm test`: 65 checks passed, no failures. All 51 original menu categories/names/prices/descriptions compare exactly. All five pages rendered at nine widths from 320 to 1920px without overflow. Ten axe scans reported zero violations. Chromium 156.0.8078.4 and WebKit passed; Firefox could not launch (`spawn UNKNOWN`).
- `node scripts/v2-extended-qa.mjs`: 17 passed, no failures, including actual 200% text across 35 route/width combinations, category history/deep links, all filtered gallery wraps/focus, booking boundary/tamper/privacy behavior, no-JS and image failure.
- Exact configured CSP passed on all five routes with gallery and reservation interactions; Worker header/asset/redirect unit tests passed.
- A final browser-computed keyboard-focus check covers seven representative controls on light/dark backgrounds. Gold outlines measured 2.34:1 on plum, so dark regions now use butter outlines at 9.80:1. All seven indicators exceed 3:1. The focused repair versions the CSS URL again so returning browsers receive it.
- Fresh visual review of all five routes at 390px/1440px resolved four findings. See `docs/V2-VISUAL-REVIEW.md` and `qa/v2/visual-review-*`. Screenshot review is qualitative, not an accessibility certificate or measured conversion claim.
- Authenticated cached Wrangler 4.151.1 matched the configured Cloudflare account. Dry-run bundle succeeded, 1.12 KiB raw / 0.56 KiB gzip. No infrastructure was changed by dry run. The release supplies `RELEASE_COMMIT` explicitly, rather than retaining an obsolete config value.

Lighthouse 13.5 used default mobile simulated throttling against local HTTP. Initial performance scores were Home 67, Menu 51, Story 97, Gallery 75, Visit 71; accessibility/best practices/SEO were 100 throughout, with CLS 0. Controlled unchanged repeats produced Home 77/99/96, Menu 98/96/99, Gallery 98/90/89, Visit 91/99/96. Repeat LCP was at most 2.636s and CLS at most 0.032. All initial and repeat reports are retained in `qa/v2/lighthouse/` and `qa/v2/performance-diagnosis/`, without score filtering. Fifteen raw local cold-context navigations reproduced startup/native-layout timing variation; ordinary app script durations were around 1.5–2.9ms, with cold outliers around 18–22ms. The severe initial multi-second menu blocking was not repeatable. This is a lab limitation, not proof of field Core Web Vitals or consistent performance on physical devices. No speculative CSS rewrite was justified by the measurements.

## Published release and live verification

The V2 source is published on `main` at `695daaa31b57b6d3af261696644db2f80ef2e7ab` (`fix: strengthen keyboard focus contrast on dark sections`). Its parent implementation commit is `e16cbc08ba95a378792fb265852fe15a7cd9978e`. The five production pages and assets match the final source commit. The evidence-only report update is published separately so the Cloudflare release identity continues to point at the exact tested source.

On 19 October 2026, authenticated Wrangler 4.151.1 confirmed Cloudflare Worker `makansedap` at `makansedap.ismailstudio.my` is serving deployment `759647e6-78d1-49ca-91ed-1ed7c0541f4a`, version `4866e79b-64af-45fa-bacc-6f2ea3c3e216`, with 100% traffic. The version annotation names source `695daaa3`. Before deployment, the local source, GitHub `main` and advertised remote SHA matched. The active deployment was checked again after release, and the deployment history still identifies this V2 version as current.

The final serialized HTTPS verification passed on the production hostname. All five canonical routes returned HTTP 200 and byte-for-byte matched the committed HTML; each exposed the expected `X-Release-Commit`, configured CSP/security headers, indexable metadata, and both verified Studio conversion links. The menu matched all 51 locked categories, names, prices and descriptions. All 86 asset and canonical-route endpoint checks passed their expected status and byte/hash comparisons; the five canonical `index.html` paths redirected to their slash routes and an unknown path returned 404.

Chromium 156 checked all five routes at 390px and 1440px: ten page/viewport results, zero axe violations, zero horizontal overflow, and no browser or failed-request errors. The menu filter, browser-history category state, gallery filtering/lightbox navigation/focus return, and reservation preview passed. The reservation preview created no request beyond same-origin static assets and wrote no browser storage or cookies. A JavaScript-disabled pass confirmed all five pages retain navigation and content, the menu shows 51 entries, and booking controls stay disabled. Hosted extended QA passed all 17 checks, including 200% text sizing across seven widths (35 route/width combinations), reduced motion and failed-image handling, CSP, booking validation/privacy and real 404 behavior. Seven representative browser-computed keyboard focus outlines measured 4.88:1 or higher; butter outlines on plum measured 9.80:1.

The first combined browser run hit a 30-second `load` timeout while the hosted suites were running together. Its partial receipts are retained in `qa/v2/iterations/final-verification-first-attempt.json`; rerunning the production verifier alone passed all ten route/viewport checks. This was a transient verification-run timeout, not a page or route failure.

Release receipts and screenshot locations:

- `qa/v2/cloudflare-release.json`: deployment/version IDs, rollout state, source commit and rollback target.
- `qa/v2/production-verification.json` and `qa/v2/production/`: final HTTP, browser, interaction and screenshot results.
- `qa/v2/production-assets.json`: 86 asset/route endpoint checks.
- `qa/v2/extended-hosted-results.json`: 17 hosted extended checks and selected interaction screenshots.
- `qa/v2/focus-contrast-production.json`: seven hosted focus-outline contrast results.
- `qa/v2/visual-review-contact-sheet.png` and `qa/v2/visual-review-*`: five-route visual review.

The earlier focus outline issue was fixed and the resulting CSS asset URL was versioned before this production verification. No deployment or source change occurred during the final verification.

## Reversible production path

Worker: `makansedap`; domain: `makansedap.ismailstudio.my`; static directory: `site/`. Current production was inspected through live HTTPS and authenticated Wrangler. Prior active deployment `e7fd8c66-3543-4933-b826-b7b4ced05f0a`, version `c3ae4573-1b31-452b-b929-3db6536ea0b8`, 100% traffic. Its source header is `656d42ed315de9f96bde042c725ed8012f941bd2`. Receipts: `qa/v2/cloudflare-before.json`, `qa/v2/cloudflare-version-before.json`, `qa/v2/baseline-live.json`.

If the V2 critical gates fail, first check the active deployment to avoid overwriting a concurrent release, then use authenticated Wrangler: `rollback c3ae4573-1b31-452b-b929-3db6536ea0b8 --name makansedap --message "Restore verified pre-V2 version" --yes`. Verify the five old release bodies, header and interactions after recovery. This restores the same named Worker's prior code/assets/bindings; no DNS or other Worker changes are needed. A Git revert alone does not roll back Cloudflare.

## Inherited exception and evidence limits

The old `rasairon.ismailstudio.my` hostname returned authoritative NXDOMAIN from Cloudflare and Google public DNS **before** V2. Historical redirect evidence remains intact, but a functioning old-host redirect cannot currently be claimed. No old DNS, Worker, redirect/ruleset, zone-wide or unrelated service edits are authorized or performed here.

Firefox, physical devices, manual screen-reader operation, field Core Web Vitals/INP and actual conversion-rate change remain unverified. The WhatsApp contact was verified as published by the real Studio and resolving to the official send endpoint; no message or actual service enquiry was sent.

## Skills

All ten local skill instructions were audited. Selective frontend art-direction, design-token, web/accessibility/performance and existing-Worker guidance informed the implementation and verification. Duplicate umbrella, banner, slides, framework-specific and unavailable asset-generation pipelines were deferred. No skill folders were modified or removed. See `docs/V2-SKILL-AUDIT.md` for findings, conflicts and reasoned consolidation recommendations.
