# Definition of Done — evidence required

- Five routes render on direct navigation and mobile/desktop; menu has exactly 51 preserved names, categories, prices and descriptions.
- Visual rebrand complete and coherent across five pages; compare actual browser screenshots at 390px and 1440px against reference. No overflow at 320, 375, 390, 768, 1024, 1440 and 1920px; meaningful reduced-motion and 200% text tests.
- Keyboard navigation, focus visibility, mobile menu, all filters, gallery dialog (including focus return), booking demo validation and explicit non-booking confirmation work. No-JS menu readable.
- Run `npm ci`, `npm test`, `npm run audit` where environment permits; record real results, not historical QA values. Check axe/WCAG 2.2 AA targets, cross-browser Playwright engines if available, runtime console/network, responsive images and Lighthouse; do not claim certification.
- Correct title/meta descriptions, canonical, sitemap, social preview, robots/noindex and production HTTP headers for indexability. No invented address, hours, ratings, certification, real reservations or payments.
- Confirm commit SHA, branch, renamed GitHub repo, live `https://makansedap.ismailstudio.my/` serving intended release, HTTPS, all routes, and old-host 301/308 redirect. Verify rollback instructions.
- Final report includes tests run, evidence paths, actual measurements, deployment/redirect verification, changed files, limitations and outstanding blockers. **Unverified checks are not passes.**
