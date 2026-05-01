# Claude Instructions

## Project Context
The Chromatic Architecture framework applies color theory metaphors to technology architecture. Three domains are implemented:
- **Architectural Chromatics**: AI/LLM application stacks (7 hues: Intent, Logic, Cognition, Memory, Interface, Velocity, Trust)
- **Data Engineering Chromatics**: Data platform composition (7 hues: Ingest, Transform, Orchestrate, Store, Serve, Observe, Govern)
- **Agent Harness Chromatics**: Agent infrastructure and reliability (7 hues: Invocation, Execution, State, Observability, Resilience, Scaling, Security)

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
- Routing: Hash-based (`#/`, `#/data-engineering`, `#/agent-harness`)

## Key Implementation Details
- 7-segment color wheel with HUE_ANGLES at 51.4° intervals for each domain
- SVG-based pattern diagrams + interactive color wheel + recipe composer
- TypeScript with domain-specific HueId union types
- Tailwind CSS with opacity-aware color rendering
- GitHub Actions deploy workflow (`/.github/workflows/deploy.yml`)
