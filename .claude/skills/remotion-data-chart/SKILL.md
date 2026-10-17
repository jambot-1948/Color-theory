---
name: remotion-data-chart
description: Animate a CSV or JSON dataset as a Remotion video such as a bar chart race. Use when the user has data and wants an animated chart video.
---

# Remotion animated data chart

Follow `remotion-setup` first.

1. Read the user's data file (e.g. `data.csv`) and confirm columns and units.
2. Default to a 20-second bar chart race: bars spring into place, labels count up, title fades in.
3. Make the composition accept props via a zod schema so the dataset can be swapped from the Studio sidebar.
4. Use accessible, consistent chart colors; label directly rather than relying on a legend where possible.
5. Verify stills at start, middle and end; confirm values match the source data.
