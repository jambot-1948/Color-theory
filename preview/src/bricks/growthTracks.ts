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
  ai: {
    edition: 'ai',
    title: 'An AI assistant, from demo to durable',
    intro: 'Most AI products start as a bright demo. Growing up means adding the tiers the demo skipped, not piling more control parts on top.',
    stages: [
      {
        id: 'prototype', horizon: 'Week 1', name: 'Prototype',
        add: ['vercel', 'supabase', 'openai'], missing: ['logic', 'trust'],
        summary: 'An interface, app services, and a model. It demos well.',
        why: 'The quickest route to something people can click and react to.',
        watch: 'No workflow control and no tracing. The outlines mark where Control and Trust parts will need to go.',
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
        summary: 'The trust tier: see what the model did and constrain what it may do.',
        why: 'Once decisions depend on the output, the team needs traces to debug and checks on inputs and outputs.',
        watch: 'Decide what is safe to record in traces before volume grows.',
      },
      {
        id: 'scale', horizon: 'Year 1', name: 'Scale',
        add: ['temporal'],
        links: [{ first: 'langgraph', second: 'temporal', kind: 'recipe', note: 'Authored for this stage: LangGraph owns agent state within a run; Temporal owns retries and resumption around it. Temporal documents a LangGraph integration for this split.' }],
        summary: 'Durable recovery for work that outlives one request.',
        why: 'Multi-step jobs now run for minutes or hours and must survive restarts.',
        watch: 'Two parts now touch control. It only snaps because the boundary is written down. Keep it that way.',
      },
      {
        id: 'accretion', horizon: 'Month 2', name: 'Wrong turn: accretion', from: 'pilot', branch: true, caution: true,
        add: ['langchain', 'temporal'],
        links: [
          { first: 'langchain', second: 'langgraph', kind: 'tension', note: 'A second agent loop is defined in LangChain outside the LangGraph graph, so two places decide the next step.' },
          { first: 'langchain', second: 'temporal', kind: 'tension', note: 'In this design both layers retry failed steps, and nobody wrote down which one wins.' },
          { first: 'langgraph', second: 'temporal', kind: 'tension', note: 'Nobody separated agent-state control from outer recovery, so both claim retries.' },
        ],
        summary: 'A second agent loop appears outside the graph, and a workflow engine is added with no written boundary.',
        why: 'Each addition seemed useful on its own, so parts were layered on instead of replaced or bounded.',
        watch: 'Three parts now claim the control loop and the oversight tier is still empty. Remove one, or assign boundaries as in Scale.',
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
        watch: 'Only model-level dbt tests, if any. Nothing blocks bad rows from being promoted.',
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
        summary: 'Scheduled scripts become assets with lineage and retries.',
        why: 'Pipelines now depend on each other and failures need to be traced to a source.',
        watch: 'Keep one orchestrator. A second is how Pipeline Pileup starts.',
      },
      {
        id: 'scale', horizon: 'Year 1', name: 'Governed & served',
        add: ['datahub', 'cube'],
        summary: 'A catalog for discovery, ownership, and lineage, and a semantic layer so every consumer uses the same metric definitions.',
        why: 'More teams and more consumers need to find, trust, and agree on the same data.',
        watch: 'Access is still enforced in the warehouse, not the catalog. Coverage decays unless every dataset has a named owner.',
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
    title: 'An agent harness, from script to hardened service',
    intro: 'Agent infrastructure usually starts silent. Visibility and recovery come before scale, or scale multiplies the silence.',
    stages: [
      {
        id: 'prototype', horizon: 'Week 1', name: 'It runs',
        add: ['lambda', 'postgresql'], caution: true, missing: ['observability'],
        summary: 'Functions and a database. The agent does its job.',
        why: 'A quick way to get an agent doing scheduled work.',
        watch: 'Nothing records what it did. Users will find the failures first.',
      },
      {
        id: 'pilot', horizon: 'Month 1', name: 'Visible',
        add: ['langfuse'], missing: ['resilience'],
        summary: 'Every run leaves a trace.',
        why: 'Before anyone depends on it, the team needs to see what each run did.',
        watch: 'A failure mid-batch still means a manual restart.',
      },
      {
        id: 'production', horizon: 'Quarter 1', name: 'Recoverable',
        add: ['temporal'],
        summary: 'Retries and resumable workflows replace manual restarts.',
        why: 'Jobs now have several steps, and partial failure is normal.',
        watch: 'Temporal workers need a home: long-running containers, or serverless workers where supported. Each function invocation is still time-limited.',
      },
      {
        id: 'scale', horizon: 'Year 1', name: 'Hardened',
        add: ['docker', 'kubernetes', 'opentelemetry', 'vault'], remove: ['lambda'],
        summary: 'Container images on long-running workers, standard telemetry, managed secrets.',
        why: 'Volume, security review, and on-call all arrive together.',
        watch: 'Operating Kubernetes is a job in itself. Budget for it.',
      },
      {
        id: 'dark-scale', horizon: 'Month 1', name: 'Wrong turn: scaled in the dark', from: 'prototype', branch: true, caution: true,
        add: ['ray'], missing: ['observability', 'resilience'],
        summary: 'Load grows, so the work is distributed before anyone can see or recover it.',
        why: 'More workers looks like the fix for a slow agent.',
        watch: 'No traces, and Ray’s default task retries cover worker crashes, not bad model output or half-written rows. One bad run now repeats across the fleet.',
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
