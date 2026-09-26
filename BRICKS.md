# Brick Manual

The brick views make the framework's premise literal: **tools are bricks, and how they combine matters more than what they are.** They replace the flat diagram as the default lens, drawn at an angle like a LEGO instruction manual.

## Where it appears

| Route | View |
| --- | --- |
| `#/` | Hero builds the Lean Knowledge Agent brick by brick. |
| `#/ai-systems`, `#/data-engineering`, `#/agent-harness` | Assembly guide defaults to **Brick manual**: numbered step, `1x` parts callout, drop arrow, seat badge, finished-model stamp. **Flat diagram** is still one tab away. |
| `#/growth`, `#/growth/data`, `#/growth/harness` | **Build over time**: one model at four maturity stages, plus one authored wrong turn. |
| `#/reference` | **Parts inventory**: every part as a brick, grouped by role and tier, with a two-part fit bench. |

## Grammar

| Mark | Meaning | Source |
| --- | --- | --- |
| Brick colour | Primary role (hue) | `tool.primaryHue` |
| Brick height | Tier the role belongs to (foundation low, surface high) | `editionTiers` in `src/bricks/buildModel.ts` |
| **Snap** (seated, ✓) | A pairing with an earlier part is recorded, authored for a recipe story or growth stage, or the whole set is a curated non-cautionary recipe | `pairsWellWith`, `assemblyStories`, `growthTracks`, `recipes` |
| **Loose** (lifted, dashed seam, ~) | Nothing recorded either way. Unproven, not wrong. | absence of data |
| **Forced** (pushed off its studs, red, ✕) | A recorded or authored tension | `conflictsWith`, tension links |
| Dashed outline | A missing part | `recipe.missingHues`, stage `missing`, or an empty tier beneath an occupied one |
| Hanging brick | Nothing sits beneath it yet | geometry |
| Crossed outline | Part removed at this growth stage | stage `remove` |

Finished-model verdicts: *Snaps together*, *Holds, with loose parts* (loose parts, gaps, or two parts with the same role and category), *Forced fit*, and *Looks built, reads wrong* (the parts seat, but the set is a named anti-pattern).

## Honesty boundaries

`ASSEMBLY_REVIEW.md` warned that an isometric attachment could invent facts the data does not hold. The views guard against that:

- Tiers are a reading aid. Height is not call order or data flow; every page says so.
- Studs lock only where a relationship is recorded. Unrecorded pairs sit loose instead of being guessed.
- Tensions in growth "wrong turns" are authored for that design, matching the refresh's position that the products coexist when responsibilities are separated.
- Growth tracks are illustrations, not prescriptions.

## Code

- `src/bricks/iso.ts`: projection, colour shading, painter's depth sort
- `src/bricks/buildModel.ts`: tiers, stable centred layout, seats, verdicts
- `src/bricks/scene.ts`: turns a part list into positioned scene bricks
- `src/bricks/Brick.tsx`: `IsoBrick`, `BrickScene`, `BrickIcon`, `Baseplate`
- `src/bricks/ManualBoard.tsx`: manual page and seat notes for the assembly guide
- `src/bricks/growthTracks.ts`: authored maturity paths per domain
- `src/GrowthPage.tsx`, `src/PartsReference.tsx`: the new pages

## Battletest questions

- Do the tier assignments match how practitioners picture each domain? (Trust at the top of AI stacks is the most arguable.)
- Do the growth stages match real team histories? Collect counter-examples.
- Are there loose pairs that experts would call a clear snap, or a clear clash? Those are data gaps in `pairsWellWith` / `conflictsWith`.
