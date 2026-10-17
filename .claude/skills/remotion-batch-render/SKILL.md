---
name: remotion-batch-render
description: Render many personalized Remotion videos from a data file (one MP4 per row). Use for per-customer, per-person or per-record video generation.
---

# Remotion batch personalized videos

Follow `remotion-setup` first.

1. Create one composition with props such as `{name, company, metric}` and an animated title card.
2. Write a Node script using `@remotion/renderer` (`bundle`, `selectComposition`, `renderMedia`) that reads `people.json` and writes one MP4 per row into `out/`.
3. Sanitize filenames; handle missing fields with clear errors.
4. Test with two rows first, then run the full batch.
5. Do not send or upload the videos anywhere unless the user asks.
