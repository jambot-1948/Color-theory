import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import ModelScene from './ModelScene'
import type { OverviewModel } from './types'
import { castleModel } from './models/castle'
import { raceCar } from './models/racecar'
import '../bricks/bricks.css'
import '../Overview.css'

// The landing overview: a recognisable LEGO-style model, read through the same five layers whichever model is shown.
// Each model is a metaphor for layers, not an architecture diagram.
const models: OverviewModel[] = [castleModel, raceCar]

const HOLD_MS = 1700
const SWING_MS = 1200
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

export default function Overview() {
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const [modelId, setModelId] = useState(models[0].id)
  const [t, setT] = useState(reduced ? 1 : 0)
  const [target, setTarget] = useState<0 | 1>(reduced ? 1 : 0)
  const frame = useRef<number>(0)
  const model = models.find(item => item.id === modelId) ?? models[0]

  useEffect(() => {
    if (reduced) return
    const timer = window.setTimeout(() => setTarget(1), HOLD_MS)
    return () => window.clearTimeout(timer)
  }, [modelId, reduced])

  useEffect(() => {
    if (reduced) return
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

  const view = target === 0 ? 'assembled' : 'layers'
  const chooseModel = (id: string) => {
    if (id === modelId) return
    setModelId(id)
    setT(reduced ? 1 : 0)
    setTarget(reduced ? 1 : 0)
  }

  return <section className="fd-castle" aria-labelledby="fd-title">
    <div className="fc-inner">
      <div className="fc-copy">
        <h1 id="fd-title">Build a system.<br />See what fits.</h1>
        <p className="fc-lead">Chromatic Architecture turns a software stack into an assembly you can test—what snaps together, what conflicts, and what is still missing.</p>
        <div className="fc-actions"><a className="fc-primary" href="#/ai-applications">Start assembling <ArrowRight size={16} /></a><a className="fc-secondary" href="#/growth">See a system grow</a></div>
        <p className="fc-model-note">Start with something familiar. Then reveal the five architectural layers underneath it.</p>
        <div className="fc-models" role="tablist" aria-label="Choose a metaphor model">
          {models.map(item => <button key={item.id} type="button" role="tab" aria-selected={item.id === model.id} onClick={() => chooseModel(item.id)}>{item.name}</button>)}
        </div>
        <p className="fc-reasoning-note"><strong>A reasoning model, not a runtime diagram.</strong> Open a workshop to assemble real products and expose missing capabilities.</p>
      </div>
      <div className="fc-stage">
        <div className="fc-stage-status" aria-live="polite">
          <span>{model.name}</span>
          <strong>{view === 'assembled' ? 'A familiar object' : 'The system underneath'}</strong>
        </div>
        <div className="fc-scene" style={{ '--fc-labels': Math.max(0, t * 2 - 1).toFixed(2) } as CSSProperties}>
          <span className="fc-boxart" style={{ opacity: Math.max(0, 1 - t * 2.5) }} aria-hidden="true">One system, five layers</span>
          <ModelScene key={model.id} model={model} t={t} unit={20} />
        </div>
        <p className="fc-stage-caption">{view === 'assembled' ? 'The object assembles first.' : 'Five layers make the whole system work.'}</p>
      </div>
    </div>
  </section>
}
