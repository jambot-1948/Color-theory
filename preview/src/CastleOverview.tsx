import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { BrickScene, type SceneBrick } from './bricks/Brick'
import { BRICK_HEIGHT, ISO_CAMERA, darken, type Camera } from './bricks/iso'
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
  { id: 'harness', number: 5, part: 'Gatehouse', name: 'Agent harness', hex: '#1b8a7e', question: 'What can the AI touch, where does its code run, who approves risky actions, and what is recorded? Like brakes on a race car, the gate is what lets the tower move fast safely.', parts: ['Tools', 'Sandbox', 'Permissions', 'Evidence', 'Recovery'], href: '#/agent-harness', link: 'Open Agent harness' },
]

const H = BRICK_HEIGHT
const CREST = H / 2
const brick = (id: string, group: string, label: string, x: number, y: number, z: number, w: number, d: number, h = H, tag?: string): SceneBrick =>
  ({ id, group, hex: hexOf(group), label, tag, box: { x, y, z, w, d, h }, state: 'seated' })

const hexOf = (id: string) => layers.find(layer => layer.id === id)!.hex

const roof = (id: string, group: string, x: number, y: number, z: number, w: number, d: number, h: number, flag = true): SceneBrick =>
  ({ id, group, hex: darken(hexOf(group), 0.18), label: '', box: { x, y, z, w, d, h }, state: 'seated', shape: 'roof', flag: flag ? FLAG : undefined })

const FLAG = '#e0b44c'

// The castle, in stud units on an 18 x 8 baseplate it covers edge to edge. Front (+y) faces the box-art camera.
// Silhouette after a fairy-tale castle: turrets with pointed roofs, a peaked gatehouse, one tall spire.
const castle: SceneBrick[] = [
  // Foundations: the courtyard, curtain walls, turrets, and the squat tower that keep it standing.
  brick('court', 'foundations', '', 0, 0, 0, 18, 6),
  brick('turret-left', 'foundations', 'Login', 0, 5, 0, 3, 3, 4 * H),
  roof('turret-left-roof', 'foundations', 0, 5, 4 * H, 3, 3, 4),
  brick('wall-left', 'foundations', 'Front end', 3, 6, 0, 4, 2, 2 * H, 'Walls'),
  brick('crest-l1', 'foundations', '', 3, 6, 2 * H, 1, 2, CREST),
  brick('crest-l2', 'foundations', '', 5, 6, 2 * H, 1, 2, CREST),
  brick('wall-right', 'foundations', 'Back end', 11, 6, 0, 4, 2, 2 * H),
  brick('crest-r1', 'foundations', '', 11, 6, 2 * H, 1, 2, CREST),
  brick('crest-r2', 'foundations', '', 13, 6, 2 * H, 1, 2, CREST),
  brick('turret-right-1', 'foundations', 'Cloud & CI/CD', 11, 1, H, 4, 3, H, 'Rooms'),
  brick('turret-right-2', 'foundations', 'Monitoring', 11, 1, 2 * H, 4, 3),
  brick('turret-right-3', 'foundations', '', 11, 1, 3 * H, 4, 3),
  roof('turret-right-roof', 'foundations', 11, 1, 4 * H, 4, 3, 4.4),
  brick('keep-right', 'foundations', 'Data', 15, 4, 0, 3, 4, 2 * H),
  brick('keep-right-c1', 'foundations', '', 15, 4, 2 * H, 1, 1, CREST),
  brick('keep-right-c2', 'foundations', '', 17, 4, 2 * H, 1, 1, CREST),
  brick('keep-right-c3', 'foundations', '', 15, 7, 2 * H, 1, 1, CREST),
  brick('keep-right-c4', 'foundations', '', 17, 7, 2 * H, 1, 1, CREST),
  // Data: the storeroom hall behind the left wall.
  brick('stores-1', 'data', 'Ingest', 2, 1, H, 4, 3, H, 'Stores'),
  brick('stores-2', 'data', 'Store', 2, 1, 2 * H, 4, 3),
  brick('stores-3', 'data', 'Quality & catalog', 2, 1, 3 * H, 4, 3),
  roof('stores-roof', 'data', 2, 1, 4 * H, 4, 3, 4),
  // AI application: the tall spire everyone sees first.
  brick('keep-1', 'ai', 'Knowledge', 7.5, 1.5, H, 3, 3),
  brick('keep-2', 'ai', 'Model', 7.5, 1.5, 2 * H, 3, 3),
  brick('keep-3', 'ai', 'Agent', 7.5, 1.5, 3 * H, 3, 3),
  brick('keep-4', 'ai', 'Interface', 7.5, 1.5, 4 * H, 3, 3, H, 'Tower'),
  brick('keep-5', 'ai', '', 7.5, 1.5, 5 * H, 3, 3),
  brick('spire-1', 'ai', '', 8, 2, 6 * H, 2, 2, 2 * H),
  roof('spire-roof', 'ai', 8, 2, 8 * H, 2, 2, 4.4),
  // Agent harness: the peaked gatehouse between the castle and the world.
  brick('gate-left', 'harness', '', 7, 6, 0, 1, 2, 2 * H),
  brick('gate-right', 'harness', '', 10, 6, 0, 1, 2, 2 * H),
  brick('gate-top', 'harness', 'Gatehouse', 7, 6, 2 * H, 4, 2, H, 'Harness'),
  roof('gate-roof', 'harness', 7, 6, 3 * H, 4, 2, 1.8, false),
]

