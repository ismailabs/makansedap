# RASA & IRON — Recovery QA report

Date: 15 October 2026. Scope: local reconstruction, genuine browser verification, and GitHub source delivery. Cloudflare deployment, custom DNS and the ISMAIL portfolio are excluded. This report supersedes the old package's unrerun claims.

## Initial defects and root causes

| Finding | Evidence and correction |
|---|---|
| Unstyled file preview | Supplied screenshot showed `file:///` and broken root-relative CSS/images. Relative asset paths now work more portably; documented loopback HTTP preview is the supported workflow. This was not evidence of a deployed failure. |
| Reference/implementation gap | The available generated composite was located and viewed before work. Original code used 24 SVG scene illustrations, not photography; 18 original AI photographic scenes now provide the required hero, dishes, interiors and details. |
| Missing webfonts | Font-family names existed without font files. Local licensed Cormorant Garamond and DM Sans WOFF2 files now load and are verified in Chromium. |
| Wrong Git context | Git initially resolved to an unrelated user-directory repository. It was left untouched. A repository was initialized explicitly at `rasa-and-iron`; GitHub metadata and `ls-remote` confirmed the authorized repository was empty. |
| Content mismatch | Source-contract comparison found “Drinks” where the locked category heading was “Non-Alcoholic Drinks.” Corrected the heading, preserving the required Drinks filter label. All 51 names, prices and categories now match the brief. |
| Unproven earlier QA | Previous package described reconstructed/offline browser checks. New tests use direct HTTP navigation to the actual files, including nested routes. |

## Findings corrected during this recovery

- Preview server root path normalization initially rejected `/` with 403; corrected the path containment check, then reran real homepage navigation.
- Initial axe scans found insufficient small-label contrast on ivory Story/Visit surfaces; colours were darkened and all scans rerun.
- Menu feature images retained HTML height despite CSS aspect ratio, creating overly tall cards; actual screenshot inspection caught this, and responsive height was corrected.
- Native dialog behaviour permitted focus to leave controls in keyboard testing; explicit Tab/Shift+Tab wrapping now contains focus and restores the opener.
- 200% text enlargement exposed overflow in category, menu-price, philosophy and visit grids; min-width, wrapping and intermediate-width layouts were corrected.
- The mobile navigation test originally queried a button by its old accessible name after the name changed. The test now locates its stable `aria-controls` relationship and verifies both visible state names.
- Lighthouse's additional visible-label rule found custom accessible names that omitted visible brand/gallery text. Removed those overrides; the extra rule is now tested separately alongside the full WCAG-tagged axe scan.
- Images were recompressed, responsive `sizes` hints corrected, first Menu/Gallery imagery prioritized, and three stylesheets combined into one committed CSS response. No noindex directive was removed for scoring.

Initial evidence remains in `qa/initial-source-results.json`, `qa/initial-axe-results.json`, `qa/first-browser-results.json`, and `qa/lighthouse-initial-summary.json`. These are historical failures, not final pass receipts.

## Environment and repeatable checks

Windows, Node.js 24.19.0, Playwright 1.64.1, Chromium 156.0.8078.4, WebKit 27.2, axe-core Playwright 4.13.0, Lighthouse 13.5.0. Browser contexts use Asia/Kuala_Lumpur for date interaction tests. No public deployment was used.

| Command / check | Result |
|---|---|
| `npm test` | 64 passed, 0 failed; one explicitly unavailable engine |
| Exact menu source contract | 51/51 names, categories and prices; all descriptions present |
| Direct HTTP routes | Home, Menu, Story, Gallery, Visit all 200 |
| Responsive matrix | 45 route/viewport combinations at 320, 375, 390, 568, 768, 860, 1024, 1440, 1920px; 568 × 320 landscape included; no horizontal overflow |
| Real screenshots | Full-page 390px and 1440px captures for all five routes in `qa/screenshots/` |
| Axe | Zero violations in ten desktop/mobile WCAG A/AA scans, plus ten dedicated visible-label scans |
| Navigation | Desktop links, mobile Enter/Tab/Escape, expanded states, focus return and breakpoint changes pass |
| Menu | All eight filters, counts, announcements, keyboard activation and deep links pass |
| Gallery | Intended image, previous/next, arrow keys, contained Tab focus, close button, Escape and opener return pass |
| Reservation | Missing/old-date/slot validation, explicit simulated confirmation, focus, no storage/cookies or submission request pass |
| JavaScript disabled | All 51 menu entries visible, navigation exposed, image links usable, reservation controls disabled |
| Accessibility resilience | Reduced motion, 200% text enlargement at 768px, and image-failure content/CTA visibility pass |
| Runtime | No JavaScript exceptions or HTTP asset failures in the normal browser suite |
| WebKit | All direct routes, mobile overflow, menu filter and dialog smoke pass |
| Firefox | Unavailable: downloaded engine fails to spawn with `spawn UNKNOWN`; not counted as passed |
| Dependencies | npm installation audit: 0 vulnerabilities at installation time |
| Secret scanning | Gitleaks 8.30.1 staged scan: zero findings; repeated at publication |

Machine-readable final receipts are in `qa/results.json` and `qa/axe-results.json`. An automated zero-violation result is not WCAG certification. Tests exercise keyboard operations in real browsers; no screen-reader listening session or physical-device testing is claimed. Text enlargement is not a claim of OS/browser zoom certification.

## Visual reconstruction and asset integrity

