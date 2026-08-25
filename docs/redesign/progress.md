# Redesign progress

Coordinator-maintained. One row per unit of work, newest phase last.

Repository identity at start: `new_site` @ `37db40a`.

## Phase 0 — reconciliation

| Deliverable | Owner | Status |
| --- | --- | --- |
| `current-baseline.md` | Agent A | done, 789 lines |
| `design-system.md`, `page-archetypes.md` | Agent B | done, 21 archetypes over 30 routes |
| `cms-reconciliation.md` | Agent C | done, 1015 lines, 12 gaps |
| `routing-decisions.md` | Agent D | done, committed as `e752b19` |
| `media-policy.md` | Coordinator | done |
| `placeholder-media.json` | Coordinator | done, empty |

No asset audit is being performed. See `media-policy.md` for why.

## Phase 1 — shared foundations

| Item | Status | Evidence |
| --- | --- | --- |
| Editorial typefaces self-hosted | done | `735b33f`, `app/typography.test.ts` |
| Typographic media fallback | done | `components/media/media-fallback.tsx` |
| Gradient media substitutes removed | done | `scripts/media-pairing.mjs` reports 0 |
| Grey `placeholder.svg` deleted | done | `lib/content/placeholder-registry.test.ts` |
| One remote-image contract | done | `lib/media/remote-image.ts` + drift test |
| Placeholder registry with teeth | done | `lib/content/placeholder-registry.test.ts` |
| Colour tokens | settled | blue + crimson kept, see decision below |
| Spacing, container, grid | not started | |
| Buttons, capsule primitives | not started | |
| Navigation, footer | not started | |
| Video handling, motion, a11y foundations | not started | |

## Phase 1.5 — routing and SEO corrections

| Item | Status | Evidence |
| --- | --- | --- |
| One canonical course URL | done | `52399d8`, two routes deleted and 301'd |
| Real 404s on dynamic routes | done | `app/routes.test.ts` |
| Titles render the org name once | done | `app/metadata-titles.test.ts` |
| Redirect integrity gate | done | `app/routes.test.ts` |
| Sitemap: courses, real lastModified | not started | `routing-decisions.md` §3 |
| 8 routes with no metadata, 22 with no OG image | not started | `routing-decisions.md` §5 |
| `discover-routes.mjs` is wrong four ways | not started | route floor is 60, not 53 |

## Design references

`docs/design_templates/` holds nine finished HTML page concepts and is the
**current layout reference**: section rhythm, capsule geometry, type scale,
asymmetry, media proportions and responsive collapse. Its colours are not
adopted. `docs/design_iu_examples/` is legacy and must not be used.

## Open decisions

### Palette — RESOLVED: keep blue and crimson

The brief named Navy `#0C2D5A`, Deep Navy `#081D3D`, Gold `#F5A623`, Teal
`#157F6B`, Ink `#11233F`, Mist `#EEF2F8`, Border `#E3E8F0`. The implementation
uses primary blue `#1E72BA`, primary dark `#0152BE`, crimson accent `#D70B52`,
deep `#142850`, mist `#E8F1FA`, border `#D8E5F2`.

`public/images/logo/logo.png` is blue and crimson: two figures, one of each,
over a crimson monitor inside a blue roundel. The brief's gold and teal appear
nowhere in the mark. The owner ruled that the implemented palette stands and
that gold and teal are dropped.

Consequences: no retokening, and the WCAG AA work in commit `947b5fe` against
the crimson accent stays valid. The brief remains authoritative on layout,
archetypes and editorial direction; the logo and the implemented tokens are
authoritative on colour. Do not reopen this by citing the brief's colour
section.

## Verification baseline

`npm run type-check`, `npm run lint`, `npm test` and `npm run build` all pass at
every commit recorded above.
