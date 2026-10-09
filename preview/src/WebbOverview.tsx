import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { Baseplate, IsoBrick, type SceneBrick } from './bricks/Brick'
import { ISO_CAMERA, darken, lighten, pathFrom, projector, type Camera, type Projector } from './bricks/iso'
import './bricks/bricks.css'
import './Overview.css'

// The overview metaphor: a system you ship is built like a LEGO model of the James Webb Space Telescope.
// Everyone sees the mirror; it only works because of the layers around it. A reading aid, not a diagram.
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
  { id: 'base', number: 1, part: 'Stand & mission control', name: 'Operating model', hex: '#c9b98f', question: 'Who owns each part, who is paged when it breaks, and how does a change get approved and shipped?', parts: ['Teams', 'Ownership', 'On-call', 'Change process'], href: '#/growth', link: 'See how builds grow over time' },
  { id: 'foundations', number: 2, part: 'Spacecraft bus', name: 'Foundations', hex: '#7d8a92', question: 'Can people sign in, can you ship a change safely, and can you see when it breaks?', parts: ['Front end', 'Back end', 'Database', 'Login', 'CI/CD', 'Cloud', 'Monitoring'], href: '#/foundations', link: 'Open Foundations' },
  { id: 'data', number: 3, part: 'Instruments', name: 'Data engineering', hex: '#2f72c4', question: 'Where does the data come from, is it correct, and who may see it?', parts: ['Ingestion', 'Transformation', 'Warehouse', 'Quality checks', 'Catalog'], href: '#/data-engineering', link: 'Open Data engineering' },
  { id: 'ai', number: 4, part: 'Mirror', name: 'AI application', hex: '#e0a92e', question: 'Which model, how does it reach your knowledge, where do people use it, and how do you know the answers are good?', parts: ['Model', 'Agent runtime', 'Retrieval', 'Interface', 'Tracing & evals'], href: '#/ai-applications', link: 'Open AI applications' },
  { id: 'harness', number: 5, part: 'Sunshield', name: 'Agent harness', hex: '#b8418f', question: 'What can the AI touch, where does its code run, who approves risky actions, and what is recorded? Like the sunshield, it is what lets the most sensitive part do its job.', parts: ['Tools', 'Sandbox', 'Permissions', 'Evidence', 'Recovery'], href: '#/agent-harness', link: 'Open Agent harness' },
]
const hexOf = (id: string) => layers.find(layer => layer.id === id)!.hex

type Point3 = [number, number, number]

// Model geometry, in stud units on a 20 x 12 display stand. Front (+y) faces the box-art camera.
const PLATE = { w: 8, d: 6 }
// Model coordinates are laid out on a 20 x 12 grid; the display stand's plate sits under its centre.
const OX = 6
const OY = 3
const SHIELD: [number, number][] = [[0.6, 6], [4.6, 0.8], [15.4, 0.8], [19.4, 6], [15.4, 11.2], [4.6, 11.2]]
const SHIELD_COLORS = ['#8e2f72', '#a83a86', '#c25a9e', '#d585b8', '#e6b2d3']
const HEX_SIZE = 1.18
const TILT = (12 * Math.PI) / 180
// The 18 primary-mirror segments: two rings of hexagons around an empty centre.
const SEGMENTS = (() => {
  const cells: [number, number][] = []
  for (let q = -2; q <= 2; q++) for (let r = -2; r <= 2; r++) {
    const distance = Math.max(Math.abs(q), Math.abs(r), Math.abs(-q - r))
    if (distance === 1 || distance === 2) cells.push([q, r])
  }
  return cells
})()

const box = (id: string, group: string, hex: string, label: string, x: number, y: number, z: number, w: number, d: number, h: number, tag?: string): SceneBrick =>
  ({ id, group, hex, label, tag, box: { x, y, z, w, d, h }, state: 'seated' })

const BOX: Camera = { azimuth: 0, elevation: 10 }
const MANUAL: Camera = ISO_CAMERA
const SWING_MS = 1900
const HOLD_MS = 2400
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

