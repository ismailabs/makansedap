# Asset credits

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
