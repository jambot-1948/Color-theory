# Brick Manual

The brick views make the framework's premise literal: **capabilities are the bricks, products fill them, and how they combine matters more than what they are.** They replace the flat diagram as the default lens, drawn at an angle like a LEGO instruction manual.

## Capability first, product second

Three levels, from why to who:

| Level | Example | Where it lives |
| --- | --- | --- |
| Role (hue) | Memory | `hues` in each domain's data file |
| Capability (the brick) | Vector store | `src/bricks/capabilities.ts` |
| Product (the printed label) | Pinecone | `tools` in each domain's data file |

A build is a list of capability slots, each optionally filled with a product (`?build=vector-store:pinecone,model-api` in share links; older `?blend=` product links still load). Curated recipes act as **blueprints**: the same capabilities with different products are reported as "Curated blueprint", and the reading names the swapped products.

Fit is judged at the level the build is decided at:
- **Capability level** (either slot unfilled): the capabilities snap if a curated recipe combines them or any of their products have a recorded pairing.
- **Product level** (both filled): only product evidence counts, from authored story links, recorded pairings, or an exact curated recipe. A sound blueprint can therefore loosen once specific products are chosen.
- **Two products in one capability** (for example Airflow and Dagster) are always forced. That duplication is what the cautionary recipes and growth wrong turns are about.

## Where it appears

| Route | View |
| --- | --- |
| `#/` | Hero builds the Lean Knowledge Agent brick by brick. |
| `#/foundations`, `#/ai-applications` (old `#/ai-systems` links still work), `#/data-engineering`, `#/agent-harness` | Assembly guide defaults to **Brick manual**: numbered step, `1x` parts callout, drop arrow, seat badge, finished-model stamp. **Flat diagram** is still one tab away. |
| `#/growth`, `#/growth/foundations`, `#/growth/data`, `#/growth/harness` | **Build over time**: one model at four maturity stages, plus one authored wrong turn. |
| `#/reference` | **Parts inventory**: every part as a brick, grouped by role and tier, with a two-part fit bench. |

## Grammar

| Mark | Meaning | Source |
| --- | --- | --- |
| Brick | A capability; its printed label is the chosen product, or a dashed "choose a product" label | `capabilities.ts` |
| Brick colour | The capability's role (hue) | `capability.hue` |
| Brick height | Tier the role belongs to (foundation low, surface high) | `editionTiers` in `src/bricks/buildModel.ts` |
| **Snap** (seated, ✓) | A pairing with an earlier part is recorded, authored for a recipe story or growth stage, or the whole set is a curated non-cautionary recipe | `pairsWellWith`, `assemblyStories`, `growthTracks`, `recipes` |
| **Loose** (lifted, dashed seam, ~) | Nothing recorded either way. Unproven, not wrong. | absence of data |
| **Forced** (pushed off its studs, red, ✕) | A recorded or authored tension | `conflictsWith`, tension links |
| Labelled plinth under the baseplate (Foundations only) | The product operating model: teams and ownership that every part rests on | `editionInfo.plateLabel` |
| Pale placeholder brick with dashed edge, plus a "Missing parts" callout above the scene | A missing part | `recipe.missingHues`, stage `missing`, or an empty tier beneath an occupied one |
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
- `src/bricks/capabilities.ts`: capability catalogue per domain
- `src/bricks/capabilityModel.ts`: slots, blueprint matching, capability- and product-level links, share-link encoding
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
