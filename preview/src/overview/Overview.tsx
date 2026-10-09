import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import ModelScene from './ModelScene'
import { LAYER_COLORS, type LayerId, type OverviewModel } from './types'
import { webb } from './models/webb'
import { castleModel } from './models/castle'
import { raceCar } from './models/racecar'
import '../bricks/bricks.css'
import '../Overview.css'

// The landing overview: a recognisable LEGO-style model, read through the same five layers whichever model is shown.
// Each model is a metaphor for layers, not an architecture diagram.
const models: OverviewModel[] = [webb, castleModel, raceCar]

interface LayerInfo {
  id: LayerId
  number: number
  name: string
  question: string
  parts: string[]
  href: string
  link: string
}

const layers: LayerInfo[] = [
  { id: 'base', number: 1, name: 'Operating model', question: 'Who owns each part, who is paged when it breaks, and how does a change get approved and shipped?', parts: ['Teams', 'Ownership', 'On-call', 'Change process'], href: '#/growth', link: 'See how builds grow over time' },
  { id: 'foundations', number: 2, name: 'Foundations', question: 'Can people sign in, can you ship a change safely, and can you see when it breaks?', parts: ['Front end', 'Back end', 'Database', 'Login', 'CI/CD', 'Cloud', 'Monitoring'], href: '#/foundations', link: 'Open Foundations' },
  { id: 'data', number: 3, name: 'Data engineering', question: 'Where does the data come from, is it correct, and who may see it?', parts: ['Ingestion', 'Transformation', 'Warehouse', 'Quality checks', 'Catalog'], href: '#/data-engineering', link: 'Open Data engineering' },
  { id: 'ai', number: 4, name: 'AI application', question: 'Which model, how does it reach your knowledge, where do people use it, and how do you know the answers are good?', parts: ['Model', 'Agent runtime', 'Retrieval', 'Interface', 'Tracing & evals'], href: '#/ai-applications', link: 'Open AI applications' },
  { id: 'harness', number: 5, name: 'Agent harness', question: 'What can the AI touch, where does its code run, who approves risky actions, and what is recorded?', parts: ['Tools', 'Sandbox', 'Permissions', 'Evidence', 'Recovery'], href: '#/agent-harness', link: 'Open Agent harness' },
]

const SWING_MS = 1900
const HOLD_MS = 2400
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

export default function Overview() {
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const [modelId, setModelId] = useState(models[0].id)
  const [t, setT] = useState(reduced ? 1 : 0)
  const [target, setTarget] = useState<0 | 1>(reduced ? 1 : 0)
  const [focus, setFocus] = useState<string | undefined>()
  const frame = useRef<number>(0)
  const model = models.find(item => item.id === modelId) ?? models[0]

  // Each model opens on its box art, then swings to the manual view once.
  useEffect(() => {
    if (reduced) return
    setT(0)
    setTarget(0)
    const timer = window.setTimeout(() => setTarget(1), HOLD_MS)
    return () => window.clearTimeout(timer)
  }, [reduced, modelId])

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

  const view = t < 0.5 ? 'box' : 'manual'

  return <section className="fd-castle" aria-labelledby="fd-title">
    <div className="fc-inner">
      <div className="fc-left">
        <h1 id="fd-title">Chromatic Architecture</h1>
        <p className="fc-lead">If you want to build something like this, here are some things to consider.</p>
        <div className="fc-models" role="tablist" aria-label="Model">
          {models.map(item => <button key={item.id} type="button" role="tab" aria-selected={item.id === model.id} onClick={() => setModelId(item.id)}>{item.name}</button>)}
        </div>
        <div className={`fc-scene${focus ? ' has-focus' : ''}`} data-focus={focus} style={{ '--fc-labels': Math.max(0, t * 2 - 1).toFixed(2) } as CSSProperties}>
          <span className="fc-boxart" style={{ opacity: Math.max(0, 1 - t * 2.5) }} aria-hidden="true">Want to build this?</span>
          <ModelScene key={model.id} model={model} t={t} unit={20} focus={focus} />
          <div className="fc-views" role="group" aria-label="View">
            <button type="button" aria-pressed={view === 'box'} onClick={() => setTarget(0)}>Box</button>
            <button type="button" aria-pressed={view === 'manual'} onClick={() => setTarget(1)}>Manual</button>
          </div>
        </div>
      </div>
      <ol className="fc-layers">
        {[...layers].reverse().map(layer => {
          const part = model.parts[layer.id]
          return <li key={layer.id} className={focus === layer.id ? 'is-active' : undefined} onMouseEnter={() => setFocus(layer.id)} onMouseLeave={() => setFocus(undefined)} onFocus={() => setFocus(layer.id)} onBlur={() => setFocus(undefined)}>
            <div className="fc-head"><i style={{ background: LAYER_COLORS[layer.id] }} aria-hidden="true" /><span className="fc-num">{layer.number}</span><strong>{part.part}</strong><small>{layer.name}</small></div>
            <p>{layer.question}{part.analogy ? ` ${part.analogy}` : ''}</p>
            <div className="fc-parts">{layer.parts.map(item => <span key={item}>{item}</span>)}</div>
            <a href={layer.href}>{layer.link} <ArrowRight size={13} /></a>
          </li>
        })}
      </ol>
      <p className="fc-caveat">Each model is a metaphor for layers, not an architecture diagram. Each layer has its own page, where real products fill the parts and you can test how they fit.</p>
    </div>
  </section>
}
