import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { BrickScene, type SceneBrick } from './bricks/Brick'
import { BRICK_HEIGHT } from './bricks/iso'
import './bricks/bricks.css'
import './CastleOverview.css'

// The overview metaphor: a system you would ship is built like a LEGO castle, one layer on another.
// This is a reading aid for the layers and what each asks of you, not an architecture diagram.
interface Layer {
  id: string
  number: number
  part: string
  name: string
  hex: string
  question: string
  parts: string[]
  href: string
  link: string
}

const layers: Layer[] = [
  { id: 'base', number: 1, part: 'Baseplate', name: 'Operating model', hex: '#c9b98f', question: 'Who owns each part, who is paged when it breaks, and how does a change get approved and shipped?', parts: ['Teams', 'Ownership', 'On-call', 'Change process'], href: '#/growth', link: 'See how builds grow over time' },
  { id: 'foundations', number: 2, part: 'Walls & rooms', name: 'Foundations', hex: '#8f9a93', question: 'Can people sign in, can you ship a change safely, and can you see when it breaks?', parts: ['Front end', 'Back end', 'Database', 'Login', 'CI/CD', 'Cloud', 'Monitoring'], href: '#/foundations', link: 'Open Foundations' },
  { id: 'data', number: 3, part: 'Storerooms', name: 'Data engineering', hex: '#3a70b8', question: 'Where does the data come from, is it correct, and who may see it?', parts: ['Ingestion', 'Transformation', 'Warehouse', 'Quality checks', 'Catalog'], href: '#/data-engineering', link: 'Open Data engineering' },
  { id: 'ai', number: 4, part: 'Tower', name: 'AI application', hex: '#6a52a8', question: 'Which model, how does it reach your knowledge, where do people use it, and how do you know the answers are good?', parts: ['Model', 'Agent runtime', 'Retrieval', 'Interface', 'Tracing & evals'], href: '#/ai-applications', link: 'Open AI applications' },
  { id: 'harness', number: 5, part: 'Gatehouse', name: 'Agent harness', hex: '#1b8a7e', question: 'What can the AI touch, where does its code run, who approves risky actions, and what is recorded?', parts: ['Tools', 'Sandbox', 'Permissions', 'Evidence', 'Recovery'], href: '#/agent-harness', link: 'Open Agent harness' },
]

const H = BRICK_HEIGHT
const brick = (id: string, group: string, hex: string, label: string, x: number, y: number, z: number, w: number, d: number, h = H, tag?: string): SceneBrick =>
  ({ id, group, hex, label, tag, box: { x, y, z, w, d, h }, state: 'seated' })

const hexOf = (id: string) => layers.find(layer => layer.id === id)!.hex

// Bricks per layer, placed so no layer hides another's label from this viewpoint.
const castle: Record<string, SceneBrick[]> = {
  foundations: [brick('walls', 'foundations', hexOf('foundations'), 'Foundations', 1, 1, 0, 12, 8, H, 'Walls')],
  data: [
    brick('stores-low', 'data', hexOf('data'), 'Ingest & store', 1, 1, H, 5, 3, H, 'Stores'),
    brick('stores-high', 'data', hexOf('data'), 'Quality & catalog', 1, 1, 2 * H, 5, 3, H),
  ],
  ai: [
    brick('tower-1', 'ai', hexOf('ai'), 'Knowledge', 9, 1, H, 3, 3),
    brick('tower-2', 'ai', hexOf('ai'), 'Model', 9, 1, 2 * H, 3, 3),
    brick('tower-3', 'ai', hexOf('ai'), 'Agent', 9, 1, 3 * H, 3, 3),
    brick('tower-4', 'ai', hexOf('ai'), 'Interface', 9, 1, 4 * H, 3, 3, H, 'Tower'),
  ],
  harness: [
    brick('gate-left', 'harness', hexOf('harness'), '', 5, 7, H, 1, 2, H),
    brick('gate-right', 'harness', hexOf('harness'), '', 9, 7, H, 1, 2, H),
    brick('gate-top', 'harness', hexOf('harness'), 'Gatehouse', 5, 7, 2 * H, 5, 2, H, 'Harness'),
  ],
}

const buildOrder = ['base', 'foundations', 'data', 'ai', 'harness']
const STEP_MS = 900

export default function CastleOverview() {
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const [built, setBuilt] = useState(reduced ? buildOrder.length : 1)
  const [focus, setFocus] = useState<string | undefined>()
  const [settled, setSettled] = useState(reduced)

  // Build the castle once, layer by layer, the first time the page opens.
  useEffect(() => {
    if (settled) return
    const timer = window.setTimeout(() => built >= buildOrder.length ? setSettled(true) : setBuilt(value => value + 1), STEP_MS)
    return () => window.clearTimeout(timer)
  }, [built, settled])

  const shown = buildOrder.slice(0, built)
  const newest = buildOrder[built - 1]
  const bricks = shown.flatMap(id => (castle[id] ?? []).map(item => ({ ...item, isNew: id === newest && !settled })))

  return <section className="fd-castle" aria-labelledby="fd-title">
    <div className="fc-inner">
      <div className="fc-left">
        <h1 id="fd-title">Chromatic Architecture</h1>
        <p className="fc-lead">Shipping software you can trust is like building a LEGO castle. It is not one big brick: it is a baseplate, walls, storerooms, a tower, and a gate, each resting on the layer below.</p>
        <p className="fc-sub">If you want to build the equivalent, here is what each layer asks of you.</p>
        <div className={`fc-scene${focus ? ' has-focus' : ''}`} data-focus={focus}>
          <BrickScene bricks={bricks} plate={{ w: 14, d: 10 }} unit={19} maxTier={5} frame="tight" showArrow={false} showBadges="none" plateLabel="Product operating model · teams · ownership" label={`A castle built in layers: ${shown.map(id => layers.find(layer => layer.id === id)?.part).join(', ')}.`} />
        </div>
      </div>
      <ol className="fc-layers">
        {[...layers].reverse().map(layer => <li key={layer.id} className={`${focus === layer.id ? 'is-active' : ''}${shown.includes(layer.id) ? '' : ' is-pending'}`} onMouseEnter={() => setFocus(layer.id)} onMouseLeave={() => setFocus(undefined)} onFocus={() => setFocus(layer.id)} onBlur={() => setFocus(undefined)}>
          <div className="fc-head"><i style={{ background: layer.hex }} aria-hidden="true" /><span className="fc-num">{layer.number}</span><strong>{layer.part}</strong><small>{layer.name}</small></div>
          <p>{layer.question}</p>
          <div className="fc-parts">{layer.parts.map(part => <span key={part}>{part}</span>)}</div>
          <a href={layer.href}>{layer.link} <ArrowRight size={13} /></a>
        </li>)}
      </ol>
      <p className="fc-caveat">A metaphor for layers, not an architecture diagram. The tower is what people see first, but it stands on everything below it, and the gate decides what it can reach. Each layer has its own page, where real products fill the parts and you can test how they fit.</p>
    </div>
  </section>
}
