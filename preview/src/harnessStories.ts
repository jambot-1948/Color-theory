import type { AssemblyStory } from './assemblyStories'

// Authored step stories for the agent-harness recipes. Steps follow each recipe's tool order.
// 'fit' links are pairs recorded in pairsWellWith; 'recipe' links describe how this recipe combines two parts,
// which is an integration to design, not an automatic connection. 'tension' links appear only in cautionary recipes.
export const harnessStories: Record<string, AssemblyStory> = {
  'silent-worker': {
    recipeId: 'silent-worker',
    steps: [
      { toolId: 'lambda', action: 'Ship the function', explanation: 'The agent runs on a trigger, and nothing records what each run did.' },
      { toolId: 'postgresql', action: 'Store only outputs', explanation: 'Results land in a table, which shows what came out but not which calls produced it.' },
      { toolId: 'mcp', action: 'Wire in tools', explanation: 'MCP servers give the agent real actions, but no check or approval sits between the model and those calls.' },
    ],
    links: [
      { first: 'lambda', second: 'postgresql', kind: 'fit', note: 'The pairing itself is sound. The caution comes from what this design leaves out, not from the two parts.' },
      { first: 'lambda', second: 'mcp', kind: 'recipe', note: 'The function connects to MCP servers with the credentials it holds, so its execution role and API keys are the only permission boundary.' },
    ],
  },
  'sandboxed-coder': {
    recipeId: 'sandboxed-coder',
    steps: [
      { toolId: 'mcp', action: 'Define the tools', explanation: 'Expose code execution and file access as MCP tools, so the agent calls a defined set rather than ad hoc functions.' },
      { toolId: 'e2b', action: 'Run code in a sandbox', explanation: 'Execute model-written code in an E2B microVM. Decide what network access and credentials the sandbox gets.' },
      { toolId: 'langfuse', action: 'Trace each attempt', explanation: 'Record every write-run-retry step, including tool calls, so failures can be traced to a specific attempt.' },
      { toolId: 'postgresql', action: 'Keep session history', explanation: 'Store results and decisions so a later session can read them back. Decide what expires.' },
    ],
    links: [
      { first: 'mcp', second: 'e2b', kind: 'fit', note: 'The E2B SDK can start an MCP gateway inside a sandbox.' },
      { first: 'mcp', second: 'langfuse', kind: 'fit', note: 'Langfuse documents linking MCP client and server traces through trace context in the _meta field.' },
      { first: 'e2b', second: 'langfuse', kind: 'recipe', note: 'The recipe traces sandbox runs from the agent code; that instrumentation is application work.' },
      { first: 'mcp', second: 'postgresql', kind: 'recipe', note: 'The recipe stores tool results and session history in PostgreSQL; the schema and read-back are application work.' },
    ],
  },
  'governed-operator': {
    recipeId: 'governed-operator',
    steps: [
      { toolId: 'kubernetes', action: 'Provide the runtime', explanation: 'Run Temporal workers and MCP servers as long-lived pods. Kubernetes restarts containers but does not judge agent actions.' },
      { toolId: 'mcp', action: 'Expose the actions', explanation: 'Each business action becomes an MCP tool with a narrow, documented input.' },
      { toolId: 'opa', action: 'Check each call', explanation: 'Before a tool runs, the harness asks OPA whether this user may call it with these arguments. OPA decides; the harness must enforce.' },
      { toolId: 'vault', action: 'Scope the credentials', explanation: 'Tools fetch short-lived credentials from Vault instead of sharing one broad key. Vault adds its own operating load.' },
      { toolId: 'temporal', action: 'Wait for approval', explanation: 'When policy requires review, the workflow blocks on a Signal carrying the approver\'s decision, with a timeout for no answer.' },
      { toolId: 'langfuse', action: 'Record what happened', explanation: 'Trace tool calls and attach the policy and approval outcome, so the audit trail shows why an action ran.' },
    ],
    links: [
      { first: 'kubernetes', second: 'temporal', kind: 'fit', note: 'Temporal publishes a Helm chart for Kubernetes, and its workers can run as long-lived pods.' },
      { first: 'kubernetes', second: 'opa', kind: 'fit', note: 'OPA documents Kubernetes admission control. That governs cluster objects, not the agent\'s tool calls.' },
      { first: 'kubernetes', second: 'vault', kind: 'fit', note: 'The Vault Secrets Operator syncs Vault secrets into Kubernetes Secrets.' },
      { first: 'mcp', second: 'opa', kind: 'recipe', note: 'The recipe checks each MCP tool call against OPA. Neither product does this for the other; the harness must route every call through the check.' },
      { first: 'mcp', second: 'vault', kind: 'recipe', note: 'The recipe has MCP servers fetch scoped credentials from Vault; each server needs an auth method configured.' },
      { first: 'opa', second: 'temporal', kind: 'recipe', note: 'The recipe turns a needs-approval decision into a workflow that waits on a Signal; the mapping is harness code.' },
      { first: 'mcp', second: 'temporal', kind: 'fit', note: 'Temporal documents running MCP operations as Activities in its OpenAI Agents SDK integration; its durability does not extend to the MCP servers themselves.' },
      { first: 'temporal', second: 'langfuse', kind: 'fit', note: 'Langfuse documents tracing Temporal workflows through OpenTelemetry.' },
      { first: 'mcp', second: 'langfuse', kind: 'fit', note: 'Langfuse documents linking MCP client and server traces.' },
    ],
  },
  'evaluated-release': {
    recipeId: 'evaluated-release',
    steps: [
      { toolId: 'litellm', action: 'Put models behind a gateway', explanation: 'Route model calls through LiteLLM with fallbacks, budgets, and rate limits. A fallback model is a behaviour change too.' },
      { toolId: 'langfuse', action: 'Trace production calls', explanation: 'Log calls routed through the gateway, with cost and latency, and manage prompts in one place.' },
      { toolId: 'promptfoo', action: 'Gate the release', explanation: 'Run candidate prompts and models, including fallbacks, against test cases in CI and fail the build below threshold.' },
      { toolId: 'postgresql', action: 'Back the gateway', explanation: 'The LiteLLM proxy keeps virtual keys and spend records in PostgreSQL. Keep that database separate from agent context.' },
    ],
    links: [
      { first: 'litellm', second: 'langfuse', kind: 'fit', note: 'Langfuse documents logging every call routed through the LiteLLM proxy.' },
      { first: 'litellm', second: 'promptfoo', kind: 'fit', note: 'Promptfoo documents a LiteLLM provider, so evals can run through the same gateway.' },
      { first: 'promptfoo', second: 'langfuse', kind: 'fit', note: 'Promptfoo and Langfuse both document using Langfuse-managed prompts in Promptfoo evals.' },
      { first: 'litellm', second: 'postgresql', kind: 'fit', note: 'The LiteLLM proxy uses PostgreSQL for keys and spend tracking.' },
    ],
  },
  'bulletproof-pipeline': {
    recipeId: 'bulletproof-pipeline',
    steps: [
      { toolId: 'kubernetes', action: 'Provide the runtime', explanation: 'Run agent workers as long-lived pods. Kubernetes restarts failed containers, but availability still depends on cluster and application design.' },
      { toolId: 'postgresql', action: 'Hold durable context', explanation: 'Store agent context in PostgreSQL. A self-hosted Temporal service can use a separate PostgreSQL database for its own persistence.' },
      { toolId: 'temporal', action: 'Make work recoverable', explanation: 'Workflows resume after failures, with activity retries and timeouts set explicitly in code.' },
      { toolId: 'langfuse', action: 'See model behaviour', explanation: 'Trace prompts, tool calls, and cost per run.' },
      { toolId: 'opentelemetry', action: 'Standardise telemetry', explanation: 'Emit traces and metrics over OTLP. Langfuse can receive OTLP traces, so one pipeline can feed both, if the team chooses.' },
      { toolId: 'vault', action: 'Manage secrets', explanation: 'Issue short-lived credentials and audit their use. Vault adds its own operating load.' },
      { toolId: 'litellm', action: 'Bound model calls', explanation: 'Add fallbacks, budgets, and rate limits in front of providers. Decide whether Temporal or LiteLLM owns model-call retries.' },
    ],
    links: [
      { first: 'kubernetes', second: 'temporal', kind: 'fit', note: 'Temporal publishes a Helm chart for Kubernetes, and its workers can run as long-lived pods.' },
      { first: 'temporal', second: 'postgresql', kind: 'fit', note: 'PostgreSQL is a supported Temporal persistence store; agent context and Temporal state should stay separate.' },
      { first: 'temporal', second: 'langfuse', kind: 'fit', note: 'Langfuse documents tracing Temporal workflows through OpenTelemetry.' },
      { first: 'langfuse', second: 'opentelemetry', kind: 'fit', note: 'Langfuse accepts traces on a native OpenTelemetry endpoint.' },
      { first: 'vault', second: 'postgresql', kind: 'fit', note: 'Vault\'s database secrets engine can generate PostgreSQL credentials.' },
      { first: 'vault', second: 'kubernetes', kind: 'fit', note: 'The Vault Secrets Operator syncs Vault secrets into Kubernetes Secrets.' },
      { first: 'litellm', second: 'langfuse', kind: 'fit', note: 'Langfuse documents logging every call routed through the LiteLLM proxy.' },
      { first: 'litellm', second: 'postgresql', kind: 'fit', note: 'The LiteLLM proxy uses PostgreSQL for keys and spend tracking, in its own database.' },
      { first: 'temporal', second: 'litellm', kind: 'recipe', note: 'The recipe has Temporal activities call models through the gateway. Both can retry, so assign retries to one layer.' },
    ],
  },
  'local-agent': {
    recipeId: 'local-agent',
    steps: [
      { toolId: 'local-machine', action: 'Provide the machine', explanation: 'A dedicated machine on-site runs the agent under its own account. Anything that machine can reach on the network, the agent\'s tools can reach.' },
      { toolId: 'mcp', action: 'Connect local tools', explanation: 'stdio MCP servers start as subprocesses on the same machine and take credentials from the environment. Nothing yet decides which calls are allowed.' },
      { toolId: 'docker', action: 'Run the services', explanation: 'Run PostgreSQL and Langfuse in containers. Containers share one kernel (on macOS, Docker Desktop\'s Linux VM), so a plain container is not a sandbox for model-written code.' },
      { toolId: 'postgresql', action: 'Keep session history', explanation: 'Store results and decisions so the next run can read them back, and back the database up off the machine.' },
      { toolId: 'langfuse', action: 'Trace each run', explanation: 'Self-hosted Langfuse records model and MCP tool calls on-site, so unattended runs leave a record someone can review.' },
    ],
    links: [
      { first: 'local-machine', second: 'mcp', kind: 'fit', note: 'The MCP stdio transport has the client launch each server as a local subprocess.' },
      { first: 'local-machine', second: 'docker', kind: 'fit', note: 'Docker runs on the machine; on macOS the documented install is Docker Desktop, with its own licence terms.' },
      { first: 'mcp', second: 'docker', kind: 'recipe', note: 'The recipe runs supporting services in containers; whether MCP servers also run in containers is a choice, and a plain container is not a sandbox for untrusted code.' },
      { first: 'docker', second: 'postgresql', kind: 'recipe', note: 'The recipe runs PostgreSQL from a container image; its data volume is what needs backing up.' },
      { first: 'mcp', second: 'postgresql', kind: 'recipe', note: 'The recipe stores tool results and session history in PostgreSQL; the schema and read-back are application work.' },
      { first: 'mcp', second: 'langfuse', kind: 'fit', note: 'Langfuse documents linking MCP client and server traces.' },
      { first: 'docker', second: 'langfuse', kind: 'fit', note: 'Langfuse publishes a Docker Compose setup for running it on one machine or VM.' },
      { first: 'postgresql', second: 'langfuse', kind: 'fit', note: 'Self-hosted Langfuse uses PostgreSQL for its own data; keep that database separate from agent context.' },
    ],
  },
  'open-door-agent': {
    recipeId: 'open-door-agent',
    steps: [
      { toolId: 'mcp', action: 'Connect every server', explanation: 'Many MCP servers are connected at once, and every session can reach all of them.' },
      { toolId: 'redis', action: 'Keep sessions fast', explanation: 'Session context sits in Redis for quick reads. That part is sound; its persistence setting still needs choosing.' },
      { toolId: 'modal', action: 'Run code in-process', explanation: 'Model-written code runs inside the agent\'s own Modal Function, with its secrets in reach, although Modal offers separate Sandboxes.' },
    ],
    links: [
      { first: 'mcp', second: 'redis', kind: 'recipe', note: 'The recipe keeps tool results in the Redis session; nothing in it limits which tools a session may call.' },
      { first: 'modal', second: 'redis', kind: 'recipe', note: 'The recipe has the Modal Function read and write session context in Redis; that connection is application code.' },
      { first: 'mcp', second: 'modal', kind: 'tension', note: 'In this design broad tool access and in-process code execution share one container and its credentials, so one bad completion can reach both.' },
    ],
  },
}
