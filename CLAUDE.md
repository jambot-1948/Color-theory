# Claude Instructions

## Project Context
The Chromatic Architecture framework applies color theory metaphors to technology architecture. Four domains are implemented:
- **Foundations**: The application and delivery foundation every other domain sits on (7 hues: Experience, Service, Data, Trust, Delivery, Platform, Operations). Its baseplate is labelled as the product operating model.
- **Architectural Chromatics** (shown as "AI applications"): AI/LLM application stacks (7 hues: Intent, Logic, Cognition, Memory, Interface, Velocity, Trust)
- **Data Engineering Chromatics**: Data platform composition (7 hues: Ingest, Transform, Orchestrate, Store, Serve, Observe, Govern)
- **Agent Harness Chromatics**: The layer between the model and the world (7 hues: Tools, Sandbox, Permissions, Context, Evidence, Recovery, Runtime). The original infrastructure-focused hues are frozen in `preview/src/agent-harness-legacy-data.ts` for the legacy view.

Core premise: **How things combine matters more than what they are individually.**

## Battletesting Process
See `BATTLETEST.md` for the full validation framework. Key steps:

1. **Gather expert feedback** from 3–5 architects/engineers per domain
2. **Apply to real systems** (map existing production stacks, identify gaps)
3. **Test anti-patterns** (do teams actually avoid the named problems?)
4. **Refine hue definitions** if tools keep getting misclassified
5. **Validate cross-domain** (can you see how domains interop?)

Collect feedback using the template at the end of `BATTLETEST.md`.

## Known Pending Items
- **thejambot.com integration**: Deferred until after LinkedIn post response lands—the external feedback will shape framing
- **Font size optimization**: Completed in a previous pass (larger for legibility)
- **"Muddy mix" quote placement**: Integrated into the framework's messaging

## Development
- Dev server: `npm run dev` in the `preview/` directory → http://localhost:5174/Color-theory/
- Build: `npm run build` → outputs to `preview/dist/`
- Deployed to GitHub Pages: https://jambotsmachine.github.io/Color-theory/
- Routing: Hash-based (`#/`, `#/foundations`, `#/ai-applications` (old `#/ai-systems` links still work), `#/data-engineering`, `#/agent-harness`, `#/growth[/foundations|/data|/harness]`, `#/reference`, `#/original`)

## Key Implementation Details
- 7-segment color wheel with HUE_ANGLES at 51.4° intervals for each domain
- SVG-based pattern diagrams + interactive color wheel + recipe composer
- Isometric brick manual (tools as LEGO-style bricks, snap / loose / forced fits, maturity growth tracks). See `BRICKS.md`
- TypeScript with domain-specific HueId union types
- Tailwind CSS with opacity-aware color rendering
- GitHub Actions deploy workflow (`/.github/workflows/deploy.yml`)
