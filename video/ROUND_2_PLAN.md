# Round 2 plan: the five open items

Status: draft for Jamil's decisions, 2026-10-31. Branch `video/goal-first-fixes`. Nothing here is built yet.

Order of work is by risk: data-only fixes first (1, 3), then visual encoding (2, 4), then the one piece of new content (5).

## 1. The AI system is missing its Interface part (act 4)

**Cause.** Question 4 ("How will people ask?") asks the AI system for Cognition, Memory and Interface. The `internal-knowledge-agent` recipe has no Interface product, so act 4 honestly reads *Holds, parts missing* with no explanation.

**Checked against the site's data.** Capability `app-interface` has two products, `vercel` and `streamlit`. Adding either to the Knowledge Agent build reads *Snaps together* with no gaps (both seat as snaps).

**Options**
- A. Add `streamlit` to the AI build in `goal.ts` (`[...recipeTools('ai','internal-knowledge-agent'), 'streamlit']`). A team-data explorer is a plausible Streamlit app. Recommended.
- B. Add `vercel` instead. It also overlaps Foundations' Experience hue, which muddies "who owns what".
- C. Leave the gap and caption it. Rejected: it makes the job's own question look unanswered in the final frame.

**Changes.** `goal.ts` (one line), `SetAct.tsx` (verdict recomputes), a one-line note in the notes of act 4 that the Interface part is added to the recipe, so the build is "recipe plus one". Also correct the stale HANDOFF line saying Streamlit reads loose.

**Check.** Run `readSystem('ai', …)` and assert verdict `clean`; render the act 4 still.

## 2. Dashed seams can read as data flow

**Cause.** Dashed lines with "?" circles between plate centres look like arrows without heads. The "not data flow" caveat appears in act 3 but not act 4.

**Fix: draw absence, not connection.** Replace lines with an *open socket* on each plate edge: a pale, empty stud pair on the facing edges, with a single label "Not recorded". No line crosses the gap between plates.

**Also**
- Repeat the caveat in act 4 as a footer: "Height shows tier, a reading aid. No link between systems is recorded."
- Change the headline to "Nothing records how these systems join." and keep "Unproven, not wrong."
- Drop the "?" circles. They invite a reading of "some data goes here".

**Changes.** `SetAct.tsx` only: the `seams` array becomes `sockets` (position per panel edge), SVG replaced by two small stud glyphs per socket. Use `SEAT_COLORS.missing` styling so it matches the seat key from act 3.

**Decision for Jamil.** Is a cross-domain "joined" state ever shown in this video? Recommend no: Phase 4 of the site plan (recorded links) does not exist yet, and drawing one would claim data we do not have.

## 3. Foundations is a passive base

**Cause.** Foundations lands third in act 4, is drawn small under the others, and its job is never said. The job asked nothing that points at it except Trust (q2) and Experience (q4).

**Fix, three parts.**
1. **Data.** Switch the Foundations build from `authenticated-app` (which marks `operations` missing) to `watched-app` (nextjs, nodejs, postgresql, render, auth0, github, github-actions, opentelemetry, pagerduty). Verified: it reads clean and covers all seven hues.
2. **Question.** Add a sixth question after "Can we trust the numbers?": "Who runs it, and who gets paged?" asking Foundations `delivery`, `platform`, `operations`. This makes Foundations an answer to the job, not scenery.
3. **Staging in act 4.** Foundations lands first, the three systems then land *on* it, and a one-line caption carries its role: "Foundations: login, delivery and running it. Every system above stands on it." Plinth label stays "Product operating model" and is read aloud in the caption.

**Cost.** One more question is about +115 frames in act 2; see timing.

**Changes.** `goal.ts` (systems.foundations tools, new question), `QuestionsAct.tsx` (timing constants derive from `questions`, so only the array changes), `SetAct.tsx` (timings `T`, caption).

**Decision for Jamil.** Is a sixth question acceptable, or fold "who gets paged" into question 2 ("Who owns this, who may see it, and who runs it?")? Recommend the sixth question; folding makes question 2 do three jobs.

## 4. Small type

**Inventory (from code).** Hue chips 15 px (system label) and 20 px (name); "N of M roles asked" 17 px; seat key 20 px; eyebrow 17 px; stamp subline 15–16 px; verdict pills 15 px; footers 18–19 px; "?" 20 px.

