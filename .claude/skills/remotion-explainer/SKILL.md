---
name: remotion-explainer
description: Build a kinetic-typography explainer video in Remotion from a script. Use when the user supplies narration or copy and wants a text-driven animated video.
---

# Remotion explainer from a script

Follow `remotion-setup` first.

1. Ask for (or accept) the script and target length (default 45s).
2. One `<Sequence>` per sentence; derive each duration from word count.
3. Large kinetic typography on a dark background, a different accent color per scene, spring-based entrance per line.
4. Put all copy and timings in a single data file.
5. Render stills for every scene and fix clipping or overflow before finishing.
