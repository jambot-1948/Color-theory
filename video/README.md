# Chromatic Architecture — animated overview

A Remotion project that renders the talk video for thejambot.com. It imports the site's real
brick renderer, data, and build rules from `../preview/src`, so the video never drifts from the site:
every snap, forced fit, and verdict is computed by `readBuild`, the same as the front-page hero.

```bash
npm install
npm run studio        # live preview and scrubbing in the browser
npm run render        # renders out/chromatic-architecture-overview.mp4
```

## Acts
| # | Act | File | Length |
|---|-----|------|--------|
| 1 | The pile: gray, role-less products | `src/acts/PileAct.tsx` | 12s |
| 2 | Picture → word: brick, colour, label, height | `src/acts/VocabAct.tsx` | 30s |
| 3 | The build: Lean Knowledge Agent (place, snap, force, missing) | `src/acts/BuildAct.tsx` | 34s |
| 4 | Growth: Foundations from Week 1 to Year 1, then the platform-before-product wrong turn | `src/acts/GrowthAct.tsx` | 37s |
| 5 | The foundation: three systems resting on Foundations, then the end card | `src/acts/FoundationAct.tsx` | 22s |

`Overview` strings all five together (about 2:15). Each act is also its own composition for quick iteration.
`src/lib/motion.tsx` holds the shared motion: parts drop in, move between steps, and lift away when removed.
