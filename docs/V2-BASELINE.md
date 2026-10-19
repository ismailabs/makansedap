# V2 baseline — 19 October 2026

Evidence: `qa/v2/baseline-live.json`, ten fresh full-page production screenshots in `qa/v2/before/`, and the actual public Studio HTML saved as `qa/v2/before/studio-source.html`. These are pre-edit observations, not V2 test results. The capture script is `qa/v2/baseline-capture.mjs`.

## Current live service

All five MakanSedap HTTPS routes returned 200 and matched their pre-edit local HTML byte for byte. Every response reported source release `656d42ed315de9f96bde042c725ed8012f941bd2`; configured security headers and CSP are present in the JSON receipt. The menu has 51 accessible source records. Chromium 156.0.8078.4 rendered every route at 390px and 1440px without horizontal overflow, broken images or page exceptions. This capture is not an accessibility audit or performance measurement.

The old `rasairon.ismailstudio.my` hostname is currently unavailable before V2: Node HTTPS fetch and independent curl attempts failed DNS resolution. Public Cloudflare and Google DNS-over-HTTPS both returned status 3 (NXDOMAIN), with the authoritative zone SOA in their response. No redirect response can therefore be verified on this baseline. Do not treat this as a new release regression or modify the old hostname/DNS/rule as part of the V2 deployment; the approved scope excludes those changes. Preserve the historical rollback/redirect records and report this inherited exception separately.

## Verified Studio conversion destinations

- Studio: `https://ismailstudio.my/` returns a 307 redirect to `https://www.ismailstudio.my/`, which serves HTTP 200 and title “ISMAIL — Web Developer for Malaysian SMEs”.
- Direct website enquiry: `https://wa.me/601163265610`. This exact URL occurs on four real Studio anchors, labelled “Let’s talk”, “START A PROJECT”, “TALK ON WHATSAPP” and “WhatsApp”. The direct endpoint returned HTTP 302 to `https://api.whatsapp.com/send/?phone=601163265610&text&type=phone_number&app_absent=0`. This verifies a real published contact route and functioning redirect; no message was sent and recipient response is not claimed.

Use the exact published contact URL. Do not infer an email address or promise any business outcome. The live Studio HTML does not provide a MakanSedap case-study link, so use portfolio and website-enquiry wording.

## UX and composition critique

- The five openings repeat charcoal backgrounds, oversized italic serif pairs and familiar food/interior imagery. Shared styling is clear, but page roles have little visual distinction.
- Home repeats the same dining-room image twice and the same section rhythm across a long dark canvas. Numbered section sequence begins with 02 before 01. The result offers little editorial pacing or hierarchy beyond headline size.
- Mobile Menu is a long single-column document (13,434px in this baseline). Filters provide useful shortcuts, but featured-card composition and category image repetition add scroll before practical reading. Protect the actual menu content while improving the dining-artifact hierarchy.
- Studio ownership is truthful but mostly a small top strip and footer. Every existing Studio conversion leaves for the portfolio home page; the equivalent direct enquiry route required by V2 is missing.
- “Visit & Contact” in the footer suggests restaurant contact, while the page correctly explains that no restaurant exists. A demo-first Visit treatment and explicit website-enquiry language would be clearer.
- The booking demonstration already has sound privacy boundaries: only guest count/date/time, no names or contact fields, no network submission/storage, honest outcome copy. The redesign should make this craft discoverable without implying a real booking.
- Gallery already has progressive linked images, categories and accessible dialog hooks. Its curation can improve through layout/crops rather than replacing a working interaction contract.

## QA assumptions versus protected behavior

Preserve the source selectors that lock category/name/price/description (`data-menu-group`, its category h2, `data-menu-item`, h3, `.menu-price`, item p). Never change the baselines. Preserve the 17 gallery records and their filtering/dialog/focus behavior, the booking IDs/validation/privacy behavior, navigation keyboard/Escape behavior, no-JS access, motion preference handling, five clean routes, canonicals/robots/sitemap and exact security policy.

Existing tests also encode presentation choices that may legitimately change: all HTTPS anchors currently equal only the Studio root, explicit Cormorant/DM Sans font checks, primary-navigation link copy, and the Home “Explore Our Menu” CTA label. Update those checks narrowly to match the intentional V2 design while requiring both exact verified Studio destinations. Retain every behavior/content assertion. Strengthen live release verification with the expected release SHA and exact security headers, alongside body/asset equality.
