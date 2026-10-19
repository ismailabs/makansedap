# Independent V2 visual review

Reviewed on 19 October 2026 against the actual local HTTP site at `http://localhost:8000`, using Chromium and fresh captures of all five routes at 390px and 1440px. Every lazy image was made eager and decoded before capture. Both the first 900px viewport and the complete page were examined, including readable mobile detail crops. The pre-edit production screenshots in `qa/v2/before/` are the comparison baseline.

This is a qualitative design/UX review, separate from the functional, axe, security and performance test reports. It supports a visible improvement judgment, not a claim of universal aesthetic superiority, accessibility certification or measured conversion uplift.

## Evidence

- `qa/v2/visual-review-contact-sheet.png`: compact first-viewport overview, all ten route/width combinations.
- `qa/v2/visual-review-{route}-comparison.png`: actual before/after first-viewport boards for Home, Menu, Story, Gallery and Visit.
- `qa/v2/visual-review-{route}-{width}-viewport.png` and `-full.png`: original-resolution after captures.
- `qa/v2/visual-review-{route}-390-detail.png`: readable mobile detail samples.
- `qa/v2/visual-review-observations.json`: capture time, page heights, HTTP status, broken-image/overflow checks and actual Studio links.
- `qa/v2/visual-review-capture.mjs`: repeatable capture/board generation. It does not edit the site or baseline evidence.

The final full capture completed at `2026-10-19T03:32:36.226Z`. All ten reviewed combinations returned HTTP 200 with zero horizontal overflow and zero broken images. The receipt records Chromium 156.0.8078.4 and SHA-256 values for all five source HTML files and the compiled stylesheet; those hashes were independently compared to the current source after capture and still matched. These are local observations.

## Improvement assessment

| Route | Visible improvement from the baseline |
| --- | --- |
| Home | A light pandan opening, confident sans headline and overlapping room/food composition replace the dark full-bleed steak hero. Subsequent paper, butter, plum and lilac sections create clear pacing. The duplicated dining-room section and decorative section numbering are gone. Restaurant discovery remains the primary task. |
| Menu | A compact dining artifact replaces the repeated hero/featured-card lead-in. Names, descriptions and right-aligned prices are easier to compare, with a desktop category rail and mobile category chips. The original category identities remain clear. |
| Story | A lilac typographic opening and spacious ingredient/grill spreads give the narrative a distinct role, with more specific culinary copy and an intelligible meaning-of-the-name section. |
| Gallery | Aubergine creates a deliberate visual-journal setting. Varied image scale and staggered rows feel curated rather than like identical cards; labels and captions remain attached to their images. Mobile uses meaningful asymmetric margins without narrowing images excessively. |
| Visit | The opening plainly communicates fiction, while the short page presents the local-only form as the main interaction. Mobile now places the form immediately after the opening, before the scene photograph. The paper/pandan panel, simple labelled controls and honest explanatory copy feel calmer and more practical than the previous full-bleed hero plus long practical-details introduction. |

The coherent palette, restrained decorative mark, culinary specificity and contrast between sans headings and selected serif passages make this recognizably a designed Malaysian restaurant concept. Existing AI imagery is reused thoughtfully; the visible disclosures correctly avoid representing it as real premises or served meals.

## Findings and iteration

1. **Resolved after review:** menu description/price text was initially about 12px on mobile. The implementer increased these to `.875rem`, making the practical 51-record reading task more comfortable. Fresh mobile crops show readable wrapping and intact price alignment.
2. **Resolved after review:** direct Studio enquiry was initially available only near the end of each long page, while the Studio portfolio was also linked at the top. A compact, explicit “Studio website enquiry” link now sits beside the author credit on every route. The mobile strip fits both real destinations without replacing restaurant navigation; the larger paired Studio section remains near the footer.
3. **Resolved after review:** the Home yellow “Pull up a chair” seal initially overlapped the room caption on the 390px opening. The implementer removed the nonessential seal. Final 390px and 1440px captures show the entire caption unobscured and the overlapping-photo composition remains distinctive.
4. **Resolved after review:** at 390px the Visit form initially followed the scene image and disclosure, so the existing `#reservation` link still required extra scrolling to reach controls. The implementer moved the mobile form ahead of the scene image and made the panel copy explicit: no availability is checked and nothing is booked, sent or stored. The first viewport now exposes the form and preserves the fictional boundary before interaction.

No unresolved material visual defects, clipping, image failures, inaccessible-looking native controls or accidental horizontal scrolling were observed in the final reviewed 390px/1440px compositions. The recommendations above were checked again in fresh screenshots after implementation. Automated keyboard/focus, enlarged-text, intermediate-width, no-JS and browser-engine results remain the authority for those separate gates.

The review also consulted the current [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) for labelled controls, visible focus, image sizing, reduced motion and layout handling. Project-specific preservation requirements take precedence over generic advice that would remove or virtualize protected source menu content.
