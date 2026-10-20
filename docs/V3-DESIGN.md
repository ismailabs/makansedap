# The Living Malaysian Table

V3 turns the imagined meal into a sequence: aromatics gather, fire transforms them, and the table becomes a Studio signature. The five public routes retain their original tasks, records and links. No venue facts, reviews, booking service or analytics were added.

## Production system

`site/assets/css/v3.css` is the authoritative authored token/component source. `npm run build` compiles its font definitions and CSS with pinned esbuild, and bundles the pinned local GSAP/ScrollTrigger vendor. Historical V2 CSS is preserved and does not participate in the production cascade.

| Role | Value / treatment |
| --- | --- |
| Ground / char | `#170F19` / `#2A171A` |
| Light / action | `#F6EDDA` / `#F3B448` |
| Chilli / leaf | `#D74A2F` / `#506A43`; leaf was darkened from the proposed token after measured contrast failed |
| Display | Existing OFL DM Sans, bold, oversized, tightly tracked, real HTML text |
| Narrative | Existing OFL Cormorant Garamond, short supporting statements |
| Reading | 16px body; 18px Home introduction; supporting disclosures at least 13px |
| Frame | Equal responsive gutters; maximum 1600px shell; single-column touch compositions |

## Components and states

| Component | Behavior and states |
| --- | --- |
| Navigation | Five named real route links, current-route indicator, visible keyboard outline. Enhanced mobile toggle exposes `aria-expanded`; Escape closes and returns focus. No-JS links remain visible. |
| CTA | Flat fill or explicit outline; hover translates 3px, press translates 2px; focus outline is 3px with 5px offset. Light/dark regions set an appropriate focus token. Reduced motion removes travel. |
| Disclosure | Visible early on every route. Real Studio and website-enquiry links are labelled as Studio services. |
| Food art | Hero portrait, circular secondary plate and aromatic crop occupy separate planes. Explicit dimensions and responsive 240/480/768 WebP variants; decorative orbital SVG uses a CSS mask. Alt text identifies concept art. |
| Menu | All original records remain in HTML. Seven category choices plus All, immediate pressed state/count/history updates, adjacent visual staging, exact native-currency prices. Touch rail scrolls horizontally; no forced carousel. Enlarged text wraps. |
| Gallery | Seventeen original linked entries. Mixed column widths become one touch column. Filtered dialog wraps within the visible set, contains focus, closes on Escape, restores opener focus, prevents background scrolling and explains image failures. |
| Reservation | Native guest/date/time fields stay directly available. The fieldset is disabled without JS. Errors identify/focus the invalid field; progress/table illustration mirrors values. Result explicitly says no reservation was created and nothing was transmitted or stored. No personal fields. |
| Studio finale | A decorative plate dissolves into the visible ISMAIL Studio name inside the table circle. Both real external CTAs are in HTML and remain immediately usable throughout. Without motion the Studio identity is already present. |
| Footer | Fictional/no-premises disclosure, AI imagery credit, five-route wayfinding and real Studio attribution. |

## Motion and fallback architecture

The functional `main.js` operates independently of motion imports. A page-specific initializer runs after the first paint. Native browser animation handles the short opening, category feedback, gallery feedback, imaginary-table response and Studio dissolve. On touch widths the main LCP plate stays still while smaller aromatic/food planes arrive. Opening endpoints use the authored CSS rotations without a synchronous layout read; no initial global animation enumeration forces a full-page layout.

GSAP 3.15.0 and ScrollTrigger load only when Home's ingredient scene or Story's fire scene enters view. Those scenes use bounded, reversible native-scroll progress, no pinning or scroll interception. Breakpoints adjust travel, not the narrative. Hidden pages suspend animation; teardown cancels listeners/observers/contexts. Media-preference changes return to a complete static presentation. A failed script/import never hides content or essential links.

The static scene remains meaningful with images or animation unavailable. Forced colors retains control outlines and selected-state borders. Text enlargement is permitted and verified separately from browser/OS zoom. No physical-device or screen-reader certification is implied by emulation or automated checks.

## Evidence

Fresh V2 baselines, final screenshots/boards, scene traces, exact-record tests, selector-grounded accessibility findings, performance comparisons and release status live under `qa/v3/`. Supplied mockups and illustrated boards are reference art; actual production implementation captures are labelled separately. See `qa/v3/final-report.md` for the final verified state.
