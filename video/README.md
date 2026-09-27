# Chromatic Architecture — animated overview

A Remotion project that renders the talk video for thejambot.com. It imports the site's real
brick renderer, data, and build rules from `../preview/src`, so the video never drifts from the site:
every snap, forced fit, and verdict is computed by `readBuild`, the same as the front-page hero.

```bash
npm install
npm run studio        # live preview and scrubbing in the browser
npm run render:build  # renders out/act3-build.mp4
```

## Acts
| # | Act | Status |
|---|-----|--------|
| 1 | The pile | planned |
| 2 | Picture → word: brick, colour, sticker, height | planned |
| 3 | The build: Lean Knowledge Agent | **built** (`src/acts/BuildAct.tsx`, 34s) |
| 4 | Growth over time, with the accretion wrong turn | planned |
| 5 | Pull back to four editions | planned |
