import { useState } from 'react'
import { ArrowRight, BrainCircuit, ChevronLeft, ChevronRight, Database, GitBranch } from 'lucide-react'
import { architecturalChromaticsData } from './architectural-chromatics-data'
import { dataEngineeringChromaticsData } from './data-engineering-chromatics-data'
import { agentHarnessChromaticsData } from './agent-harness-chromatics-data'
import './BlendWorkshop.css'
import './WorkshopNavigation.css'
import './FrontDoor.css'
import SiteHeader from './SiteHeader'
import { BrickScene } from './bricks/Brick'
import { slotLinks, slotTools, slotsFromTools } from './bricks/capabilityModel'
import { sceneBricks, withSupport } from './bricks/scene'
import { assemblyStories } from './assemblyStories'
import './bricks/bricks.css'

const build = [
  { name: 'OpenAI', role: 'Cognition', action: 'Begin with a model API', explanation: 'A model reasons and generates, but it does not know your private material. Here OpenAI fills the part; Claude would fit the same brick.', color: '#7557a4', Icon: BrainCircuit },
  { name: 'OpenAI Agents SDK', role: 'Intent', action: 'Add an agent runtime', explanation: 'The runtime owns tool calls and handoffs, making the agent loop explicit. Here the OpenAI Agents SDK fills it.', color: '#b95345', Icon: GitBranch },
  { name: 'Pinecone', role: 'Memory', action: 'Add vector retrieval', explanation: 'An indexed knowledge base answers a tool call. Here Pinecone fills it; the connection and its quality still need to be built and tested.', color: '#c48a45', Icon: Database },
] as const

const heroSlots = slotsFromTools('ai', ['openai', 'openai-agents-sdk', 'pinecone'])
const heroTools = slotTools('ai', architecturalChromaticsData, heroSlots)
const heroLinks = slotLinks('ai', architecturalChromaticsData, heroSlots, assemblyStories['lean-agent-runtime'].links)

function heroBricks(step: number) {
  const tools = heroTools.slice(0, step)
  return withSupport(sceneBricks({ edition: 'ai', data: architecturalChromaticsData, tools, layoutTools: heroTools, links: heroLinks, newIds: [tools[step - 1].id] }))
}

const editions = [
  { name: 'AI systems', href: '#/ai-systems', detail: 'Models, agent runtimes, retrieval, interfaces, and trust.', data: architecturalChromaticsData },
  { name: 'Data engineering', href: '#/data-engineering', detail: 'Ingestion, transformation, storage, serving, and governance.', data: dataEngineeringChromaticsData },
  { name: 'Agent harness', href: '#/agent-harness', detail: 'Execution, state, observability, resilience, and security.', data: agentHarnessChromaticsData },
]

export default function FrontDoor() {
  const [step, setStep] = useState(1)
  const current = build[step - 1]

  return <div className="bw-app fd-app">
    <SiteHeader />
    <main>
      <section className="fd-hero" aria-labelledby="fd-title">
        <div className="fd-hero-inner">
          <div className="fd-intro"><h1 id="fd-title">Stack Assembly</h1><p>Capabilities are the bricks. Products fill them. Some combinations snap together; some only look built.</p><a className="fd-primary" href="?blend=openai,openai-agents-sdk,pinecone#/ai-systems">Explore the example <ArrowRight size={17} /></a></div>
          <div className="fd-iso" aria-hidden="true">
            <BrickScene bricks={heroBricks(step)} plate={{ w: 12, d: 6 }} unit={20} maxTier={4} frame="tall" showBadges="new" label={`Step ${step} of 3: ${build.slice(0, step).map(part => part.name).join(', ')}`} />
          </div>
          <div className="fd-sequence"><div className="fd-sequence-copy" aria-live="polite"><span>STEP {String(step).padStart(2, '0')} / 03</span><h2>{current.action}</h2><p>{current.explanation}</p></div><div className="fd-sequence-controls"><button type="button" onClick={() => setStep(value => Math.max(1, value - 1))} disabled={step === 1} aria-label="Previous step"><ChevronLeft size={18} /></button><div className="fd-step-tabs" role="tablist" aria-label="Example assembly step">{build.map((part, index) => <button key={part.name} type="button" role="tab" aria-selected={step === index + 1} aria-label={`Step ${index + 1}: ${part.action}`} onClick={() => setStep(index + 1)} className={step === index + 1 ? 'active' : ''}>{String(index + 1).padStart(2, '0')}</button>)}</div><button type="button" onClick={() => setStep(value => Math.min(3, value + 1))} disabled={step === 3} aria-label="Next step"><ChevronRight size={18} /></button></div></div>
        </div>
      </section>

      <section className="fd-principles" aria-labelledby="fd-principles-title"><div className="fd-section-inner"><div className="fd-section-heading"><h2 id="fd-principles-title">How to read a model</h2><p>A useful stack is more than a pile of tools. Each brick has a job, and each join has a reason.</p></div><div className="fd-definitions">
        <div><span>01</span><h3>Brick</h3><p>A capability, such as a model API or a vector store. Colour is its role; height is its tier. The printed label is the product that fills it.</p></div>
        <div><span>02</span><h3>Snap</h3><p>The brick locks onto an earlier part because a pairing or curated recipe is recorded.</p></div>
        <div><span>03</span><h3>Loose</h3><p>It sits on the model, but nothing recorded says it locks. Not wrong, just unproven.</p></div>
        <div><span>04</span><h3>Forced</h3><p>Pushed off its studs by a recorded tension, usually two parts claiming the same job.</p></div>
        <div><span>05</span><h3>Outline</h3><p>A dashed brick is a part the model is missing. A hanging brick has nothing underneath it yet.</p></div>
      </div><p className="fd-boundary">Stacking shows relationships and tiers. It is not runtime wiring or data flow. <a href="#/growth">See how models grow over time</a>.</p></div></section>

      <section className="fd-editions" aria-labelledby="fd-editions-title"><div className="fd-section-inner"><div className="fd-section-heading"><h2 id="fd-editions-title">Choose a system</h2><p>Explore a curated assembly, then change the parts to test your own combination.</p></div><div className="fd-edition-list">{editions.map(edition => <a key={edition.name} href={edition.href}><span className="fd-edition-name">{edition.name}</span><span className="fd-edition-detail">{edition.detail}</span><span className="fd-edition-count">{edition.data.tools.length} parts · {edition.data.recipes.length} examples</span><ArrowRight size={19} /></a>)}</div></div></section>
    </main>
  </div>
}
