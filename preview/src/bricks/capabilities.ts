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
  foundations: [
    { id: 'web-frontend', name: 'Web front end', hue: 'experience', summary: 'The pages and interactions people use in a browser.', products: ['nextjs'] },
    { id: 'mobile-app', name: 'Mobile app', hue: 'experience', summary: 'Native apps for phones and tablets.', products: ['react-native'] },
    { id: 'api-service', name: 'API service', hue: 'service', summary: 'The back end: endpoints and business logic behind the front end.', products: ['nodejs', 'django', 'spring-boot'] },
    { id: 'relational-db', name: 'Relational database', hue: 'data', summary: 'Durable, queryable records with transactions.', products: ['postgresql'] },
    { id: 'cache', name: 'Cache', hue: 'data', summary: 'Fast, short-lived copies of data and sessions.', products: ['redis'] },
    { id: 'message-queue', name: 'Message queue', hue: 'data', summary: 'Hands work between services so they do not have to wait on each other.', products: ['rabbitmq'] },
    { id: 'identity', name: 'Identity & login', hue: 'trust', summary: 'Who a user is, how they sign in, and what they may access.', products: ['keycloak', 'auth0'] },
    { id: 'secrets', name: 'Secrets manager', hue: 'trust', summary: 'Stores and issues credentials instead of keeping them in code or images.', products: ['vault'] },
    { id: 'supply-chain-scan', name: 'Image scanning & SBOM', hue: 'trust', summary: 'Checks what you ship for known vulnerabilities and records what is inside it.', products: ['trivy'] },
    { id: 'source-control', name: 'Source control', hue: 'delivery', summary: 'Versioned code, branches, and review before changes merge.', products: ['github'] },
    { id: 'ci-pipeline', name: 'CI pipeline', hue: 'delivery', summary: 'Builds, tests, and scans every change automatically.', products: ['github-actions'] },
    { id: 'artifact-registry', name: 'Artifact registry', hue: 'delivery', summary: 'Stores versioned images and packages that deployments pull from.', products: ['harbor'] },
    { id: 'gitops', name: 'GitOps sync', hue: 'delivery', summary: 'Keeps what is running in line with what is declared in Git.', products: ['argocd'] },
    { id: 'managed-platform', name: 'Managed platform', hue: 'platform', summary: 'Runs the app without you managing servers or clusters.', products: ['heroku'] },
    { id: 'container-images', name: 'Container images', hue: 'platform', summary: 'Packages the app and its dependencies into a portable image.', products: ['docker'] },
    { id: 'orchestration', name: 'Container orchestration', hue: 'platform', summary: 'Schedules containers across machines and restarts them when they fail.', products: ['kubernetes'] },
    { id: 'iac', name: 'Infrastructure as code', hue: 'platform', summary: 'Declares cloud resources in reviewable files instead of console clicks.', products: ['terraform'] },
    { id: 'cloud', name: 'Cloud provider', hue: 'platform', summary: 'The compute, network, and storage everything else runs on.', products: ['aws'] },
    { id: 'self-hosted', name: 'Self-hosted hardware', hue: 'platform', summary: 'Your own servers, workstations, or small machines, on premises or in a colo. You run the patching, power, and backups.', products: ['self-hosted'] },
    { id: 'telemetry', name: 'Telemetry standard', hue: 'operations', summary: 'Vendor-neutral traces, metrics, and logs from instrumented services. Not a storage or alerting backend itself.', products: ['opentelemetry'] },
    { id: 'metrics', name: 'Metrics', hue: 'operations', summary: 'Time series of how the system is behaving.', products: ['prometheus'] },
    { id: 'dashboards', name: 'Dashboards', hue: 'operations', summary: 'Shared views of health, usage, and golden signals.', products: ['grafana'] },
    { id: 'alerting', name: 'Alerting & on-call', hue: 'operations', summary: 'Routes alerts, such as an SLO at risk, to the on-call person.', products: ['pagerduty'] },
  ],
  ai: [
    { id: 'model-api', name: 'Model API', hue: 'cognition', summary: 'A language model you call through an API, hosted by a provider or run on your own hardware.', products: ['openai', 'claude', 'ollama'] },
    { id: 'agent-runtime', name: 'Agent runtime', hue: 'intent', summary: 'Runs the agent loop: prompts, tool calls, and handoffs.', products: ['openai-agents-sdk', 'langchain'] },
    { id: 'agent-graph', name: 'Agent state graph', hue: 'logic', summary: 'Makes an agent’s steps, branches, and state explicit and resumable.', products: ['langgraph'] },
    { id: 'durable-workflow', name: 'Durable workflow', hue: 'logic', summary: 'Retries and resumes long-running work across failures and restarts.', products: ['temporal'] },
    { id: 'vector-retrieval', name: 'Vector store', hue: 'memory', summary: 'Indexes embeddings and returns relevant material for a question. Not conversation memory on its own.', products: ['pinecone'] },
    { id: 'app-interface', name: 'App front end', hue: 'interface', summary: 'The interface where people ask and read answers, and where it is hosted, from internal prototype to public product.', products: ['vercel', 'streamlit'] },
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
    { id: 'quality-checks', name: 'Data quality checks', hue: 'observe', summary: 'Assertions data is checked against; a pipeline can use them to block promotion.', products: ['great-expectations'] },
    { id: 'metadata-catalog', name: 'Metadata catalog', hue: 'govern', summary: 'Discovery, ownership, and lineage for datasets. Access is enforced in the engines.', products: ['datahub'] },
  ],
  harness: [
    { id: 'tool-protocol', name: 'Tool protocol', hue: 'tools', summary: 'A standard protocol for exposing tools, resources, and prompts to an agent’s host application.', products: ['mcp'] },
    { id: 'code-sandbox', name: 'Code sandbox', hue: 'sandbox', summary: 'Disposable environments where model-written code and commands run away from your systems.', products: ['e2b'] },
    { id: 'isolation-runtime', name: 'Isolation runtime', hue: 'sandbox', summary: 'An application kernel that intercepts container system calls, adding a boundary between untrusted workloads and the host kernel.', products: ['gvisor'] },
    { id: 'policy-engine', name: 'Policy engine', hue: 'permissions', summary: 'Decides which actions are allowed, as code that can be reviewed and tested. Enforcement stays in the caller.', products: ['opa'] },
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
    { id: 'local-machine', name: 'Local machine', hue: 'runtime', summary: 'A dedicated workstation or small machine that runs agents on-site, inside your network.', products: ['local-machine'] },
    { id: 'distributed-compute', name: 'Distributed compute', hue: 'runtime', summary: 'Spreads work across many workers and machines.', products: ['ray'] },
  ],
}
