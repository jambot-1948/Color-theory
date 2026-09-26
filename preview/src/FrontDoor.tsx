import { useEffect, useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { architecturalChromaticsData } from './architectural-chromatics-data'
import { dataEngineeringChromaticsData } from './data-engineering-chromatics-data'
import { agentHarnessChromaticsData } from './agent-harness-chromatics-data'
import { foundationsData } from './foundations-data'
import './BlendWorkshop.css'
import './WorkshopNavigation.css'
import './FrontDoor.css'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
import { BrickScene } from './bricks/Brick'
import { slotLinks, slotTools, slotsFromTools } from './bricks/capabilityModel'
import { capabilities } from './bricks/capabilities'
import { readBuild, verdictCopy, type EditionId } from './bricks/buildModel'
import { MissingCallout } from './bricks/ManualBoard'
import type { WorkshopData } from './workshopData'
import { sceneBricks, withSupport } from './bricks/scene'
import { assemblyStories } from './assemblyStories'
import './bricks/bricks.css'

const heroData = architecturalChromaticsData
const heroSlots = [...slotsFromTools('ai', ['openai', 'openai-agents-sdk', 'pinecone']), { capability: 'model-api', product: 'claude' }]
const heroAll = slotTools('ai', heroData, heroSlots)
const heroMissing = heroData.recipes.find(recipe => recipe.id === 'lean-agent-runtime')?.missingHues ?? []

// A short, looping build that shows the grammar in order: place, snap, force, then read what is missing.
// Every verdict is computed by the same rules as the assembly pages; nothing here is staged.
const frames = [
  { parts: 1, action: 'Place a capability', explanation: 'Each brick is a capability. Colour is its role and height is its tier. The label is the product filling it: OpenAI here, though Claude or a local model fits the same brick.' },
  { parts: 2, action: 'Snap on an agent runtime', explanation: 'It locks because a pairing is recorded: the OpenAI Agents SDK uses OpenAI models by default.' },
  { parts: 3, action: 'Snap on retrieval', explanation: 'A curated recipe links Pinecone to the runtime. That is an integration to build and test, not an automatic connection.' },
  { parts: 4, action: 'Force a second model', explanation: 'Two products on one capability are pushed off their studs until someone names how the work splits between them.' },
  { parts: 3, missing: true, action: 'Read what is missing', explanation: 'Take it back off and the model holds, but pale placeholders mark the roles this example leaves out: Interface (a front end), Velocity (an app backend), and Trust (tracing and checks).' },
] as const

function heroFrame(index: number) {
  const frame = frames[index]
  const tools = heroAll.slice(0, frame.parts)
  const slots = heroSlots.slice(0, frame.parts)
  const links = slotLinks('ai', heroData, slots, assemblyStories['lean-agent-runtime'].links)
  const gaps = 'missing' in frame ? [...heroMissing] : []
  const reading = readBuild('ai', tools, links, { gaps })
  const added = index > 0 && frame.parts > frames[index - 1].parts ? [tools[frame.parts - 1].id] : index === 0 ? [tools[0].id] : []
  const bricks = sceneBricks({ edition: 'ai', data: heroData, tools, layoutTools: heroAll, links, ghostHues: [...heroMissing], newIds: added })
    .filter(brick => gaps.length || brick.state !== 'ghost')
  return { bricks: withSupport(bricks), reading, tools }
}

const FRAME_MS = 3400

const editions: { id: EditionId, name: string, href: string, detail: string, data: WorkshopData }[] = [
  { id: 'foundations', name: 'Foundations', href: '#/foundations', detail: 'What every system sits on: front end, back end, data, login, delivery, platform, and operations.', data: foundationsData },
  { id: 'ai', name: 'AI applications', href: '#/ai-applications', detail: 'What AI adds: models, agent runtimes, retrieval, interfaces, and oversight.', data: architecturalChromaticsData },
  { id: 'data', name: 'Data engineering', href: '#/data-engineering', detail: 'Ingestion, transformation, storage, serving, and governance.', data: dataEngineeringChromaticsData },
  { id: 'harness', name: 'Agent harness', href: '#/agent-harness', detail: 'Between the model and the world: tools, sandboxes, permissions, context, evals, and recovery.', data: agentHarnessChromaticsData },
]

export default function FrontDoor() {
  const [step, setStep] = useState(0)
  const [paused, setPaused] = useState(() => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  const [hovered, setHovered] = useState(false)
  const current = frames[step]
  const { bricks, reading, tools } = heroFrame(step)
  const playing = !paused && !hovered

  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => setStep(value => (value + 1) % frames.length), FRAME_MS)
    return () => window.clearTimeout(timer)
  }, [playing, step])

  const goTo = (index: number) => { setPaused(true); setStep((index + frames.length) % frames.length) }
  // While parts go on, name how the newest one seated; on the last frame, read the whole model.
  const newest = reading.seats.at(-1)
  const chip = 'missing' in current ? { tone: reading.verdict, label: verdictCopy[reading.verdict].label }
    : newest?.seat === 'clash' ? { tone: 'forced', label: newest.partner?.name === newest.tool.name ? 'Forced: one capability, two products' : `Forced against ${newest.partner?.name}` }
    : newest?.seat === 'snap' ? { tone: 'clean', label: `Snaps onto ${newest.partner?.name}` }
    : newest?.seat === 'loose' ? { tone: 'loose', label: 'Sits loose' }
    : { tone: 'gaps', label: 'On the baseplate' }

  return <div className="bw-app fd-app">
    <SiteHeader />
    <main>
      <section className="fd-hero" aria-labelledby="fd-title">
        <div className="fd-hero-inner" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
          <div className="fd-intro"><h1 id="fd-title">Chromatic Architecture</h1><p>How capabilities combine: what snaps together, what’s forced, and what’s missing.</p><a className="fd-primary" href="?build=model-api:openai,agent-runtime:openai-agents-sdk,vector-retrieval:pinecone#/ai-applications">Build this example yourself <ArrowRight size={17} /></a></div>
          <div className="fd-iso" aria-hidden="true">
            <BrickScene bricks={bricks} plate={{ w: 12, d: 6 }} unit={20} maxTier={4} frame="tall" showBadges={'missing' in current ? 'none' : 'all'} showArrow={bricks.some(brick => brick.isNew)} label={`Step ${step + 1} of ${frames.length}: ${tools.map(part => part.name).join(', ')}`} />
          </div>
          {'missing' in current && <div className="fd-missing" aria-hidden="true"><MissingCallout data={heroData} gaps={reading.gaps} /></div>}
          <div className="fd-sequence"><div className="fd-sequence-copy" aria-live={playing ? 'off' : 'polite'}><span>STEP {String(step + 1).padStart(2, '0')} / {String(frames.length).padStart(2, '0')}<b key={step} className={`fd-verdict is-${chip.tone}`}>{chip.label}</b></span><h2>{current.action}</h2><p>{current.explanation}</p><i className="fd-progress" key={`${step}-${playing}`} data-playing={playing || undefined} style={{ animationDuration: `${FRAME_MS}ms` }} /></div><div className="fd-sequence-controls"><button type="button" onClick={() => goTo(step - 1)} aria-label="Previous step"><ChevronLeft size={18} /></button><div className="fd-step-tabs" role="tablist" aria-label="Example assembly step">{frames.map((frame, index) => <button key={frame.action} type="button" role="tab" aria-selected={step === index} aria-label={`Step ${index + 1}: ${frame.action}`} onClick={() => goTo(index)} className={step === index ? 'active' : ''}>{String(index + 1).padStart(2, '0')}</button>)}</div><button type="button" onClick={() => goTo(step + 1)} aria-label="Next step"><ChevronRight size={18} /></button><button type="button" className="fd-play" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Play the example' : 'Pause the example'}>{paused ? <Play size={16} /> : <Pause size={16} />}</button></div></div>
        </div>
      </section>

      <section className="fd-principles" aria-labelledby="fd-principles-title"><div className="fd-section-inner"><div className="fd-section-heading"><h2 id="fd-principles-title">How to read a model</h2><p>A useful stack is more than a pile of tools. Each brick has a job, and each join is either recorded or marked loose.</p></div><div className="fd-definitions">
        <div><span>01</span><h3>Brick</h3><p>A capability, such as a model API or a vector store. Colour is its role; height is its tier. The printed label is the product that fills it.</p></div>
        <div><span>02</span><h3>Snap</h3><p>The brick locks onto an earlier part because a pairing, curated recipe, or authored note links them.</p></div>
        <div><span>03</span><h3>Loose</h3><p>It sits on the model, but nothing recorded says it locks. Not wrong, just unproven.</p></div>
        <div><span>04</span><h3>Forced</h3><p>Pushed off its studs by a tension authored for this design, or by two products filling the same capability.</p></div>
        <div><span>05</span><h3>Placeholder</h3><p>A pale, dashed brick is a part the model is missing, and each one is named in a missing-parts box. A hanging brick has nothing underneath it yet.</p></div>
      </div><p className="fd-boundary">Stacking shows relationships and tiers. It is not runtime wiring or data flow. <a href="#/growth">See how models grow over time</a>.</p></div></section>

      <section className="fd-editions" aria-labelledby="fd-editions-title"><div className="fd-section-inner"><div className="fd-section-heading"><h2 id="fd-editions-title">Choose a system</h2><p>Explore a curated assembly, then change the parts to test your own combination.</p></div><div className="fd-edition-list">{editions.map(edition => <a key={edition.name} href={edition.href}><span className="fd-edition-name">{edition.name}</span><span className="fd-edition-detail">{edition.detail}</span><span className="fd-edition-count">{capabilities[edition.id].length} capabilities · {edition.data.tools.length} products · {edition.data.recipes.length} examples</span><ArrowRight size={19} /></a>)}</div></div></section>
    </main>
    <SiteFooter />
  </div>
}
