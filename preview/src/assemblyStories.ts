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
      { toolId: 'supabase', action: 'Add app services', explanation: 'Supabase adds Postgres, auth, and storage without a dedicated backend build. Its pgvector extension could hold embeddings later.' },
      { toolId: 'openai', action: 'Add model capability', explanation: 'The model adds reasoning or generation to the prototype. Retrieval design, governance, and workflow control remain outside this recipe.' },
    ],
    links: [
      { first: 'streamlit', second: 'supabase', kind: 'fit', note: 'The practitioner interface and backend platform are a curated pairing.' },
      { first: 'streamlit', second: 'openai', kind: 'fit', note: 'The practitioner interface and model are a curated pairing.' },
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
      { first: 'temporal', second: 'pinecone', kind: 'recipe', note: 'No product integration: retrieval calls run as ordinary workflow steps that the application implements.' },
      { first: 'claude', second: 'guardrails', kind: 'fit', note: 'The model and validation layer are a curated pairing.' },
      { first: 'claude', second: 'langsmith', kind: 'fit', note: 'The model and tracing layer are a curated pairing.' },
      { first: 'temporal', second: 'guardrails', kind: 'recipe', note: 'No product integration: validation runs inside workflow steps, and the application decides what a failed check does.' },
    ],
  },
  'reflective-ai-system': {
    recipeId: 'reflective-ai-system',
    steps: [
      { toolId: 'claude', action: 'Establish the model core', explanation: 'Start with the model responsible for structured language work.' },
      { toolId: 'langchain', action: 'Structure the interaction', explanation: 'Add prompt and workflow scaffolding around the model through the LangChain Anthropic integration.' },
      { toolId: 'langsmith', action: 'Expose the feedback loop', explanation: 'Tracing makes behavior legible. Evaluation datasets, criteria, and the owner of feedback still need to be defined.' },
    ],
    links: [
      { first: 'claude', second: 'langchain', kind: 'fit', note: 'The model and scaffolding are a curated pairing.' },
      { first: 'langchain', second: 'langsmith', kind: 'fit', note: 'The scaffolding and tracing layer are a curated pairing.' },
      { first: 'claude', second: 'langsmith', kind: 'fit', note: 'The model and tracing layer are a curated pairing.' },
    ],
  },
  'muddy-agent-recipe': {
    recipeId: 'muddy-agent-recipe',
    steps: [
      { toolId: 'langchain', action: 'Begin with an agent loop', explanation: 'A LangChain agent gets the team moving quickly. It already runs its own tool-calling loop.' },
      { toolId: 'langgraph', action: 'Add a graph beside it', explanation: 'A LangGraph graph adds explicit state, but the earlier agent loop stays outside it. LangChain agents are built on LangGraph, so the loop could have been a node in this graph instead.' },
      { toolId: 'temporal', action: 'Introduce competing control', explanation: 'This cautionary recipe adds Temporal retries without deciding which layer owns them. Temporal ships an experimental LangGraph plugin; the products can coexist when their responsibilities are separated.' },
      { toolId: 'openai', action: 'Add cognition to the overlap', explanation: 'Model capability does not resolve the control conflict, and nothing traces the overlapping loops. The recipe recommends one agent loop, clear boundaries, and tracing.' },
    ],
    links: [
      { first: 'langchain', second: 'langgraph', kind: 'tension', note: 'In this design the LangChain agent loop runs beside the graph instead of inside it, so two loops hold state.' },
      { first: 'langchain', second: 'temporal', kind: 'tension', note: 'In this cautionary recipe, the outside agent loop and Temporal both retry the same work.' },
      { first: 'langgraph', second: 'temporal', kind: 'tension', note: 'The products integrate, but here nobody separated agent-state control from outer workflow recovery.' },
      { first: 'langchain', second: 'openai', kind: 'fit', note: 'The framework and model are a curated pairing; this does not settle the control conflict.' },
    ],
  },
}
