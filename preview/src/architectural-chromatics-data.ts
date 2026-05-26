export type HueId =
  | "intent"
  | "logic"
  | "cognition"
  | "memory"
  | "interface"
  | "velocity"
  | "trust";

export type Maturity = "emerging" | "production";
export type ComplexityLevel = "low" | "medium" | "high";
export type ContributionLevel = "low" | "medium" | "high";

export interface SiteMeta {
  name: string;
  version: string;
  tagline: string;
  description: string;
}

export interface Hue {
  id: HueId;
  name: string;
  colorName: string;
  hex: string;
  description: string;
}

export interface Tool {
  id: string;
  name: string;
  primaryHue: HueId;
  secondaryHue?: HueId;
  category: string;
  maturity: Maturity;
  description: string;
  complexityAdded: ComplexityLevel;
  trustContribution: ContributionLevel;
  pairsWellWith: string[];
  conflictsWith: string[];
  patterns: string[];
  notes: string;
}

export interface Pattern {
  id: string;
  name: string;
  type: "foundational" | "high-velocity" | "anti-pattern" | "structural";
  hues: HueId[];
  description: string;
  strengths: string[];
  weaknesses: string[];
  watchFor: string[];
}

export interface Recipe {
  id: string;
  name: string;
  tools: string[];
  patternIds: string[];
  useCase: string;
  whyItWorks?: string[];
  whereItBreaks?: string[];
  missingHues?: HueId[];
  upgradePath?: string[];
  whyItHappens?: string[];
  symptoms?: string[];
  fix?: string[];
}

export interface ChromaticsData {
  site: SiteMeta;
  hues: Hue[];
  evaluationDimensions: string[];
  tools: Tool[];
  patterns: Pattern[];
  recipes: Recipe[];
}

