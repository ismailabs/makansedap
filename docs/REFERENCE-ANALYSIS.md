# Reference reconstruction

The available approved reference is `reference/approved-concept.png`, a 438 × 291 conceptual composite showing five desktop pages and five mobile panels. It was inspected before reconstruction. It is a generated design, not proof of an implemented website; its small type cannot reliably be read. Locked text and menu requirements take precedence.

| Page | Observed composition | Implemented response |
|---|---|---|
| Home | Dark navigation, steak on the right, editorial hero on the left, brass CTA, three craft notes, warm dining-room narrative | Full-width steak photograph with a controlled text gradient; selectable serif headline; three compact principles; interior narrative; signature dishes, category paths, atmosphere, gallery and closing demo CTA |
| Menu | Dark page, centred heading, category selection, photographic features with prices | Centred editorial introduction, three photographic signature cards, practical category buttons and a scannable two-column 51-item menu; one column on phones/tablets |
| Story | Fire hero, light narrative panel with photography, three values | Wide charcoal/fire hero, ivory narrative and ingredients composition, RASA/IRON meaning, Fire/Local Flavour/Hospitality and menu CTA |
| Gallery | Dark photographic mosaic mixing food, dining rooms and details | Varied 17-image grid, warm cohesive image grade, visible captions and accessible modal with explicit controls |
| Visit | Interior hero, practical ivory details, warm light form | Interior background with legible headline, truthful Kuala Lumpur positioning, no invented address/hours, local-only reservation form, FAQs and distinct ISMAIL CTA |

The mobile reference is interpreted as a deliberate vertical composition: photography before/behind the hero copy, compact branding, stacked sections and usable touch targets. The implementation preserves readable text rather than matching the very small type in the composite. The mandatory visible fictional disclosure adds height above the navigation on every page.

## Evidence and deliberate differences

`../qa/screenshots/` contains actual direct-HTTP full-page captures at 390px and 1440px for all five pages. `../qa/inspection/` contains first-view and interaction screenshots. Images in those pages are original AI-generated assets; the browser screenshots themselves are real rendered evidence.

The reconstruction matches the reference's warm charcoal/brass identity, photographic atmosphere, editorial typography, primary hero subjects, dark Menu/Gallery treatment and ivory Story/Visit surfaces. It is not a pixel-identical reproduction. Original generated scenes differ from those in the composite, required content creates longer pages, the full menu is optimized for scanning, and the reservation interface omits personal-information fields and any implication of real availability. There is no numerical image-similarity claim.

The first visual pass caught feature images retaining their HTML height and creating overly tall Menu cards. Explicit responsive image height fixed the composition. Subsequent browser captures were reviewed after the correction. Accessibility findings also changed small-label colours and text-resize layouts rather than preserving inaccessible proportions.
