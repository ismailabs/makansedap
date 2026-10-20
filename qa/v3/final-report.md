# MakanSedap V3 — PARTIAL-BLOCKED

20 October 2026. The five-route implementation and local functional gates are complete. **Deployment is blocked by a repeatable material mobile-simulation performance regression. No performance tradeoff is approved. Production remains V2.** This is not a DONE or production-verification claim.

The approved Living Malaysian Table direction is implemented with semantic HTML, modular vanilla JavaScript, responsive concept artwork, self-hosted pinned GSAP/ScrollTrigger for the two bounded scroll scenes, native feedback, exact menu/gallery content, and explicit fictional-booking language. All 26 installed skill instructions were inspected and assigned a role or non-applicability reason in [skill-usage.md](skill-usage.md).

## Gate record

| Gate | State | Evidence |
| --- | --- | --- |
| H01 Source integrity | Pending final commit receipt | Feature branch `codex/makansedap-v3`, base `19e44f6c12dc4f5d4676ab9e4a0c76f70d8ea80a`. Protected JSON/historical QA have no diff; unrelated handoff deletions, local skills/handoff and V2 receipts preserved. Exact source and staged secret scan will be recorded in release-identity.json. |
| H02 Routes/SEO | PASS local | [local/results.json](local/results.json): five routes, canonical/meta/social/sitemap/robots, actual 404, unique titles/descriptions. |
| H03 Menu | PASS | Exact 51 category/name/price/description/order records and seven group/item identities, filtering, history/fragments, 51 visible with JS off. [scenes/results.json](scenes/results.json), core and extended receipts. Baselines untouched. |
| H04 Gallery | PASS local | All 17 original metadata/link/alt/caption records; filters, wrap, keyboard, Escape, focus return, image-failure recovery and no-JS links. |
| H05 Reservation | PASS local | Guest/date/time boundaries, semantic progress and seats, explicit no-booking result; zero personal fields, data-bearing requests, cookies or storage. Static same-origin GETs may finish loading during interaction; method/body/path/query assertions reject submission. |
| H06 Studio | PASS | Exact named Studio destinations on all routes; [fresh Studio source check](studio-verification.json) confirms the enquiry link. No message sent. |
| H07 Accessibility | PASS within tested scope | Zero axe WCAG 2/2.1/2.2 A/AA violations at 390/1440; separate keyboard, focus, modal/labels, seven computed focus-contrast checks, actual per-element 200% text, forced colors and reduced motion. |
| H08 Responsive/no-JS | PASS local | Nine normal widths from 320 to 1920 on all five pages; seven widths at 200% text; all required no-JS tasks. Fifteen actual full-page captures at 390/768/1440. |
| H09 Security | PASS local | Exact unchanged CSP and Worker/config/header files; no third-party runtime, data collection or unsafe script; security-smoke and Worker tests pass. Staged Gitleaks receipt required with H01. |
| H10 Motion | PASS local | [14 V3 scene checks](scenes/results.json), browser RAF samples, actual screenshots and local traces: touch/desktop opening, reversible unpinned scroll, category staging, Studio dissolve, Story/Gallery/Visit, preference changes and failed imports. |
| H11 Licensing | PASS | [17 new asset hashes/provenance](asset-provenance.json), [credits](../../ASSET-CREDITS.md), unchanged OFL fonts, GSAP 3.15.0 Standard No Charge website use and retained notices. AI concept art is not documentary imagery. |
| H12 Reproducibility | PASS local commands; release qualification FAIL | Core **65/0**, extended **17/0**, V3 **14/0**, CSP, focus **7/0**, Worker tests; complete paired Lighthouse run and visual capture scripts. Performance fails below. Hosted source/asset verification is deferred under H13. |
| H13 Release | BLOCKED / not attempted | No V3 deployment, main update, DNS or other infrastructure change. [Fresh production state](production-state-before.json) and [Cloudflare read](cloudflare-preflight.json) still identify V2. |
| Visual transformation | PASS by pixel review | [Concrete review](visual-review.md), [20 labelled comparison boards](comparisons/receipt.json), [15 actual captures](visual-final/receipt.json). The two taste-inspector heuristic exceptions are retained and narrowly explained in [taste-review.json](taste-review.json). |
| Performance | **FAIL — release veto** | [Complete comparison](performance-release-paired/results.json), [assessment and all-run metrics](performance-assessment.json). |

