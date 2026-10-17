---
name: remotion-troubleshooting
description: Diagnose common Remotion problems such as jumpy animation, timing gaps, text overflow and slow renders. Use when a Remotion video looks or renders wrong.
---

# Remotion troubleshooting

- **Animation looks jumpy:** replace CSS transitions/animations with `interpolate`/`spring` driven by `useCurrentFrame`.
- **Timing is off:** list the frame range of every `<Sequence>` and fix overlaps or gaps; remember `useCurrentFrame` is relative to the enclosing Sequence.
- **Text overflows:** render stills at the first, middle and last frame of each scene and fix clipping.
- **Render is slow:** find the heaviest components per frame; memoize or simplify them, and avoid recomputing large data per frame.
- **Fonts or assets missing at render:** load fonts via `@remotion/google-fonts`; reference assets with `staticFile()` from `public/`.
