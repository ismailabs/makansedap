# MakanSedap V2 — The Malaysian supper table

The restaurant leads; Studio ownership is easy to find. Home opens as an invitation, with a composed room photograph and a smaller nasi-lemak image. The menu behaves as a practical dining artifact, Story reads as an essay, Gallery becomes a dark visual journal, and Visit puts an honest reservation demonstration within reach.

Pandan paper `#e8eddc`, aubergine ink `#302239`, butter `#f4d985`, lilac `#ded2e5`, and warm white `#f8f7f0` replace the repeated charcoal/clay treatment. DM Sans carries clear, closely set headings and practical reading. Cormorant Garamond is reserved for the wordmark, menu category titles, and brief narrative passages. Both are existing self-hosted OFL assets.

Shared navigation, a compact fictional disclosure, paired Studio/enquiry links, and a quiet footer form the common system. Mobile layouts have their own image proportions and section ordering. Interaction motion follows the visitor's action; there are no scroll reveals, autoplay or text fading. Reduced motion removes smooth scrolling and transitions.

The existing 51 original menu records and seven category groups are retained verbatim, including descriptions and deep-link IDs. Category filters now maintain shareable URLs and browser history. The 17 gallery links retain filtering, modal keyboard controls and focus restoration. Booking remains local: guests, future date and illustrative time only, with no actual availability, personal-data fields, requests or storage.

The live Studio homepage verified the exact enquiry destination `https://wa.me/601163265610`. Studio and website-enquiry actions are available together in the top author strip and the larger attribution section on every route. No message was sent, and no conversion-rate improvement is claimed.

V2 uses the existing static HTML/CSS/vanilla-JS Worker architecture and adds no dependencies. Authored CSS is `site/assets/css/v2.css`; `scripts/prepare-css.mjs` compiles it with the existing font definitions. Older authored CSS remains available as historical project material but is not included in the shipped stylesheet. CSS and JS links use a V2 cache query so returning browsers do not reuse the previous release's week-cached files. Imagery rights and the new social preview are documented in `ASSET-CREDITS.md`.

Review-driven repairs include character-exact menu comparison, the corrected dessert deep link, removal of a redundant logo label, enlarged menu text, reflow at 200% text size, a top-strip direct enquiry link, removal of a decorative seal that overlapped a caption, and moving the Visit demo panel ahead of imagery on mobile. Evidence belongs in `qa/v2/`; original QA and baselines remain unchanged.
