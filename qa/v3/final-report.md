# MakanSedap V3 — DONE-VERIFIED

20 October 2026. All mandatory local, visual, performance and hosted acceptance gates pass. The user explicitly approved the repaired `1c0eb63` source for main-branch publication and deployment. It is live at [MakanSedap](https://makansedap.ismailstudio.my/) on the existing Worker with 100% traffic. The earlier performance waiver was declined; that failing candidate was never deployed. No waiver is used for this repaired release.

The approved Living Malaysian Table direction retains semantic HTML, modular vanilla source, responsive concept artwork, pinned self-hosted GSAP/ScrollTrigger for bounded scroll scenes, native feedback, exact menu/gallery data, and fictional-booking privacy. The native modules compile to one 6.7KB raw low-priority runtime; the separate GSAP vendor stays lazy. All 26 skills are mapped in [skill-usage.md](skill-usage.md).

Deployed/qualified source: `1c0eb6334fc23a52193ca4f3949163edb1be49df`. Tested implementation source: `6bbb502bd8aca1040150ed8d7b3f59691050ec2e`, independently verified on [codex/makansedap-v3](https://github.com/ismailabs/makansedap/tree/codex/makansedap-v3). [Source receipt](release-identity.json) binds every tested runtime/supporting file. Receipt-only commits do not change the tested runtime.

## Gate record

| Gate | State | Evidence |
| --- | --- | --- |
| H01 Source integrity | PASS | Exact implementation source and remote verified in release-identity.json; deterministic rebuild and all Git-filtered blobs match. Staged Gitleaks/diff checks pass. Protected data/history and unrelated local work remain intact. |
| H02 Routes/SEO | PASS local + hosted | [local/results.json](local/results.json): five routes, canonical/meta/social/sitemap/robots, actual 404, unique titles/descriptions. |
| H03 Menu | PASS | Exact 51 category/name/price/description/order records and seven group/item identities, filtering, history/fragments, 51 visible with JS off. [scenes/results.json](scenes/results.json), core and extended receipts. Baselines untouched. |
| H04 Gallery | PASS local + hosted | All 17 original metadata/link/alt/caption records; filters, wrap, keyboard, Escape, focus return, image-failure recovery and no-JS links. |
| H05 Reservation | PASS local + hosted | Guest/date/time boundaries, semantic progress and seats, explicit no-booking result; zero personal fields, data-bearing requests, cookies or storage. Static same-origin GETs may finish loading during interaction; method/body/path/query assertions reject submission. |
| H06 Studio | PASS | Exact named Studio destinations on all routes; [fresh Studio source check](studio-verification.json) confirms the enquiry link. No message sent. |
| H07 Accessibility | PASS within tested scope | Zero axe WCAG 2/2.1/2.2 A/AA violations at 390/1440; separate keyboard, focus, modal/labels, seven computed focus-contrast checks, actual per-element 200% text, forced colors and reduced motion. |
| H08 Responsive/no-JS | PASS local + hosted | Nine normal widths from 320 to 1920 on all five pages; seven widths at 200% text; all required no-JS tasks. Fifteen actual full-page captures at 390/768/1440. |
| H09 Security | PASS local + hosted | Exact unchanged CSP and Worker/config/header files; no third-party runtime, data collection or unsafe script; security-smoke and Worker tests pass. Gitleaks 8.30.1 found no leaks in the reviewed staged diff. |
| H10 Motion | PASS local + hosted | [14 V3 scene checks](scenes/results.json), browser RAF samples, actual screenshots and local traces: touch/desktop opening, reversible unpinned scroll, category staging, Studio dissolve, Story/Gallery/Visit, preference changes and failed imports. |
| H11 Licensing | PASS | [19 new asset hashes/provenance](asset-provenance.json), [credits](../../ASSET-CREDITS.md), unchanged OFL fonts, GSAP 3.15.0 Standard No Charge website use and retained notices. AI concept art is not documentary imagery. |
| H12 Reproducibility | PASS local commands | Core **65/0**, extended **17/0**, V3 **14/0**, CSP, focus **7/0**, Worker tests; complete paired Lighthouse run and visual capture scripts. Performance qualification passes below. Hosted source/asset verification, 17 extended checks, 14 scene checks and seven focus checks also pass. |
| H13 Release | PASS hosted | [Authorization](release-authorization.json), [deployment receipt](deployment-receipt.json), [live source/security checks](production-verification.json), [asset endpoints](production-assets.json), [final active version](cloudflare-after.json). Existing Worker/domain retained; no DNS changes. |
| Visual transformation | PASS by pixel review | [Concrete review](visual-review.md), [20 labelled comparison boards](comparisons/receipt.json), [15 actual captures](visual-final/receipt.json). The two taste-inspector heuristic exceptions are retained and narrowly explained in [taste-review.json](taste-review.json). |
| Performance | PASS local qualification | [Complete final delivery comparison](performance-delivery-paired/results.json), [assessment with all-run metrics](performance-assessment.json). |

## Performance repair and full comparison

Three interleaved V2/repaired-V3 runs per route use the same host/browser, identical gzip HTTP servers and default Lighthouse 13.5 mobile simulation. Order reverses in run 2. The V2 copy is validated against its original Git blobs. No other browser QA ran concurrently. All 18 raw reports, including every slow run, are retained.

| Median | V2 LCP | Repaired V3 LCP | V2 / V3 TBT |
| --- | ---: | ---: | ---: |
| Home | 2.875s | 2.118s | 503 / 250ms |
| Menu | 2.266s | 1.519s | 812 / 141ms |
| Gallery | 1.979s | 1.823s | 118 / 49ms |

All nine representative V3 runs have zero CLS and meet the brief's LCP aim. Accessibility, best-practices and SEO scores are 100 throughout. FCP is about 0.2s later than V2, with all representative V3 runs still below 1.0s. That small initial-paint cost is disclosed; the material Home/Menu LCP regression is absent, paired median blocking time improves on every representative route, and layout is stable. This assessment does not turn score targets into additional user-approved hard thresholds. These are local lab results, not field CWV, physical-mobile evidence or field INP. Supplementary Story/Visit audits are in [delivery-extra-audit](delivery-extra-audit/lighthouse-summary.json).

The repair flattens the opening native-module request chain into one small bundle, gives the functional core high priority and cosmetics low priority, preloads the two responsive LCP images with matching source sets, and corrects secondary/sidebar image slots. The Home secondary image now uses an existing-image 320px derivative, and the menu-stage fallback can select 240px. The actual request waterfall confirms the priorities and the absence of the GSAP vendor from the opening. The compositions, tasks and movements remain intact. Primary guidance: [Fetch Priority](https://web.dev/articles/fetch-priority) and [responsive image preloads](https://web.dev/articles/preload-responsive-images).

The earlier source 61f40e69eb5282d57d4a44b7107e1484954a909a remains documented in [its failed assessment](performance-assessment-61f40e6.json) and performance-release-paired/. Its 20–30% Home/Menu LCP regression was not waived or deployed. The isolated delivery experiment and every diagnostic run remain local; unlike sources/transports are not pooled. One scene-harness end-state assertion observed opacity 0.0021 at its sample-clock boundary. The check now waits for the browser's actual animation-finished signal before retaining the strict zero-opacity assertion; the independent real-time samples and visibility assertions remain. The repaired suite passes 14/0.

## Verified production and rollback

Production source is `1c0eb6334fc23a52193ca4f3949163edb1be49df`, Worker version `4993b7d7-6cfd-4941-af35-9139f3fabc9c` (number 5), deployment `8146fe99-8489-40fc-a889-6be4b061e2e6`, at **100%**. Account `44214a829e2337ca50cf40e4cd827cba`, Worker `makansedap`, existing custom domain `makansedap.ismailstudio.my`. GitHub main was independently checked at the exact qualified source before deployment. Final receipt-only publication does not change deployed code or the release header.

[Hosted verification](production-verification.json) proves five exact HTML/source-header matches, all exact security headers, SEO/social/robots/sitemap/favicon bytes, actual 404, all 51 menu records, ten zero-violation axe/overflow viewports, working gallery focus return and privacy-safe preview, no browser errors, and five-route no-JS behavior. [Asset verification](production-assets.json) checks 113 endpoints: five index-HTML redirects and 108 exact asset byte/hash matches; canonical HTML is separately compared in full. Hosted [extended checks](extended-hosted/results.json) pass **17/0**, [V3 scenes](scenes-hosted/results.json) **14/0**, and [focus contrast](focus-contrast-production.json) **7/0**. Full-page hosted captures and interaction traces remain local under production/, extended-hosted/ and scenes-hosted/. [Completion audit](completion-audit.json) consolidates the gates.

The prior V2 version `4866e79b-64af-45fa-bacc-6f2ea3c3e216` remains readable with source `695daaa31b57b6d3af261696644db2f80ef2e7ab`, independently rechecked after V3 deployment. If a critical failure later requires rollback, first re-query the active release and verify ownership/version; revalidate that prior version, then use project-local Wrangler 4.151.1: `node node_modules/wrangler/bin/wrangler.js rollback 4866e79b-64af-45fa-bacc-6f2ea3c3e216 --name makansedap --message "Rollback verified V3 release" --yes`. Re-verify five V2 routes and source header afterward. No test rollback was performed. The Worker has no build triggers; Git publication and deployment are separate operations. Configuration, DNS and unrelated Workers were preserved.

Chromium 156 and WebKit 27.2 were exercised. Firefox remains unavailable (spawn UNKNOWN). Physical touch hardware, OS/browser zoom and assistive-technology speech output were unavailable; emulation/200% CSS-text results are identified as such. The inherited rasairon.ismailstudio.my NXDOMAIN exception remains untouched. Raw large traces/captures and supplied reference mockups remain local; selected compact evidence is committed. User handoff deletions, skills, supplied handoff and historical V2 evidence remain preserved and unstaged.
