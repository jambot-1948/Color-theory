# Architectural Chromatics — Project Context

> Last updated: 2026-03-25
> Repo: https://github.com/jambot-1948/Color-theory
> Destination: thejambot.com (currently a static HTML site — integration pending)

---

## What This Is

A CNCF-landscape-inspired reference tool for AI stack composition, built around a color theory metaphor:

- **Tools are pigments** — each plays a distinct architectural role (a "hue")
- **Combinations are harmonies** — adjacent roles reinforce, opposite roles tension-test
- **Architectures are compositions** — recurring patterns of how tools combine
- **Recipes are pre-vetted stacks** — canonical combinations with known trade-offs

Primary use case: a consultant at a client site who wants fast mental recall of how AI tools integrate, what they conflict with, and what architectural patterns they form. Like CNCF landscape knowledge — not looked up, but remembered.

---

## Current Implementation State (v0.3)

### What's Built

| Feature | Status |
|---|---|
| 11 curated tools (one per distinct architectural role) | ✓ |
| 7 hues (architectural roles mapped to color wheel) | ✓ |
| 16 compositional patterns with SVG diagrams | ✓ |
| 6 recipes including 1 anti-pattern | ✓ |
| Blend bar (select up to 5 tools, real-time analysis) | ✓ |
| Harmony computation (Monochromatic → Complex) | ✓ |
| Export Manifest (markdown download) | ✓ |
| Save/Share Blend (URL params + localStorage) | ✓ |
| Tool detail modal with relationship web SVG | ✓ |
| "Appears In" recipes section in tool modal | ✓ |
| "Load into Blend" on recipe cards | ✓ |
| Palette explainer section (labeled color wheel + hue chips) | ✓ |
| Chromatic definition in hero | ✓ |
| Grid / Index view toggle | ✓ |
| Context Diagram tab (3 SVG panels) | ✓ |
| Empty blend state hint | ✓ |
| Hue filter (sticky bar) | ✓ |
| Search | ✓ |
| Vite preview environment | ✓ |

### What's Not Built Yet

- Integration into thejambot.com (static HTML site — needs CDN React or Next.js upgrade)
- Confirmation dialog when "Load into Blend" overwrites an existing blend
- "Pairs with" contextual filter (show tools that pair well with selected tool)
- Evaluation dimensions as active filters (currently read-only sidebar labels)
- Pattern detail view showing which tools compose it (reverse lookup)
- Mobile optimization of the blend bar (cramped below 768px)
- Export as copy-to-clipboard modal (currently only file download)

---

## File Structure

```
Color-theory/
├── ArchitecturalChromatics.tsx          ← canonical component (Next.js, has 'use client')
├── architectural-chromatics-data.ts     ← canonical data source of truth
├── Context.md                           ← original project brief
├── CONTEXT.md                           ← this file (current state)
├── preview/                             ← Vite dev environment
│   ├── src/
│   │   ├── ArchitecturalChromatics.tsx  ← copy without 'use client' (for Vite)
│   │   ├── architectural-chromatics-data.ts
│   │   ├── App.tsx                      ← renders <ArchitecturalChromatics />
│   │   └── index.css                    ← @import "tailwindcss"
│   ├── vite.config.ts                   ← includes @tailwindcss/vite plugin
│   └── package.json
└── 60733d51608550fc3d86995dbc4c69b3.jpg ← Alexander's 15 Properties reference image
```

**Sync rule:** canonical files live at the root. After editing in `preview/src/`, sync back:
```bash
cp preview/src/ArchitecturalChromatics.tsx ArchitecturalChromatics.tsx
sed -i '' '1s/^/'"'"'use client'"'"';\n/' ArchitecturalChromatics.tsx
```

**To run the dev server:**
```bash
cd preview && npm run dev
# Runs on localhost:5177 (ports 5173-5176 in use on this machine)
```

---

## Data Model

```typescript
ChromaticsData {
  site:                SiteMeta
  hues:                Hue[]       // ×7
  tools:               Tool[]      // ×11
  patterns:            Pattern[]   // ×16
  recipes:             Recipe[]    // ×6
  evaluationDimensions: string[]
}

Hue     { id, name, hex, description }

Tool    { id, name, category, maturity, description,
          primaryHue, secondaryHue?,
          complexityAdded, trustContribution,
          patterns[], pairsWellWith[], conflictsWith[], notes }

Pattern { id, name, type, hues[], description,
          strengths[], weaknesses[], watchFor[] }

Recipe  { id, name, tools[], patternIds[], useCase,
          whyItWorks[]?, whereItBreaks[]?, missingHues[]?,
          upgradePath[]?, whyItHappens[]?, fix[]? }
```

**Helpers** in `chromaticsHelpers` (end of data file):
- `getHueById(hueId)`
- `getToolsByHue(hueId)`
- `getPatternsForTool(toolId)`
- `getRecipesForTool(toolId)` — used in tool modal "Appears In" section
- `getToolsForPattern(patternId)`

---

## The 11 Tools

One per distinct architectural role — "box of crayons" principle. You don't need five shades of brown.

| Tool | Primary Hue | Role |
|---|---|---|
| LangChain | logic | Framework / orchestration entry point |
| LangGraph | logic | Stateful agent graph orchestration |
| Temporal | logic | Durable workflow engine (production) |
| OpenAI | cognition | General-purpose LLM |
| Claude | cognition | Reasoning-focused LLM |
| Pinecone | memory | Managed vector database |
| Vercel | interface | Product-facing deployment |
| Streamlit | interface | Internal tools / data-facing UI |
| Supabase | memory | BaaS — auth, storage, real-time |
| LangSmith | trust | Observability and tracing |
| Guardrails AI | trust | Validation and safety constraints |

