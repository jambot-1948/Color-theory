import type { BuildLink, EditionId } from './buildModel'

// Authored maturity paths. Each stage adds (and occasionally removes) parts from the stage before it.
// A branch stage grows from `from` instead of the previous stage, to show a wrong turn.
export interface GrowthStage {
  id: string
  horizon: string
  name: string
  add: string[]
  remove?: string[]
  from?: string
  branch?: boolean
  caution?: boolean
  missing?: string[]
  links?: BuildLink[]
  summary: string
  why: string
  watch: string
}

export interface GrowthTrack {
  edition: EditionId
  title: string
  intro: string
  stages: GrowthStage[]
}

export const growthTracks: Record<EditionId, GrowthTrack> = {
  foundations: {
    edition: 'foundations',
    title: 'An application, from first deploy to owned platform',
    intro: 'Many applications start on a managed platform and earn each foundation as users arrive: login and tests, then the ability to see failures, and only then a platform of their own.',
    stages: [
      {
        id: 'prototype', horizon: 'Week 1', name: 'Ship it',
        add: ['nextjs', 'nodejs', 'postgresql', 'heroku'], missing: ['trust', 'operations'],
        summary: 'A front end, an API, and a database on a managed platform. People can use it.',
        why: 'The quickest way to learn whether anyone wants it is to put it in front of them.',
        watch: 'Anyone can reach every endpoint, and nothing tells you when it breaks.',
      },
      {
        id: 'pilot', horizon: 'Month 1', name: 'Signed in & tested',
        add: ['auth0', 'github-actions'], missing: ['operations'],
        summary: 'Users sign in, and every change runs through tests before it ships.',
        why: 'Real users bring real data, and changes now need a safety net.',
        watch: 'Deploys are safer, but you still hear about failures from users first.',
      },
      {
        id: 'production', horizon: 'Quarter 1', name: 'Watched',
        add: ['opentelemetry', 'pagerduty'],
        summary: 'Services emit traces and metrics through OpenTelemetry, and alerts page an on-call owner through PagerDuty.',
        why: 'Users now notice downtime before the team does.',
        watch: 'Telemetry still needs a backend to store it and raise alerts. Alerts need owners and runbooks, or they turn into noise.',
      },
      {
        id: 'scale', horizon: 'Year 1', name: 'Own the platform',
        add: ['kubernetes', 'argocd', 'terraform'], remove: ['heroku'],
        summary: 'Infrastructure declared in code, and deployments driven from Git.',
        why: 'Enough services and teams that one shared, paved road beats each team’s own setup.',
        watch: 'A platform is a product with its own team. Budget for the people, not just the cluster.',
      },
      {
        id: 'platform-first', horizon: 'Month 1', name: 'Wrong turn: platform before product', from: 'prototype', branch: true, caution: true,
        add: ['kubernetes', 'argocd', 'terraform'], remove: ['heroku'], missing: ['trust', 'operations'],
        summary: 'Kubernetes, GitOps, and Terraform arrive before login, tests, or monitoring.',
        why: 'It looks like the grown-up setup, and the team wants to build it right the first time.',
        watch: 'Weeks go into the platform while the product still has no tests and no way to see failures.',
      },
    ],
  },
  ai: {
    edition: 'ai',
    title: 'An AI assistant, from demo to durable',
    intro: 'Many AI products start as a bright demo. Growing up means adding the tiers the demo skipped, not piling more control parts on top.',
    stages: [
      {
        id: 'prototype', horizon: 'Week 1', name: 'Prototype',
        add: ['vercel', 'supabase', 'openai'], missing: ['logic', 'trust'],
        summary: 'An interface, app services, and a model. It demos well.',
        why: 'The quickest route to something people can click and react to.',
        watch: 'No workflow control and no tracing. The outlines mark where Logic and Trust parts will need to go.',
      },
      {
        id: 'pilot', horizon: 'Month 1', name: 'Pilot',
        add: ['pinecone', 'langgraph'], missing: ['trust'],
        summary: 'Knowledge retrieval and explicit control arrive.',
        why: 'Real users ask about material the model was never trained on, and the agent’s steps need to be explicit.',
        watch: 'Answer quality now depends on retrieval quality. Evaluate it before widening access.',
      },
      {
        id: 'production', horizon: 'Quarter 1', name: 'Production',
        add: ['langsmith', 'guardrails'],
        summary: 'The trust tier: see what the model did, and check what goes in and comes out.',
        why: 'Once decisions depend on the output, the team needs traces to debug and checks on inputs and outputs.',
        watch: 'Decide what is safe to record in traces before volume grows.',
      },
      {
        id: 'scale', horizon: 'Year 1', name: 'Scale',
        add: ['temporal'],
        links: [{ first: 'langgraph', second: 'temporal', kind: 'recipe', note: 'Authored for this stage: LangGraph owns agent state within a run; Temporal owns retries and resumption around it. Temporal’s Python SDK ships an experimental LangGraph plugin that runs graph nodes as Temporal activities.' }],
        summary: 'Durable recovery for work that outlives one request.',
        why: 'Multi-step jobs now run for minutes or hours and must survive restarts.',
        watch: 'Two parts now touch control. It only snaps because the boundary is written down. Keep it that way.',
      },
      {
        id: 'accretion', horizon: 'Month 2', name: 'Wrong turn: accretion', from: 'pilot', branch: true, caution: true, missing: ['trust'],
        add: ['langchain', 'temporal'],
        links: [
          { first: 'langchain', second: 'langgraph', kind: 'tension', note: 'A second agent loop is defined in LangChain outside the LangGraph graph, so two places decide the next step.' },
          { first: 'langchain', second: 'temporal', kind: 'tension', note: 'In this design both layers retry failed steps, and nobody wrote down which one wins.' },
          { first: 'langgraph', second: 'temporal', kind: 'tension', note: 'Nobody separated agent-state control from outer recovery, so both claim retries.' },
        ],
        summary: 'A second agent loop appears outside the graph, and a workflow engine is added with no written boundary.',
        why: 'Each addition seemed useful on its own, so parts were layered on instead of replaced or bounded.',
        watch: 'Three parts now claim the control loop, and nothing yet traces or checks what the agent does. Remove one, or assign boundaries as in Scale.',
      },
    ],
  },
  data: {
    edition: 'data',
    title: 'A warehouse, from first load to governed platform',
    intro: 'Data platforms mature by adding gates, coordination, and governance around the core, and by resisting a second scheduler.',
    stages: [
      {
        id: 'prototype', horizon: 'Week 1', name: 'Load & model',
        add: ['fivetran', 'snowflake', 'dbt'], missing: ['observe'],
        summary: 'Managed ingestion into a warehouse, modelled in SQL.',
        why: 'The quickest route from source systems to tables people can query.',
        watch: 'dbt tests are the only checks. Under dbt build, a failing error-severity test skips downstream models, but the tested model is already built and warn-level tests block nothing.',
      },
      {
        id: 'pilot', horizon: 'Month 1', name: 'Quality gates',
        add: ['great-expectations'], missing: ['orchestrate', 'govern'],
        summary: 'Data must pass checks before it is promoted.',
        why: 'Consumers are starting to build reports on these tables.',
        watch: 'Gates that always pass are not checking the right things.',
      },
      {
        id: 'production', horizon: 'Quarter 1', name: 'Orchestrated',
        add: ['dagster'], missing: ['govern'],
        summary: 'Syncs, dbt runs, and checks become assets with dependencies, lineage, and retries.',
        why: 'Pipelines now depend on each other and failures need to be traced to a source.',
        watch: 'Prefer one orchestrator. A second without a written ownership line is how Pipeline Pileup starts.',
      },
      {
        id: 'scale', horizon: 'Year 1', name: 'Governed & served',
        add: ['datahub', 'cube'],
        summary: 'A catalog for discovery, ownership, and lineage, and a semantic layer so every consumer uses the same metric definitions.',
        why: 'More teams and more consumers need to find, trust, and agree on the same data.',
        watch: 'Access is still enforced in the warehouse, not the catalog. Catalog coverage tends to decay unless each dataset has a named owner.',
      },
      {
        id: 'second-scheduler', horizon: 'Quarter 2', name: 'Wrong turn: second scheduler', from: 'production', branch: true, caution: true,
        add: ['airflow'],
        links: [{ first: 'dagster', second: 'airflow', kind: 'tension', note: 'In this design both orchestrators own overlapping assets and trigger each other, so lineage breaks at the boundary.' }],
        summary: 'A new team arrives with the orchestrator it already knows.',
        why: 'Each scheduler owns “different things”, until they start triggering each other.',
        watch: 'Failures can start anywhere and trace nowhere. Consolidate, or draw a hard ownership line.',
      },
    ],
  },
  harness: {
    edition: 'harness',
    title: 'An agent harness, from wired tools to governed service',
    intro: 'Agents become useful the moment they get tools, and risky at the same moment. Containment, evidence, and permission gates come before scale.',
    stages: [
      {
        id: 'prototype', horizon: 'Week 1', name: 'Tools wired',
        add: ['lambda', 'postgresql', 'mcp'], caution: true, missing: ['sandbox', 'permissions'],
        summary: 'A function, a database, and tools the model can call. It works.',
        why: 'Connecting tools is the quickest way to make an agent useful.',
        watch: 'Tools run with whatever the function’s role can reach. Nothing gates what they change, and nothing records it.',
      },
      {
        id: 'pilot', horizon: 'Month 1', name: 'Contained',
        add: ['e2b', 'langfuse'], missing: ['permissions'],
        summary: 'Model-written code runs in a sandbox, and instrumented runs leave a trace.',
        why: 'The first time the agent runs generated code, it should not run on your hosts.',
        watch: 'Tools can still change real systems with whatever credentials they hold.',
      },
      {
        id: 'production', horizon: 'Quarter 1', name: 'Gated',
        add: ['opa', 'vault'], missing: ['recovery'],
        summary: 'Policy decides which actions are allowed, and credentials are issued rather than embedded.',
        why: 'The agent now touches systems that other teams own.',
        watch: 'Policies cover only the actions someone listed. Review them whenever a tool changes.',
      },
      {
        id: 'scale', horizon: 'Year 1', name: 'Durable',
        add: ['temporal', 'kubernetes'], remove: ['lambda'],
        summary: 'Long runs survive failures, and risky actions can wait for a person to approve them.',
        why: 'Runs now last hours and touch systems other people depend on.',
        watch: 'Retries repeat tool calls. Make those calls safe to repeat before a workflow retries them.',
      },
      {
        id: 'open-scale', horizon: 'Month 1', name: 'Wrong turn: scaled the open door', from: 'prototype', branch: true, caution: true,
        add: ['ray'], missing: ['sandbox', 'permissions', 'evidence'],
        summary: 'Load grows, so the same open tools are handed to many more workers.',
        why: 'More workers looks like the fix for a slow agent.',
        watch: 'Every worker can now run and change whatever the tools allow, and nothing records which one did it.',
      },
    ],
  },
}

export function stageTools(track: GrowthTrack, stageId: string): { ids: string[], added: string[], removed: string[] } {
  const index = track.stages.findIndex(stage => stage.id === stageId)
  const stage = track.stages[index]
  const parent = stage.from ?? (index > 0 && !stage.branch ? previousMain(track, index) : undefined)
  const before = parent ? stageTools(track, parent).ids : []
  const ids = [...before.filter(id => !stage.remove?.includes(id)), ...stage.add.filter(id => !before.includes(id))]
  return { ids, added: stage.add, removed: stage.remove ?? [] }
}

function previousMain(track: GrowthTrack, index: number) {
  for (let i = index - 1; i >= 0; i--) if (!track.stages[i].branch) return track.stages[i].id
  return undefined
}
