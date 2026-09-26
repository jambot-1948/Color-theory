# Chromatic Architecture: Assembly Review

## Purpose

Use an instruction-manual structure to help a consultant understand a tool combination in under a minute. Parts, numbered additions, and a finished composition carry the explanation. The seven role colors remain semantic labels, not a substitute for explaining relationships. This is a working content model for the prototype, not a final illustration system.

## Inventory

| Edition | Products | Capabilities | Roles | Patterns | Recipes |
| --- | ---: | ---: | ---: | ---: | ---: |
| Foundations | 26 | 23 | 7 | 8 | 7 |
| AI applications | 13 | 9 | 7 | 16 | 8 |
| Data engineering | 13 | 11 | 7 | 9 | 6 |
| Agent harness | 19 | 18 | 7 | 10 | 7 |

Counts as of the September 26, 2026 credibility pass. Every tool, pattern, and recipe id resolves, every pairing is declared on both tools, and `missingHues` lists roles absent as both primary and secondary role.

The four editions share the same general shape, but their roles and instructions are domain-specific. Foundations is generic by design; the other three build on it. All four editions have authored step stories for every recipe (`assemblyStories`, `dataStories`, `harnessStories`, `foundationsStories`). These are editorial, not technical build instructions, and still need domain review. See `SOFTWARE_REFRESH.md` for the September 2026 capability audit.

## Evidence Hierarchy

1. **Exact curated recipe:** The selected set matches a recipe, regardless of selection order. Use its named use case, strengths, and breakpoints. The Muddy Agent is a curated caution, not a recommended build.
2. **Recorded conflict:** A selected pair appears in either tool's `conflictsWith` list. Surface this even if a positive pattern otherwise resembles the role mix. The current audited editions have no unconditional tool-level conflicts; cautionary recipes instead describe context-specific design tensions.
3. **Role resemblance:** At least two distinct primary roles overlap a positive pattern. This is a comparison, not a diagnosis or a validated recipe.
4. **No named pattern:** Do not force a pattern on a single tool or an unsupported combination.

`pairsWellWith` means curated affinity; `conflictsWith` means recorded tension. Neither field identifies a runtime interface, data-flow direction, or required build order. The current assembly diagram's curves show those relationships only. Arrows between numbered steps mean presentation order, not execution order.

## AI Application Recipe Stories

| Example | What the manual should reveal | Crucial check |
| --- | --- | --- |
| Lean Knowledge Agent | One agent runtime owns tools and handoffs; a retrieval tool supplies indexed knowledge. | The Pinecone tool must be implemented and evaluated; it is not automatic conversation memory. |
| Bright Demo | Interface, backend speed, and model capability produce an early product experience. | The recipe explicitly calls out missing observability and workflow control. |
| Data Prototype | The same three primary roles can serve a different audience and workflow. | Hue coverage alone cannot distinguish this from Bright Demo; the recipe's use case must lead. |
| Knowledge Agent | Reasoning and retrieval gain coordination and tracing. | Source quality and retrieval tuning remain real costs; LangChain and LangGraph need explicit boundaries. |
| Enterprise-Ready Stack | Durable workflow, model, retrieval, governance, and observability form a heavier composition. | The recipe calls out setup and operational cost. Do not imply that adding all five is universally preferable. |
| Reflective Stack | Model output, scaffolding, and tracing support an improvement loop. | Evaluation criteria and feedback ownership are not specified by the current data. |
| Muddy Agent | Additional orchestration appears useful until responsibility overlaps. | The tension is specific to this cautionary design, not a blanket incompatibility between LangChain, LangGraph, and Temporal. |

## Content Gaps Before a Richer Manual

- The prototype has authored explanatory steps and conceptual links for all eight AI-application recipes. The source data still lacks ports, inputs, outputs, and connection direction, so the brick manual shows tiers and recorded relationships only; see `BRICKS.md` "Honesty boundaries".
- Pattern `watchFor` entries are pattern-level possibilities. They must not be displayed as active failures when the selected tools contradict them.
- Several positive and cautionary patterns share primary role sets. Role colors alone cannot classify a stack.
- Three role signatures are shared by multiple patterns: Cognition/Intent/Trust, Cognition/Memory, and Cognition/Interface/Velocity. The Cognition/Memory pair spans a foundational pattern and an anti-pattern, so the conditions around a build matter more than the palette.
- All `pairsWellWith` declarations are symmetric in every edition (audited September 26, 2026).
- A recipe's primary pattern is not necessarily listed on every ingredient tool. `recipe.patternIds` is the authoritative mapping for an exact recipe; per-tool `patterns` is supporting reference data.
- Secondary roles are present in the tool data but absent from the current assembly part labels. Decide whether they should appear as a second face or capability marker.
- Product claims such as "standard choice" or categorical scalability judgments should be checked before publication. This review treats them as repository copy, not verified market facts.
- `Context.md` contains older role mappings for some tools. The TypeScript data is the current source of truth for the prototype.

## Manual Grammar To Develop

- **Part:** A capability brick, coloured by role and labelled with the product that fills it. Vendor branding does not determine geometry.
- **Placement:** One numbered explanatory step. State what capability is added and which earlier part it relates to.
- **Connection:** A documented affinity or conflict. Use separate marks for each; unclassified pairs remain unconnected rather than being guessed.
- **Runtime flow:** Reserved for future recipe-specific, reviewed connection data. Use directional arrows only when a source, destination, and transferred responsibility have been authored.
- **Finished assembly:** All selected parts with the reading, recipe or pattern evidence level, and an explicit unresolved check.
- **Cautionary build:** Show the failure introduced by the conflicting addition and the removal or boundary choice that repairs it.

## Next Content Pass

Review the authored step stories in all four editions with domain experts. Then specify runtime inputs, outputs, ownership, and direction for any recipe that should become a technical manual. The original AI color-theory view remains at `#/original` for comparison.