export const architecturalChromaticsData: ChromaticsData = {
  site: {
    name: "Architectural Chromatics",
    version: "0.3",
    tagline:
      "A landscape of AI tools, patterns, and combinations seen through color theory.",
    description:
      "Architectural Chromatics is a reference landscape for modern AI systems that treats tools like pigments, combinations like color harmonies, and architectures like compositions.",
  },

  hues: [
    {
      id: "intent",
      name: "Intent",
      colorName: "Red",
      hex: "#C84C3A",
      description: "Direction, goals, prompting, and decision framing.",
    },
    {
      id: "logic",
      name: "Logic",
      colorName: "Blue",
      hex: "#4A6FA5",
      description: "Deterministic control, orchestration, and flow.",
    },
    {
      id: "cognition",
      name: "Cognition",
      colorName: "Purple",
      hex: "#7A5AA6",
      description: "Reasoning, generation, and transformation.",
    },
    {
      id: "memory",
      name: "Memory",
      colorName: "Orange",
      hex: "#D98E3D",
      description: "Context, retrieval, and persistence of meaning.",
    },
    {
      id: "interface",
      name: "Interface",
      colorName: "Yellow",
      hex: "#D9B84A",
      description: "Interaction, experience, and visibility.",
    },
    {
      id: "velocity",
      name: "Velocity",
      colorName: "Green",
      hex: "#5D9C59",
      description: "Build speed, iteration, and delivery.",
    },
    {
      id: "trust",
      name: "Trust",
      colorName: "Teal",
      hex: "#3F8F8C",
      description: "Observability, evaluation, safety, and governance.",
    },
  ],

  evaluationDimensions: [
    "harmony",
    "contrast",
    "complexity",
    "durability",
    "clarity",
    "adaptability",
    "operationalLoad",
    "trustSurface",
  ],

  // --- 11 TOOLS ---
  // One per distinct architectural role. Like a box of crayons — you don't need
  // five shades of brown when one common brown is sufficient.

  tools: [
    // INTENT
    {
      id: "langchain",
      name: "LangChain",
      primaryHue: "intent",
      secondaryHue: "logic",
      category: "Framework",
      maturity: "production",
      description:
        "Prompt orchestration and agent scaffolding for LLM applications. The most common entry point for teams building on top of models.",
      complexityAdded: "medium",
      trustContribution: "low",
      pairsWellWith: ["openai", "pinecone", "langgraph", "langsmith"],
      conflictsWith: ["temporal"],
      patterns: ["conductor", "muddy-mix", "thin-wrapper"],
      notes:
        "A common entry point. Gets teams moving fast but can create orchestration overlap when paired with heavier workflow engines.",
    },

    // LOGIC
    {
      id: "langgraph",
      name: "LangGraph",
      primaryHue: "logic",
      secondaryHue: "intent",
      category: "Orchestrator",
      maturity: "emerging",
      description:
        "Graph-based orchestration for stateful agent and multi-step workflow control. Lets you define agent behavior as explicit state machines.",
      complexityAdded: "medium",
      trustContribution: "low",
      pairsWellWith: ["langchain", "openai", "pinecone", "langsmith"],
      conflictsWith: ["temporal"],
      patterns: ["conductor", "orchestration-pileup", "modular-palette"],
      notes:
        "Very strong for agent flow control. Easy to overlap with other workflow engines — choose one orchestration layer and commit.",
    },
    {
      id: "temporal",
      name: "Temporal",
      primaryHue: "logic",
      secondaryHue: "trust",
      category: "Workflow Engine",
      maturity: "production",
      description:
        "Durable workflow orchestration for production-critical systems. Handles retries, state, and long-running processes that must not fail silently.",
      complexityAdded: "high",
      trustContribution: "high",
      pairsWellWith: ["openai", "claude", "pinecone", "guardrails"],
      conflictsWith: ["langgraph", "langchain"],
      patterns: ["durable-spine", "governance-shell", "conductor"],
      notes:
        "The right backbone when reliability and auditability are non-negotiable. High setup cost — earns its weight in regulated or production-critical systems.",
    },

    // COGNITION
    {
      id: "openai",
      name: "OpenAI",
      primaryHue: "cognition",
      secondaryHue: "intent",
      category: "Model Provider",
      maturity: "production",
      description:
        "General-purpose cognition layer for reasoning, generation, summarization, and transformation. The default model choice for most stacks.",
      complexityAdded: "low",
      trustContribution: "low",
      pairsWellWith: ["langchain", "langgraph", "pinecone", "vercel", "langsmith"],
      conflictsWith: [],
      patterns: ["bright-demo", "thin-wrapper", "conductor", "cognitive-core"],
      notes:
        "Easy to start with, powerful, but easy to over-rely on without stronger control and trust layers. Low complexity added — the model is someone else's problem.",
    },
    {
      id: "claude",
      name: "Anthropic Claude",
      primaryHue: "cognition",
      secondaryHue: "trust",
      category: "Model Provider",
      maturity: "production",
      description:
        "Reasoning-focused model layer with strong performance on structured language tasks and safer output behavior by design.",
      complexityAdded: "low",
      trustContribution: "medium",
      pairsWellWith: ["langsmith", "guardrails", "temporal"],
      conflictsWith: [],
      patterns: ["reflective-loop", "cognitive-core", "governance-shell"],
      notes:
        "Often a better fit than OpenAI where clarity, structure, and safer behavior matter — particularly in regulated or high-stakes contexts.",
    },

    // MEMORY
    {
      id: "pinecone",
      name: "Pinecone",
      primaryHue: "memory",
      secondaryHue: "trust",
      category: "Vector Database",
      maturity: "production",
      description:
        "Managed vector database for retrieval-based memory systems. The standard choice when you need a model to recall from a body of knowledge.",
      complexityAdded: "medium",
      trustContribution: "medium",
      pairsWellWith: ["openai", "claude", "langchain", "langgraph"],
      conflictsWith: [],
      patterns: ["long-memory-system", "conductor", "retrieval-illusion"],
      notes:
        "A common memory layer, but only as good as the data fed into it. Poor chunking, bad sources, or weak retrieval design creates false confidence.",
    },

    // INTERFACE
    {
      id: "vercel",
      name: "Vercel / Next.js",
      primaryHue: "interface",
      secondaryHue: "velocity",
      category: "Frontend Platform",
      maturity: "production",
      description:
        "Interface and deployment layer that makes AI applications feel polished quickly. The standard for product-oriented, JavaScript-first AI apps.",
      complexityAdded: "low",
      trustContribution: "low",
      pairsWellWith: ["openai", "supabase"],
      conflictsWith: [],
      patterns: ["bright-demo", "thin-wrapper", "velocity-stack"],
      notes:
        "A major enabler of beautiful AI demos and fast productization. Low complexity, but what's behind it matters more than what it shows.",
    },
    {
      id: "streamlit",
      name: "Streamlit",
      primaryHue: "interface",
      secondaryHue: "velocity",
      category: "UI Framework",
      maturity: "production",
      description:
        "Rapid UI for Python and data-heavy AI applications. The standard for internal tools, technical proof-of-concepts, and data-facing workflows.",
      complexityAdded: "low",
      trustContribution: "low",
      pairsWellWith: ["openai", "supabase"],
      conflictsWith: [],
      patterns: ["bright-demo", "velocity-stack"],
      notes:
        "Where Vercel is product-facing, Streamlit is practitioner-facing. Great for getting real feedback fast from technical audiences.",
    },

    // VELOCITY
    {
      id: "supabase",
      name: "Supabase",
      primaryHue: "velocity",
      secondaryHue: "memory",
      category: "Backend Platform",
      maturity: "production",
      description:
        "Backend-as-a-service that accelerates full-stack AI application development. Handles auth, storage, and real-time without a dedicated backend.",
      complexityAdded: "low",
      trustContribution: "low",
      pairsWellWith: ["vercel", "streamlit", "openai"],
      conflictsWith: [],
      patterns: ["bright-demo", "velocity-stack"],
      notes:
        "Fast, practical, and very effective for getting products moving. The go-to backend for any team that doesn't want to build infrastructure from scratch.",
    },

    // TRUST
    {
      id: "langsmith",
      name: "LangSmith",
      primaryHue: "trust",
      secondaryHue: "logic",
      category: "Observability",
      maturity: "production",
      description:
        "Tracing, debugging, and observability for LLM applications and workflows. Makes the invisible visible — what the model actually saw and did.",
      complexityAdded: "low",
      trustContribution: "high",
      pairsWellWith: ["langchain", "langgraph", "openai", "claude"],
      conflictsWith: [],
      patterns: ["reflective-loop", "durable-spine", "conductor", "trust-gap"],
      notes:
        "One of the cleanest ways to make LLM systems legible. Low cost to add, high cost not to — especially once you're in production.",
    },
    {
      id: "guardrails",
      name: "Guardrails AI",
      primaryHue: "trust",
      secondaryHue: "intent",
      category: "Governance",
      maturity: "production",
      description:
        "Validation and safety constraints for model inputs and outputs. Enforces structure, policy, and reliable behavior at the model boundary.",
      complexityAdded: "medium",
      trustContribution: "high",
      pairsWellWith: ["claude", "openai", "temporal"],
      conflictsWith: [],
      patterns: ["governance-shell", "durable-spine"],
      notes:
        "A useful stabilizer when systems need reliable structure, safety, or policy enforcement. Most teams add this too late — build it in from the start.",
    },
  ],

  patterns: [
    {
      id: "conductor",
      name: "The Conductor",
      type: "foundational",
      hues: ["logic", "cognition", "memory"],
      description:
        "You have a model that can reason and a store that can retrieve, but without structure every call is uncoordinated — inconsistent behavior, repeated work, no audit trail. A single orchestration layer owns control flow: it decides when to think, when to retrieve, and in what order.",
      strengths: ["clarity", "control", "repeatability"],
      weaknesses: ["rigidity", "orchestration complexity"],
      watchFor: ["missing trust layer", "workflow sprawl"],
    },
    {
      id: "reflective-loop",
      name: "The Reflective Loop",
      type: "foundational",
      hues: ["cognition", "trust", "intent"],
      description:
        "A model produces outputs, but you have no way to know if they're good until they reach a user. Shipping without evaluation is guessing. Build measurement into the generation cycle — generate, evaluate against criteria, refine. Quality becomes a property of the system, not a hope.",
      strengths: ["quality", "measurability", "continuous improvement"],
      weaknesses: ["latency", "cost"],
      watchFor: ["slow feedback loops", "overfitting to evals"],
    },
    {
      id: "long-memory-system",
      name: "The Long Memory System",
      type: "foundational",
      hues: ["cognition", "memory"],
      description:
        "Models are stateless by default — every call starts from scratch. But real problems require context that spans sessions, documents, histories. Pair the model with a retrieval layer: the model reasons, the store remembers. Together they behave as if they have persistent context. The risk is the store: it's only as good as what's indexed.",
      strengths: ["context depth", "grounding", "knowledge recall"],
      weaknesses: ["retrieval drift", "false confidence"],
      watchFor: ["bad source data", "weak chunking and indexing"],
    },
    {
      id: "balanced-stack",
      name: "The Balanced Stack",
      type: "foundational",
      hues: ["intent", "logic", "cognition", "memory", "interface", "velocity", "trust"],
      description:
        "Every team has a dominant skill, and stacks reflect the org chart more than the problem. Engineers favor Logic and Cognition; product teams favor Interface; platform teams favor Trust. A balanced stack is a deliberate audit against that gravity — fill the role gaps before they become failure modes.",
      strengths: ["resilience", "coverage", "adaptability"],
      weaknesses: ["slower setup", "more design effort"],
      watchFor: ["accidental complexity"],
    },
    {
      id: "bright-demo",
      name: "The Bright Demo",
      type: "high-velocity",
      hues: ["interface", "velocity", "cognition"],
      description:
        "You need to show something real before you can justify building the full architecture. Lead with Interface and Cognition, get to a working experience fast, and accept the structural gaps as known temporary debt. The failure mode is when the demo becomes the product.",
      strengths: ["speed", "wow factor", "product momentum"],
      weaknesses: ["fragility", "limited observability", "shallow structure"],
      watchFor: ["missing trust", "missing workflow control"],
    },
    {
      id: "thin-wrapper",
      name: "The Thin Wrapper",
      type: "high-velocity",
      hues: ["interface", "cognition"],
      description:
        "The model already does the heavy lifting — complex architecture around it feels like overhead when a simple interface serves the same user. Ship the wrapper. Own that differentiation comes from the product decision, not the stack. When users want behavior the model can't provide out of the box, you'll have no architecture to extend.",
      strengths: ["simplicity", "speed to market"],
      weaknesses: ["weak defensibility", "limited differentiation"],
      watchFor: ["feature stagnation", "model dependence"],
    },
    {
      id: "velocity-stack",
      name: "The Velocity Stack",
      type: "high-velocity",
      hues: ["velocity", "interface", "cognition"],
      description:
        "You don't know yet what the right architecture is. Building for permanence before you understand the problem means building the wrong thing carefully. Optimize for iteration speed and validated learning. The debt is acceptable — until the team stops treating the shortcuts as temporary.",
      strengths: ["iteration speed", "developer momentum"],
      weaknesses: ["architecture drift", "scale friction"],
      watchFor: ["thin boundaries", "operational shortcuts"],
    },
    {
      id: "muddy-mix",
      name: "The Muddy Mix",
      type: "anti-pattern",
      hues: ["intent", "logic", "cognition", "memory", "trust"],
      description:
        "Each tool was added for a good reason. The problem isn't the tools — it's that nobody assigned ownership of how they relate. Responsibility diffuses across the stack until debugging requires understanding three systems simultaneously and the team argues about which tool should handle what.",
      strengths: ["apparent flexibility"],
      weaknesses: ["confusion", "debugging pain", "team disagreement"],
      watchFor: ["duplicate orchestration", "tool sprawl", "vague ownership"],
    },
    {
      id: "orchestration-pileup",
      name: "The Orchestration Pileup",
      type: "anti-pattern",
      hues: ["logic"],
      description:
        "The team started with one orchestration tool. As requirements grew, they added another. Each made sense in isolation. Together they create a control plane nobody fully understands — unclear who owns flow, high complexity, and maintenance that compounds with every change.",
      strengths: [],
      weaknesses: ["unclear flow", "high complexity", "maintenance drag"],
      watchFor: ["LangGraph alongside Temporal", "any two orchestrators in one stack"],
    },
    {
      id: "hollow-core",
      name: "The Hollow Core",
      type: "anti-pattern",
      hues: ["interface", "velocity"],
      description:
        "Demo quality is high, so leadership assumes production readiness. The gap between what's visible and what's structural doesn't surface until scale or failure — and by then the architecture is already load-bearing.",
      strengths: ["presentation quality", "early momentum"],
      weaknesses: ["fragility", "thin substance"],
      watchFor: ["demo-first architecture", "no observability layer"],
    },
    {
      id: "trust-gap",
      name: "The Trust Gap",
      type: "anti-pattern",
      hues: ["trust"],
      description:
        "Observability feels optional when the system is working. It becomes essential the moment something goes wrong — and by then you can't see what went wrong, how far it spread, or whether the fix worked.",
      strengths: ["speed before failure"],
      weaknesses: ["silent errors", "low confidence", "scaling risk"],
      watchFor: ["production without tracing or evals"],
    },
    {
      id: "retrieval-illusion",
      name: "The Retrieval Illusion",
      type: "anti-pattern",
      hues: ["memory", "cognition"],
      description:
        "The model cites sources. It seems grounded. But the retrieval pipeline is producing plausible results from bad data — and confident wrong answers are worse than honest uncertainty. The system appears to know more than it does.",
      strengths: ["surface grounding"],
      weaknesses: ["misleading confidence", "bad answers with citations"],
      watchFor: ["low-quality sources", "untuned retrieval pipelines"],
    },
    {
      id: "durable-spine",
      name: "The Durable Spine",
      type: "structural",
      hues: ["logic", "trust"],
      description:
        "Systems that work in development fail in production because development never tests partial failures, retries, or what breaks at 3am. Building for the happy path is building for demos. Invest in workflow durability and observability before you need them — the cost of adding them after a production incident is always higher.",
      strengths: ["reliability", "auditability", "operational confidence"],
      weaknesses: ["slower build speed", "higher complexity"],
      watchFor: ["overengineering too early"],
    },
    {
      id: "cognitive-core",
      name: "The Cognitive Core",
      type: "structural",
      hues: ["cognition", "trust", "intent"],
      description:
        "The model is the product, but running it without constraint produces inconsistent behavior. Surrounding it with too much structure obscures what it actually does. Keep the model central; wrap it in evaluation and intent systems that improve its behavior without hiding it.",
      strengths: ["strong model leverage", "high capability ceiling"],
      weaknesses: ["centralized model dependence"],
      watchFor: ["weak memory and workflow support"],
    },
    {
      id: "governance-shell",
      name: "The Governance Shell",
      type: "structural",
      hues: ["trust", "intent", "logic"],
      description:
        "Systems that work technically can still violate policy, produce unsafe outputs, or fail audits. Governance bolted on after the fact is always fragile — it fights the architecture instead of being part of it. Design the governance layer as a first-class architectural concern, not an afterthought.",
      strengths: ["policy control", "safer deployment", "higher confidence"],
      weaknesses: ["more friction", "slower iteration"],
      watchFor: ["governance bolted on too late"],
    },
    {
      id: "modular-palette",
      name: "The Modular Palette",
      type: "structural",
      hues: ["intent", "logic", "memory", "trust"],
      description:
        "Stacks accumulate tools organically and boundaries blur over time. Nobody can explain what owns what, and every new addition compounds the confusion. Enforce legible boundaries from the start — each tool has one primary role, and overlap is named explicitly when it exists. Requires ongoing discipline; without it, stacks drift back into overlap.",
      strengths: ["clarity", "replaceability", "evolution over time"],
      weaknesses: ["requires design discipline"],
      watchFor: ["drift back into overlap"],
    },
  ],

  recipes: [
    {
      id: "bright-demo-recipe",
      name: "The Bright Demo",
      tools: ["vercel", "supabase", "openai"],
      patternIds: ["bright-demo", "thin-wrapper"],
      useCase: "Quick AI MVP, internal pitch, or lightweight product prototype. JavaScript-first, product-oriented.",
      whyItWorks: [
        "Gets to a polished experience quickly",
        "Feels complete early",
        "Minimizes setup friction",
      ],
      whereItBreaks: [
        "No observability — you're flying blind",
        "No workflow control — model calls are unstructured",
        "Hard to debug when behavior drifts",
      ],
      missingHues: ["logic", "trust"],
      upgradePath: ["langgraph", "langsmith"],
    },
    {
      id: "data-prototype-recipe",
      name: "The Data Prototype",
      tools: ["streamlit", "supabase", "openai"],
      patternIds: ["velocity-stack", "bright-demo"],
      useCase: "Hackathons, internal tools, and Python-first proof-of-concepts. Fast feedback from technical audiences.",
      whyItWorks: [
        "Python-native — meets data teams where they are",
        "Low infrastructure overhead",
        "Fast iteration with real data",
      ],
      whereItBreaks: [
        "Not product-grade — Streamlit doesn't scale to public users",
        "No memory or retrieval layer",
        "No governance",
      ],
      missingHues: ["logic", "memory", "trust"],
      upgradePath: ["pinecone", "langsmith"],
    },
    {
      id: "internal-knowledge-agent",
      name: "The Knowledge Agent",
      tools: ["openai", "pinecone", "langchain", "langgraph", "langsmith"],
      patternIds: ["conductor", "long-memory-system", "reflective-loop"],
      useCase:
        "Internal knowledge search, support assistant, or organizational memory tool.",
      whyItWorks: [
        "Combines reasoning with retrieval",
        "Orchestration structure keeps behavior predictable",
        "LangSmith makes the whole thing debuggable",
      ],
      whereItBreaks: [
        "Only as good as the source data",
        "Retrieval tuning is a real cost",
        "Prompt and workflow complexity compounds fast",
      ],
      missingHues: ["interface", "velocity"],
      upgradePath: ["guardrails", "vercel"],
    },
    {
      id: "enterprise-ai-workflow",
      name: "The Enterprise-Ready Stack",
      tools: ["temporal", "claude", "pinecone", "guardrails", "langsmith"],
      patternIds: ["durable-spine", "governance-shell", "conductor"],
      useCase:
        "Regulated, production-critical, or enterprise-sensitive AI workflows where failure has real consequences.",
      whyItWorks: [
        "Temporal provides a durable, auditable control plane",
        "Claude's safer output behavior pairs well with Guardrails",
        "LangSmith surfaces what the model actually did",
      ],
      whereItBreaks: [
        "High setup cost — this is a 6-week build, not a weekend",
        "Can feel heavy for small teams or early-stage products",
        "Requires operational sophistication to run well",
      ],
      missingHues: ["interface", "velocity"],
      upgradePath: ["vercel", "streamlit"],
    },
    {
      id: "reflective-ai-system",
      name: "The Reflective Stack",
      tools: ["claude", "langchain", "langsmith"],
      patternIds: ["reflective-loop", "cognitive-core"],
      useCase:
        "Higher-quality generation for documents, decisions, or structured outputs where consistency and accuracy matter.",
      whyItWorks: [
        "Claude's structured outputs + LangChain's scaffolding create a tight loop",
        "LangSmith makes prompt behavior legible and improvable",
        "The feedback loop catches regressions before they reach users",
      ],
      whereItBreaks: [
        "No memory layer — context resets each session",
        "Latency increases with eval loops",
        "Requires ongoing prompt engineering discipline",
      ],
      missingHues: ["memory", "interface", "velocity"],
      upgradePath: ["pinecone", "vercel"],
    },
    {
      id: "muddy-agent-recipe",
      name: "The Muddy Agent",
      tools: ["langchain", "langgraph", "temporal", "openai"],
      patternIds: ["muddy-mix", "orchestration-pileup"],
      useCase:
        "A cautionary example. What teams often build when they layer tools without clear boundaries.",
      whyItHappens: [
        "Tool enthusiasm — each one seemed useful individually",
        "Unclear ownership of orchestration",
        "Layering new tools on top of old ones instead of replacing",
      ],
      symptoms: [
        "Nobody can explain who owns the control flow",
        "Debugging requires understanding 3 different systems",
        "The team argues about which tool should handle X",
      ],
      fix: [
        "Choose one primary orchestration layer — LangGraph or Temporal, not both",
        "Assign clear responsibility to each tool",
        "Remove tools that duplicate what another already does",
      ],
    },
  ],
};

