---
name: remotion-setup
description: Scaffold and configure a Remotion (React video) project with the house rules for animation, structure and verification. Use before any other remotion-* skill, or when the user wants to start making a video in code.
---

# Remotion setup

## Steps
1. If there is no Remotion project, run `npx create-video@latest` (TypeScript, blank template). Otherwise reuse the existing one.
2. Start the Studio with `npx remotion studio`.
3. Defaults unless the user says otherwise: 1920x1080, 30fps.
4. Build every video as compositions in `src/`.

## Rules
- Animate only with `useCurrentFrame`, `interpolate` and `spring`. Never CSS transitions or CSS animations; they do not render deterministically.
- Keep copy, colors and timings in one data/config file so the user can edit without touching components.
- Expose editable inputs as composition props with a zod schema so they appear in the Studio sidebar.
- Load fonts with `@remotion/google-fonts`.
- After each change, render a still (`npx remotion still <CompositionId> out/frame.png --frame=30`) and inspect it before reporting done. Check first, middle and last frame of each scene.
- Work one scene at a time; do not generate the whole video in one pass.

## Commands
| Task | Command |
| --- | --- |
| Open Studio | `npx remotion studio` |
| Render a still | `npx remotion still <CompositionId> out/frame.png --frame=30` |
| Render video | `npx remotion render <CompositionId> out/video.mp4` |

Commands and package names change; if one fails, check https://www.remotion.dev/docs. Remotion has its own commercial licence terms (https://www.remotion.dev/license); mention this if the work is paid.