**Rule.** At 1920×1080, any text a viewer is meant to read gets a 22 px floor; 18 px only for decorative labels (eyebrow, scene-edge captions). Brick sticker text is exempt and is already handled by zoom.

**Changes by file**
- `QuestionsAct.tsx`: chip system label 15 to 18 (uppercase, so it reads larger), chip name 20 to 24; count 17 to 22; footer caption 18 to 22. Chips may wrap to two rows; the left column has room until the summary.
- `SetAct.tsx`: verdict pills 15 to 22; system names 18 to 24; panel captions 22.
- `DataBuildAct.tsx`: stamp subline 22; caveat footer 22; seat key stays 20 and goes to 22; primer marks unchanged.
- `lib/type.tsx`: raise `Chip` to 22 and add a `caption` style at 22 so acts stop hand-setting sizes.

**Check.** Stills at frames with the densest text (Questions summary, Set end of seams) and review at 50% scale, which approximates a phone.

## 5. The video has no evaluation criteria

**Cause.** The job is stated and the questions are asked, but nothing says how the finished build is *judged*. The friend's original suggestion was "evaluate these criteria".

**What the site actually holds.** `evaluationDimensions` (harmony, contrast, complexity, durability, clarity, adaptability, operationalLoad, trustSurface) exist in each domain's data file but are used only by the legacy full-page components, not by the brick views and not by `readBuild`. Tools carry `complexityAdded` and `trustContribution`, but I only confirmed these in the Data Engineering file (15 occurrences); coverage across the other three domains is unchecked. There is no recorded scoring we can compute from.

**Recommendation: three editorial criteria, shown not scored.** Pick three of the eight that this job makes matter, name them as the job's criteria, and show them as the lens. Do not put numbers or bars on them.
- **Trust surface** (this is people data)
- **Operational load** (a small team will run it)
- **Adaptability** (new questions will arrive)

**Placement**
- Act 1, after the job line: "Judged on:" with the three criteria as plain pills. (~90 frames.)
- Act 4, close: each criterion gets one sentence tied to something already on screen, e.g. Trust surface: "Governance and Trust roles are filled" (computed from `gaps`, not a score); Operational load: "Two orchestrators is one too many" (the forced fit from act 3); Adaptability: "Roles are separable, so a product swap is a label change". (~150 frames.)
- Label: "Criteria are editorial, chosen for this job." Same register as the existing "starting checklist, not a rule" caption.

**What not to do.** No scores, no radar chart, no `complexityAdded` sums. The site does not record them for brick builds, and the project's own rule (CLAUDE.md, Product Selection) avoids unsourced rankings.

**Changes.** `goal.ts` (new `criteria` array with `id`, `label`, `evidence`), `JobAct.tsx` (pills), `SetAct.tsx` (closing beat before the end card).

**Decisions for Jamil.** (a) Are these the right three? (b) Should the site get the same criteria on the `?job=` lens (site plan Phase 2) so the video and site agree? Recommend yes, otherwise the video claims something the site cannot show.

## Timing budget

Current 3680 frames (2:03). Additions: +115 (sixth question), +90 (criteria in act 1), +150 (criteria in act 4), +40 (Foundations caption beat). Total about +395, so roughly 4075 frames (2:16). To stay near 2:10 trim act 3's steps 4 and 6 by about 60 frames each and act 1's pile by 40. Target 3900 frames (2:10).

## Order and verification

1. `goal.ts` data changes (items 1, 3) with a throwaway `tsx` check that every system's verdict and gap count are what the video says.
2. Type floors (4), then bundle and render stills of acts 2 and 4.
3. Sockets and Foundations staging (2, 3).
4. Criteria (5) after Jamil confirms the three.
5. Full render, scrub for text overflow and timing, then update HANDOFF.

## Decisions needed

1. Streamlit or Vercel for the AI Interface part (recommend Streamlit).
2. Sixth question for Foundations, or folded into question 2.
3. Which three criteria, and whether the site gets them too.
4. Whether any "joined" state is ever shown between systems (recommend no).
5. Target length: 2:10 (trim) or accept 2:16.
