export type AHHueId =
  | "tools"
  | "sandbox"
  | "permissions"
  | "context"
  | "evidence"
  | "recovery"
  | "runtime";

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
    version: "0.2",
    tagline: "A framework for the agent harness: the layer between the model and the world.",
    description:
      "Agent Harness Chromatics is a reference guide to the layer between the model and the world: the tools an agent can call, where its code runs, what it may do, what it remembers, how its behaviour is judged, how a run recovers or stops, and the compute underneath. Focus: not the model or the agent's prompt, but the harness around them.",
  },

  hues: [
    {
      id: "tools",
      name: "Tools",
      colorName: "Purple",
      hex: "#6A4C93",
      description: "What the agent can call — tool definitions, protocols, and connectors to outside systems.",
    },
    {
      id: "sandbox",
      name: "Sandbox",
      colorName: "Teal",
      hex: "#1B998B",
      description: "Where agent-generated code and commands run — isolated from the host, its secrets, and everything else.",
    },
    {
      id: "permissions",
      name: "Permissions",
      colorName: "Indigo",
      hex: "#4B0082",
      description: "What the agent may do, with whose credentials, and which actions need a person to approve them first.",
    },
    {
      id: "context",
      name: "Context",
      colorName: "Forest Green",
      hex: "#2D6A4F",
      description: "What the agent remembers across steps and sessions — and what it deliberately forgets.",
    },
    {
      id: "evidence",
      name: "Evidence",
      colorName: "Rust",
      hex: "#E76F51",
      description: "What records and judges the agent's behaviour — traces, evals, and regression gates.",
    },
    {
      id: "recovery",
      name: "Recovery",
      colorName: "Red",
      hex: "#D62828",
      description: "What keeps a run going or stops it safely — retries, resumption, model fallbacks, spend and rate limits.",
    },
    {
      id: "runtime",
      name: "Runtime",
      colorName: "Bright Blue",
      hex: "#0077B6",
      description: "What compute the harness itself runs on — functions, containers, and clusters.",
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
    // ── Tools ──────────────────────────────────────────────────────────
    {
      id: "mcp",
      name: "Model Context Protocol",
      primaryHue: "tools",
      category: "Tool Protocol",
      maturity: "production",
      description:
        "Open protocol, with official SDKs, for exposing tools, resources, and prompts from servers to AI applications. The current specification version is 2026-07-28.",
      complexityAdded: "low",
      trustContribution: "low",
      pairsWellWith: ["e2b", "langfuse", "litellm", "promptfoo", "temporal", "letta"],
      conflictsWith: [],
      patterns: ["gated-action", "sandboxed-loop", "open-door"],
      notes:
        "Standardises how tools are described and called; it does not decide which calls are allowed. The specification says tools represent arbitrary code execution, that hosts must obtain user consent before invoking a tool, and that the protocol itself cannot enforce these principles. Tool descriptions and annotations should be treated as untrusted unless the server is trusted. Official SDKs include TypeScript, Python, C#, Go, and Rust (Tier 1), with further languages at lower support tiers.",
    },

    // ── Sandbox ────────────────────────────────────────────────────────
    {
      id: "e2b",
      name: "E2B",
      primaryHue: "sandbox",
      category: "Cloud Sandbox",
      maturity: "production",
      description:
        "Open-source infrastructure for running AI-generated code in isolated cloud sandboxes, started and controlled through JavaScript and Python SDKs. Each sandbox is a Firecracker microVM that can be paused and resumed.",
      complexityAdded: "low",
      trustContribution: "high",
      pairsWellWith: ["mcp"],
      conflictsWith: [],
      patterns: ["sandboxed-loop"],
      notes:
        "Isolation covers where code runs, not what it is allowed to reach; network access and credentials placed in a sandbox still need deciding. The SDK can start an MCP gateway inside a sandbox. Hosted by E2B, or self-hosted on AWS or Google Cloud using the published Terraform-based infrastructure. SDK repository is Apache-2.0 licensed.",
    },
    {
      id: "gvisor",
      name: "gVisor",
      primaryHue: "sandbox",
      category: "Container Isolation",
      maturity: "production",
      description:
        "Application kernel, written in Go and running in userspace, that sits between a container and the host kernel. Its OCI runtime, runsc, works with Docker and Kubernetes.",
      complexityAdded: "medium",
      trustContribution: "high",
      pairsWellWith: ["docker", "kubernetes"],
      conflictsWith: [],
      patterns: ["sandboxed-loop"],
      notes:
        "Hardens the container boundary for untrusted workloads; it is not a VM and not a syscall filter. The project documents runtime costs over native containers, especially for system-call-heavy work, and it implements its own system-call surface, so check compatibility and measure before adopting. Apache-2.0 licensed.",
    },

    // ── Permissions ────────────────────────────────────────────────────
    {
      id: "opa",
      name: "Open Policy Agent",
      primaryHue: "permissions",
      category: "Policy Engine",
      maturity: "production",
      description:
        "General-purpose policy engine. Services query it with structured input and it returns a decision computed from Rego policies and data, so rules such as \"can user X call operation Y on resource Z\" are not hard-coded.",
      complexityAdded: "medium",
      trustContribution: "high",
      pairsWellWith: ["kubernetes"],
      conflictsWith: [],
      patterns: ["gated-action"],
      notes:
        "OPA returns decisions; the calling service must enforce them, so every tool path has to ask. It has no built-in agent or MCP integration: checking tool calls against OPA is code the harness owns. Its Kubernetes admission-control use governs cluster objects, not agent actions. CNCF graduated project, Apache-2.0 licensed.",
    },
    {
      id: "vault",
      name: "HashiCorp Vault",
      primaryHue: "permissions",
      category: "Secrets Management",
      maturity: "production",
      description:
        "Centralized secrets management with encryption, access control, audit logging, and dynamic credentials.",
      complexityAdded: "high",
      trustContribution: "high",
      pairsWellWith: ["kubernetes", "temporal", "postgresql"],
      conflictsWith: [],
      patterns: ["gated-action", "open-door"],
      notes:
        "Complex to operate. One option for secret rotation, dynamic credentials (including generated PostgreSQL logins), and audit; smaller footprints may not need it. Scoped, short-lived credentials limit what a tool can reach, but Vault does not decide which agent actions are allowed. Current versions are under the Business Source License 1.1, with IBM as licensor.",
    },

    // ── Context ────────────────────────────────────────────────────────
    {
      id: "postgresql",
      name: "PostgreSQL",
      primaryHue: "context",
      category: "Relational Database",
      maturity: "production",
      description:
        "Durable, queryable database for persisting agent state, conversation history, and structured context.",
      complexityAdded: "medium",
      trustContribution: "high",
      pairsWellWith: ["lambda", "temporal", "vault", "litellm"],
      conflictsWith: [],
      patterns: ["durable-agent", "stateless-learner"],
      notes:
        "Durable and queryable. Redis can complement it for low-latency session access rather than competing for the same responsibility. Self-hosted Temporal and the LiteLLM proxy can each use PostgreSQL for their own persistence; keep those databases separate from agent context. What to keep and what to expire is a design decision the database does not make.",
    },
    {
      id: "redis",
      name: "Redis",
      primaryHue: "context",
      category: "In-Memory Store",
      maturity: "production",
      description:
        "Fast in-memory data store for agent sessions, caches, and short-lived context; durability depends on the persistence configuration.",
      complexityAdded: "low",
      trustContribution: "low",
      pairsWellWith: ["modal", "litellm"],
      conflictsWith: [],
      patterns: ["stateless-learner"],
      notes:
        "RDB snapshots and append-only persistence are available. Decide whether Redis is a cache, a session store, or a durable system of record before pairing it with PostgreSQL. The LiteLLM proxy can also use Redis for shared state across instances.",
    },
    {
      id: "letta",
      name: "Letta",
      primaryHue: "context",
      category: "Agent Memory",
      maturity: "emerging",
      description:
        "Stateful agent platform (formerly MemGPT) whose agents rewrite their own memory blocks over time, with context tracked in git. Development has moved to Letta Code, a full agent harness with CLI, desktop app, and SDK.",
      complexityAdded: "medium",
      trustContribution: "medium",
      pairsWellWith: ["mcp"],
      conflictsWith: [],
      patterns: ["stateless-learner"],
      notes:
        "Letta is no longer a memory layer to drop into another harness: the V1 API server is retired, and Letta Code brings its own loop, permissions, and runtime. Agent memory is stored in Letta Cloud by default or locally. Agents can call MCP tools. Self-editing memory makes what the agent remembers a behaviour to review, not a fixed store. Apache-2.0 licensed.",
    },

    // ── Evidence ───────────────────────────────────────────────────────
    {
      id: "langfuse",
      name: "Langfuse",
      primaryHue: "evidence",
      category: "LLM Observability",
      maturity: "production",
      description:
        "LLM-specific tracing and monitoring. Captures prompts, completions, latency, costs, and evaluation metrics.",
      complexityAdded: "low",
      trustContribution: "high",
      pairsWellWith: ["lambda", "modal", "temporal", "opentelemetry", "mcp", "litellm", "promptfoo"],
      conflictsWith: [],
      patterns: ["silent-agent", "gated-action", "sandboxed-loop", "eval-gate"],
      notes:
        "Purpose-built for LLM workloads. Tracks cost out of the box; quality scores need evaluations configured. Accepts traces on a native OpenTelemetry (OTLP over HTTP) endpoint, documents linking MCP client and server traces, logs calls routed through the LiteLLM proxy, and can serve managed prompts to Promptfoo evals. Core is MIT-licensed; enterprise directories are licensed separately.",
    },
    {
      id: "opentelemetry",
      name: "OpenTelemetry",
      primaryHue: "evidence",
      category: "Standards-Based Instrumentation",
      maturity: "production",
      description:
        "Vendor-neutral instrumentation framework for metrics, logs, and traces. Exports over OTLP to many backends; it is not a storage or UI backend itself.",
      complexityAdded: "medium",
      trustContribution: "high",
      pairsWellWith: ["kubernetes", "temporal", "langfuse", "lambda"],
      conflictsWith: [],
      patterns: ["silent-agent", "durable-agent"],
      notes:
        "Reduces vendor lock-in; requires careful setup and a chosen backend. The generative AI semantic conventions are still in Development status, so attribute names may change.",
    },
    {
      id: "promptfoo",
      name: "Promptfoo",
      primaryHue: "evidence",
      category: "Evals and Red Teaming",
      maturity: "production",
      description:
        "CLI and library for evaluating and red-teaming LLM applications: compares prompts and models against test cases and can fail a CI build when results fall short.",
      complexityAdded: "low",
      trustContribution: "high",
      pairsWellWith: ["langfuse", "litellm", "mcp"],
      conflictsWith: [],
      patterns: ["eval-gate", "ungated-release"],
      notes:
        "A gate is only as good as its test cases and pass thresholds, which the team writes and maintains. Evals run locally by default. Documents CI/CD quality gates, a LiteLLM provider, Langfuse-managed prompts, and connecting providers to MCP servers. Promptfoo is now part of OpenAI and states it remains open source under the MIT license.",
    },

    // ── Recovery ───────────────────────────────────────────────────────
    {
      id: "temporal",
      name: "Temporal",
      primaryHue: "recovery",
      category: "Workflow Orchestration",
      maturity: "production",
      description:
        "Durable execution platform: workflow code resumes after failures, with activity retries and timeouts built in. Workflows can block on Signals, which Temporal documents as its human-in-the-loop approval pattern.",
      complexityAdded: "high",
      trustContribution: "high",
      pairsWellWith: ["kubernetes", "postgresql", "langfuse", "vault", "opentelemetry", "mcp"],
      conflictsWith: [],
      patterns: ["durable-agent", "gated-action", "cascading-failure"],
      notes:
        "Durable execution can simplify retries and recovery for long-running work. Not every production agent needs a separate workflow engine. Workers usually run as long-lived processes; Serverless Workers on AWS Lambda are in Public Preview. Self-hosting needs a persistence store such as PostgreSQL. SDKs include OpenTelemetry tracing support. Temporal's durability does not extend to MCP servers; its OpenAI Agents SDK integration runs each MCP operation as an Activity.",
    },
    {
      id: "litellm",
      name: "LiteLLM",
      primaryHue: "recovery",
      secondaryHue: "permissions",
      category: "LLM Gateway",
      maturity: "production",
      description:
        "Open-source LLM gateway (proxy server) and Python SDK that calls many model providers through one OpenAI-format API, with retries and fallbacks across deployments, budgets, rate limits, and virtual keys.",
      complexityAdded: "medium",
      trustContribution: "medium",
      pairsWellWith: ["langfuse", "postgresql", "redis", "promptfoo", "mcp"],
      conflictsWith: [],
      patterns: ["eval-gate", "durable-agent", "cascading-failure"],
      notes:
        "Budgets can hard-fail requests (max budget) or only alert (soft budget), and can be attached to keys, teams, organizations, and end users. A fallback model is a behaviour change, so it needs the same evals as the primary. The proxy is one more service in the request path; its published production stack uses PostgreSQL and Redis. Also offers an MCP gateway. MIT-licensed outside the enterprise directory.",
    },

    // ── Runtime ────────────────────────────────────────────────────────
    {
      id: "lambda",
      name: "AWS Lambda",
      primaryHue: "runtime",
      category: "Serverless Compute",
      maturity: "production",
      description:
        "Serverless function platform for triggering agents on-demand. Auto-scales with load; pay per invocation.",
      complexityAdded: "low",
      trustContribution: "medium",
      pairsWellWith: ["postgresql", "langfuse", "opentelemetry"],
      conflictsWith: [],
      patterns: ["silent-agent", "cascading-failure"],
      notes:
        "Useful for event-triggered work. Each invocation has a 15-minute limit, so long jobs must be split or checkpointed; Lambda durable functions add checkpointed steps that resume after interruptions. AWS publishes OpenTelemetry Lambda layers for instrumentation. A function's execution role is a permission boundary for the whole function, not for individual tool calls.",
    },
    {
      id: "modal",
      name: "Modal",
      primaryHue: "runtime",
      secondaryHue: "sandbox",
      category: "Serverless ML",
      maturity: "production",
      description:
        "Serverless container platform for ML and LLM workloads, with GPU requests, container autoscaling limits, per-input retries, and Sandboxes: separate containers for running untrusted code.",
      complexityAdded: "low",
      trustContribution: "medium",
      pairsWellWith: ["redis", "langfuse"],
      conflictsWith: [],
      patterns: ["sandboxed-loop", "unsandboxed-execution"],
      notes:
        "Fast path to GPU and container workloads. Warm-container settings trade cost for cold-start latency. Sandboxes are a separate API from ordinary Modal Functions: code executed inside a Function runs with that Function's environment and secrets. Modal is not an LLM tracing tool; pair it with one such as Langfuse for prompt-level visibility.",
    },
    {
      id: "docker",
      name: "Docker",
      primaryHue: "runtime",
      category: "Containerization",
      maturity: "production",
      description:
        "Builds and runs OCI container images that package an agent with its dependencies. The images run on Kubernetes through any CRI runtime, such as containerd or CRI-O.",
      complexityAdded: "low",
      trustContribution: "low",
      pairsWellWith: ["kubernetes", "gvisor"],
      conflictsWith: [],
      patterns: ["unsandboxed-execution"],
      notes:
        "Foundational packaging tool; rarely stands alone. A standard container shares the host kernel, so it is not by itself a sandbox for model-written code; gVisor's runsc runtime can harden it. Kubernetes removed its built-in Docker Engine integration (dockershim) in v1.24, but Docker-built images still run there.",
    },
    {
      id: "kubernetes",
      name: "Kubernetes",
      primaryHue: "runtime",
      category: "Orchestration",
      maturity: "production",
      description:
        "Industry-standard container orchestration for managing agents at scale. Complex but powerful and flexible.",
      complexityAdded: "high",
      trustContribution: "high",
      pairsWellWith: ["docker", "temporal", "vault", "opentelemetry", "ray", "gvisor", "opa"],
      conflictsWith: [],
      patterns: ["durable-agent", "gated-action"],
      notes:
        "Steep learning curve and meaningful operating overhead. Use when container orchestration is warranted; it is not required merely because a system is large. Operators exist for Ray (KubeRay) and Vault (Vault Secrets Operator); gVisor can be selected per workload as a container runtime, and OPA can act as an admission controller for cluster objects.",
    },
    {
      id: "ray",
      name: "Ray",
      primaryHue: "runtime",
      category: "Distributed Computing",
      maturity: "production",
      description:
        "Distributed computing framework that runs Python tasks and stateful actors across a cluster for parallel agent execution.",
      complexityAdded: "high",
      trustContribution: "medium",
      pairsWellWith: ["kubernetes"],
      conflictsWith: [],
      patterns: ["cascading-failure"],
      notes:
        "Powerful for data-parallel workloads; requires cluster thinking. Retries tasks when a worker or machine fails (3 times by default), but not on application exceptions unless configured. Runs on Kubernetes through the KubeRay operator.",
    },
  ],

  patterns: [
    // ── Anti-patterns ──────────────────────────────────────────────────
    {
      id: "silent-agent",
      name: "The Silent Agent",
      type: "anti-pattern",
      hues: ["evidence"],
      description:
        "Tracing feels like overhead when the agent is working. When it stops working, there is nothing to look at — no record of which tools were called, with what arguments, or what the model saw. Users discover failures before the team does.",
      strengths: [],
      weaknesses: [
        "No record of prompts, tool calls, or model outputs per run",
        "Root cause analysis happens only in post-mortems after incidents",
        "No baseline to compare a prompt or model change against",
      ],
      watchFor: [
        "Agent running in production with no traces of its tool calls",
        "Errors or bad actions reported by end users first",
        "Cost or latency known only from the monthly bill",
      ],
    },
    {
      id: "stateless-learner",
      name: "The Stateless Learner",
      type: "anti-pattern",
      hues: ["context"],
      description:
        "Treating each run as a fresh function call is the simplest harness. It is also the one where every session starts from zero — no prior decisions, no record of what was already tried. The opposite failure is just as real: context kept forever, with nobody deciding what to forget.",
      strengths: [],
      weaknesses: [
        "Agent repeats work and questions from earlier sessions",
        "Cannot reference prior decisions or tool results",
        "Unbounded context, when it is kept, grows stale and expensive",
      ],
      watchFor: [
        "Outputs are stored but never read back before the next run",
        "Every user interaction starts from zero context",
        "No rule for what is expired, summarised, or deleted",
      ],
    },
    {
      id: "cascading-failure",
      name: "The Cascading Failure",
      type: "anti-pattern",
      hues: ["recovery"],
      description:
        "Error handling feels like overhead when things are working. One model timeout or rate limit in a multi-step run throws away every step before it. Naive retries make it worse: they hammer the failing provider, repeat side effects, and run up spend with nothing to stop them.",
      strengths: [],
      weaknesses: [
        "One provider error ends the whole run",
        "Retries repeat tool calls that already had side effects",
        "No spend or rate ceiling, so a retry loop becomes a bill",
      ],
      watchFor: [
        "No timeouts, backoff, or retry limits on model and tool calls",
        "No fallback model or provider for a known outage",
        "Long runs that cannot resume from the last completed step",
      ],
    },
    {
      id: "open-door",
      name: "The Open Door",
      type: "anti-pattern",
      hues: ["tools", "permissions"],
      description:
        "Connecting a tool is one line of configuration; deciding who may use it is not. Every tool is callable by every run, with one broad credential, and nothing asks a person before an irreversible action. The agent's permissions are whatever its API keys allow.",
      strengths: [],
      weaknesses: [
        "A prompt injection or bad plan can reach every connected system",
        "Actions run under a shared credential, so audit cannot say who acted",
        "Irreversible actions (payments, deletes, emails) happen without review",
      ],
      watchFor: [
        "Long-lived API keys in environment variables of the agent process",
        "Tools added to the agent without a policy or approval rule",
        "Tool descriptions from third-party servers trusted as written",
      ],
    },
    {
      id: "unsandboxed-execution",
      name: "The Unsandboxed Execution",
      type: "anti-pattern",
      hues: ["sandbox", "runtime"],
      description:
        "The agent writes code or shell commands, and the harness runs them where the harness itself runs — with its filesystem, network, and secrets in reach. It works in the demo because the model behaves. The failure is one bad completion or injected instruction away.",
      strengths: [],
      weaknesses: [
        "Model-written code can read secrets and credentials of the host process",
        "A runaway command can exhaust or damage shared compute",
        "No clean boundary to reset between runs",
      ],
      watchFor: [
        "exec, eval, or subprocess calls on model output in the main service",
        "A plain container treated as the security boundary for untrusted code",
        "Sandboxes that still carry production credentials or open network access",
      ],
    },
    {
      id: "ungated-release",
      name: "The Ungated Release",
      type: "anti-pattern",
      hues: ["evidence"],
      description:
        "A prompt edit or model upgrade looks like configuration, so it ships like configuration: straight to production. Nobody runs the change against known cases first, and regressions surface as user complaints days later.",
      strengths: [],
      weaknesses: [
        "Regressions found by users, not by tests",
        "No way to say whether a new model or fallback is better or worse",
        "Rollback decisions made on anecdote",
      ],
      watchFor: [
        "Prompts edited directly in production without a test run",
        "Model or fallback changes merged without an eval job in CI",
        "Eval suites that exist but do not block a release",
      ],
    },

    // ── Positive patterns ─────────────────────────────────────────────
    {
      id: "gated-action",
      name: "The Gated Action",
      type: "foundational",
      hues: ["tools", "permissions", "evidence"],
      description:
        "Every tool call passes a check before it runs: is this action allowed, for this user, with these arguments? Low-risk calls proceed; risky ones wait for a person. Each decision is recorded next to the trace, so the audit trail explains both what happened and why it was allowed.",
      strengths: [
        "Tool access follows written policy rather than whatever the credential allows",
        "Irreversible actions get a human decision on record",
        "Denied and approved calls are visible in traces",
      ],
      weaknesses: [
        "Policies and approval flows are code the team must write and maintain",
        "Approval steps add latency and need someone on call to answer",
      ],
      watchFor: [
        "A tool path that skips the check (a direct SDK call, a new server)",
        "Approvers clicking through requests without reading them",
        "Policies drifting from the tools actually connected",
      ],
    },
    {
      id: "sandboxed-loop",
      name: "The Sandboxed Loop",
      type: "foundational",
      hues: ["tools", "sandbox", "evidence"],
      description:
        "The agent writes code, runs it somewhere disposable, reads the result, and tries again. The loop is only safe because execution happens outside the harness process, and only improvable because each attempt is traced.",
      strengths: [
        "Model-written code cannot reach the harness's own secrets or filesystem",
        "A failed or hostile run is discarded with its sandbox",
        "Traces show every attempt, not just the final answer",
      ],
      weaknesses: [
        "Sandbox start-up and round trips add latency per step",
        "Network and credential rules inside the sandbox still need design",
      ],
      watchFor: [
        "Sandboxes given production credentials for convenience",
        "Unbounded loops: no step, time, or spend limit on retries",
        "Sandbox output trusted as if it were verified",
      ],
    },
    {
      id: "eval-gate",
      name: "The Eval Gate",
      type: "foundational",
      hues: ["evidence", "recovery"],
      description:
        "Prompt, model, and fallback changes run against a maintained set of test cases before release, and the release is blocked if they fall short. The same suite checks the fallback model, because a fallback that has never been evaluated is an untested release waiting for an outage.",
      strengths: [
        "Regressions caught before users see them",
        "Model and provider swaps compared on the same cases",
        "Fallback behaviour known before it is needed",
      ],
      weaknesses: [
        "Test cases and thresholds need ongoing curation",
        "Evals cost model calls and CI time",
      ],
      watchFor: [
        "A suite that only covers the happy path",
        "Thresholds loosened whenever the gate fails",
        "Production traces never feeding back into new test cases",
      ],
    },
    {
      id: "durable-agent",
      name: "The Durable Agent",
      type: "structural",
      hues: ["recovery", "context", "runtime"],
      description:
        "A long run survives a crashed worker, a provider outage, or a deploy: completed steps are recorded, the run resumes from the last one, and side effects are not repeated. The price is a runtime that keeps workers alive and a clear line between workflow state and agent memory.",
      strengths: [
        "Runs resume after failures instead of restarting",
        "Retries and timeouts are explicit rather than scattered",
        "Long waits (for people or schedules) do not hold compute",
      ],
      weaknesses: [
        "A workflow engine and its persistence add operating load",
        "Workflow code must be deterministic and versioned carefully",
      ],
      watchFor: [
        "Non-idempotent tool calls retried inside activities",
        "Workflow history and agent context stored in the same database",
        "Every short request forced through the workflow engine",
      ],
    },
  ],

  recipes: [
    {
      id: "silent-worker",
      name: "The Silent Worker",
      tools: ["lambda", "postgresql", "mcp"],
      patternIds: ["silent-agent", "open-door"],
      useCase:
        "(Anti-pattern) A function-hosted agent with MCP tools wired in. Results land in the database, but nothing records what each run called, and nothing checks or gates the calls before they happen.",
      whyItHappens: [
        "Quick to stand up: a function, a database, and a list of MCP servers",
        "Tracing and approval rules deferred as 'phase two'",
        "The function's API keys quietly become the agent's permission model",
      ],
      symptoms: [
        "Bad or unexpected actions discovered by the people affected",
        "No record of which tool was called with which arguments",
        "Cannot say whether a prompt change made behaviour better or worse",
      ],
      fix: [
        "Trace model and tool calls with Langfuse; its MCP tracing can link client and server spans",
        "Check each tool call against policy (for example with OPA) and hold irreversible ones for approval",
        "Move multi-step or long runs into Temporal so failures resume rather than silently stop",
      ],
      missingHues: ["sandbox", "permissions", "evidence", "recovery"],
      upgradePath: ["langfuse", "opa", "temporal"],
    },
    {
      id: "sandboxed-coder",
      name: "The Sandboxed Coder",
      tools: ["mcp", "e2b", "langfuse", "postgresql"],
      patternIds: ["sandboxed-loop"],
      useCase:
        "A coding or data-analysis agent that writes and runs code as part of its loop. Think: notebook-style analysis, code generation with test runs, file transformations.",
      whyItWorks: [
        "MCP gives the agent a defined set of tools rather than ad hoc functions",
        "E2B runs model-written code in a separate microVM, away from the harness's own secrets",
        "Langfuse traces each attempt, including MCP tool calls",
        "PostgreSQL keeps session history so a later session can pick up prior results",
      ],
      whereItBreaks: [
        "The sandbox isolates execution, not intent: network access and credentials inside it still need rules",
        "No permission layer decides which tools a given user's session may call",
        "No step, time, or spend limit on the write-run-retry loop",
        "Where the agent loop itself runs is left open",
      ],
      missingHues: ["permissions", "recovery", "runtime"],
      upgradePath: ["opa", "temporal"],
    },
    {
      id: "governed-operator",
      name: "The Governed Operator",
      tools: ["kubernetes", "mcp", "opa", "vault", "temporal", "langfuse"],
      patternIds: ["gated-action", "durable-agent"],
      useCase:
        "An agent that takes real actions in business or infrastructure systems. Each tool call is checked against policy; risky ones pause the workflow until a person approves. Think: operations assistant, account changes, refunds.",
      whyItWorks: [
        "OPA answers allow, deny, or needs-approval for each tool call from written policy",
        "Temporal documents a human-in-the-loop Approval pattern: the workflow blocks on a Signal carrying the decision, with a timeout",
        "Vault issues scoped, short-lived credentials so tools do not share one broad key",
        "Langfuse traces the calls, and the recorded decisions can be attached to them",
        "Kubernetes runs the long-lived Temporal workers and MCP servers",
      ],
      whereItBreaks: [
        "Checking MCP tool calls against OPA is harness code to write; neither product does it for the other",
        "Every tool path must go through the check, including servers added later",
        "Approvals need a person on call and a timeout rule for when nobody answers",
        "Operational load is substantial: a cluster, a workflow service, a policy engine, and Vault",
      ],
      missingHues: ["sandbox", "context"],
      upgradePath: ["gvisor", "postgresql"],
    },
    {
      id: "evaluated-release",
      name: "The Evaluated Release",
      tools: ["litellm", "langfuse", "promptfoo", "postgresql"],
      patternIds: ["eval-gate"],
      useCase:
        "A team that changes prompts and models often and wants each change, including fallback models, tested before it ships. Think: model upgrades, provider switches, prompt iteration.",
      whyItWorks: [
        "LiteLLM puts every model behind one API, with fallbacks, budgets, and rate limits",
        "Promptfoo runs the same test cases against candidate prompts and models and can fail the CI job",
        "Langfuse traces production calls through the gateway and can serve managed prompts to Promptfoo",
        "PostgreSQL backs the LiteLLM proxy's keys and spend records",
      ],
      whereItBreaks: [
        "The gate is only as good as its test cases and thresholds",
        "Evals that never include tool calls say little about agent behaviour",
        "The gateway is one more service in every model request's path",
      ],
      missingHues: ["tools", "sandbox", "runtime"],
      upgradePath: ["mcp", "e2b"],
    },
    {
      id: "bulletproof-pipeline",
      name: "The Resilient Production Harness",
      tools: ["kubernetes", "postgresql", "temporal", "langfuse", "opentelemetry", "vault", "litellm"],
      patternIds: ["durable-agent"],
      useCase:
        "A heavily instrumented, recoverable agent harness for workloads with strict operational requirements. No tool combination guarantees safety or zero failures.",
      whyItWorks: [
        "Kubernetes restarts failed containers and reschedules work; availability still depends on cluster and application design",
        "PostgreSQL durably stores agent context",
        "Temporal handles retries, timeouts, and workflow versioning",
        "LiteLLM adds model fallbacks, budgets, and rate limits in front of providers",
        "Langfuse and OpenTelemetry can expose model and infrastructure traces when instrumented end to end",
        "Vault issues and rotates credentials, including generated PostgreSQL logins, with audit logging",
      ],
      whereItBreaks: [
        "Operational complexity is substantial",
        "Cost high for low-traffic workloads",
        "Temporal and LiteLLM can both retry the same model call; decide which layer owns retries",
        "Recovery and visibility are covered, but nothing here defines the agent's tools or isolates code it writes",
      ],
      missingHues: ["tools", "sandbox"],
      upgradePath: ["mcp", "gvisor", "promptfoo"],
    },
    {
      id: "open-door-agent",
      name: "The Open Door Agent",
      tools: ["mcp", "redis", "modal"],
      patternIds: ["open-door", "unsandboxed-execution", "silent-agent"],
      useCase:
        "(Anti-pattern) A fast, capable agent: many MCP servers connected, session context in Redis, and model-written code executed inside the same Modal Function that runs the agent. Modal offers Sandboxes, but this design does not use them.",
      whyItHappens: [
        "Connecting another MCP server is quicker than writing a rule for it",
        "Running generated code in-process is the shortest path to a working demo",
        "Fast, autoscaling compute makes the design feel production-ready",
      ],
      symptoms: [
        "Generated code can read the Function's environment and secrets",
        "Any connected tool is reachable from any session",
        "No trace explains an action after the fact",
      ],
      fix: [
        "Run generated code in Modal Sandboxes or E2B, with no production credentials inside",
        "Put a policy check (for example OPA) in front of tool calls, and require approval for irreversible ones",
        "Trace runs with Langfuse and put spend and rate limits in front of the model (for example LiteLLM)",
      ],
      missingHues: ["permissions", "evidence", "recovery"],
      upgradePath: ["opa", "langfuse", "litellm"],
    },
  ],
};
