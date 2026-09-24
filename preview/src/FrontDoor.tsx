import { useState } from 'react'
import { ArrowRight, BrainCircuit, ChevronLeft, ChevronRight, Database, GitBranch } from 'lucide-react'
import { architecturalChromaticsData } from './architectural-chromatics-data'
import { dataEngineeringChromaticsData } from './data-engineering-chromatics-data'
import { agentHarnessChromaticsData } from './agent-harness-chromatics-data'
import './BlendWorkshop.css'
import './WorkshopNavigation.css'
import './FrontDoor.css'

const build = [
  { name: 'OpenAI', role: 'Cognition', action: 'Begin with a model', explanation: 'The model can reason and generate, but it does not know your private source material.', color: '#7557a4', Icon: BrainCircuit },
  { name: 'OpenAI Agents SDK', role: 'Intent', action: 'Give it a runtime', explanation: 'The runtime owns tool calls and handoffs. It makes the agent loop explicit.', color: '#b95345', Icon: GitBranch },
  { name: 'Pinecone', role: 'Memory', action: 'Add knowledge retrieval', explanation: 'An indexed knowledge base can answer a tool call. The connection and its quality still need to be built and tested.', color: '#c48a45', Icon: Database },
] as const

const editions = [
  { name: 'AI systems', href: '#/ai-systems', detail: 'Models, agent runtimes, retrieval, interfaces, and trust.', data: architecturalChromaticsData },
  { name: 'Data engineering', href: '#/data-engineering', detail: 'Ingestion, transformation, storage, serving, and governance.', data: dataEngineeringChromaticsData },
  { name: 'Agent harness', href: '#/agent-harness', detail: 'Execution, state, observability, resilience, and security.', data: agentHarnessChromaticsData },
]

export default function FrontDoor() {
  const [step, setStep] = useState(1)
  const current = build[step - 1]

  return <div className="bw-app fd-app">
    <header className="bw-header"><a className="bw-brand" href="#/"><span className="bw-mark"><i /><i /><i /></span>Stack Assembly</a><nav aria-label="Main navigation"><a href="#/ai-systems">AI systems</a><a href="#/data-engineering">Data engineering</a><a href="#/agent-harness">Agent harness</a><a href="#/reference">Reference</a></nav></header>
    <main>
      <section className="fd-hero" aria-labelledby="fd-title">
        <div className="fd-hero-inner">
          <div className="fd-intro"><h1 id="fd-title">Stack Assembly</h1><p>Understand a combination, one part at a time.</p><a className="fd-primary" href="?blend=openai,openai-agents-sdk,pinecone#/ai-systems">Explore the example <ArrowRight size={17} /></a></div>
          <div className="fd-scene" role="img" aria-label={`Step ${step} of 3: ${build.slice(0, step).map(part => part.name).join(', ')}`}>
            <span className="fd-scene-rule fd-rule-one" aria-hidden="true" /><span className="fd-scene-rule fd-rule-two" aria-hidden="true" />
            {build.map((part, index) => <div key={part.name} className={`fd-part fd-part-${index + 1}${index + 1 === step ? ' is-current' : ''}${index + 1 > step ? ' is-future' : ''}`} aria-hidden="true">
              <span className="fd-part-index">{String(index + 1).padStart(2, '0')}</span><span className="fd-part-face" style={{ borderColor: part.color }}><part.Icon size={29} strokeWidth={1.8} color={part.color} /><span><strong>{part.name}</strong><small>{part.role}</small></span></span>
            </div>)}
          </div>
          <div className="fd-sequence"><div className="fd-sequence-copy" aria-live="polite"><span>STEP {String(step).padStart(2, '0')} / 03</span><h2>{current.action}</h2><p>{current.explanation}</p></div><div className="fd-sequence-controls"><button type="button" onClick={() => setStep(value => Math.max(1, value - 1))} disabled={step === 1} aria-label="Previous step"><ChevronLeft size={18} /></button><div className="fd-step-tabs" role="tablist" aria-label="Example assembly step">{build.map((part, index) => <button key={part.name} type="button" role="tab" aria-selected={step === index + 1} aria-label={`Step ${index + 1}: ${part.action}`} onClick={() => setStep(index + 1)} className={step === index + 1 ? 'active' : ''}>{String(index + 1).padStart(2, '0')}</button>)}</div><button type="button" onClick={() => setStep(value => Math.min(3, value + 1))} disabled={step === 3} aria-label="Next step"><ChevronRight size={18} /></button></div></div>
        </div>
      </section>

      <section className="fd-principles" aria-labelledby="fd-principles-title"><div className="fd-section-inner"><div className="fd-section-heading"><h2 id="fd-principles-title">How to read a stack</h2><p>A useful assembly is more than a list of tools. Each part has a job, and each relationship has a reason.</p></div><div className="fd-definitions">
        <div><span>01</span><h3>Part</h3><p>A named piece of software with a specific capability.</p></div>
        <div><span>02</span><h3>Role</h3><p>The architectural job it serves. Shape and color help you recognize it.</p></div>
        <div><span>03</span><h3>Fit</h3><p>A plausible relationship worth considering, not an integration built for you.</p></div>
        <div><span>04</span><h3>Tension</h3><p>A missing capability or overlapping responsibility in a particular design.</p></div>
      </div><p className="fd-boundary">Assembly lines explain relationships. They are not runtime wiring or data-flow instructions.</p></div></section>

      <section className="fd-editions" aria-labelledby="fd-editions-title"><div className="fd-section-inner"><div className="fd-section-heading"><h2 id="fd-editions-title">Choose a system</h2><p>Explore a curated assembly, then change the parts to test your own combination.</p></div><div className="fd-edition-list">{editions.map(edition => <a key={edition.name} href={edition.href}><span className="fd-edition-name">{edition.name}</span><span className="fd-edition-detail">{edition.detail}</span><span className="fd-edition-count">{edition.data.tools.length} parts · {edition.data.recipes.length} examples</span><ArrowRight size={19} /></a>)}</div></div></section>
    </main>
  </div>
}
