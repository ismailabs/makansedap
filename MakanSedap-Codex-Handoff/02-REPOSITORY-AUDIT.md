# Source-based audit (read-only; 2026-10-17)

Inspected GitHub `ismailabs/rasa-iron`, default branch `main`, via connected GitHub file retrieval. This is a **source audit, not a live browser or Cloudflare deployment audit**.

Verified: repository contains `site/`, `scripts/`, `qa/`, `docs/`, `package.json`, `README.md`, `QA-REPORT.md`, `ASSET-CREDITS.md`. `site/` holds five HTML pages: `/`, `/menu/`, `/story/`, `/gallery/`, `/visit/`. Existing project uses static HTML/CSS/JS, local images/fonts and development-only Playwright, axe and Lighthouse. `qa/menu-contract.json` contains 51 category/name/price entries; `site/menu/index.html` supplies descriptions. All five page heads currently include `<meta name="robots" content="noindex, follow">`. README also documents `site/_headers` noindex and Cloudflare Pages setup **as future work**, not proof of live configuration.

Historical QA-REPORT (2026-10-15) reports 64 passed, Firefox unavailable, local screenshots, and variable homepage Lighthouse performance. These are historical claims from repository documentation, not tests rerun in this handoff. Re-run all checks on redesigned source and deployed host.

Risks: design board includes invented dishes and business claims; never import its copy as data. Brand rename requires sweeping all metadata, UI strings, SVGs, share images and test expectations. Remove noindex from both HTML and actual hosted response headers; check canonical per route only after new domain verified. Domain redirect may need dedicated Cloudflare rule if old hostname is not served by the new Pages project. Check hosting integration before renaming GitHub repo.

Do not confuse `https://rasairon.ismailstudio.my/` (user-supplied current URL) with a verified active deployment: hosting, DNS and public reachability were not independently confirmed here.
