# Implementation specification

1. Inspect `git status`, remote URLs, branch, Pages/Cloudflare integration, menu contract, QA scripts, asset licences, HTML, CSS and JS. Make a recoverable baseline commit/branch before extensive changes; preserve history and user changes.
2. Define visual tokens, semantic typography, layout grid, mobile/desktop variants, image roles, component states and motion rules. Select cohesive art direction and document choice.
3. Implement visual rebrand in five existing static routes; avoid gratuitous framework migration. Keep site readable and navigable without JS; no backend or fake reservation confirmation implying real booking.
4. Preserve menu: compare category/name/price records to `qa/menu-contract.json` and descriptions against a pre-change snapshot of `site/menu/index.html`. Do not edit baseline contract to make tests pass. If descriptions are in HTML only, extract them before modifications into a separate locked snapshot.
5. Use locally stored properly licensed/generated image assets and responsive variants. The included board is a reference, not a production hero asset. Original restaurant images may be retained where stronger; do not use third-party assets without licensing.
6. Refresh compiled CSS with repository's `node scripts/prepare-css.mjs` if editing authored styles; verify actual workflow before assuming command success.
7. Rebrand all visible strings, page titles, metadata, icon/logo names, alt text, social cards, docs and tests; keep truthful fictional disclosures. Avoid fake opening hours, phone numbers, addresses, reviews or certification.
8. Maintain correct URL routes, canonical and Open Graph URLs after verifying target host; make site indexable and test real response headers.
9. Compare real screenshots to references, repair discrepancies, repeat QA, report measured results and limitations.