function WebbScene({ t, unit, focus }: { t: number, unit: number, focus?: string }) {
  const titleId = useId()
  const camera: Camera = { azimuth: BOX.azimuth + (MANUAL.azimuth - BOX.azimuth) * t, elevation: BOX.elevation + (MANUAL.elevation - BOX.elevation) * t }
  const p: Projector = projector(unit, camera)
  const P = (point: Point3) => p.point(point[0] - OX, point[1] - OY, point[2])
  const extent: [number, number][] = []
  const seen = (points: [number, number][]) => { extent.push(...points); return points }

  // Layers move apart in the manual view, like an exploded instruction page.
  const rise = 4.2 * t
  const shieldBase = 5.8 + rise
  const shieldGap = 0.42 + 0.55 * t
  const mirrorLift = rise + 1.4 * t
  const moduleLift = 0.6 * t
  const shieldTop = shieldBase + shieldGap * 4

  const stand = box('stand', 'base', '#59606a', '', 9.5, 5.5, 0, 1, 1, 3.6)
  const bus = box('bus', 'foundations', hexOf('foundations'), 'Spacecraft', 7.5, 4, 3.6, 5, 4, 1.8, 'Bus')
  const radiator = box('radiator', 'foundations', darken(hexOf('foundations'), 0.25), '', 12.5, 4.5, 3.9, 1, 3, 1.2)
  const module1 = box('module-1', 'data', hexOf('data'), 'Ingest', 15.8, 0.9, shieldTop + 0.3 + moduleLift, 3.4, 2.6, 1.2, 'Instruments')
  const module2 = box('module-2', 'data', lighten(hexOf('data'), 0.12), 'Store & check', 15.8, 0.9, shieldTop + 1.5 + moduleLift, 3.4, 2.6, 1.2)
  ;[stand, bus, radiator, module1, module2].forEach(item => { item.box.x -= OX; item.box.y -= OY })
  ;[stand, bus, radiator, module1, module2].forEach(item => {
    const { x, y, z, w, d, h } = item.box
    seen([p.point(x, y, z), p.point(x + w, y + d, z + h), p.point(x, y + d, z), p.point(x + w, y, z + h)])
  })

  const panel: Point3[] = [[1.6, 5, 4.3], [7.5, 5, 4.3], [7.5, 7.4, 4.3], [1.6, 7.4, 4.3]]
  const shields = SHIELD_COLORS.map((color, index) => ({ color, points: seen(SHIELD.map(([x, y]) => P([x, y, shieldBase + shieldGap * index]))) }))

  const centre: Point3 = [10, 4.2, 11.6 + mirrorLift]
  const along = (point: Point3, du: number, dv: number): Point3 => [point[0] + du, point[1] - dv * Math.sin(TILT), point[2] + dv * Math.cos(TILT)]
  const segments = SEGMENTS.map(([q, r], index) => {
    const cx = HEX_SIZE * Math.sqrt(3) * (q + r / 2)
    const cy = -HEX_SIZE * 1.5 * r
    const corners = Array.from({ length: 6 }, (_, k) => {
      const angle = ((90 + 60 * k) * Math.PI) / 180
      return P(along(centre, cx + HEX_SIZE * 0.93 * Math.cos(angle), cy + HEX_SIZE * 0.93 * Math.sin(angle)))
    })
    const shade = ((q - r + 4) % 3) * 0.07
    return { key: `${q}:${r}:${index}`, corners: seen(corners), fill: lighten(hexOf('ai'), shade) }
  })
  const secondary: Point3 = [10, 9.6, 12.4 + mirrorLift]
  const strutFeet = [along(centre, 0, HEX_SIZE * 4.2), along(centre, -HEX_SIZE * 3.4, -HEX_SIZE * 2.2), along(centre, HEX_SIZE * 3.4, -HEX_SIZE * 2.2)]
  seen([P(secondary), ...strutFeet.map(P)])
  seen([p.point(0, PLATE.d, -1.6), p.point(PLATE.w, PLATE.d, -1.6), p.point(PLATE.w, 0, -1.6)])

  const minX = Math.min(...extent.map(c => c[0])) - 210
  const maxX = Math.max(...extent.map(c => c[0])) + 210
  const minY = Math.min(...extent.map(c => c[1])) - 26
  const maxY = Math.max(...extent.map(c => c[1])) + 10
  const labelsShown = Math.max(0, t * 2 - 1)

  const group = (id: string, children: ReactNode) => <g data-group={id}><g>{children}</g></g>
  const callout = (anchor: [number, number], side: 1 | -1, lift: number, title: string, subtitle: string, id: string) => {
    const end: [number, number] = [anchor[0] + side * 70, anchor[1] - lift]
    const textX = end[0] + side * 6
    return <g key={id} className={`wb-callout${focus === id ? ' is-active' : ''}`} opacity={labelsShown} aria-hidden="true">
      <circle cx={anchor[0]} cy={anchor[1]} r="2.6" fill="#1d2420" />
      <path d={`M ${anchor[0]} ${anchor[1]} L ${end[0]} ${end[1]}`} stroke="#1d2420" strokeWidth="1" fill="none" />
      <text x={textX} y={end[1] - 2} textAnchor={side > 0 ? 'start' : 'end'} fontSize="14" fontWeight="800" fill="#1b2c26">{title}</text>
      <text x={textX} y={end[1] + 14} textAnchor={side > 0 ? 'start' : 'end'} fontSize="12" fill="#4b5a52">{subtitle}</text>
    </g>
  }

  return <svg className="iso-scene wb-scene" viewBox={`${minX.toFixed(1)} ${minY.toFixed(1)} ${(maxX - minX).toFixed(1)} ${(maxY - minY).toFixed(1)}`} role="img" aria-labelledby={titleId}>
    <title id={titleId}>A LEGO-style model of the James Webb Space Telescope: a display stand for the operating model, the spacecraft bus for foundations, the instruments for data, the gold mirror for the AI application, and the five-layer sunshield for the agent harness.</title>
    <Baseplate w={PLATE.w} d={PLATE.d} p={p} label="Mission control" />
    {group('base', <IsoBrick brick={stand} p={p} />)}
    {group('foundations', <>
      <path d={pathFrom(panel.map(P))} fill="#1f3f7a" stroke="#0f2140" strokeWidth=".8" strokeLinejoin="round" />
      {[1, 2, 3, 4].map(i => { const x = 1.6 + (5.9 / 5) * i; return <path key={i} d={`M ${P([x, 5, 4.3]).join(' ')} L ${P([x, 7.4, 4.3]).join(' ')}`} stroke="#5f86c9" strokeWidth=".7" /> })}
      <IsoBrick brick={bus} p={p} />
      <IsoBrick brick={radiator} p={p} />
    </>)}
    {group('harness', shields.map((layer, index) => <path key={index} d={pathFrom(layer.points)} fill={layer.color} stroke={darken(layer.color, 0.35)} strokeWidth=".9" strokeLinejoin="round" />))}
    {group('data', <><IsoBrick brick={module1} p={p} /><IsoBrick brick={module2} p={p} /></>)}
    {group('ai', <>
      {segments.map(segment => <path key={segment.key} d={pathFrom(segment.corners)} fill={segment.fill} stroke={darken(hexOf('ai'), 0.4)} strokeWidth=".8" strokeLinejoin="round" />)}
      {strutFeet.map((foot, index) => <path key={`strut-${index}`} d={`M ${P(foot).join(' ')} L ${P(secondary).join(' ')}`} stroke="#4a3d1c" strokeWidth="1.6" />)}
      <circle cx={P(secondary)[0]} cy={P(secondary)[1]} r={unit * 0.42} fill={lighten(hexOf('ai'), 0.2)} stroke={darken(hexOf('ai'), 0.4)} strokeWidth=".9" />
    </>)}
    {callout(segments.flatMap(segment => segment.corners).reduce((best, point) => point[0] - point[1] > best[0] - best[1] ? point : best), 1, 18, 'Mirror · 18 segments', 'AI application', 'ai')}
    {callout(P([19.2, 2.2, shieldTop + 1.0 + moduleLift]), 1, -20, 'Instruments', 'Data engineering', 'data')}
    {callout(shields[4].points[0], -1, 18, 'Sunshield · 5 layers', 'Agent harness', 'harness')}
    {callout(P([7.5, 8, 4.6]), -1, -10, 'Spacecraft bus', 'Foundations', 'foundations')}
    {callout(P([OX, OY + PLATE.d, -0.8]), -1, -8, 'Display stand', 'Operating model', 'base')}
  </svg>
}

