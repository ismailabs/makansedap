> Historical original-release provenance. Current MakanSedap implementation and release evidence are documented in docs/MAKANSEDAP-IMPLEMENTATION.md and docs/RELEASE-REPORT.md.

# Asset credits

## V2, 19 October 2026

The V2 layout reuses the original project-generated images and self-hosted OFL fonts below. No additional stock, external imagery, generation services or icon packages were introduced. The redesigned 1200 × 630 social preview is typeset locally by `scripts/artwork-v2.mjs` using the dining-room and nasi-lemak imagery, DM Sans and Cormorant Garamond. All crops remain illustrative; the site labels the restaurant and imagery as fictional.

## Original AI concept imagery

18 distinct images were generated for this project with OpenAI's built-in image-generation tool on 15 October 2026. They depict imagined dishes and interiors, not real premises or meals served to customers. No stock photographs, scraped commercial photos, stock purchases, external generation API keys or third-party generation services were used.

The prompt set is in [docs/image-prompts.json](docs/image-prompts.json). This records provenance, not a claim of exclusive copyright over AI output; use remains subject to applicable service terms.

| File stem | Subject / use |
|---|---|
| hero-ribeye | Sliced ribeye, sambal butter and garlic; home hero/gallery |
| signature-ribeye | Plated ribeye and pepper sauce; signature/menu |
| dining-room | Imagined walnut/brass dining room; atmosphere/gallery |
| evening-tables | Intimate table and cognac booth; Visit hero/closing |
| grill-fire | Steaks above live charcoal; Story hero/gallery |
| percik-chicken | Chicken with coconut percik sauce; signature/menu/gallery |
| grilled-prawns | Tiger prawns and sambal butter; signature/menu/gallery |
| nasi-lemak | Coconut rice, percik chicken and accompaniments; menu/gallery |
| beef-rendang | Rendang and rice; gallery |
| fresh-ingredients | Malaysian aromatics; Story/sides category/gallery |
| dessert-brulee | Palm-sugar crème brûlée; dessert category/gallery |
| pandan-dessert | Pandan coconut panna cotta; gallery |
| kopi-gula-melaka | Iced coffee and palm sugar; drinks category/gallery |
| pepper-sirloin | Sirloin and peppercorn sauce; gallery |
| charcoal-lamb | Lamb shoulder and aubergine; gallery |
| mushroom-soup | Roasted mushroom soup; starters category/gallery |
| burnt-cheesecake | Basque-style cheesecake; gallery |
| bandung-lychee | Rose milk and lychee soft drink; gallery |

Each has 640px, 960px and 1536px WebP exports preserving the original ratio: 54 files total. [docs/image-manifest.json](docs/image-manifest.json) records dimensions and bytes; [qa/asset-contact-sheet.jpg](qa/asset-contact-sheet.jpg) shows the delivered set. Reuse across pages keeps the same subject. Food presentation is illustrative, not a claim about an actual kitchen.

The 24 earlier SVG scene illustrations were removed from production. They are not counted as photographic imagery.

## Fonts

- **Cormorant Garamond**, Cormorant Project Authors: normal/italic Latin variable WOFF2, weights 400–600.
- **DM Sans**, DM Sans Project Authors: normal Latin variable WOFF2, weights 400–700.

Files were obtained from official Google Fonts CSS and `fonts.gstatic.com`; the provider URLs are recorded in `scripts/font-source.css`. They are self-hosted and cause no visitor Google Fonts requests. SIL Open Font License 1.1 and copyright notices are included in `site/assets/fonts/Cormorant-Garamond-OFL.txt` and `DM-Sans-OFL.txt`.

Official licences: [Cormorant Garamond](https://github.com/google/fonts/blob/main/ofl/cormorantgaramond/OFL.txt), [DM Sans](https://github.com/google/fonts/blob/main/ofl/dmsans/OFL.txt). Redistribution/self-hosting are permitted under those terms; retain the notices and do not sell font files by themselves.

## Branding and interface

The original project flame/monogram and seven category SVGs were retained. The primary logo was re-spaced to avoid clipping; the live header uses selectable text in the delivered webfonts. SVG favicon, 32px PNG and 180px Apple icon are included. The 1200 × 630 photographic social graphic combines original generated imagery with live font rendering and visibly identifies the fictional concept and ISMAIL.

No third-party icon pack is used. Controls use text/CSS and native HTML.

## Reference and evidence

`docs/reference/approved-concept.png` is the supplied generated conceptual reference discovered in the user's context (438 × 291 available pixels). It is not an implementation screenshot. Small text cannot reliably be resolved; the written brief governs content.

`qa/screenshots/` contains actual Playwright captures from the implemented site over local HTTP. Concept imagery and real browser evidence are explicitly distinguished. Initial and final test receipts remain separate. The original failed local-preview screenshot is excluded from publication because its browser chrome includes a local user path.

## V3 — The Living Malaysian Table (20 October 2026)

The approved V3 handoff supplied `hero-plate.webp` and `floating-aromatics.webp`, crops of its original OpenAI-generated `cinematic-diptych.webp`. They depict imaginary food/aromatics, not a verified canonical menu dish or an operating restaurant. Production derivatives are `site/assets/images/v3/{hero-plate,floating-aromatics}-{240,480,768}.webp`; resize/encoding preserves the artwork. No documentary photography claim is made. Handoff provenance: `meta/09-PROVENANCE.md`. No new image generation was needed.

The four SVG ornamental primitives under `site/assets/images/v3/vectors/` are original programmatic handoff artwork: banana-leaf frame, flame lines, spice orbit and brand stamp. Meaningful food art has descriptive AI concept alt text; ornamental vectors are decorative. Existing 17 gallery entries and alt/caption texts remain unchanged. No new real-person or restaurant-premises photography was introduced.

`site/assets/images/social-preview.png` is the V3 1200×630 composition authored by `scripts/artwork-v3.mjs` using the supplied plate crop and real text. Responsive artwork and vendor files have dimensions/bytes/SHA256/provenance in `qa/v3/asset-provenance.json`.

GSAP core and ScrollTrigger are pinned to npm `gsap@3.15.0`, bundled locally via pinned `esbuild@0.28.2` into `site/assets/js/vendor/gsap-3.15.0.js`. Original copyright/license notices are retained, with `GSAP-LICENSE.txt` linking to the package-declared Standard No Charge license at https://gsap.com/standard-license (verified 20 October 2026). This restaurant portfolio website is a permitted website use; it is not a visual animation builder. No CDN/runtime third-party request is used.

DM Sans and Cormorant Garamond remain the existing self-hosted OFL font files and license notices. No new font files were added. Display uses oversized bold DM Sans with close tracking; Cormorant supplies restrained narrative contrast.

Gallery lead derivatives `v3/journal-ribeye-{320,480}.webp` and `v3/journal-aromatics-{320,480}.webp` are responsive encodings of the existing repository `hero-ribeye.webp` and `fresh-ingredients.webp`, whose original AI-image credits above remain authoritative. They are not crops from the V3 handoff diptych. Original gallery links, captions, alt text and full-size assets remain intact.

`v3/hero-prawns-320.webp` is a 320px responsive encoding of the existing original AI concept `grilled-prawns.webp`, generated by `scripts/artwork-v3.mjs`. The original image, gallery entry and credit remain intact. It serves the small Home secondary crop; larger screens retain the existing 640/960 variants. `motion/runtime.js` bundles the project-authored native scene modules only; the separately credited GSAP vendor remains a lazy import.
