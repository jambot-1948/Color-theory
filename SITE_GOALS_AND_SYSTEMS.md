# Site plan: start from the job, and show systems of systems

Status: draft, 2026-09-29. Nothing on the site has changed yet. This carries two ideas from the goal-first video cut (`video/GOAL_FIRST.md`) onto the site:

1. **Start from the job.** A build is judged against what it is for, not only against its own parts.
2. **Systems of systems.** A real job spans several domains. Each is its own model on its own plate; the joins between them are not recorded.

## What the site does today

- Every build lives inside one domain. `?build=` decodes against one edition, and recipes, stories and pairings are keyed within it.
- A recipe's `useCase` is the closest thing to a job, but it only appears in the Architect and Consultant lenses, under the brick manual (`BlendWorkshop.tsx`, `architectText` / `consultantText`). `ASSEMBLY_REVIEW.md` already says the use case must lead.
- "Foundations sits under the others" is stated only as text: the `BUILDS ON FOUNDATIONS` note on each domain page (`foundationNotes`). The plinth label exists only on the Foundations plate.
- No page shows two domains' models together. Parts inventory lists all four but has no links between them.
- `BATTLETEST.md` step 5, "Validate cross-domain", has nothing on the site to test against.

## Guardrails

- **Consultant speed stays intact** (PRODUCT.md: an answer in under 60 seconds). Goal-first is a new way in, not a wizard in front of every page. Today's domain pages keep working exactly as they do with no job selected.
- **Jobs and their questions are editorial.** The site says so wherever they appear, the way growth tracks say they are illustrations.
- **Seams are not studs.** Nothing joins two systems until a cross-domain link is recorded with the same evidence standard as `pairsWellWith`. Until then a seam is drawn open and labelled "No recorded link. Unproven, not wrong."
- **Verdicts stay computed.** A job's unfilled roles are passed to `readBuild` as `gaps`, exactly as `missingHues` is today. No new verdict type.

## Phase 1: let the job lead (copy and layout only, about a day)

No new data. Small, reversible changes.

| Where | Change | Draft copy |
|---|---|---|
| `BlendWorkshop.tsx`, above the parts tray | Show the matched recipe's `useCase` as the first thing in the workspace when a blueprint matches, instead of only inside two lenses | Label: `THE JOB THIS BUILD IS FOR`. Body: the recipe's `useCase`. With no match: "No named job matches this build yet. Name what it is for, then read what is missing." |
| `BlendWorkshop.tsx`, `foundationNotes` for AI, Data, Harness | Keep the text; add one line on systems of systems | "Most real jobs need more than one of these systems. See how they combine on the job pages." (link added in phase 3) |
| `FrontDoor.tsx`, hero subhead | Add the job framing | "Start from the job. See what snaps together, what's forced, and what's missing." |
| `FrontDoor.tsx`, `fd-principles` | Add a sixth definition after Placeholder | **Job**: "What the build is for. Its questions name the roles it needs, before any product is chosen." |

## Phase 2: jobs as data, and a job lens on each domain page (about 3 days)

**New file `preview/src/jobs.ts`.** Promote the video's `video/src/goal.ts` into the site so the video imports it, keeping the "reuse the site" rule.

```ts
export interface JobQuestion {
  text: string
  note?: string
  asks: Partial<Record<EditionId, HueId[]>>   // roles this question needs, per domain
}
export interface JobSystem {
  edition: EditionId
  name: string                // "Team data", "Ask in plain language"
  build: string               // same encoding as ?build=
  optional?: string           // "Only if it acts"
}
export interface Job {
  id: string
  name: string
  line: string                // "A tool to explore how a project team works."
  questions: JobQuestion[]
  systems: JobSystem[]
}
```

**Job lens in `BlendWorkshop` (`?job=team-explorer`):**
- A compact "Job" panel above the parts tray lists the questions that ask this domain for roles, each with its hue chips.
- The job's roles for this domain that the build doesn't fill become placeholders: `ghostHues` = job hues minus filled hues, passed through `AssemblyGuide` → `ManualBoard` the same way `missingHues` is.
- The finished-model verdict then reads against the job. The video's data build shows why: Fivetran + dbt + Snowflake alone reads *Holds, parts missing* against the job; the Governance Gap reads *Looks built, reads wrong*; adding GX Core and DataHub reads *Snaps together*.
- `share()` keeps `job=` in the link.
- An "Other systems in this job" row links to the job's other domains, each with its own `?build=&job=`.

