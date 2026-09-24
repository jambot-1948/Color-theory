export type AssemblyLinkKind = 'fit' | 'recipe' | 'tension'

export interface AssemblyStep {
  toolId: string
  action: string
  explanation: string
}

export interface AssemblyLink {
  first: string
  second: string
  kind: AssemblyLinkKind
  note: string
}

export interface AssemblyStory {
  recipeId: string
  steps: AssemblyStep[]
  links: AssemblyLink[]
}

export const assemblyStories: Record<string, AssemblyStory> = {
  'lean-agent-runtime': {
    recipeId: 'lean-agent-runtime',
    steps: [
      { toolId: 'openai', action: 'Choose model capability', explanation: 'Start with a model suited to the task; the model alone does not own tools or conversation state.' },
      { toolId: 'openai-agents-sdk', action: 'Add the agent runtime', explanation: 'Let the SDK run the tool loop and handoffs. Its built-in tracing and guardrails should be evaluated before adding separate layers.' },
      { toolId: 'pinecone', action: 'Add knowledge retrieval', explanation: 'Expose retrieval through a tool the agent can call. The index needs current, relevant source data and evaluation.' },
    ],
    links: [
      { first: 'openai', second: 'openai-agents-sdk', kind: 'fit', note: 'The SDK uses OpenAI models through the Responses API by default.' },
      { first: 'openai-agents-sdk', second: 'pinecone', kind: 'recipe', note: 'The recipe adds a retrieval tool; this is an integration to implement, not an automatic SDK connection.' },
    ],
  },
  'bright-demo-recipe': {
    recipeId: 'bright-demo-recipe',
    steps: [
      { toolId: 'vercel', action: 'Make the interface', explanation: 'Start with the product-facing surface. The recipe is meant to get a usable experience in front of people quickly.' },
      { toolId: 'supabase', action: 'Add app services', explanation: 'Add the backend services that support the interface without building that infrastructure from scratch.' },
      { toolId: 'openai', action: 'Add model capability', explanation: 'The model supplies generation and reasoning. The result is demo-ready, with tracing and workflow control still to be addressed.' },
    ],
    links: [
      { first: 'vercel', second: 'supabase', kind: 'fit', note: 'The interface and backend platform are a curated pairing.' },
      { first: 'vercel', second: 'openai', kind: 'fit', note: 'The product surface and model are a curated pairing.' },
    ],
  },
  'data-prototype-recipe': {
    recipeId: 'data-prototype-recipe',
    steps: [
      { toolId: 'streamlit', action: 'Start with a practitioner UI', explanation: 'Streamlit puts a Python-facing interface in front of technical users for fast feedback.' },
      { toolId: 'supabase', action: 'Add app services', explanation: 'Supabase adds storage and application services without a dedicated backend build.' },
      { toolId: 'openai', action: 'Add model capability', explanation: 'The model adds reasoning or generation to the prototype. Memory, governance, and workflow control remain outside this recipe.' },
    ],
    links: [
      { first: 'streamlit', second: 'supabase', kind: 'fit', note: 'The practitioner interface and backend platform are a curated pairing.' },
      { first: 'streamlit', second: 'openai', kind: 'recipe', note: 'The recipe combines a Python-facing UI with model capability.' },
    ],
  },
  'internal-knowledge-agent': {
    recipeId: 'internal-knowledge-agent',
    steps: [
      { toolId: 'openai', action: 'Establish cognition', explanation: 'Begin with the model that reasons over the question and produces a response.' },
      { toolId: 'pinecone', action: 'Add retrieval memory', explanation: 'Pair the model with a retrieval store. The value depends on the quality of the source material and retrieval design.' },
      { toolId: 'langchain', action: 'Scaffold the interaction', explanation: 'Add prompt and tool scaffolding around the model and retrieval layer.' },
      { toolId: 'langgraph', action: 'Make control explicit', explanation: 'Add stateful workflow control. Keep its responsibility distinct from the scaffolding already present.' },
      { toolId: 'langsmith', action: 'Expose behavior', explanation: 'Add tracing so the team can inspect the model and workflow behavior as the system grows.' },
    ],
    links: [
      { first: 'openai', second: 'pinecone', kind: 'fit', note: 'The model and retrieval store are a curated pairing.' },
      { first: 'openai', second: 'langchain', kind: 'fit', note: 'The model and interaction scaffolding are a curated pairing.' },
      { first: 'langchain', second: 'langgraph', kind: 'fit', note: 'Scaffolding and stateful control are a curated pairing; their boundaries still need ownership.' },
      { first: 'langgraph', second: 'langsmith', kind: 'fit', note: 'The workflow and tracing layer are a curated pairing.' },
      { first: 'openai', second: 'langsmith', kind: 'fit', note: 'The model and tracing layer are a curated pairing.' },
    ],
  },
  'enterprise-ai-workflow': {
    recipeId: 'enterprise-ai-workflow',
    steps: [
      { toolId: 'temporal', action: 'Start with durable control', explanation: 'Place long-running work and recovery under a durable workflow layer.' },
      { toolId: 'claude', action: 'Add cognition', explanation: 'The model handles reasoning and language work inside the production workflow.' },
      { toolId: 'pinecone', action: 'Add retrieval memory', explanation: 'Introduce a retrieval store when the workflow needs context from a body of knowledge.' },
      { toolId: 'guardrails', action: 'Constrain model boundaries', explanation: 'Add validation and policy checks around model inputs or outputs.' },
      { toolId: 'langsmith', action: 'Make behavior inspectable', explanation: 'Tracing helps the team inspect what the model saw and did. This remains a higher-cost system to operate.' },
    ],
    links: [
      { first: 'temporal', second: 'claude', kind: 'fit', note: 'Durable workflow control and model capability are a curated pairing.' },
      { first: 'temporal', second: 'pinecone', kind: 'fit', note: 'The workflow and retrieval store are a curated pairing.' },
      { first: 'claude', second: 'guardrails', kind: 'fit', note: 'The model and validation layer are a curated pairing.' },
      { first: 'claude', second: 'langsmith', kind: 'fit', note: 'The model and tracing layer are a curated pairing.' },
      { first: 'temporal', second: 'guardrails', kind: 'fit', note: 'The workflow and governance layer are a curated pairing.' },
    ],
  },
  'reflective-ai-system': {
    recipeId: 'reflective-ai-system',
    steps: [
      { toolId: 'claude', action: 'Establish the model core', explanation: 'Start with the model responsible for structured language work.' },
      { toolId: 'langchain', action: 'Structure the interaction', explanation: 'Add prompt and workflow scaffolding around the model. The recipe names this combination, although the tool pair is not separately listed as a curated fit.' },
      { toolId: 'langsmith', action: 'Expose the feedback loop', explanation: 'Tracing makes behavior legible. Evaluation criteria and the owner of feedback still need to be defined.' },
    ],
    links: [
      { first: 'claude', second: 'langchain', kind: 'recipe', note: 'The recipe explicitly combines model output with LangChain scaffolding.' },
      { first: 'langchain', second: 'langsmith', kind: 'fit', note: 'The scaffolding and tracing layer are a curated pairing.' },
      { first: 'claude', second: 'langsmith', kind: 'fit', note: 'The model and tracing layer are a curated pairing.' },
    ],
  },
  'muddy-agent-recipe': {
    recipeId: 'muddy-agent-recipe',
    steps: [
      { toolId: 'langchain', action: 'Begin with scaffolding', explanation: 'A framework helps the team move quickly, but it already carries some orchestration responsibility.' },
      { toolId: 'langgraph', action: 'Add stateful control', explanation: 'A graph adds explicit workflow state. Name the boundary between this control layer and the framework scaffolding.' },
      { toolId: 'temporal', action: 'Introduce competing control', explanation: 'This cautionary recipe gives Temporal the same control responsibility as the agent framework. The products can coexist when their responsibilities are separated.' },
      { toolId: 'openai', action: 'Add cognition to the overlap', explanation: 'Model capability does not resolve the control conflict. The recipe recommends removing duplicate orchestration or assigning clear boundaries.' },
    ],
    links: [
      { first: 'langchain', second: 'langgraph', kind: 'fit', note: 'The framework and graph are a curated pairing when their responsibilities are distinct.' },
      { first: 'langchain', second: 'temporal', kind: 'tension', note: 'In this cautionary recipe, both layers try to own the same control loop.' },
      { first: 'langgraph', second: 'temporal', kind: 'tension', note: 'Separate agent-state control from outer workflow recovery to avoid this recipe-level overlap.' },
      { first: 'langchain', second: 'openai', kind: 'fit', note: 'The framework and model are a curated pairing; this does not settle the control conflict.' },
    ],
  },
}
