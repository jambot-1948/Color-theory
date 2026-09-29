# Handoff: Chromatic Architecture animated overview

Last session: 2026-09-27/28. Branch: `video/animated-overview` on `jambot-1948/Color-theory`. `main` is untouched.

## What exists
A 2:15, 1080p, 30fps Remotion video (`Overview` composition) in five acts. Silent, with kinetic text. It is the **talk version for thejambot.com**. Jamil does not want a separate LinkedIn cut; he may record a GIF from it.

| # | Act | File | Frames |
|---|-----|------|--------|
| 1 | The pile: gray bricks with product names only, then the premise | `src/acts/PileAct.tsx` | 360 |
| 2 | Picture → word: brick = capability, colour = role (7-role wheel), label = product (OpenAI → Claude → Ollama swap), height = tier | `src/acts/VocabAct.tsx` | 900 |
| 3 | The build: Lean Knowledge Agent. Place, snap, snap, force a second model, read what's missing, "Holds, parts missing" stamp | `src/acts/BuildAct.tsx` | 1020 |
| 4 | Growth, **Foundations**: Week 1 → Year 1 on the "Product operating model" plinth, then rewind to the "Wrong turn: platform before product" | `src/acts/GrowthAct.tsx` | ~1110 |
| 5 | The foundation: Foundations shrinks to the base; AI / Data / Harness systems land above it; end card | `src/acts/FoundationAct.tsx` | 660 |

Shared code: `src/lib/motion.tsx` (MorphScene: parts drop in, glide between keyframes, and lift away when removed; also badges and drop arrows) and `src/lib/type.tsx` (Beat, Chip, and type styles). `src/theme.ts` holds colours taken from the site's `FrontDoor.css`.

## Decisions already made (don't relitigate without asking)
- **Reuse the site, don't redraw it.** Every act imports from `../preview/src`: the `IsoBrick` / `Baseplate` renderer, the edition data, `capabilities.ts`, `growthTracks.ts`, `*Stories.ts`, and `readBuild` / `verdictCopy`. Snaps, forced fits, gaps and verdicts are **computed**, never typed in. If the data changes, the video changes.
- **Foundations carries the back half** (acts 4–5), because Jamil wanted it to balance the AI-heavy concepts.
- **Honesty boundaries from BRICKS.md stay visible.** Act 3 ends with the line "Stacking shows relationships and tiers, not runtime wiring or data flow." Act 2 says height is "a reading aid, not data flow." Products appear only as sticker text, never as vendor logos.
- Visual register follows PRODUCT.md: neutral chrome, colour only from the hue system, and no 3D, neon or gradients.

## Open questions and ideas to explore
- **Year 1 reads "Holds, with loose parts."** That verdict is computed. Some new platform parts have no recorded pairing in `foundations-data.ts`. Either add the pairings (a data fix that would also change the site) or keep it as a talking point.
- Act 5's three upper systems are small at 1080p; their sticker text isn't readable. Consider a slow zoom per system, or fewer bricks.
- Act 1's pile uses products from all domains but no Foundations capabilities. It could mix in more Foundations products.
- No audio. Timing is built for silent reading; a voiceover would need re-timing (step lengths are constants at the top of each act).
- Possible extras: a loopable GIF segment (act 3, 5 steps) for the site, and a reduced-motion or poster frame.
- Should the video live on the site (replacing or complementing the hero loop), or on thejambot.com only? CLAUDE.md says the thejambot.com integration is deferred until after the LinkedIn post response.

## How to run
```bash
cd video
npm install
npm run studio     # scrub in the browser
npm run render     # out/chromatic-architecture-overview.mp4 (~9 min in a cloud container)
# one act or one frame:
npx remotion still src/index.ts Act4-Growth out/f.png --frame=700
```

## Gotchas hit last session (cloud container)
- Remotion can't download its browser there. Pass `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`.
- `remotion.config.ts` adds `video/node_modules` to webpack module lookup, because files in `../preview/src` import `react`. `tsconfig.json` maps `react` paths for the same reason. Keep both.
- Concurrency is `null`, because the container has 2 cores and a fixed value errors.
- Bundle once (`npx remotion bundle src/index.ts --out-dir build`), then render stills from `build` for fast checks.
- `out/`, `build/` and `node_modules/` are gitignored; the MP4 isn't in the repo.
- If a git hook says the branch has "no remote branch" after a shallow clone, the commits are there. Add the branch to `remote.origin.fetch` and set the upstream.

## Useful repo context
- `BRICKS.md`: the brick grammar (snap / loose / forced, placeholders, tiers) and its honesty boundaries.
- `PRODUCT.md`: users (consultants who need recall in under 60s), brand principles, and anti-references.
- `ASSEMBLY_REVIEW.md` and `BATTLETEST.md`: evidence hierarchy and validation plan.
- `preview/src/FrontDoor.tsx`: the site's 5-frame hero loop, which act 3 mirrors.