export default function WebbOverview() {
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

  const view = t < 0.5 ? 'box' : 'manual'

  return <section className="fd-castle" aria-labelledby="fd-title">
    <div className="fc-inner">
      <div className="fc-left">
        <h1 id="fd-title">Chromatic Architecture</h1>
        <p className="fc-lead">Building software for production is like building the James Webb Space Telescope out of LEGO. Everyone sees the gold mirror. It only works because of the layers around it.</p>
        <p className="fc-sub">Webb had one chance to unfold, with 344 single points of failure. Most of what you build can be swapped after launch, so you can learn and iterate. Knowing which parts are hard to change later is what this site is for.</p>
        <div className={`fc-scene${focus ? ' has-focus' : ''}`} data-focus={focus} style={{ '--fc-labels': Math.max(0, t * 2 - 1).toFixed(2) } as CSSProperties}>
          <span className="fc-boxart" style={{ opacity: Math.max(0, 1 - t * 2.5) }} aria-hidden="true">Want to build this?</span>
          <WebbScene t={t} unit={20} focus={focus} />
          <div className="fc-views" role="group" aria-label="Telescope view">
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
      <p className="fc-caveat">A metaphor for layers, not an architecture diagram, and a LEGO-style model rather than an engineering drawing of Webb. Each layer has its own page, where real products fill the parts and you can test how they fit.</p>
    </div>
  </section>
}