## Measured release blocker

Three interleaved before/after runs per route used the same browser/host, identical gzip HTTP servers and default Lighthouse 13.5 simulated mobile throttling. Order reverses in run 2. The preserved V2 copy was validated against its original Git blobs. No other browser QA ran concurrently. Every run, including slow runs, is retained.

| Median LCP | V2 | Final V3 | Change |
| --- | ---: | ---: | ---: |
| Home | 1.976s | 2.569s | +0.593s / +30.0% |
| Menu | 2.270s | 2.727s | +0.457s / +20.1% |
| Gallery | 1.982s | 1.899s | −0.083s / −4.2% |

All final V3 CLS results were 0. Accessibility, best-practices and SEO scores were 100 throughout the final comparison. CPU/TBT scores varied substantially on both versions; all values appear in the assessment. These are local lab measurements, not field Core Web Vitals or a measured field INP result. The veto is the repeatable added rendering delay on Home/Menu, not a newly invented numerical threshold or a cherry-picked score.

Specific repairs already measured: lazy GSAP only at scroll scenes; native entrance/feedback; two-frame first-paint scheduling; no initial global animation enumeration; batched/removed forced opening layout reads; static mobile focal plate with smaller-plane arrival; static Gallery primary art; smaller responsive lead images and corrected priorities; minified pinned CSS build. Earlier diagnostic candidates, Chrome traces and the interrupted/incomplete run remain locally available and are not pooled with the final comparison. The final paired run is complete (18 reports). There is no unbounded retry loop.

The acceptance document requires: “Any repeatable material regression introduced by V3 blocks release until mitigated or an explicit documented tradeoff is approved.” No such approval exists. The smallest release-unblocking action is a demonstrated mitigation on these two routes, or explicit approval of the quantified visual/performance tradeoff. Approval must not be inferred from elapsed time or the original general deployment authorization.

## Production and continuation

Current production source: `695daaa31b57b6d3af261696644db2f80ef2e7ab`. Current deployment: `759647e6-78d1-49ca-91ed-1ed7c0541f4a`; version `4866e79b-64af-45fa-bacc-6f2ea3c3e216` at 100%. Its version was freshly readable and its RELEASE_COMMIT binding matched V2. This is a current rollback reference, not authority to reuse it blindly after another release.

After the performance gate is resolved, re-run affected tests, record a complete PASS local gate report, verify remote/source ancestry and the active Cloudflare version again, and deploy the exact tested source SHA to existing Worker `makansedap` in account `44214a829e2337ca50cf40e4cd827cba` with `RELEASE_COMMIT`. Then run the production verifier, all asset-byte checks, hosted extended/V3 interactions and a fresh active-version/traffic/header check. Only those receipts can change the outcome to DONE-VERIFIED. If a critical live gate fails, re-query ownership before rolling back to the freshly recorded valid prior version and reverify it.

Chromium 156 and WebKit 27.2 were exercised. Firefox remains unavailable on this Windows host (`spawn UNKNOWN`). Physical touch devices, OS/browser zoom and assistive-technology speech output were not available; emulation/200% CSS text tests are identified as such. The inherited `rasairon.ismailstudio.my` NXDOMAIN exception remains untouched and no working redirect is claimed. Raw large screenshots/traces and supplied reference mockups remain local; selected compact evidence is published with the candidate. No secrets, machine paths, local skills or unrelated handoff deletions should be staged.