**First three jobs** (each system is an existing curated recipe unless noted; verdicts below are computed today, using each recipe's own `missingHues`):

| Job | Systems |
|---|---|
| Explore how a project team works | Data: custom build (the video's; *Snaps together* against the job). AI: The Knowledge Agent. Foundations: The Authenticated App. Harness, only if it acts: The Governed Operator. |
| Handle refunds with an agent that asks before acting | Harness: The Governed Operator (*Holds, parts missing*: Sandbox, Context). AI: The Enterprise-Ready Stack (*Holds, parts missing*: Interface, Velocity). Foundations: The Watched App (*Snaps together*). |
| Answer questions from sensitive notes, on our own hardware | AI: The Private Local Assistant (*Holds, parts missing*: Memory, Trust). Harness: The Local Agent (*Holds, parts missing*: Sandbox, Permissions, Recovery). Foundations: The Self-Hosted App (*Holds, parts missing*: Delivery). |

The third job is honest about being unfinished everywhere. That is useful: it shows the self-hosted path costs parts in every system, not just one.

## Phase 3: the job page, where systems of systems is visible (about 4 days)

**Route `#/jobs` and `#/jobs/:id`**, new `JobPage.tsx`. Nav gets "Jobs" as the first item, ahead of the four domains.

`#/jobs` is a short list of job cards: name, one line, and the domains it spans as hue strips.

`#/jobs/:id` is the video's act 4 as a page:
1. **The job and its questions.** Each question with hue chips grouped by domain; chips link to the domain page with the job lens on.
2. **The set.** One `BrickScene` per system, each on its own plate, with Foundations drawn last and widest, carrying its plinth label. Each system shows its computed verdict and "Open in the assembly". An optional system is drawn pale on a dashed outline with its condition ("Only if it acts").
3. **The seams.** Open dashed joins between systems, each with a `?` marker. Hover or tap: "No recorded link between these systems. Unproven, not wrong." Page line: "Each system has its own parts. The joins between them are yours to design."
4. **Shared parts, when present.** Computed: any product that appears in two systems of the set, with the role it plays in each. Seven products already sit in two domains with different roles (PostgreSQL, Redis, Vault, Docker, Kubernetes, OpenTelemetry, Temporal). Draft copy: "Same product, different job: Vault is Trust in Foundations and Permissions in the agent harness."
5. **Boundary line**, as on the front page: "A job page shows which systems a job needs and how each is built. It does not show runtime wiring or data flow between them."

Share link: `#/jobs/:id?data=<build>&ai=<build>&foundations=<build>` so a consultant can swap one system and send the set.

`FrontDoor.tsx`: add a "Start from a job" section before "Choose a system", with the three job cards. The domain cards stay as the second way in.

## Phase 4, later: record the seams

Only if battletesting shows people want it. `preview/src/crossLinks.ts`: documented integrations between products in different domains (for example a warehouse feeding a vector index), declared with a source, like `pairsWellWith`. A recorded seam draws as a closed join; everything else stays open. This is what `BATTLETEST.md` step 5 needs to become testable, so the battletest template should gain a question: "Which joins between these systems would you call a clear fit, and which a clear clash?"

## Docs to update alongside

- `BRICKS.md`: add **Job** (questions that name roles; editorial) and **Seam** (open join between systems; nothing recorded) to the grammar table, and a line to Honesty boundaries.
- `PRODUCT.md`: add a second use to Product Purpose: "or start from a job and see which systems it needs."
- `CLAUDE.md`: add the `#/jobs` routes.
- `video/src/goal.ts`: delete once `preview/src/jobs.ts` exists, and import from the site.

## Decisions for Jamil

1. **Nav naming.** "Jobs", "Start from a job", or "Sets"? "Jobs" is shortest; "Sets" leans on the LEGO metaphor but reads as vague.
2. **Front door order.** Put "Start from a job" before "Choose a system" (proposed), or after? Before signals the new stance; after protects returning users who come for a domain.
3. **Which three jobs.** The team explorer sits close to BTA's artifact-trail diagnostic. Keep it as the flagship, or lead with refunds, which is further from BTA?
4. **Phase 4 at all.** Recording cross-domain links is a real data commitment with the same review burden as `pairsWellWith`.
