import type { AssemblyStory } from './assemblyStories'

// Authored step stories for the agent-harness recipes. Steps follow each recipe's tool order.
// 'fit' links are pairs recorded in pairsWellWith; 'recipe' links describe how this recipe combines two parts,
// which is an integration to design, not an automatic connection.
export const harnessStories: Record<string, AssemblyStory> = {
  'batch-processor': {
    recipeId: 'batch-processor',
    steps: [
      { toolId: 'lambda', action: 'Run the scheduled job', explanation: 'Lambda starts each batch on a trigger. Each invocation is capped at 15 minutes, so size batches to fit or checkpoint them.' },
      { toolId: 'postgresql', action: 'Persist results', explanation: 'Write outputs and a record of each run to PostgreSQL so a later run, or a person, can see what was done.' },
      { toolId: 'langfuse', action: 'Trace each run', explanation: 'Instrument model calls so cost and latency are visible per batch. Alerting on failed runs is still separate work.' },
    ],
    links: [
      { first: 'lambda', second: 'postgresql', kind: 'fit', note: 'The function and the database are a curated pairing.' },
      { first: 'lambda', second: 'langfuse', kind: 'fit', note: 'The function and the LLM tracing tool are a curated pairing; tracing must be added to the function code.' },
    ],
  },
  'real-time-responder': {
    recipeId: 'real-time-responder',
    steps: [
      { toolId: 'modal', action: 'Serve the agent', explanation: 'Modal runs the agent in containers that scale within configured limits. Measure cold starts against the latency target.' },
      { toolId: 'redis', action: 'Keep session context close', explanation: 'Store session state in Redis, with a persistence setting that matches how much loss is acceptable.' },
      { toolId: 'temporal', action: 'Bound the multi-step work', explanation: 'Hand longer or multi-step turns to Temporal for retries and timeouts. Keep the fast reply path outside it.' },
      { toolId: 'langfuse', action: 'Trace responses', explanation: 'Record prompts, cost, and latency for each response. Quality scores need evaluations configured.' },
    ],
    links: [
      { first: 'modal', second: 'redis', kind: 'fit', note: 'The serverless runtime and the session store are a curated pairing.' },
      { first: 'modal', second: 'temporal', kind: 'recipe', note: 'The recipe routes multi-step turns to Temporal. Modal also offers per-input retries, so decide which layer owns retries.' },
      { first: 'temporal', second: 'langfuse', kind: 'fit', note: 'Langfuse documents tracing Temporal workflows through OpenTelemetry.' },
      { first: 'modal', second: 'langfuse', kind: 'fit', note: 'The runtime and the LLM tracing tool are a curated pairing.' },
    ],
  },
  'silent-worker': {
    recipeId: 'silent-worker',
    steps: [
      { toolId: 'lambda', action: 'Ship the function', explanation: 'The agent runs on a trigger, and nothing records what each run did.' },
      { toolId: 'postgresql', action: 'Store only outputs', explanation: 'Results land in a table, but no run history is read back, so each run starts from zero. The repair is tracing plus reading prior context before each run.' },
    ],
    links: [
      { first: 'lambda', second: 'postgresql', kind: 'fit', note: 'The pairing itself is sound. The caution comes from what this design leaves out, not from the two parts.' },
    ],
  },
  'bulletproof-pipeline': {
    recipeId: 'bulletproof-pipeline',
    steps: [
      { toolId: 'kubernetes', action: 'Provide the runtime', explanation: 'Run agent workers as long-lived pods. Kubernetes restarts failed containers, but availability still depends on cluster and application design.' },
      { toolId: 'postgresql', action: 'Hold durable state', explanation: 'Store agent state in PostgreSQL. A self-hosted Temporal service can use a separate PostgreSQL database for its own persistence.' },
      { toolId: 'temporal', action: 'Make work recoverable', explanation: 'Workflows resume after failures, with activity retries and timeouts set explicitly in code.' },
      { toolId: 'langfuse', action: 'See model behaviour', explanation: 'Trace prompts, tool calls, and cost per run.' },
      { toolId: 'opentelemetry', action: 'Standardise telemetry', explanation: 'Emit traces and metrics over OTLP. Langfuse can receive OTLP traces, so one pipeline can feed both, if the team chooses.' },
      { toolId: 'vault', action: 'Manage secrets', explanation: 'Issue short-lived credentials and audit their use. Vault adds its own operating load.' },
    ],
    links: [
      { first: 'kubernetes', second: 'temporal', kind: 'fit', note: 'Temporal workers can run as long-lived pods; this is a curated pairing.' },
      { first: 'temporal', second: 'postgresql', kind: 'fit', note: 'PostgreSQL is a supported Temporal persistence store; agent state and Temporal state should stay separate.' },
      { first: 'temporal', second: 'langfuse', kind: 'fit', note: 'Langfuse documents tracing Temporal workflows through OpenTelemetry.' },
      { first: 'langfuse', second: 'opentelemetry', kind: 'fit', note: 'Langfuse accepts traces on a native OpenTelemetry endpoint.' },
      { first: 'vault', second: 'postgresql', kind: 'fit', note: 'Vault’s database secrets engine can generate PostgreSQL credentials.' },
      { first: 'vault', second: 'kubernetes', kind: 'fit', note: 'The Vault Secrets Operator syncs Vault secrets into Kubernetes Secrets.' },
    ],
  },
  'distributed-swarm': {
    recipeId: 'distributed-swarm',
    steps: [
      { toolId: 'ray', action: 'Distribute the work', explanation: 'Express agent work as Ray tasks or actors across a cluster. Default retries cover worker crashes, not bad model output.' },
      { toolId: 'postgresql', action: 'Collect shared results', explanation: 'Workers write results to PostgreSQL. Pool connections and keep writes idempotent so retried tasks do not duplicate rows.' },
      { toolId: 'opentelemetry', action: 'Trace across workers', explanation: 'Instrument tasks and export to a chosen backend. OpenTelemetry does not store or display telemetry itself.' },
      { toolId: 'vault', action: 'Supply credentials to workers', explanation: 'Each node authenticates to Vault instead of carrying static keys. Every node still needs an auth method configured.' },
    ],
    links: [
      { first: 'ray', second: 'postgresql', kind: 'recipe', note: 'The recipe has workers write shared results to PostgreSQL; connection limits and idempotency are design work.' },
      { first: 'ray', second: 'opentelemetry', kind: 'recipe', note: 'The recipe instruments Ray tasks with OpenTelemetry; check what the Ray version in use supports.' },
      { first: 'ray', second: 'vault', kind: 'recipe', note: 'The recipe has workers fetch credentials from Vault; this is an integration to implement.' },
    ],
  },
}
