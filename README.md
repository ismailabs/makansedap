# RASA & IRON

**Steakhouse Soul. Malaysian Heart.** A fictional contemporary Malaysian fusion steakhouse for the ISMAIL portfolio. No real restaurant, orders or reservations. The illustrative menu is pork-free and alcohol-free by design; no halal certification is claimed.

Repository: [ismailabs/rasa-iron](https://github.com/ismailabs/rasa-iron), branch `main`.

## Windows preview

Open PowerShell in the `rasa-and-iron` folder containing this README:

```powershell
node scripts/serve.mjs
```

Open **http://127.0.0.1:8000/**. Stop with **Ctrl+C**. Node.js is required; npm installation is not needed for preview. Alternatively:

```powershell
python -m http.server 8000 --bind 127.0.0.1 --directory site
```

Python does not interpret Cloudflare's `_headers`. The Node preview supplies a local noindex header; HTML meta noindex exists in both cases. Direct `file:///` opening is not the supported preview method: earlier root-relative paths resolved outside the extracted folder. Assets now use document-relative paths, improving direct-file portability, but folder navigation, font permissions and response headers still need HTTP. A file-preview failure alone does not prove a hosting failure.

## Structure

```text
site/                       # Complete static publish directory; no build
  index.html                # Home
  menu/index.html           # All 51 menu items, readable without JS
  story/index.html          # Story and culinary philosophy
  gallery/index.html        # 17-image gallery and keyboard-accessible modal
  visit/index.html          # Local reservation demo and FAQs
  assets/css/               # Foundations, editorial layout, local fonts
  assets/js/main.js         # Progressive interactions
  assets/images/            # 18 AI scenes / 54 WebP variants / social PNG
  assets/fonts/             # WOFF2 files and SIL OFL licences
  assets/icons/             # Original SVG branding and category icons
  _headers                  # Cloudflare headers and CSP
  robots.txt                # Allow crawling so noindex is visible
scripts/                    # Preview, tests, images, artwork and Lighthouse
qa/                         # Browser screenshots and measured results
qa/menu-contract.json       # Locked content extracted from supplied brief
docs/                      # Reference, prompts and image manifest
```

Edit content directly in the five static HTML documents. Maintain consistent shared navigation/footer edits. `styles.css` supplies shared components; `editorial.css` handles the photographic compositions and responsive refinements; `fonts.css` declares local licensed fonts. Production uses no React, SPA, CMS, database, API key, runtime package or bundler. npm dependencies are development-only.

Do not regenerate the menu contract from implementation HTML: it independently protects all names, categories and prices. The required filter label “Drinks” selects the locked “Non-Alcoholic Drinks” category.

No analytics, cookies, local storage, personal-data fields or booking backend are installed. The demo is disabled without JS. With JS it validates 1–8 guests, tomorrow through 180 days ahead in the visitor's local calendar, and allowed illustrative time slots. Date limits refresh on submission. The confirmation explicitly states that no reservation was created.

## Repeatable verification

Node.js 24 was used. Install the locked development dependencies and browsers:

```powershell
npm ci
npx playwright install chromium firefox webkit
npm test
npm run audit
```

`npm test` starts its own loopback server, verifies direct HTTP routes, the menu contract, metadata, links and local files, runs responsive and interaction tests, saves ten full-page screenshots, and runs axe on desktop/mobile. Results are in `qa/results.json` and `qa/axe-results.json`. Optional browser engine launch failures are reported as unavailable; assertions still run for every successfully launched engine.

`npm run audit` uses Lighthouse default mobile simulated throttling and Chromium debugging port 9223. Ensure the port is free. Results are local lab measurements, not production Core Web Vitals or real-user data. Mandatory noindex reduces the SEO score.

`node scripts/artwork.mjs` recreates the logo PNGs and photographic social preview. `node scripts/optimize-images.mjs SOURCE-MANIFEST.json` accepts `{name, path}` source-image entries and exports 640/960/1536px WebP variants. Source PNGs are authoring inputs outside the production payload. Prompts and delivered dimensions/bytes are recorded in `docs/`.

See [QA-REPORT.md](QA-REPORT.md) and [ASSET-CREDITS.md](ASSET-CREDITS.md).

## Future Cloudflare Pages deployment — not performed

GitHub source publication is separate from deployment. No Cloudflare project, DNS record or ISMAIL portfolio was changed.

1. Open **Workers & Pages → Create application → Pages → Import an existing Git repository**. Connect GitHub and select `ismailabs/rasa-iron`.
2. Choose **production branch `main`**, **framework preset None**, default repository root, and **build output directory `site`**.
3. No build step is required. Leave the command blank if supported, or use **`exit 0`**, Cloudflare's documented no-op. Do not publish the repository root.
4. Deploy only when authorized. Verify the actual assigned `*.pages.dev` URL. Future connected pushes may trigger deployments; review that integration before future publication.
5. Test `/`, `/menu/`, `/story/`, `/gallery/`, `/visit/` directly and through navigation. Verify imagery, fonts, keyboard controls, mobile layouts and explicit no-booking confirmation.
6. Run `curl.exe -I https://YOUR-ACTUAL-HOST/menu/`. Confirm `X-Robots-Tag: noindex, follow`, CSP and asset content types. Local tests cannot establish Cloudflare's hosted header behaviour.

Official references checked for this handover: [Static HTML](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/), [Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/), [headers](https://developers.cloudflare.com/pages/configuration/headers/), [custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/).

## Domain and metadata finalization

**Proposed, unverified address:** `https://rasa-iron.ismailstudio.my/`. The site does not claim that it is live.

After an authorized deployment, add the subdomain through Pages **Custom domains** first. Identify the authoritative DNS provider; if external, create the required CNAME to the actual Pages hostname. Avoid conflicting records. Wait for activation and certificate issuance, then verify DNS, HTTPS, all five routes and security headers. No Cloudflare credentials or DNS changes are needed for this source handover.

All pages retain `<meta name="robots" content="noindex, follow">`; `robots.txt` allows crawling. Keep that policy. No misleading Restaurant/LocalBusiness schema, reviews, certification or live availability is published.

Canonical and `og:url` are deliberately deferred until the final host is verified. Then add each page's own absolute URL, replace relative `og:image` and `twitter:image` with the verified absolute social-preview URL, and test actual sharing crawlers. The local preview graphic already exists at `assets/images/social-preview.png` (1200 × 630). These are deployment-dependent steps, not evidence of a functioning public host.

An independently indexable case study may later be added by the ISMAIL portfolio owner. This task does not edit that site. The demo links to [ISMAIL](https://www.ismailstudio.my/). SEO cannot guarantee rankings; the conversion review is a usability assessment, not measured conversion uplift.

When changing CSS, edit the authored files, then run `node scripts/prepare-css.mjs` to refresh the committed `site/assets/css/site.css`. This small concatenation utility preserves the cascade while delivering one stylesheet request. Hosting still serves files directly and needs no build step.
