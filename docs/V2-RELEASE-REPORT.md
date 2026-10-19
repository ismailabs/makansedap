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
- Fresh visual review of all five routes at 390px/1440px resolved four findings. See `docs/V2-VISUAL-REVIEW.md` and `qa/v2/visual-review-*`. Screenshot review is qualitative, not an accessibility certificate or measured conversion claim.
- Authenticated cached Wrangler 4.151.1 matched the configured Cloudflare account. Dry-run bundle succeeded, 1.12 KiB raw / 0.56 KiB gzip. No infrastructure was changed by dry run. The release supplies `RELEASE_COMMIT` explicitly, rather than retaining an obsolete config value.

Lighthouse 13.5 used default mobile simulated throttling against local HTTP. Initial performance scores were Home 67, Menu 51, Story 97, Gallery 75, Visit 71; accessibility/best practices/SEO were 100 throughout, with CLS 0. Controlled unchanged repeats produced Home 77/99/96, Menu 98/96/99, Gallery 98/90/89, Visit 91/99/96. Repeat LCP was at most 2.636s and CLS at most 0.032. All initial and repeat reports are retained in `qa/v2/lighthouse/` and `qa/v2/performance-diagnosis/`, without score filtering. Fifteen raw local cold-context navigations reproduced startup/native-layout timing variation; ordinary app script durations were around 1.5–2.9ms, with cold outliers around 18–22ms. The severe initial multi-second menu blocking was not repeatable. This is a lab limitation, not proof of field Core Web Vitals or consistent performance on physical devices. No speculative CSS rewrite was justified by the measurements.

Source publication, deployment and final HTTPS verification are pending at this candidate-document checkpoint. Actual release receipts will follow below.

## Reversible production path

Worker: `makansedap`; domain: `makansedap.ismailstudio.my`; static directory: `site/`. Current production was inspected through live HTTPS and authenticated Wrangler. Prior active deployment `e7fd8c66-3543-4933-b826-b7b4ced05f0a`, version `c3ae4573-1b31-452b-b929-3db6536ea0b8`, 100% traffic. Its source header is `656d42ed315de9f96bde042c725ed8012f941bd2`. Receipts: `qa/v2/cloudflare-before.json`, `qa/v2/cloudflare-version-before.json`, `qa/v2/baseline-live.json`.

If the V2 critical gates fail, first check the active deployment to avoid overwriting a concurrent release, then use authenticated Wrangler: `rollback c3ae4573-1b31-452b-b929-3db6536ea0b8 --name makansedap --message "Restore verified pre-V2 version" --yes`. Verify the five old release bodies, header and interactions after recovery. This restores the same named Worker's prior code/assets/bindings; no DNS or other Worker changes are needed. A Git revert alone does not roll back Cloudflare.

## Inherited exception and evidence limits

The old `rasairon.ismailstudio.my` hostname returned authoritative NXDOMAIN from Cloudflare and Google public DNS **before** V2. Historical redirect evidence remains intact, but a functioning old-host redirect cannot currently be claimed. No old DNS, Worker, redirect/ruleset, zone-wide or unrelated service edits are authorized or performed here.

Firefox, physical devices, manual screen-reader operation, field Core Web Vitals/INP and actual conversion-rate change remain unverified. The WhatsApp contact was verified as published by the real Studio and resolving to the official send endpoint; no message or actual service enquiry was sent.

## Skills

All ten local skill instructions were audited. Selective frontend art-direction, design-token, web/accessibility/performance and existing-Worker guidance informed the implementation and verification. Duplicate umbrella, banner, slides, framework-specific and unavailable asset-generation pipelines were deferred. No skill folders were modified or removed. See `docs/V2-SKILL-AUDIT.md` for findings, conflicts and reasoned consolidation recommendations.