The approved reference available locally is a 438 × 291 generated composite. Its dark photographic Home/Menu/Gallery, warm brass, serif hierarchy, fire hero, ivory Story narrative and Visit form informed all five layouts. The output is a close reconstruction of that visual direction, not a pixel-identical copy. Mandatory disclosures, the full 51-item menu and accessible controls require different lengths and proportions. Original generated food/interior scenes differ from the conceptual composite.

`docs/REFERENCE-ANALYSIS.md` provides the page-by-page mapping. `qa/screenshots/` contains actual implemented browser evidence. `qa/asset-contact-sheet.jpg` shows all 18 original AI scenes; `docs/image-manifest.json` records 54 responsive WebP files. Total photographic WebP payload across every size is 5,149,922 bytes, down from 6,110,924 bytes in the first asset export. Each page loads only the relevant selected sizes. Local fonts, original SVG branding, PNG icons and a 1200 × 630 photographic social card are included. The asset credit document lists delivered assets and font licences.

## SEO and conversion review

All pages have unique titles/descriptions, one H1, semantic landmarks, local social graphics, meaningful alt text, real internal links and visible fictional notices. The exact 51-item menu is static HTML. No external runtime image/font/CDN dependency, fabricated business schema, reviews, address, hours or certification exists.

Every HTML document retains `noindex, follow`; robots.txt allows crawlers to see it. Cloudflare `_headers` declares noindex and a restrictive CSP. Local header checks and local CSP application are distinct from eventual hosted verification. Canonical, `og:url` and absolute social URLs are intentionally deferred until a real final host is verified; no speculative domain is emitted as canonical authority.

Restaurant journey: clear hero menu CTA → signature dishes/full menu → story/atmosphere/gallery → explicitly simulated reservation. Client journey: above-fold ISMAIL attribution → contextual footer creator link on every page → distinct Visit business CTA. All destinations use `https://www.ismailstudio.my/`; a read-only HTTP HEAD returned 200. No enquiries were sent and the portfolio was not modified. CTA quality was assessed heuristically and through actual navigation tests; no traffic-based conversion lift or A/B result is claimed.

## Remaining boundaries

- No Cloudflare deployment, DNS configuration, live-domain validation or public-host performance evidence. Future instructions are in README.
- Final absolute canonical/social URL configuration and sharing-crawler validation depend on a verified deployment host.
- Firefox could not launch locally. Physical devices, assistive-technology speech output and real-user performance remain untested.
- The reference is low resolution; small conceptual copy is not recoverable. Written locked content takes precedence.
- AI imagery is explicitly identified and depicts no real restaurant. It is not documentary food photography.
- Automated checks do not certify WCAG conformance, search rankings or conversion uplift.

## Measured performance

Lighthouse 13.5.0, default mobile simulated throttling, direct local HTTP, Chromium 156. Final five-route run after image/CSS refinements:

| Page | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|
| Home | 52 | 100 | 100 | 66 | 4.09 s | 4,684 ms | 0 |
| Menu | 88 | 100 | 100 | 66 | 3.17 s | 245 ms | 0 |
| Story | 95 | 100 | 100 | 66 | 2.79 s | 0 ms | 0 |
| Gallery | 97 | 100 | 100 | 66 | 2.46 s | 0 ms | 0.0031 |
| Visit | 94 | 100 | 100 | 66 | 2.13 s | 249 ms | 0.0213 |

The initial run measured 73/88/93/86/96 performance respectively. The homepage's unexpectedly high final blocking time was investigated with three unchanged sequential repetitions: **53, 94, 88** performance; LCP **3.81, 2.59, 2.59 s**; TBT **3,564, 171, 380 ms**; CLS **0** throughout. Median repeat performance was 88. All runs are retained; the slow first runs have not been discarded or relabelled as passing. First-process timing appears to be a contributor, but the precise source of the variance is unproven. Homepage cold-run performance remains a limitation requiring measurement on the eventual host and target devices.

All five scored 100 accessibility and best practices in the final audit. SEO is 66 because the explicitly required noindex blocks indexing; it has not been disabled to improve the score. Lighthouse also identifies remaining unused shared CSS, image delivery and render-blocking opportunities. These are disclosed optimization opportunities, not invented production CWV passes. Raw reports and summaries are in `qa/lighthouse/`, `qa/lighthouse-summary.json` and `qa/home-performance-variance.json`.

## Final security and visual inspection

`node scripts/security-smoke.mjs` passed five routes with the exact configured Cloudflare CSP applied to local browser responses: CSS/fonts, reservation demonstration and gallery remained functional, with zero console errors. This is policy compatibility evidence, not a deployed-header claim. Receipt: `qa/csp-smoke.json`.

`node scripts/inspect.mjs` captured first-view desktop/mobile screenshots, a 320px lightbox and explicit simulated confirmation. Chromium's actual platform-font records confirm custom Cormorant Garamond and DM Sans glyph rendering (`qa/rendered-fonts.json`), beyond CSS family declarations. The desktop overview is `qa/desktop-comparison.png`.

Gitleaks 8.30.1 scanned the final staged source/documentation/evidence text (approximately 3.94 MB) with zero findings. Git whitespace checks passed after removing trailing whitespace from bundled licence text without changing its terms. Dependencies, temporary generation sources/tools, environment files and the old screenshot containing a local user path are excluded. No existing remote history was overwritten and no deployment workflow was introduced.