// The manual view lifts each layer a little off the one below, like an exploded instruction page.
const lift: Record<string, number> = { foundations: 0, data: 0.5, harness: 0, ai: 1.8 }
const BOX: Camera = { azimuth: 0, elevation: 12 }
const MANUAL: Camera = ISO_CAMERA
const SWING_MS = 1800
const HOLD_MS = 2200
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

export default function CastleOverview() {
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const [t, setT] = useState(reduced ? 1 : 0)
  const [target, setTarget] = useState<0 | 1>(reduced ? 1 : 0)
  const [focus, setFocus] = useState<string | undefined>()
  const frame = useRef<number>(0)

  // Hold on the box art, then swing to the manual view once.
  useEffect(() => {
    if (reduced) return
    const timer = window.setTimeout(() => setTarget(1), HOLD_MS)
    return () => window.clearTimeout(timer)
  }, [reduced])

  useEffect(() => {
    if (reduced) { setT(target); return }
    const from = t
    if (from === target) return
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / (SWING_MS * Math.abs(target - from)))
      setT(from + (target - from) * ease(progress))
      if (progress < 1) frame.current = requestAnimationFrame(step)
    }
    frame.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, reduced])

  const camera: Camera = { azimuth: BOX.azimuth + (MANUAL.azimuth - BOX.azimuth) * t, elevation: BOX.elevation + (MANUAL.elevation - BOX.elevation) * t }
  const bricks = castle.map(item => ({ ...item, box: { ...item.box, z: item.box.z + lift[item.group!] * t } }))
  const view = t < 0.5 ? 'box' : 'manual'

  return <section className="fd-castle" aria-labelledby="fd-title">
    <div className="fc-inner">
      <div className="fc-left">
        <h1 id="fd-title">Chromatic Architecture</h1>
        <p className="fc-lead">Shipping software you can trust is like building a LEGO castle. It is not one big brick: it is a baseplate, walls, storerooms, a tower, and a gate, each resting on the layer below.</p>
        <p className="fc-sub">If you want to build the equivalent, here is what each layer asks of you.</p>
        <div className={`fc-scene${focus ? ' has-focus' : ''}`} data-focus={focus} style={{ '--fc-labels': Math.max(0, t * 2 - 1).toFixed(2) } as CSSProperties}>
          <span className="fc-boxart" style={{ opacity: Math.max(0, 1 - t * 2.5) }} aria-hidden="true">Want to build this?</span>
          <BrickScene bricks={bricks} plate={{ w: 18, d: 8 }} unit={17} maxTier={14} frame="tight" showArrow={false} showBadges="none" plateLabel="Product operating model · teams · ownership" camera={camera} label="A LEGO castle built in layers: an operating-model baseplate, foundation walls and rooms, data storerooms, an AI tower, and a harness gatehouse." />
          <div className="fc-views" role="group" aria-label="Castle view">
            <button type="button" aria-pressed={view === 'box'} onClick={() => setTarget(0)}>Box</button>
            <button type="button" aria-pressed={view === 'manual'} onClick={() => setTarget(1)}>Manual</button>
          </div>
        </div>
      </div>
      <ol className="fc-layers">
        {[...layers].reverse().map(layer => <li key={layer.id} className={focus === layer.id ? 'is-active' : undefined} onMouseEnter={() => setFocus(layer.id)} onMouseLeave={() => setFocus(undefined)} onFocus={() => setFocus(layer.id)} onBlur={() => setFocus(undefined)}>
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
