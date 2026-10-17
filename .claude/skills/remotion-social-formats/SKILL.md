---
name: remotion-social-formats
description: Create 1:1 and 9:16 variants of an existing Remotion composition that share scene components. Use when the user wants social cutdowns or multiple aspect ratios.
---

# Remotion social formats

1. Keep scene components aspect-ratio agnostic; pass layout as props.
2. Register 1:1 (1080x1080) and 9:16 (1080x1920) compositions alongside the 16:9 one, reusing the same scenes.
3. Reflow layout per ratio instead of scaling; keep text inside safe margins.
4. Render a still of each variant and check clipping.
