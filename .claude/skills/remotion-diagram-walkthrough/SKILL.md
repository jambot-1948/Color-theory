---
name: remotion-diagram-walkthrough
description: Turn an SVG or architecture diagram into a narrated-style Remotion walkthrough with sequential draw-on animation and captions. Use for architecture, process or framework explainers.
---

# Remotion diagram walkthrough

Follow `remotion-setup` first.

1. Take the user's SVG or diagram description (default 40 seconds).
2. Draw each node and arrow in sequence using `stroke-dashoffset` animation driven by `interpolate`.
3. Highlight one component at a time while a caption explains it; dim the rest.
4. Captions come from an editable array in the data file.
5. Verify that highlights, captions and timing line up by rendering stills at each step boundary.
