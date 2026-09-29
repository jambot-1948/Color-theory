# Draft: goal-first cut of the overview

Status: exploration, 2026-09-29. Nothing in `src/` has changed. This responds to two notes from a friend who liked the video:

1. **Start with the end in mind.** Open with a job to be done, name what the job demands, then show which pieces fit. Don't open with pieces.
2. **Systems of systems.** A real build is like a LEGO set with a ship and a plane: each is its own model with its own parts, and the set is both.

## The core idea: the two notes are one note

If you start from a job, the job's questions quickly ask for more than one system. "A tool to explore how a project team works" needs a data system to collect and model the team's records, an AI system to answer questions in plain language, and a foundation for login and hosting. A fourth system, the agent harness, is needed only if the tool also *acts*. Systems of systems isn't a separate act. It's where goal-first reasoning leads.

This also gives the video a stronger argument than it has now. **Parts can snap together and still not serve the job.** The data engine computes that directly (see "The proof beat" below).

## The proof beat (all computed, verified against current data)

| Build (Data engineering) | Verdict from `readBuild` |
|---|---|
| Fivetran + dbt + Snowflake | Snaps together |
| + Trino + Airflow (this is the curated **Governance Gap** recipe) | **Looks built, reads wrong** |
| + GX Core (observe) + DataHub (govern) | **Snaps together** |

For a tool full of people data, the question "who may see whose work?" is exactly what the Governance Gap leaves out. The job's criterion names the missing role; the engine confirms the fix seats. No verdict is typed in.

Other systems in the set, also computed:

| System | Build | Verdict |
|---|---|---|
| AI applications | The Knowledge Agent (OpenAI, Pinecone, LangChain, LangGraph, LangSmith) | Snaps together (curated blueprint; its recipe marks Interface and Velocity missing) |
| Foundations | The Authenticated App (Next.js, Node.js, PostgreSQL, Heroku, Auth0, GitHub Actions) | Snaps together (recipe marks Operations missing) |
| Agent harness, only if it acts | The Governed Operator (Kubernetes, MCP, OPA, Vault, Temporal, Langfuse) | Snaps together |

Watch-out: swapping OpenAI for Claude in the AI system loosens the retrieval brick (no recorded Claude + Pinecone pairing). That is either a data gap to fix or a line to avoid.

## Proposed running order (~2:20, vs 2:15 today)

| # | Act | Length | What happens |
|---|---|---|---|
| 1 | **The job** | 0:12 | "Say you want a tool to explore how a project team works: its tickets, commits and conversations." The gray pile flashes in as the usual answer, then clears. |
| 2 | **The questions** | 0:30 | Five questions appear one at a time. Each lights the hue chips it demands, and dashed placeholder bricks appear on the plates that need them. Colour = role is taught here, in context, replacing most of today's act 2. |
| 3 | **One system up close** | 0:35 | The data system: place, snap, snap, then read **Looks built, reads wrong** (Governance Gap). Add GX Core and DataHub and it snaps. The label swap and height-as-tier lines from today's act 2 move here as captions. |
| 4 | **The set** | 0:35 | Pull back. The AI system and the data system sit side by side on Foundations, like the ship and plane in one box. The harness plate appears ghosted, labelled "Only if it acts." |
| 5 | **The seams** | 0:15 | Dashed lines between the systems, labelled "No recorded link. Unproven, not wrong." Line: "Each system has its own parts. The joins between them are yours to design." |
| 6 | **End card** | 0:13 | Unchanged, with the job line as the subtitle: "Start from the job. See what snaps, what's forced, and what's missing." |

### The five questions (draft copy)

| Question | Roles it asks for |
|---|---|
| Where does the team's data come from, and how fresh must it be? | Data: Ingest, Orchestrate. Nightly is enough, which rules out the Streaming Pipeline. |
| Who may see whose work? | Data: Govern. Foundations: Trust. |
| Can we trust the numbers? | Data: Observe. |
| How will people ask? | Dashboards: Data Serve. Plain language: the AI system (Cognition, Memory, Interface). |
| Does it only answer, or also act? | Acting adds the agent harness (Permissions, Evidence). |

Hue names above are the real ones from each domain's data file. The *mapping* from question to roles is new authored content, not something the data holds today.

## What this costs

- **Act 3's Lean Knowledge Agent build goes away.** It mirrors the site's hero loop, so the video and site would stop echoing each other. The new build still uses the same place / snap / read grammar.
- **Act 4 (Growth) is cut from the main video.** This touches a settled decision: Foundations carries the back half. In this cut Foundations is still the base of the set, but its Week 1 → Year 1 story and the "platform before product" wrong turn are gone. Option: keep act 4 as a separate clip for the site's growth page.
- **The questions are authored, not recorded.** Per BRICKS.md's honesty rules they should say so on screen, for example a small caption: "Questions are a starting checklist, not a rule."

## What it would take to build

- `video/src/goal.ts` (new): the job line, the five questions, and each question's required hues per domain. Keep it in `video/` unless the site wants a goal view later, then move it to `preview/src`.
- Act 3 rewrite reuses `BuildAct`'s step machinery with data-edition parts, and passes the goal's required hues as `gaps` exactly as today's act 3 passes `missingHues`.
- Act 4 (the set) extends `FoundationAct`: two upper systems instead of three, plus a ghosted harness plate. This also fixes the open handoff note that act 5's systems are too small to read.
- The seam lines already exist as dashed SVG paths in `FoundationAct`; they only need labels.

## Lower-risk alternative

Keep today's five acts. Add a 12-second job opener and swap the end-card subtitle. Cheaper, but the build in act 3 (a knowledge agent) wouldn't match the opening job (a team explorer), so the anchor would feel bolted on. Not recommended.

## Worth knowing, not used above

Seven products appear in two domains with a different role in each: PostgreSQL (Foundations Data, Harness Context), Redis (same), Vault (Foundations Trust, Harness Permissions), Docker and Kubernetes (Foundations Platform, Harness Runtime), OpenTelemetry (Foundations Operations, Harness Evidence), Temporal (AI Logic, Harness Recovery). "Same product, different job" is a computed, honest way to show systems sharing parts. None of these appears in the builds above; picking different builds to use it would be a choice to make deliberately.

## Decisions for Jamil

1. Goal-first cut, or keep the current structure?
2. OK to drop the Growth act from the main video (and keep it as a clip)?
3. Is "explore how a project team works" the right job? It sits close to BTA's artifact-trail diagnostic, which could be a strength or a distraction in a Chromatic Architecture video.
