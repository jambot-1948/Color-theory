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

  // --- 13 TOOLS ---
  // One per distinct architectural role. Like a box of crayons — you don't need
  // five shades of brown when one common brown is sufficient.

  tools: [
    // INTENT
    {
      id: "openai-agents-sdk",
      name: "OpenAI Agents SDK",
      primaryHue: "intent",
      secondaryHue: "logic",
      category: "Agent Runtime",
      maturity: "production",
      description:
        "Agent runtime for tools, handoffs, sessions, guardrails, and built-in tracing. Uses the Responses API by default for OpenAI models. Other providers connect through an OpenAI-compatible client or a custom model provider, or through the beta Any-LLM and LiteLLM adapters.",
      complexityAdded: "medium",
      trustContribution: "medium",
      pairsWellWith: ["openai", "temporal", "langsmith", "ollama"],
      conflictsWith: [],
      patterns: ["conductor", "long-memory-system"],
      notes:
        "Use when the SDK should own the agent loop. Compare its built-in tracing and guardrails with separate products before adding duplicate layers. The SDK's gpt-oss example calls a model served by Ollama through OpenAIChatCompletionsModel and the local OpenAI-compatible endpoint, with tracing disabled. That example notes that custom output types may not work well with gpt-oss models, and the SDK's hosted tools and tool search need an OpenAI Responses model.",
    },
    {
      id: "langchain",
      name: "LangChain",
      primaryHue: "intent",
      secondaryHue: "logic",
      category: "Framework",
      maturity: "production",
      description:
        "Agent framework with model and tool integrations. Its agent runtime uses LangGraph primitives; use LangGraph directly when you need finer workflow control.",
      complexityAdded: "medium",
      trustContribution: "low",
      pairsWellWith: ["openai", "claude", "pinecone", "langgraph", "langsmith", "guardrails", "ollama", "streamlit"],
      conflictsWith: [],
      patterns: ["conductor", "muddy-mix"],
      notes:
        "Use the higher-level agent API for straightforward loops. With a separate workflow engine, name which layer owns retries, state, and handoffs. The langchain-ollama package (ChatOllama) connects to a local Ollama server, and Streamlit's documentation includes a LangChain app tutorial.",
    },

    // LOGIC
    {
      id: "langgraph",
      name: "LangGraph",
      primaryHue: "logic",
      secondaryHue: "intent",
      category: "Orchestrator",
      maturity: "production",
      description:
        "Graph-based orchestration for stateful agent and multi-step workflow control. Lets you define agent behavior as explicit state machines, and its checkpointing overlaps with durable workflow engines.",
      complexityAdded: "medium",
      trustContribution: "low",
      pairsWellWith: ["langchain", "openai", "pinecone", "langsmith", "temporal", "ollama"],
      conflictsWith: [],
      patterns: ["conductor", "orchestration-pileup", "modular-palette"],
      notes:
        "Useful for explicit agent state and transitions. It can sit inside a broader durable workflow, but the boundary between the two must be designed. Graph nodes call models and vector stores through LangChain integrations, such as ChatOllama for a local model or the Pinecone vector store.",
    },
    {
      id: "temporal",
      name: "Temporal",
      primaryHue: "logic",
      secondaryHue: "trust",
      category: "Workflow Engine",
      maturity: "production",
      description:
        "Durable workflow execution. Records each workflow's progress so long-running processes can retry failed steps and resume after a crash.",
      complexityAdded: "high",
      trustContribution: "high",
      pairsWellWith: ["claude", "openai-agents-sdk", "langgraph"],
      conflictsWith: [],
      patterns: ["durable-spine", "governance-shell", "conductor"],
      notes:
        "Durable execution for workflows with long waits, retries, and recovery needs. Temporal's Python SDK includes an OpenAI Agents SDK integration and an experimental LangGraph plugin; with either, decide which layer owns retries and state.",
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
        "Model and API platform for reasoning, generation, summarization, and multimodal work. Choose a model and API mode for the specific task.",
      complexityAdded: "low",
      trustContribution: "low",
      pairsWellWith: ["langchain", "langgraph", "pinecone", "vercel", "langsmith", "openai-agents-sdk", "streamlit", "supabase", "guardrails"],
      conflictsWith: [],
      patterns: ["bright-demo", "thin-wrapper", "conductor", "cognitive-core"],
      notes:
        "The Responses API and Agents SDK offer different levels of control. Model capability does not replace application evaluation, tracing, or policy decisions.",
    },
    {
      id: "claude",
      name: "Anthropic Claude",
      primaryHue: "cognition",
      secondaryHue: "intent",
      category: "Model Provider",
      maturity: "production",
      description:
        "Model platform for language, reasoning, and tool-use workloads. Safety and reliability still depend on evaluation and application controls.",
      complexityAdded: "low",
      trustContribution: "low",
      pairsWellWith: ["langsmith", "guardrails", "temporal", "langchain"],
      conflictsWith: [],
      patterns: ["reflective-loop", "cognitive-core", "governance-shell"],
      notes:
        "Compare candidate models on your own tasks, cost, latency, and policy requirements rather than assuming one provider is inherently safer.",
    },
    {
      id: "ollama",
      name: "Ollama",
      primaryHue: "cognition",
      category: "Local Model Runtime",
      maturity: "production",
      description:
        "Runs open-weight models on your own machine and serves them over a local REST API, including an OpenAI-compatible endpoint at /v1 (chat completions, completions, embeddings, models, and Responses).",
      complexityAdded: "medium",
      trustContribution: "low",
      pairsWellWith: ["langchain", "langgraph", "openai-agents-sdk"],
      conflictsWith: [],
      patterns: ["thin-wrapper", "velocity-stack"],
      notes:
        "Models small enough to run locally differ in capability from hosted frontier models, so evaluate them on your own tasks, including tool calling, rather than assuming parity. Memory decides what is usable: model size and context length must fit in GPU or unified memory, or the model spills to slower CPU memory. By default Ollama sets a 4k context below 24 GiB of VRAM, while its docs suggest at least 64k for agents and coding tools. Supports NVIDIA, AMD, Apple Metal, and Vulkan GPUs. The server binds to 127.0.0.1:11434 by default and the OpenAI-compatible endpoint ignores the API key, so exposing it on a network needs access control in front of it. Ollama also offers cloud models, which a signed-in local server can route to, sending prompts off the machine; its cloud features can be turned off. LangChain publishes langchain-ollama (ChatOllama), which LangGraph uses through LangChain models, and an OpenAI Agents SDK example calls it through OpenAIChatCompletionsModel. MIT-licensed.",
    },

    // MEMORY
    {
      id: "pinecone",
      name: "Pinecone",
      primaryHue: "memory",
      category: "Vector Database",
      maturity: "production",
      description:
        "Managed vector database for semantic retrieval over indexed content. It can support an agent's knowledge access, but is not conversation memory by itself.",
      complexityAdded: "medium",
      trustContribution: "medium",
      pairsWellWith: ["openai", "langchain", "langgraph"],
      conflictsWith: [],
      patterns: ["long-memory-system", "conductor", "retrieval-illusion"],
      notes:
        "Only as good as the data fed into it. Poor chunking, bad sources, or weak retrieval design creates false confidence.",
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
        "Next.js application framework with Vercel deployment for web-facing AI products. Hosting and framework are separate choices, even when used together.",
      complexityAdded: "low",
      trustContribution: "low",
      pairsWellWith: ["openai", "supabase"],
      conflictsWith: [],
      patterns: ["bright-demo", "thin-wrapper", "velocity-stack"],
      notes:
        "A short path from prototype to a web product. Low complexity, but what's behind it matters more than what it shows.",
    },
    {
      id: "streamlit",
      name: "Streamlit",
      primaryHue: "interface",
      secondaryHue: "velocity",
      category: "UI Framework",
      maturity: "production",
      description:
        "Python framework for quickly building interactive data and AI applications, especially practitioner-facing tools and prototypes.",
      complexityAdded: "low",
      trustContribution: "low",
      pairsWellWith: ["openai", "supabase", "langchain"],
      conflictsWith: [],
      patterns: ["bright-demo", "velocity-stack"],
      notes:
        "Where Vercel is product-facing, Streamlit is practitioner-facing: useful for putting a working tool in front of technical users. Its documentation includes a LangChain app tutorial; its LangChain callback handler integration was removed in version 1.58.0.",
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
        "Backend-as-a-service built on managed Postgres, with auth, storage, realtime, edge functions, and pgvector for embeddings.",
      complexityAdded: "low",
      trustContribution: "low",
      pairsWellWith: ["vercel", "streamlit", "openai"],
      conflictsWith: [],
      patterns: ["bright-demo", "velocity-stack"],
      notes:
        "Managed backend can shorten prototyping time. Assess data access, auth policy, and operating requirements before treating it as the long-term backend.",
    },

    // TRUST
    {
      id: "langsmith",
      name: "LangSmith",
      primaryHue: "trust",
      category: "Observability",
      maturity: "production",
      description:
        "Debugging, evaluation, and monitoring for LLM applications and agents. Traces record what the model received and returned.",
      complexityAdded: "low",
      trustContribution: "high",
      pairsWellWith: ["langchain", "langgraph", "openai", "claude", "openai-agents-sdk"],
      conflictsWith: [],
      patterns: ["reflective-loop", "durable-spine", "conductor", "trust-gap"],
      notes:
        "Trace and evaluation coverage make agent behavior easier to inspect. Scope retention, sensitive inputs, and integration cost for the deployment.",
    },
    {
      id: "guardrails",
      name: "Guardrails AI",
      primaryHue: "trust",
      secondaryHue: "intent",
      category: "Governance",
      maturity: "production",
      description:
        "Open-source validators that check model inputs and outputs against schemas and policies. Coverage depends on the validators you choose.",
      complexityAdded: "medium",
      trustContribution: "high",
      pairsWellWith: ["claude", "openai", "langchain"],
      conflictsWith: [],
      patterns: ["governance-shell", "durable-spine"],
      notes:
        "Validators are installed as Python packages and run in your application. In July 2026 Guardrails announced that validators move to standard PyPI packages and that it is discontinuing hosted remote inference, with a planned cutoff of August 25, 2026. Decide early which checks block a response and which only log.",
    },
  ],

  patterns: [
    {
      id: "conductor",
      name: "The Conductor",
      type: "foundational",
      hues: ["logic", "cognition", "memory"],
      description:
        "You have a model that can reason and a store that can retrieve, but without structure the calls go uncoordinated — inconsistent behavior, repeated work, no audit trail. A single orchestration layer owns control flow: it decides when to think, when to retrieve, and in what order.",
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
        "A model produces outputs, but you have no way to know if they're good until they reach a user. Shipping without evaluation is guessing. Build measurement into the generation cycle — generate, evaluate against criteria, refine — so quality is measured before release instead of assumed.",
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
        "A retrieval store can supply relevant indexed documents to a model, but it does not automatically preserve conversation history or agent state. Use retrieval for source knowledge and a separate session strategy when continuity across turns is required. Evaluate the index and retrieval results, not just the final answer.",
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
        "Teams tend to build toward their strongest skill, so a stack can reflect the org chart more than the problem: an engineering-led team may overbuild Logic and Cognition, a product-led team Interface. A balanced stack is a deliberate audit against that gravity — fill the role gaps before they become failure modes.",
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
      watchFor: ["two orchestrators without a written boundary", "more than one layer claiming retries"],
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
        "Systems that work in development can fail in production because development rarely exercises partial failures, retries, or long waits. Building only for the happy path is building for demos. Invest in workflow durability and observability before a production incident forces the change.",
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
        "Systems that work technically can still violate policy, produce unsafe outputs, or fail audits. Governance bolted on after the fact tends to fight the architecture instead of being part of it. Design the governance layer as a first-class architectural concern, not an afterthought.",
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
      id: "lean-agent-runtime",
      name: "The Lean Knowledge Agent",
      tools: ["openai", "openai-agents-sdk", "pinecone"],
      patternIds: ["long-memory-system"],
      useCase: "A small agent that answers from an indexed knowledge base with one runtime responsible for tool calls and handoffs.",
      whyItWorks: [
        "The Agents SDK owns the agent loop and includes tracing",
        "A retrieval tool gives the model access to indexed knowledge",
        "The smaller stack keeps orchestration ownership visible",
      ],
      whereItBreaks: [
        "Retrieval quality and access control still require testing",
        "A Pinecone index is not conversation memory or an evaluation system",
        "Built-in tracing records runs but does not evaluate them",
      ],
      missingHues: ["interface", "velocity", "trust"],
    },
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
        "No tracing or evaluation of model calls",
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
        "Streamlit reruns the script on each interaction, so many concurrent public users need capacity planning",
        "No retrieval pipeline designed yet; Supabase pgvector is available but unused",
        "No governance",
      ],
      missingHues: ["logic", "trust"],
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
        "LangGraph makes control flow and agent state explicit",
        "LangSmith traces make failures easier to locate",
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
        "Temporal records each workflow's event history and resumes work after failures",
        "Guardrails validators check model inputs and outputs in the application, independent of the model provider",
        "LangSmith surfaces what the model actually did",
      ],
      whereItBreaks: [
        "High setup cost: several systems to deploy, configure, and operate",
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
        "Claude's structured outputs and LangChain's scaffolding keep generation in a consistent shape",
        "LangSmith makes prompt behavior legible and improvable",
        "Evaluations run against a dataset before release can catch regressions",
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
        "A second agent loop defined in LangChain outside the LangGraph graph",
        "Temporal added for retries without deciding which layer owns them",
      ],
      symptoms: [
        "Nobody can explain who owns the control flow",
        "Debugging requires understanding 3 different systems",
        "The team argues about which tool should handle X",
        "No tracing or evaluation tool, so the overlapping loops are hard to inspect",
      ],
      fix: [
        "Run the agent loop inside the LangGraph graph (LangChain agents are built on LangGraph) instead of beside it",
        "Assign LangGraph agent-state control and Temporal outer recovery separately, or remove the redundant layer",
        "Add tracing before adding more control",
      ],
      missingHues: ["memory", "interface", "velocity"],
    },
    {
      id: "private-local-assistant",
      name: "The Private Local Assistant",
      tools: ["ollama", "langchain", "streamlit"],
      patternIds: ["velocity-stack", "thin-wrapper"],
      useCase:
        "An assistant for material that should not leave the team's own machine: an open-weight model served by Ollama, LangChain for prompts and tools, and a Streamlit page for the people using it. Think: drafting from pasted internal notes or sensitive text, or working offline.",
      whyItWorks: [
        "Ollama serves the model on the same machine, so prompts need not leave it while cloud features stay off",
        "LangChain's ChatOllama supports tool calling and structured output, and a hosted model can be compared by swapping the chat model class",
        "Streamlit gives practitioners a Python interface, and its documentation includes a LangChain app tutorial",
      ],
      whereItBreaks: [
        "The machine's memory bounds model size, context length, and speed; the default context below 24 GiB of VRAM is 4k tokens",
        "A local model is not a hosted frontier model; answers and tool calls need evaluating on real tasks",
        "No retrieval or history: nothing indexes documents or keeps context across sessions",
        "No tracing or evaluation; LangSmith is hosted unless self-hosted on an Enterprise plan, so decide where traces may go before adding it",
        "Private only while it stays local: a signed-in Ollama can route to cloud models, and a Streamlit app reachable on the network needs authentication",
      ],
      missingHues: ["memory", "trust"],
      upgradePath: ["guardrails", "langsmith"],
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
      warnings.push("Trust gap: no tool in this composition has Trust as its primary or secondary role.");
    }

    if (orchestrationTools.length > 1) {
      warnings.push(
        "Two orchestrators: name which layer owns agent state and which owns retries and resumption."
      );
    }

    return warnings;
  },
};
