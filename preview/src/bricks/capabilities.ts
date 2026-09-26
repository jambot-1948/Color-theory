import type { EditionId } from './buildModel'

// Capabilities are the parts. Products are interchangeable ways to fill them.
// Each product fills exactly one capability here: its primary job in these recipes.
export interface Capability {
  id: string
  name: string
  hue: string
  summary: string
  products: string[]
}

export const capabilities: Record<EditionId, Capability[]> = {
  ai: [
    { id: 'model-api', name: 'Model API', hue: 'cognition', summary: 'A hosted language model that reasons over and generates from what it is given.', products: ['openai', 'claude'] },
    { id: 'agent-runtime', name: 'Agent runtime', hue: 'intent', summary: 'Runs the agent loop: prompts, tool calls, and handoffs.', products: ['openai-agents-sdk', 'langchain'] },
    { id: 'agent-graph', name: 'Agent state graph', hue: 'logic', summary: 'Makes an agent’s steps, branches, and state explicit and resumable.', products: ['langgraph'] },
    { id: 'durable-workflow', name: 'Durable workflow', hue: 'logic', summary: 'Retries and resumes long-running work across failures and restarts.', products: ['temporal'] },
    { id: 'vector-retrieval', name: 'Vector store', hue: 'memory', summary: 'Indexes embeddings and returns relevant material for a question. Not conversation memory on its own.', products: ['pinecone'] },
    { id: 'app-interface', name: 'App interface', hue: 'interface', summary: 'Where people ask and read answers, from internal prototype to public product.', products: ['vercel', 'streamlit'] },
    { id: 'app-backend', name: 'App backend', hue: 'velocity', summary: 'Managed database, auth, and storage behind the interface.', products: ['supabase'] },
    { id: 'tracing-evals', name: 'Tracing & evals', hue: 'trust', summary: 'Records what the model and agent did so it can be debugged and evaluated.', products: ['langsmith'] },
    { id: 'output-validation', name: 'Input/output validation', hue: 'trust', summary: 'Checks model inputs and outputs against rules before they are used.', products: ['guardrails'] },
  ],
  data: [
    { id: 'managed-ingestion', name: 'Managed ELT connectors', hue: 'ingest', summary: 'Prebuilt connectors that copy data from source systems.', products: ['fivetran', 'openflow'] },
    { id: 'event-stream', name: 'Event stream', hue: 'ingest', summary: 'A durable log of events that many consumers can read.', products: ['kafka'] },
    { id: 'sql-transformation', name: 'SQL transformation', hue: 'transform', summary: 'Versioned, tested SQL models that turn raw tables into trusted ones.', products: ['dbt'] },
    { id: 'distributed-processing', name: 'Distributed processing', hue: 'transform', summary: 'Batch and stream computation across a cluster.', products: ['spark'] },
    { id: 'orchestration', name: 'Pipeline orchestration', hue: 'orchestrate', summary: 'Schedules, orders, and retries pipeline work, and tracks what ran.', products: ['dagster', 'airflow'] },
    { id: 'warehouse', name: 'Cloud warehouse', hue: 'store', summary: 'Managed storage and SQL compute for analytics.', products: ['snowflake'] },
    { id: 'open-table', name: 'Open table format', hue: 'store', summary: 'Tables on object storage that several engines can read and write.', products: ['iceberg'] },
    { id: 'query-engine', name: 'Federated query', hue: 'serve', summary: 'One SQL engine over many storage systems.', products: ['trino'] },
    { id: 'semantic-layer', name: 'Semantic layer', hue: 'serve', summary: 'Shared metric and entity definitions that every consumer queries.', products: ['cube'] },
    { id: 'quality-checks', name: 'Data quality checks', hue: 'observe', summary: 'Assertions data must pass before it is promoted.', products: ['great-expectations'] },
    { id: 'metadata-catalog', name: 'Metadata catalog', hue: 'govern', summary: 'Discovery, ownership, and lineage for datasets. Access is enforced in the engines.', products: ['datahub'] },
  ],
  harness: [
    { id: 'tool-protocol', name: 'Tool protocol', hue: 'tools', summary: 'A standard contract for the tools, resources, and prompts an agent can call.', products: ['mcp'] },
    { id: 'code-sandbox', name: 'Code sandbox', hue: 'sandbox', summary: 'Disposable environments where model-written code and commands run away from your systems.', products: ['e2b'] },
    { id: 'isolation-runtime', name: 'Isolation runtime', hue: 'sandbox', summary: 'A kernel boundary between containers and the host for workloads you do not fully trust.', products: ['gvisor'] },
    { id: 'policy-engine', name: 'Policy engine', hue: 'permissions', summary: 'Decides which actions are allowed, as code that can be reviewed and tested.', products: ['opa'] },
    { id: 'secrets', name: 'Secrets manager', hue: 'permissions', summary: 'Issues and rotates credentials instead of embedding them in the agent.', products: ['vault'] },
    { id: 'relational-state', name: 'Relational store', hue: 'context', summary: 'Durable records of runs, tasks, and results.', products: ['postgresql'] },
    { id: 'fast-state', name: 'In-memory store', hue: 'context', summary: 'Low-latency session state, queues, and caches.', products: ['redis'] },
    { id: 'agent-memory', name: 'Agent memory', hue: 'context', summary: 'Decides what an agent keeps, recalls, and forgets across sessions.', products: ['letta'] },
    { id: 'llm-tracing', name: 'LLM tracing', hue: 'evidence', summary: 'Traces prompts, tool calls, cost, and scores per run.', products: ['langfuse'] },
    { id: 'telemetry-standard', name: 'Telemetry standard', hue: 'evidence', summary: 'Vendor-neutral traces, metrics, and logs over OTLP. Not a storage or UI backend itself.', products: ['opentelemetry'] },
    { id: 'eval-gates', name: 'Eval gates', hue: 'evidence', summary: 'Test suites that must pass before a prompt, model, or tool change ships.', products: ['promptfoo'] },
    { id: 'durable-workflow', name: 'Durable workflow', hue: 'recovery', summary: 'Retries and resumes multi-step work across failures, and can wait on a human.', products: ['temporal'] },
    { id: 'llm-gateway', name: 'LLM gateway', hue: 'recovery', summary: 'One endpoint in front of model providers, with fallbacks, rate limits, and spend limits.', products: ['litellm'] },
    { id: 'serverless-functions', name: 'Serverless compute', hue: 'runtime', summary: 'Runs agent code on demand, as functions or containers, without managing servers.', products: ['lambda', 'modal'] },
    { id: 'container-image', name: 'Container images', hue: 'runtime', summary: 'Builds and runs OCI images that package agent code and dependencies.', products: ['docker'] },
    { id: 'container-orchestration', name: 'Container orchestration', hue: 'runtime', summary: 'Schedules and keeps long-running workers alive.', products: ['kubernetes'] },
    { id: 'distributed-compute', name: 'Distributed compute', hue: 'runtime', summary: 'Spreads work across many workers and machines.', products: ['ray'] },
  ],
}
