# Redesign progress

Coordinator-maintained. One row per unit of work, newest phase last.

Repository identity at start: `new_site` @ `37db40a`.

## Phase 0 — reconciliation

| Deliverable | Owner | Status |
| --- | --- | --- |
| `current-baseline.md` | Agent A | in progress |
| `design-system.md`, `page-archetypes.md` | Agent B | in progress |
| `cms-reconciliation.md` | Agent C | in progress |
| `routing-decisions.md` | Agent D | in progress |
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
