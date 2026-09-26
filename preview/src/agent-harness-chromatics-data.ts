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
      secondaryHue: "execution",
      category: "Serverless Compute",
      maturity: "production",
      description:
        "Serverless function platform for triggering agents on-demand. Auto-scales with load; pay per invocation.",
      complexityAdded: "low",
      trustContribution: "medium",
      pairsWellWith: ["postgresql", "langfuse", "opentelemetry"],
      conflictsWith: [],
      patterns: ["observable-agent", "silent-agent"],
      notes: "Useful for event-triggered work. Each invocation has a 15-minute limit, so long jobs must be split or checkpointed; Lambda durable functions add checkpointed steps that resume after interruptions. AWS publishes OpenTelemetry Lambda layers for instrumentation.",
    },
    {
      id: "modal",
      name: "Modal",
      primaryHue: "invocation",
      secondaryHue: "scaling",
      category: "Serverless ML",
      maturity: "production",
      description:
        "Serverless container platform for ML and LLM workloads, with GPU requests, container autoscaling limits, per-input retries, and Sandboxes for running untrusted code.",
      complexityAdded: "low",
      trustContribution: "medium",
      pairsWellWith: ["redis", "langfuse"],
      conflictsWith: [],
      patterns: ["resilient-loop", "observable-agent"],
      notes:
        "Fast path to GPU and container workloads. Warm-container settings trade cost for cold-start latency. Modal is not an LLM tracing tool; pair it with one such as Langfuse for prompt-level visibility.",
    },
    {
      id: "docker",
      name: "Docker",
      primaryHue: "execution",
      category: "Containerization",
      maturity: "production",
      description:
        "Builds and runs OCI container images that package an agent with its dependencies. The images run on Kubernetes through any CRI runtime, such as containerd or CRI-O.",
      complexityAdded: "low",
      trustContribution: "low",
      pairsWellWith: ["kubernetes"],
      conflictsWith: [],
      patterns: ["distributed-agent"],
      notes: "Foundational packaging tool; rarely stands alone. Kubernetes removed its built-in Docker Engine integration (dockershim) in v1.24, but Docker-built images still run there.",
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
      pairsWellWith: ["docker", "temporal", "vault", "opentelemetry", "ray"],
      conflictsWith: [],
      patterns: ["distributed-agent", "secured-harness"],
      notes:
        "Steep learning curve and meaningful operating overhead. Use when container orchestration is warranted; it is not required merely because a system is large. Operators exist for Ray (KubeRay) and Vault (Vault Secrets Operator).",
    },
    {
      id: "redis",
      name: "Redis",
      primaryHue: "state",
      category: "In-Memory Store",
      maturity: "production",
      description:
        "Fast in-memory data store for agent sessions, caches, and short-lived context; durability depends on the persistence configuration.",
      complexityAdded: "low",
      trustContribution: "low",
      pairsWellWith: ["modal"],
      conflictsWith: [],
      patterns: ["persistent-memory", "resilient-loop"],
      notes: "RDB snapshots and append-only persistence are available. Decide whether Redis is a cache, a session store, or a durable system of record before pairing it with PostgreSQL.",
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
      patterns: ["persistent-memory", "secured-harness"],
      notes: "Durable and queryable. Redis can complement it for low-latency session access rather than competing for the same responsibility. Self-hosted Temporal can also use PostgreSQL for its own persistence; keep that database separate from agent state.",
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
      pairsWellWith: ["lambda", "modal", "temporal", "opentelemetry"],
      conflictsWith: [],
      patterns: ["observable-agent", "resilient-loop"],
      notes:
        "Purpose-built for LLM workloads. Tracks cost out of the box; quality scores need evaluations configured. Accepts traces on a native OpenTelemetry (OTLP over HTTP) endpoint. Core is MIT-licensed; enterprise directories are licensed separately.",
    },
    {
      id: "temporal",
      name: "Temporal",
      primaryHue: "resilience",
      secondaryHue: "execution",
      category: "Workflow Orchestration",
      maturity: "production",
      description:
        "Durable execution platform: workflow code resumes after failures, with activity retries and timeouts built in.",
      complexityAdded: "high",
      trustContribution: "high",
      pairsWellWith: ["kubernetes", "postgresql", "langfuse", "vault", "opentelemetry"],
      conflictsWith: [],
      patterns: ["resilient-loop", "distributed-agent"],
      notes:
        "Durable execution can simplify retries and recovery for long-running work. Not every production agent needs a separate workflow engine. Workers usually run as long-lived processes; Serverless Workers on AWS Lambda are in Public Preview. Self-hosting needs a persistence store such as PostgreSQL. SDKs include OpenTelemetry tracing support.",
    },
    {
      id: "opentelemetry",
      name: "OpenTelemetry",
      primaryHue: "observability",
      category: "Standards-Based Instrumentation",
      maturity: "production",
      description:
        "Vendor-neutral instrumentation framework for metrics, logs, and traces. Exports over OTLP to many backends; it is not a storage or UI backend itself.",
      complexityAdded: "medium",
      trustContribution: "high",
      pairsWellWith: ["kubernetes", "temporal", "langfuse", "lambda"],
      conflictsWith: [],
      patterns: ["observable-agent", "secured-harness"],
      notes: "Reduces vendor lock-in; requires careful setup and a chosen backend. The generative AI semantic conventions are still in Development status, so attribute names may change.",
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
      pairsWellWith: ["kubernetes", "temporal", "postgresql"],
      conflictsWith: [],
      patterns: ["secured-harness"],
      notes: "Complex to operate. One option for secret rotation, dynamic credentials (including generated PostgreSQL logins), and audit; smaller footprints may not need it. Current versions are under the Business Source License 1.1, with IBM as licensor.",
    },
    {
      id: "ray",
      name: "Ray",
      primaryHue: "scaling",
      secondaryHue: "execution",
      category: "Distributed Computing",
      maturity: "production",
      description:
        "Distributed computing framework that runs Python tasks and stateful actors across a cluster for parallel agent execution.",
      complexityAdded: "high",
      trustContribution: "medium",
      pairsWellWith: ["kubernetes"],
      conflictsWith: [],
      patterns: ["distributed-agent"],
      notes:
        "Powerful for data-parallel workloads; requires cluster thinking. Retries tasks when a worker or machine fails (3 times by default), but not on application exceptions unless configured. Runs on Kubernetes through the KubeRay operator.",
    },
  ],

  patterns: [
    {
      id: "silent-agent",
      name: "The Silent Agent",
      type: "anti-pattern",
      hues: ["observability"],
      description: "Logging feels like overhead when the agent is working. When it stops working, there's nothing to look at — no traces, no error context, no way to understand what happened. Users discover failures before systems do.",
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
      hues: ["state"],
      description: "Treating the agent as a stateless function is the simplest architecture. It's also the one that makes every interaction start from zero — no prior context, no continuity, no ability to reference what happened before. The agent can't improve; it just repeats.",
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
      hues: ["resilience"],
      description: "Error handling feels like overhead when things are working. One unhandled exception in a chain of agent calls takes down everything downstream. Users experience total outage instead of degraded service. No retry mechanism means no recovery without manual intervention.",
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
      description: "You can't debug what you can't see. An agent that produces wrong outputs with no trace of why is impossible to improve. Adding observability after the fact means retrofitting it into every call path. Wire it in from the start: every invocation logged, every decision traced.",
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
      description: "Transient failures — a model timeout, a temporary API outage, a rate limit — will happen in production. Without retry logic, a transient failure becomes a user-facing error. With naive retries, you hammer a failing service and make it worse. Deliberate retry logic with backoff degrades gracefully; it doesn't just fail less often.",
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
      description: "Every invocation that starts from zero context makes the agent a slightly better search engine, not an agent. Persistent memory means state management complexity — stale context, unbounded growth, versioning conflicts. The complexity is the price of continuity; it's worth paying when the use case demands it.",
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
      description: "A single-process agent hits a ceiling — one invocation at a time. Distributing across workers solves throughput but introduces state synchronization complexity: who owns shared state, what happens when a worker dies, how do you avoid split-brain. Accept the coordination cost as the price of scale.",
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
      description: "Hardcoded credentials work until they're rotated, leaked, or audited. Access controls feel unnecessary until someone runs an agent they shouldn't. Audit trails feel like overhead until a compliance event. Building security in from the start costs less than retrofitting after an incident.",
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
        "Langfuse tracks cost and latency of each batch",
      ],
      whereItBreaks: [
        "No resilience if an agent fails mid-batch — whole batch may need restart",
        "Each Lambda invocation is capped at 15 minutes; long batches must be split or checkpointed",
        "Individual runs need trace correlation and alerting; adding Langfuse alone does not wire every failure path",
      ],
      missingHues: ["resilience", "scaling", "security"],
      upgradePath: ["temporal", "vault"],
    },
    {
      id: "real-time-responder",
      name: "The Real-Time Responder",
      tools: ["modal", "redis", "temporal", "langfuse"],
      patternIds: ["resilient-loop", "persistent-memory"],
      useCase:
        "Low-latency agent responding to user requests in real-time. Think: chatbot, on-demand analytics, immediate recommendations.",
      whyItWorks: [
        "Modal starts containers on demand and autoscales within configured limits; cold starts still need measuring",
        "Redis caches session state for fast retrieval",
        "Temporal can own retries and timeouts for multi-step turns",
        "Langfuse tracks cost and latency of individual responses",
      ],
      whereItBreaks: [
        "Session context can be lost if Redis persistence and recovery are not configured for the requirement",
        "Temporal adds operational complexity and a workflow round trip; keep the latency-sensitive reply path short",
      ],
      missingHues: ["security"],
      upgradePath: ["vault"],
    },
    {
      id: "silent-worker",
      name: "The Silent Worker",
      tools: ["lambda", "postgresql"],
      patternIds: ["silent-agent", "stateless-learner"],
      useCase:
        "(Anti-pattern) Agent runs invisibly. The database stores outputs, but nothing records what each run did and no prior context is read back. Nobody knows if it's working.",
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
        "Read prior run history from the existing PostgreSQL store before each run",
        "Add Temporal for error recovery and retry logic",
      ],
      missingHues: ["observability", "resilience", "scaling", "security"],
    },
    {
      id: "bulletproof-pipeline",
      name: "The Resilient Production Harness",
      tools: ["kubernetes", "postgresql", "temporal", "langfuse", "opentelemetry", "vault"],
      patternIds: ["resilient-loop", "secured-harness", "observable-agent"],
      useCase:
        "A heavily instrumented, recoverable agent harness for workloads with strict operational requirements. No tool combination guarantees safety or zero failures.",
      whyItWorks: [
        "Kubernetes restarts failed containers and reschedules work; availability still depends on cluster and application design",
        "PostgreSQL durably stores state",
        "Temporal handles retries, timeouts, and workflow versioning",
        "Langfuse and OpenTelemetry can expose model and infrastructure traces when instrumented end to end",
        "Vault issues and rotates credentials, including generated PostgreSQL logins, with audit logging",
      ],
      whereItBreaks: [
        "Operational complexity is substantial",
        "Cost high for low-traffic workloads",
      ],
      missingHues: ["invocation"],
    },
    {
      id: "distributed-swarm",
      name: "The Distributed Swarm",
      tools: ["ray", "postgresql", "opentelemetry", "vault"],
      patternIds: ["distributed-agent"],
      useCase:
        "Hundreds of agents working in parallel on large datasets. Think: distributed inference, parallel analysis, map-reduce-style processing.",
      whyItWorks: [
        "Ray distributes work written as tasks and actors across the cluster",
        "PostgreSQL stores shared results; many concurrent writers need connection pooling",
        "OpenTelemetry carries traces and metrics to a backend that must still be chosen",
        "Vault can supply credentials to workers instead of static keys on each node",
      ],
      whereItBreaks: [
        "Ray requires cluster thinking and understanding of distributed systems",
        "Ray retries tasks after worker crashes, not after bad model output or partial writes, unless configured",
        "State synchronization can become a bottleneck",
        "Network partition handling is non-trivial",
      ],
      missingHues: ["invocation", "resilience"],
    },
  ],
};
