# Remotion Prompt Playbook

Copy-paste prompts for making videos with [Remotion](https://www.remotion.dev), the React-based video framework, using Claude Code or any coding agent. A video is just code, so the agent can write it, preview it, and re-render it.

## How to use this

1. Create an empty folder and open your coding agent in it.
2. Paste the **Setup prompt** first.
3. Paste one of the **Recipes** below, replacing anything in `[brackets]`.
4. Iterate one scene at a time in the Studio, then export.

---

## Setup prompt (always send first)

```
Scaffold a Remotion project with `npx create-video@latest` (TypeScript, blank template).
Start the Studio with `npx remotion studio`. Build everything I ask for as Remotion
compositions in src/. Use useCurrentFrame, interpolate and spring for all animation,
never CSS transitions or CSS animations. Default to 1920x1080 at 30fps unless I say
otherwise. Keep copy, colors and timings in one data/config file so I can edit them
without touching components. After each change, render a still with
`npx remotion still` and inspect it before telling me it's done.
```

---

## Recipes

### 1. Explainer from a script

```
Build a 45-second explainer video in Remotion from this script: [paste script].
One <Sequence> per sentence, with duration derived from word count. Use large kinetic
typography on a dark background, a different accent color per scene, and a
spring-based entrance for each line. Put all copy and timings in a single data file.
```

### 2. Data-driven animated chart

```
Read data.csv and make a 20-second Remotion video that animates it as a bar chart
race. Bars spring into place, labels count up, and the title fades in. Make the
composition accept props via a zod schema so I can swap the dataset from the Studio
sidebar.
```

### 3. Product or feature demo

```
Make a 30-second Remotion launch video for [product]. Scenes: problem, solution,
three feature callouts, call to action. Use a faux browser window component with an
animated cursor and click ripples. Add a vertical 1080x1920 composition that reuses
the same scenes.
```

### 4. Diagram or architecture walkthrough

```
Turn this SVG diagram into a Remotion video: [paste or point to file]. Draw each node
and arrow in sequence with stroke-dashoffset animation, and highlight one component
at a time while a caption explains it. Total length 40 seconds. Captions come from an
editable array.
```

### 5. Batch personalized videos

```
Create one Remotion composition with props {name, company, metric}. Then write a
script using @remotion/renderer that reads people.json and renders one MP4 per row
into out/. Show the name and metric on an animated title card.
```

### 6. Voiceover and captions

```
Add public/voiceover.mp3 to my composition. Generate word-level captions with
@remotion/captions (or Whisper) and render them as TikTok-style highlighted
subtitles. Sync scene changes to caption timestamps.
```

### 7. Social cutdowns

```
Take my existing 16:9 composition and add 1:1 and 9:16 variants as separate
compositions that share the same scene components. Reflow layout per aspect ratio
instead of just scaling. Keep text inside safe margins.
```

### 8. Motion graphics intro/outro

```
Make a reusable 4-second logo sting as a Remotion composition: logo mask-reveals,
a color wipe, then a tagline. Expose duration, colors and tagline as props. Export it
as a standalone composition I can <Sequence> into other videos.
```

---

## Tips

- **One scene at a time.** Asking for the whole video at once tends to produce generic output.
- **State constraints.** Duration, fps, aspect ratio, palette, fonts (load with `@remotion/google-fonts`).
- **Make the agent look.** Tell it to render stills and check them. Without that, it can't see what it made.
- **Prefer props over hardcoding.** A zod schema gives you editable controls in the Studio.
- **Reuse scenes.** Build scene components once, then compose them into multiple formats.

## Handy commands

| Task | Command |
| --- | --- |
| Create project | `npx create-video@latest` |
| Open Studio | `npx remotion studio` |
| Render a still | `npx remotion still <CompositionId> out/frame.png --frame=30` |
| Render video | `npx remotion render <CompositionId> out/video.mp4` |

## Troubleshooting prompts

- **Animation looks jumpy:** "Replace any CSS transitions with `interpolate`/`spring` driven by `useCurrentFrame`."
- **Timing is off:** "Show me the frame ranges for each `<Sequence>` and fix any overlaps or gaps."
- **Text overflows:** "Render stills at the first, middle and last frame of every scene and fix any clipping."
- **Render is slow:** "Find the heaviest components per frame and memoize or simplify them."

## Notes

- Remotion has its own licence terms for commercial use. Check [remotion.dev/license](https://www.remotion.dev/license) before shipping paid work.
- Commands and package names change over time. If something fails, check the current docs at [remotion.dev/docs](https://www.remotion.dev/docs).
