export type AHHueId =
  | "invocation"
  | "execution"
  | "state"
  | "observability"
  | "resilience"
  | "scaling"
  | "security";

export type Maturity = "emerging" | "production";
export type ComplexityLevel = "low" | "medium" | "high";
export type ContributionLevel = "low" | "medium" | "high";

export interface AHSiteMeta {
  name: string;
  version: string;
  tagline: string;
  description: string;
}

export interface AHHue {
  id: AHHueId;
  name: string;
  colorName: string;
  hex: string;
  description: string;
}

export interface AHTool {
  id: string;
  name: string;
  primaryHue: AHHueId;
  secondaryHue?: AHHueId;
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

export interface AHPattern {
  id: string;
  name: string;
  type: "foundational" | "high-velocity" | "anti-pattern" | "structural";
  hues: AHHueId[];
  description: string;
  strengths: string[];
  weaknesses: string[];
  watchFor: string[];
}

export interface AHRecipe {
  id: string;
  name: string;
  tools: string[];
  patternIds: string[];
  useCase: string;
  whyItWorks?: string[];
  whereItBreaks?: string[];
  missingHues?: AHHueId[];
  upgradePath?: string[];
  whyItHappens?: string[];
  symptoms?: string[];
  fix?: string[];
}

export interface AHChromaticsData {
  site: AHSiteMeta;
  hues: AHHue[];
  evaluationDimensions: string[];
  tools: AHTool[];
  patterns: AHPattern[];
  recipes: AHRecipe[];
}

export const agentHarnessChromaticsData: AHChromaticsData = {
  site: {
    name: "Agent Harness Chromatics",
    version: "0.1",
    tagline: "A framework for reliable AI agent infrastructure — invocation through execution to observability and recovery.",
    description:
      "Agent Harness Chromatics is a reference guide for building the infrastructure layer that runs and observes AI agents safely. Focus: not the agent itself, but the harness it runs within.",
  },

  hues: [
    {
      id: "invocation",
      name: "Invocation",
      colorName: "Purple",
      hex: "#6A4C93",
      description: "Who calls the agent and passes work to it — entry points, triggers, request handling.",
    },
    {
      id: "execution",
      name: "Execution",
      colorName: "Teal",
      hex: "#1B998B",
      description: "Who provides the compute for the agent to run — runtime environment, resource management.",
    },
    {
      id: "state",
      name: "State",
      colorName: "Forest Green",
      hex: "#2D6A4F",
      description: "Who remembers what the agent has seen and done — persistent context across invocations.",
    },
    {
      id: "observability",
      name: "Observability",
      colorName: "Rust",
      hex: "#E76F51",
      description: "Who watches what the agent is actually doing — logging, tracing, metrics, debugging.",
    },
    {
      id: "resilience",
      name: "Resilience",
      colorName: "Red",
      hex: "#D62828",
      description: "Who catches agent failures and recovers from them — retries, fallbacks, circuit breakers.",
    },
    {
      id: "scaling",
      name: "Scaling",
      colorName: "Bright Blue",
      hex: "#0077B6",
      description: "Who handles running many agents at once — concurrency, load balancing, worker pools.",
    },
    {
      id: "security",
      name: "Security",
      colorName: "Indigo",
      hex: "#4B0082",
      description: "Who controls access and protects secrets — authentication, secrets management, audit trails.",
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

  tools: [
    {
      id: "lambda",
      name: "AWS Lambda",
      primaryHue: "invocation",
      secondaryHue: "scaling",
      category: "Serverless Compute",
      maturity: "production",
      description:
        "Serverless function platform for triggering agents on-demand. Auto-scales with load; pay per invocation.",
      complexityAdded: "low",
      trustContribution: "medium",
      pairsWellWith: ["postgresql", "langfuse"],
      conflictsWith: ["kubernetes"],
      patterns: ["observable-agent", "batch-processor"],
      notes: "Simple for low-latency use cases; limited observability by default. Cold starts can be an issue.",
    },
    {
      id: "modal",
      name: "Modal",
      primaryHue: "invocation",
      secondaryHue: "execution",
      category: "Serverless ML",
      maturity: "production",
      description:
        "Developer-friendly serverless platform optimized for ML and LLM workloads. Built-in scaling and GPU support.",
      complexityAdded: "low",
      trustContribution: "high",
      pairsWellWith: ["redis", "langfuse", "temporal"],
      conflictsWith: [],
      patterns: ["resilient-loop", "real-time-responder"],
      notes:
        "Best-in-class developer experience. Good for ML-heavy workloads. Excellent observability out of the box.",
    },
    {
      id: "docker",
      name: "Docker",
      primaryHue: "execution",
      category: "Containerization",
      maturity: "production",
      description:
        "Container runtime for packaging agents with all dependencies. Standard prerequisite for Kubernetes and other orchestration.",
      complexityAdded: "low",
      trustContribution: "low",
      pairsWellWith: ["kubernetes", "vault"],
      conflictsWith: [],
      patterns: ["bulletproof-pipeline"],
      notes: "Foundational technology; rarely stands alone. Enables reproducibility and portability.",
    },
    {
      id: "kubernetes",
      name: "Kubernetes",
      primaryHue: "execution",
      secondaryHue: "scaling",
      category: "Orchestration",
      maturity: "production",
      description:
        "Industry-standard container orchestration for managing agents at scale. Complex but powerful and flexible.",
      complexityAdded: "high",
      trustContribution: "high",
      pairsWellWith: ["docker", "temporal", "vault", "opentelemetry"],
      conflictsWith: ["lambda"],
      patterns: ["distributed-agent", "bulletproof-pipeline"],
      notes:
        "Steep learning curve; powerful once mastered. Overhead for small workloads; essential for enterprise scale.",
    },
    {
      id: "redis",
      name: "Redis",
      primaryHue: "state",
      category: "In-Memory Store",
      maturity: "production",
      description:
        "Fast, ephemeral key-value store for agent session state, conversation context, and temporary data.",
      complexityAdded: "low",
      trustContribution: "low",
      pairsWellWith: ["modal", "kubernetes", "temporal"],
      conflictsWith: ["postgresql"],
      patterns: ["persistent-memory", "real-time-responder"],
      notes: "Perfect for fast access to recent state; data loss on restart. Use for non-critical context.",
    },
    {
      id: "postgresql",
      name: "PostgreSQL",
      primaryHue: "state",
      category: "Relational Database",
      maturity: "production",
      description:
        "Durable, queryable database for persisting agent state, conversation history, and structured context.",
      complexityAdded: "medium",
      trustContribution: "high",
      pairsWellWith: ["lambda", "temporal", "vault"],
      conflictsWith: [],
      patterns: ["persistent-memory", "bulletproof-pipeline"],
      notes: "ACID guarantees; durable; queryable. Slower than Redis but data survives restarts.",
    },
    {
      id: "langfuse",
      name: "Langfuse",
      primaryHue: "observability",
      category: "LLM Observability",
      maturity: "production",
      description:
        "LLM-specific tracing and monitoring. Captures prompts, completions, latency, costs, and evaluation metrics.",
      complexityAdded: "low",
      trustContribution: "high",
      pairsWellWith: ["modal", "temporal", "kubernetes"],
      conflictsWith: [],
      patterns: ["observable-agent", "resilient-loop", "bulletproof-pipeline"],
      notes:
        "Purpose-built for LLM workloads. Easy integration; provides cost and quality tracking out of the box.",
    },
    {
      id: "temporal",
      name: "Temporal",
      primaryHue: "resilience",
      secondaryHue: "execution",
      category: "Workflow Orchestration",
      maturity: "production",
      description:
        "Distributed workflow engine with built-in retries, timeouts, versioning, and state management.",
      complexityAdded: "high",
      trustContribution: "high",
      pairsWellWith: ["kubernetes", "postgresql", "langfuse", "vault"],
      conflictsWith: [],
      patterns: ["resilient-loop", "bulletproof-pipeline", "distributed-agent"],
      notes:
        "Complex but eliminates entire classes of failure modes. Essential for production reliability.",
    },
    {
      id: "opentelemetry",
      name: "OpenTelemetry",
      primaryHue: "observability",
      category: "Standards-Based Instrumentation",
      maturity: "production",
      description:
        "Vendor-agnostic instrumentation framework for metrics, logs, and traces. Integrates with any backend.",
      complexityAdded: "medium",
      trustContribution: "high",
      pairsWellWith: ["kubernetes", "datadog", "langfuse"],
      conflictsWith: [],
      patterns: ["observable-agent", "secured-harness"],
      notes: "Avoids vendor lock-in; requires careful setup. Industry standard for observability.",
    },
    {
      id: "vault",
      name: "HashiCorp Vault",
      primaryHue: "security",
      category: "Secrets Management",
      maturity: "production",
      description:
        "Centralized secrets management with encryption, access control, audit logging, and dynamic credentials.",
      complexityAdded: "high",
      trustContribution: "high",
      pairsWellWith: ["kubernetes", "temporal", "opentelemetry"],
      conflictsWith: [],
      patterns: ["secured-harness", "bulletproof-pipeline"],
      notes: "Enterprise-grade; complex setup. Essential for compliance and secret rotation.",
    },
    {
      id: "ray",
      name: "Ray",
      primaryHue: "scaling",
      secondaryHue: "execution",
      category: "Distributed Computing",
      maturity: "production",
      description:
        "Distributed computing framework for parallel agent execution. Handles data parallelization and state coordination.",
      complexityAdded: "high",
      trustContribution: "medium",
      pairsWellWith: ["kubernetes", "postgresql", "vault"],
      conflictsWith: [],
      patterns: ["distributed-swarm", "distributed-agent"],
      notes:
        "Powerful for data-parallel workloads; requires cluster thinking. Good for scaling beyond single machine.",
    },
  ],

  patterns: [
    {
      id: "silent-agent",
      name: "The Silent Agent",
      type: "anti-pattern",
      hues: ["invocation", "execution"],
      description: "Agent runs with zero logging or monitoring. Failures discovered by users, not systems.",
      strengths: [],
      weaknesses: [
        "No visibility into agent behavior or failures",
        "Root cause analysis becomes post-mortems after incidents",
        "Can't debug issues or improve performance",
      ],
      watchFor: [
        "Agent running in production with no logging",
        "Errors or failures reported by end users first",
        "No metrics or traces available for performance analysis",
      ],
    },
    {
      id: "stateless-learner",
      name: "The Stateless Learner",
      type: "anti-pattern",
      hues: ["invocation", "execution"],
      description: "Agent resets all context and memory on every invocation. Can't learn or maintain continuity.",
      strengths: [],
      weaknesses: [
        "Agent forgets every conversation immediately",
        "Can't reference prior context or decisions",
        "No ability to improve or adapt based on history",
      ],
      watchFor: [
        "Agent treated as stateless function with no persistence",
        "Every user interaction starts from zero context",
        "No conversation history or learning across sessions",
      ],
    },
    {
      id: "cascading-failure",
      name: "The Cascading Failure",
      type: "anti-pattern",
      hues: ["invocation", "execution"],
      description: "Single agent error crashes the entire system. No retries, fallbacks, or graceful degradation.",
      strengths: [],
      weaknesses: [
        "One error takes down the whole service",
        "No recovery mechanism; manual restart required",
        "Users experience total outage, not degraded service",
      ],
      watchFor: [
        "No error handling or try-catch logic",
        "No retry mechanism or circuit breaker",
        "Failure in one agent affects other agents",
      ],
    },
    {
      id: "observable-agent",
      name: "The Observable Agent",
      type: "foundational",
      hues: ["invocation", "execution", "observability"],
      description: "Full instrumentation from day one. Every call logged, every decision traced.",
      strengths: [
        "Visibility into agent behavior in production",
        "Easy debugging and performance analysis",
        "Can correlate failures to specific inputs or states",
      ],
      weaknesses: [
        "Observability adds latency and overhead",
        "Requires learning observability platform",
      ],
      watchFor: [
        "Logging too verbose (performance impact) or too sparse (can't debug)",
        "Observability system itself becoming a bottleneck",
      ],
    },
    {
      id: "resilient-loop",
      name: "The Resilient Loop",
      type: "foundational",
      hues: ["invocation", "execution", "resilience", "observability"],
      description: "Error handling and retries woven in from the start. Failures are logged and recoverable.",
      strengths: [
        "Transient errors automatically recovered",
        "System degrades gracefully under load, doesn't crash",
        "Failures logged and traceable for improvement",
      ],
      weaknesses: [
        "Retries can hide underlying issues if not monitored",
        "Complex error handling logic to maintain",
      ],
      watchFor: [
        "Retries that don't actually fix the problem (infinite retry loops)",
        "Backoff strategy that hammers a failing service",
      ],
    },
    {
      id: "persistent-memory",
      name: "The Persistent Memory",
      type: "foundational",
      hues: ["invocation", "execution", "state", "observability"],
      description: "Agent maintains context across sessions. Can reference prior conversations and learn over time.",
      strengths: [
        "Agent continuity across restarts and deployments",
        "Learning and adaptation across sessions",
        "User experience improves with agent's knowledge",
      ],
      weaknesses: [
        "State management adds complexity",
        "Stale state can lead to incorrect decisions if not versioned",
      ],
      watchFor: [
        "State bloat — context growing unbounded",
        "Stale state not being refreshed or expired",
        "Conflicts between old and new context",
      ],
    },
    {
      id: "distributed-agent",
      name: "The Distributed Agent",
      type: "structural",
      hues: ["invocation", "execution", "scaling", "resilience", "state"],
      description: "Agent distributed across workers with state sync. Handles high concurrency without bottlenecking.",
      strengths: [
        "Scales to hundreds of concurrent agents",
        "Single point of failure eliminated",
        "Workload distributed across resources",
      ],
      weaknesses: [
        "State synchronization becomes non-trivial",
        "Network latency and partition tolerance issues",
        "Debugging distributed state is harder",
      ],
      watchFor: [
        "State inconsistency across workers",
        "Network partitions causing split-brain scenarios",
        "Worker death causing state orphaning",
      ],
    },
    {
      id: "secured-harness",
      name: "The Secured Harness",
      type: "foundational",
      hues: ["security", "observability", "resilience"],
      description: "Secrets never in code, all calls audited, auth enforced. Compliance-ready from the start.",
      strengths: [
        "Secrets never exposed in code or logs",
        "Full audit trail for compliance",
        "Access control prevents unauthorized runs",
      ],
      weaknesses: [
        "Adds operational complexity (secret rotation, etc.)",
        "Audit logging can become expensive at scale",
      ],
      watchFor: [
        "Secrets hardcoded or leaked in logs",
        "Audit trails not being retained",
        "Access control bypassed 'for convenience'",
      ],
    },
  ],

  recipes: [
    {
      id: "batch-processor",
      name: "The Batch Processor",
      tools: ["lambda", "postgresql", "langfuse"],
      patternIds: ["observable-agent"],
      useCase:
        "Agents running on a schedule to process batches of data. Think: daily report generation, bulk data processing, scheduled analysis.",
      whyItWorks: [
        "Lambda cost-effective for occasional runs",
        "PostgreSQL persists results durably",
        "Langfuse tracks cost and quality of each batch",
      ],
      whereItBreaks: [
        "No resilience if an agent fails mid-batch — whole batch may need restart",
        "Lambda cold starts add latency if frequency is unpredictable",
        "No observability into individual agent runs during batch",
      ],
      missingHues: ["resilience", "scaling"],
      upgradePath: [
        "Add Temporal for reliable batch coordination and retries",
        "Add Redis for inter-step communication within batch",
      ],
    },
    {
      id: "real-time-responder",
      name: "The Real-Time Responder",
      tools: ["modal", "redis", "temporal", "langfuse"],
      patternIds: ["resilient-loop", "persistent-memory"],
      useCase:
        "Low-latency agent responding to user requests in real-time. Think: chatbot, on-demand analytics, immediate recommendations.",
      whyItWorks: [
        "Modal provides fast invocation and good defaults",
        "Redis caches session state for fast retrieval",
        "Temporal handles retries and timeouts transparently",
        "Langfuse tracks quality of individual responses",
      ],
      whereItBreaks: [
        "Redis data loss if instance restarts — session context is lost",
        "Temporal adds operational complexity",
      ],
      missingHues: ["security", "scaling"],
    },
    {
      id: "silent-worker",
      name: "The Silent Worker",
      tools: ["lambda", "postgresql"],
      patternIds: ["silent-agent", "stateless-learner"],
      useCase:
        "(Anti-pattern) Agent runs invisibly with no observability or context across runs. Nobody knows if it's working.",
      whyItHappens: [
        "Quick to stand up — just Lambda + DB, ship it",
        "Observability deferred as 'phase two'",
        "Stateless thinking — each invocation is independent",
      ],
      symptoms: [
        "Errors discovered only when system starts failing",
        "Can't correlate issues to specific inputs",
        "Agent can't learn from prior runs",
      ],
      fix: [
        "Add Langfuse for observability",
        "Add Redis or PostgreSQL for conversation context",
        "Add Temporal for error recovery and retry logic",
      ],
      missingHues: ["observability", "resilience", "state"],
    },
    {
      id: "bulletproof-pipeline",
      name: "The Bulletproof Pipeline",
      tools: ["kubernetes", "postgresql", "temporal", "langfuse", "vault"],
      patternIds: ["resilient-loop", "secured-harness", "observable-agent"],
      useCase:
        "Production AI agent with full safety guarantees. For mission-critical workloads that can't fail.",
      whyItWorks: [
        "Kubernetes provides high availability and auto-recovery",
        "PostgreSQL durably stores state",
        "Temporal handles retries, timeouts, and state versioning",
        "Langfuse and OpenTelemetry provide full visibility",
        "Vault manages secrets securely",
      ],
      whereItBreaks: [
        "Operational complexity is substantial",
        "Cost high for low-traffic workloads",
      ],
    },
    {
      id: "distributed-swarm",
      name: "The Distributed Swarm",
      tools: ["ray", "postgresql", "opentelemetry", "vault"],
      patternIds: ["distributed-agent"],
      useCase:
        "Hundreds of agents working in parallel on large datasets. Think: distributed inference, parallel analysis, map-reduce-style processing.",
      whyItWorks: [
        "Ray handles parallelization transparently",
        "PostgreSQL coordinates state across workers",
        "OpenTelemetry provides observability across the cluster",
        "Vault secures credentials on all nodes",
      ],
      whereItBreaks: [
        "Ray requires cluster thinking and understanding of distributed systems",
        "State synchronization can become a bottleneck",
        "Network partition handling is non-trivial",
      ],
    },
  ],
};
