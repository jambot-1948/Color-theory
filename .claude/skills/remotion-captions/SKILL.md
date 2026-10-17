---
name: remotion-captions
description: Add voiceover audio and word-level highlighted captions to a Remotion composition. Use when the user has audio and wants TikTok-style subtitles or audio-synced scenes.
---

# Remotion voiceover and captions

Follow `remotion-setup` first.

1. Place audio in `public/` (e.g. `voiceover.mp3`) and add it with Remotion's `<Audio>`.
2. Generate word-level captions with `@remotion/captions` (or Whisper) and store them as JSON.
3. Render captions as TikTok-style subtitles with the active word highlighted.
4. Sync scene changes to caption timestamps.
5. Check stills against several timestamps to confirm caption timing and line breaks.
