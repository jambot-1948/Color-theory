# Stack Assembly Review

## Purpose

Use an instruction-manual structure to help a consultant understand a tool combination in under a minute. Parts, numbered additions, and a finished composition carry the explanation. The seven role colors remain semantic labels, not a substitute for explaining relationships. This is a working content model for the prototype, not a final illustration system.

## Inventory

| Edition | Tools | Roles | Patterns | Recipes | Reference integrity |
| --- | ---: | ---: | ---: | ---: | --- |
| AI stacks | 12 | 7 | 16 | 7 | Tool and pattern IDs resolve |
| Data engineering | 13 | 7 | 8 | 6 | Tool and pattern IDs resolve |
| Agent harness | 11 | 7 | 8 | 5 | Tool and pattern IDs resolve |

The three datasets share the same general shape, but their roles and instructions are domain-specific. All three editions now use the assembly interaction grammar. AI stacks have authored recipe-specific stories; data engineering and agent harness use recipe order, tool descriptions, and recorded pairings as a first pass. Their step narratives still need domain review. See `SOFTWARE_REFRESH.md` for the September 2026 capability audit.

## Evidence Hierarchy

1. **Exact curated recipe:** The selected set matches a recipe, regardless of selection order. Use its named use case, strengths, and breakpoints. The Muddy Agent is a curated caution, not a recommended build.
2. **Recorded conflict:** A selected pair appears in either tool's `conflictsWith` list. Surface this even if a positive pattern otherwise resembles the role mix. The current audited editions have no unconditional tool-level conflicts; cautionary recipes instead describe context-specific design tensions.
3. **Role resemblance:** At least two distinct primary roles overlap a positive pattern. This is a comparison, not a diagnosis or a validated recipe.
4. **No named pattern:** Do not force a pattern on a single tool or an unsupported combination.

`pairsWellWith` means curated affinity; `conflictsWith` means recorded tension. Neither field identifies a runtime interface, data-flow direction, or required build order. The current assembly diagram's curves show those relationships only. Arrows between numbered steps mean presentation order, not execution order.

## AI Recipe Stories

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

- The prototype now has authored explanatory steps and conceptual links for all six AI-stack recipes. The source data still lacks ports, inputs, outputs, and connection direction. An isometric attachment or runtime arrow would invent those facts today.
- Pattern `watchFor` entries are pattern-level possibilities. They must not be displayed as active failures when the selected tools contradict them.
- Several positive and cautionary patterns share primary role sets. Role colors alone cannot classify a stack.
- Three role signatures are shared by multiple patterns: Cognition/Intent/Trust, Cognition/Memory, and Cognition/Interface/Velocity. The Cognition/Memory pair spans a foundational pattern and an anti-pattern, so the conditions around a build matter more than the palette.
- Seven `pairsWellWith` declarations appear from only one of the two AI tools. The prototype treats either declaration as an undirected affinity; a manual should review these pairs before drawing a specific attachment.
- A recipe's primary pattern is not necessarily listed on every ingredient tool. `recipe.patternIds` is the authoritative mapping for an exact recipe; per-tool `patterns` is supporting reference data.
- Secondary roles are present in the tool data but absent from the current assembly part labels. Decide whether they should appear as a second face or capability marker.
- Product claims such as "standard choice" or categorical scalability judgments should be checked before publication. This review treats them as repository copy, not verified market facts.
- `Context.md` contains older role mappings for some tools. The TypeScript data is the current source of truth for the prototype.

## Manual Grammar To Develop

- **Part:** A tool, labeled by name, primary role, and category. Shape may distinguish architectural role; vendor branding should not determine geometry.
- **Placement:** One numbered explanatory step. State what capability is added and which earlier part it relates to.
- **Connection:** A documented affinity or conflict. Use separate marks for each; unclassified pairs remain unconnected rather than being guessed.
- **Runtime flow:** Reserved for future recipe-specific, reviewed connection data. Use directional arrows only when a source, destination, and transferred responsibility have been authored.
- **Finished assembly:** All selected parts with the reading, recipe or pattern evidence level, and an explicit unresolved check.
- **Cautionary build:** Show the failure introduced by the conflicting addition and the removal or boundary choice that repairs it.

## Next Content Pass

Review the seven authored AI step stories with a domain expert, especially conceptual links that come from one-sided affinity data. Author equivalent step stories for the six data-engineering and five agent-harness recipes; the current generic steps are not technical build instructions. Then specify actual runtime inputs, outputs, ownership, and direction for any recipe that should become a technical manual. The original AI color-theory view remains at `#/original` for comparison.