---

## The 7 Hues

| Hue | Wheel Angle | Plain English |
|---|---|---|
| Intent | 0° | prompts, goals, decisions |
| Memory | 51.4° | vector stores, retrieval |
| Interface | 102.9° | UIs, dashboards |
| Velocity | 154.3° | deployment, build tools |
| Trust | 205.7° | evals, guardrails, logging |
| Logic | 257.1° | orchestrators, workflows |
| Cognition | 308.6° | LLMs, reasoning engines |

Adjacent hues reinforce each other. Opposite hues create productive tension.
A single-hue stack runs deep but fragile. Harmonic coverage builds resilience.

---

## Component Architecture

```
ArchitecturalChromatics()               ← main page, all state lives here
│
│  state: search, activeHue, selectedTools, inspectedTool,
│         view ('landscape'|'recipes'|'diagram'),
│         compactMode, blendCopied
│
│  effects: restore blend from URL/?blend= or localStorage on mount
│           sync blend to URL + localStorage on change
│
├── ColorWheelLabeled                   ← palette explainer: annotated donut chart
├── ColorWheelMini                      ← small wheel in pattern cards + blend bar
├── PatternDiagram(patternId, color, size=80)  ← 16 unique SVGs, size prop (18–80px)
├── RelationshipWeb(tool)               ← modal SVG: pairings upper arc, conflicts lower
├── ComplexityBar / TrustScale          ← 3-segment indicator bars
├── ToolIndexCard                       ← compact row (Index mode)
├── ToolCard                            ← grid card with pattern chips
├── PatternCard                         ← diagram + wheel + harmony + S/W/watchFor
│
├── MetaphorBridgeDiagram               ← Context Diagram panel 1
├── DataModelDiagram                    ← Context Diagram panel 2
└── UserLoopDiagram                     ← Context Diagram panel 3
```

**Views:**
- `landscape` — tool grid/index + compositional patterns (default)
- `recipes` — recipe cards with Load into Blend
- `diagram` — Context Diagram: Metaphor Bridge | Data Model | User Loop

---

## Key SVG Utilities (module-level)

```typescript
HUE_ANGLES: Record<string, number>   // degrees from top, clockwise
SEGMENT_SWEEP = 360 / 7              // 51.43°
polarToXY(cx, cy, r, angleDeg)       // converts polar to SVG x/y
wedgePath(cx, cy, r, startDeg, endDeg) // pie wedge path string
computeHarmony(hueIds[])             // returns { label, meaning }
  // → Monochromatic | Analogous | Split | Complementary
  // → Triadic | Split-Complementary | Analogous+ | Tetradic | Complex
```

---

## Design Conventions

- `font-black` for headings, `font-bold` for labels, `font-medium` for body
- `text-[10px] uppercase tracking-widest font-black` for section micro-labels
- Hue colors always sourced from `DATA.hues[].hex` — never hardcoded Tailwind colors
- `rounded-xl` for cards, `rounded-3xl` for large panels, `rounded-[3rem]` for recipe cards
- `shadow-sm` default, `shadow-md` hover, `shadow-xl` for modals/floating elements
- SVG text: `fontFamily="system-ui,sans-serif"`, field text: `fontFamily="'Courier New', monospace"`

---

## Blend Bar Behavior

The fixed bottom bar slides up when `selectedTools.length > 0`:

1. Tool pills (up to 5) with remove-on-hover
2. Hue dots + harmony label (Analogous, Triadic, etc.)
3. Complexity + Trust bars (sum of tool scores vs. max possible)
4. Closest Pattern match (which pattern do the most selected tools share)
5. Health indicators (conflicts in rose, warnings in amber, "High Resonance" in emerald)
6. **Share Blend** — copies `window.location.href` to clipboard, flashes green "✓ Link Copied"
7. **Export Manifest** — downloads a `.md` file with full stack analysis

Blend persistence: `?blend=langchain,pinecone,claude` in URL, mirrored to `localStorage('ac-blend')`.

---

## Outstanding Items from Agent Reviews (2026-03-25)

**UX:**
- Load into Blend should warn/confirm before overwriting an existing blend
- Export should offer clipboard copy in addition to file download
- Mobile blend bar cramped below 768px — needs layout rework

**IA:**
- Evaluation dimensions sidebar is passive/read-only — wire up or remove
- "Pairs with" contextual filter missing: when a tool is selected, show tools that pair with it
- Pattern detail view: which tools compose this pattern (reverse of tool.patterns[])

**PM:**
- Consider "I want to build ___" quick-start prompts in the hero
- Recipes could support "Save as Template" flow (user loads recipe, tweaks, saves variant)

---

## Metaphor Reference (quick cheat sheet)

| Color Theory | AI Architecture |
|---|---|
| Pigment | Tool |
| Primary Hue | Architectural Role |
| Color Wheel | Role Spectrum (7 positions) |
| Harmony | Stack Composition |
| Analogous Colors | Adjacent Roles — reinforce each other |
| Complementary | Opposing Roles — cover blind spots |
| Composition | Architecture — the full system design |
| Muddy Mix | Anti-Pattern — competing roles, unclear ownership |