export const chromaticsHelpers = {
  getHueById: (hueId: HueId) =>
    architecturalChromaticsData.hues.find((h) => h.id === hueId),

  getToolById: (toolId: string) =>
    architecturalChromaticsData.tools.find((t) => t.id === toolId),

  getPatternById: (patternId: string) =>
    architecturalChromaticsData.patterns.find((p) => p.id === patternId),

  getRecipeById: (recipeId: string) =>
    architecturalChromaticsData.recipes.find((r) => r.id === recipeId),

  getToolsByHue: (hueId: HueId) =>
    architecturalChromaticsData.tools.filter(
      (tool) => tool.primaryHue === hueId || tool.secondaryHue === hueId
    ),

  getPatternsForTool: (toolId: string) =>
    architecturalChromaticsData.patterns.filter((pattern) =>
      architecturalChromaticsData.tools
        .find((tool) => tool.id === toolId)
        ?.patterns.includes(pattern.id)
    ),

  getRecipesForTool: (toolId: string) =>
    architecturalChromaticsData.recipes.filter((recipe) =>
      recipe.tools.includes(toolId)
    ),

  getToolsForPattern: (patternId: string) =>
    architecturalChromaticsData.tools.filter((tool) =>
      tool.patterns.includes(patternId)
    ),

  getPatternMatchesForTools: (toolIds: string[]) => {
    const selectedTools = architecturalChromaticsData.tools.filter((tool) =>
      toolIds.includes(tool.id)
    );

    return architecturalChromaticsData.patterns
      .map((pattern) => {
        const matchingTools = selectedTools.filter((tool) =>
          tool.patterns.includes(pattern.id)
        );
        return {
          pattern,
          score: matchingTools.length,
          matchingToolIds: matchingTools.map((tool) => tool.id),
        };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score);
  },

  getDominantHuesForTools: (toolIds: string[]) => {
    const counts: Record<HueId, number> = {
      intent: 0,
      logic: 0,
      cognition: 0,
      memory: 0,
      interface: 0,
      velocity: 0,
      trust: 0,
    };

    architecturalChromaticsData.tools
      .filter((tool) => toolIds.includes(tool.id))
      .forEach((tool) => {
        counts[tool.primaryHue] += 2;
        if (tool.secondaryHue) counts[tool.secondaryHue] += 1;
      });

    return Object.entries(counts)
      .map(([hueId, weight]) => ({
        hueId: hueId as HueId,
        weight,
        hue: architecturalChromaticsData.hues.find((h) => h.id === hueId)!,
      }))
      .filter((entry) => entry.weight > 0)
      .sort((a, b) => b.weight - a.weight);
  },

  getWarningsForTools: (toolIds: string[]) => {
    const selectedTools = architecturalChromaticsData.tools.filter((tool) =>
      toolIds.includes(tool.id)
    );

    const hasTrust = selectedTools.some(
      (tool) => tool.primaryHue === "trust" || tool.secondaryHue === "trust"
    );

    const orchestrationTools = selectedTools.filter((tool) =>
      ["langgraph", "temporal"].includes(tool.id)
    );

    const warnings: string[] = [];

    if (!hasTrust) {
      warnings.push("Trust gap: this composition lacks a strong trust layer.");
    }

    if (orchestrationTools.length > 1) {
      warnings.push(
        "Orchestration overlap: LangGraph and Temporal in the same stack creates ambiguity over who owns control flow."
      );
    }

    return warnings;
  },
};
