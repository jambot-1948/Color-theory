import type { ReactNode } from 'react'
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { editionTiers, tierOf, verdictCopy } from '../../../preview/src/bricks/buildModel'
import { BrickIcon } from '../../../preview/src/bricks/Brick'
import { SEAT_COLORS, projector } from '../../../preview/src/bricks/iso'
import { MorphScene, clamp, viewBoxFor } from '../lib/motion'
import { Eyebrow } from '../lib/type'
import { INK, MUTED, PAPER, SUBTLE } from '../theme'
import { hueOf, readSystem, secondOrchestrator, systems } from '../goal'

// Act 3: one system up close. First one brick is read mark by mark, then the data system is built toward the job's placeholders.
// Every verdict is read by the site's rules; the job's unfilled roles count as missing parts.
const all = systems.data.tools
const withSecond = [...all, secondOrchestrator]
// Steps with no second orchestrator share one layout, so no part moves between them.
const at = (count: number, layout = all) => readSystem('data', layout.slice(0, count), layout)
const primer = readSystem('data', ['snowflake'], all)
const orchestrators = readSystem('data', withSecond, withSecond).tools.filter(tool => tool.primaryHue === 'orchestrate')
const [firstName, secondName] = orchestrators.map(tool => tool.product!.name)
const steps = [
  { start: 20, kind: 'primer', action: 'Read one brick', copy: '', read: primer, bricks: primer.parts },
  { start: 300, kind: 'build', action: 'Fill three roles', copy: 'Fivetran, dbt and Snowflake each fill a role. A ✓ means a pairing between them is recorded.', read: at(3) },
  { start: 500, kind: 'build', action: 'Fill two more', copy: `Trino and ${firstName} seat too. Every part links, yet the set is a named anti-pattern: ${at(5).match?.recipe.name ?? ''}.`, read: at(5) },
  { start: 710, kind: 'build', action: 'Ask the job again', copy: `The job asked for ${hueOf('data', 'govern').name} and ${hueOf('data', 'observe').name}. Nothing here fills them yet.`, read: at(5) },
  { start: 900, kind: 'build', action: 'Fill the roles the job asked for', copy: 'GX Core checks the data and DataHub records owners. Every role the job asked for is filled.', read: at(7) },
  { start: 1110, kind: 'build', action: 'Add a second orchestrator', copy: `${secondName} and ${firstName} both fill ${orchestrators[0].name}. Two products on one role stay marked until someone names how the work splits.`, read: at(8, withSecond) },
  { start: 1330, kind: 'build', action: 'Take it back off', copy: 'One orchestrator again. Every link is recorded; none has been tested.', read: at(7) },
].map(step => ({ ...step, bricks: 'bricks' in step ? step.bricks : step.read.bricks }))
const STAMP_AT = steps[6].start + 60
const FORCED = 5
export const DATA_BUILD_DURATION = 1560

const toneColor: Record<string, string> = { clean: SEAT_COLORS.snap, loose: SEAT_COLORS.loose, forced: SEAT_COLORS.clash, gaps: '#56655d', caution: '#b0562f', empty: MUTED }
const stepAt = (frame: number) => steps.reduce((current, step, index) => (frame >= step.start ? index : current), 0)

// ---------------------------------------------------------------------------
// Reading one brick: four marks carry all of its meaning. Everything printed here is read from the site's data.
// ---------------------------------------------------------------------------
const SCENE = { w: 1160, h: 910 }
const PLATE = { w: 12, d: 6 }
const PRIMER_ZOOM = 1.75
const p = projector(20)
const primerPart = primer.tools[0]
const primerBrick = primer.parts[0]
const primerHue = hueOf('data', primerPart.primaryHue)
const primerTier = editionTiers.data[tierOf('data', primerPart.primaryHue)].name
const marks = [
  { at: 80, title: 'Brick = capability', detail: `A job the system needs done: ${primerPart.name}.` },
  { at: 135, title: 'Colour = role', detail: `Why it is there: ${primerHue.name}.` },
  { at: 190, title: 'Label = product', detail: `What fills the job today: ${primerPart.product!.name}.` },
  { at: 245, title: 'Height = tier', detail: `${primerTier}. A reading aid, not data flow.` },
]

// Where the brick sits on screen, so the zoom can centre on it.
function primerOrigin() {
  const [minX, minY, width, height] = viewBoxFor(p, PLATE).split(' ').map(Number)
  const scale = Math.min(SCENE.w / width, SCENE.h / height)
  const b = primerBrick.box
  const [cx, cy] = p.point(b.x + b.w / 2, b.y + b.d / 2, b.z + b.h / 2)
  return `${(SCENE.w - width * scale) / 2 + (cx - minX) * scale}px ${(SCENE.h - height * scale) / 2 + (cy - minY) * scale}px`
}

function PrimerList({ frame, fps }: { frame: number, fps: number }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 8 }}>
    {marks.map((mark, index) => {
      if (frame < mark.at) return null
      const enter = spring({ frame: frame - mark.at, fps, config: { damping: 18, stiffness: 130 } })
      const active = index === marks.reduce((current, item, i) => (frame >= item.at ? i : current), 0)
      return <div key={mark.title} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', opacity: enter * (active ? 1 : 0.55), transform: `translateX(${(1 - enter) * -16}px)` }}>
        <span style={{ width: 38, height: 38, flex: 'none', display: 'grid', placeItems: 'center', borderRadius: 19, border: `2.5px solid ${INK}`, background: '#fff', fontSize: 20, fontWeight: 800, color: INK }}>{index + 1}</span>
        <span>
          <strong style={{ display: 'block', fontSize: 30, lineHeight: 1.1, fontWeight: 760, color: INK }}>{mark.title}</strong>
          <span style={{ display: 'block', marginTop: 4, maxWidth: 560, fontSize: 23, lineHeight: 1.3, color: '#41554a' }}>{mark.detail}</span>
        </span>
      </div>
    })}
  </div>
}

// Numbered markers on the brick, in step with the list. Drawn in the scene's own coordinates.
function PrimerMarks({ frame, fps }: { frame: number, fps: number }) {
  const b = primerBrick.box
  const P = p.point
  const gone = interpolate(frame, [steps[1].start - 30, steps[1].start - 10], [1, 0], clamp)
  if (gone <= 0) return null
  const pins: { at: [number, number], to: [number, number] }[] = [
    { at: P(b.x + 0.35, b.y + b.d, b.z + b.h * 0.9), to: [-24, -19] },
    { at: P(b.x + b.w, b.y + b.d * 0.3, b.z + b.h * 0.8), to: [26, -16] },
    { at: P(b.x + b.w * 0.62, b.y + b.d, b.z + b.h * 0.1), to: [-20, 24] },
  ]
  const [bx, by] = P(b.x, b.y + b.d, 0)
  const [tx, ty] = P(b.x, b.y + b.d, b.h)
  const bracketX = bx - 11
  const mark = (index: number, x: number, y: number) => {
    const pop = spring({ frame: frame - marks[index].at, fps, config: { damping: 11, stiffness: 190 } })
    return <g key={index} transform={`translate(${x} ${y}) scale(${pop})`}>
      <circle r="4.6" fill="#fff" stroke={INK} strokeWidth="0.9" />
      <text y="1.9" textAnchor="middle" fontSize="5.4" fontWeight="800" fill={INK} fontFamily="Inter, sans-serif">{index + 1}</text>
    </g>
  }
  return <g opacity={gone}>
    {pins.map((pin, index) => {
      if (frame < marks[index].at) return null
      const [x, y] = pin.at
      const grow = interpolate(frame, [marks[index].at, marks[index].at + 12], [0, 1], clamp)
      return <g key={index}>
        <line x1={x} y1={y} x2={x + pin.to[0] * grow} y2={y + pin.to[1] * grow} stroke={INK} strokeWidth="0.8" strokeLinecap="round" />
        <circle cx={x} cy={y} r="1.1" fill={INK} />
        {mark(index, x + pin.to[0], y + pin.to[1])}
      </g>
    })}
    {frame >= marks[3].at && <g opacity={interpolate(frame, [marks[3].at, marks[3].at + 10], [0, 1], clamp)}>
      <path d={`M ${bracketX + 3} ${ty} L ${bracketX} ${ty} L ${bracketX} ${by} L ${bracketX + 3} ${by}`} fill="none" stroke={INK} strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
      {mark(3, bracketX - 8, (ty + by) / 2)}
    </g>}
  </g>
}

// What the marks on a brick mean once parts start to join. Shown from the first snap on.
function SeatMark({ seat }: { seat: 'snap' | 'loose' | 'clash' }) {
  const color = SEAT_COLORS[seat]
  return <svg width="30" height="30" viewBox="0 0 28 28" style={{ flex: 'none' }}>
    <circle cx="14" cy="14" r="12" fill="#fff" stroke={color} strokeWidth="2" />
    {seat === 'snap' && <path d="M 8.6 14 L 12.8 18.2 L 19.8 9.8" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />}
    {seat === 'loose' && <path d="M 8 14.5 q 3 -4.8 6 0 t 6 0" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" />}
    {seat === 'clash' && <path d="M 9.5 9.5 L 18.5 18.5 M 18.5 9.5 L 9.5 18.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />}
  </svg>
}

function SeatKey({ frame }: { frame: number }) {
  const show = interpolate(frame, [steps[1].start + 70, steps[1].start + 95], [0, 1], clamp)
  const rows: { mark: ReactNode, name: string, text: string }[] = [
    { mark: <SeatMark seat="snap" />, name: 'Snaps', text: 'a pairing is recorded' },
    { mark: <SeatMark seat="loose" />, name: 'Loose', text: 'nothing recorded either way' },
    { mark: <SeatMark seat="clash" />, name: 'Forced', text: 'a recorded tension, or two products on one role' },
    { mark: <span style={{ width: 30, flex: 'none' }}><BrickIcon hex="#8a948f" unit={5} ghost /></span>, name: 'Missing', text: 'the job asks, nothing fills it' },
  ]
  return <div style={{ opacity: show, display: 'flex', flexDirection: 'column', gap: 9 }}>
    {rows.map(row => <div key={row.name} style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 20, color: '#41554a' }}>
      {row.mark}<span><strong style={{ color: INK, fontWeight: 760 }}>{row.name}</strong> · {row.text}</span>
    </div>)}
  </div>
}

function StepCopy({ frame, fps }: { frame: number, fps: number }) {
  const index = stepAt(frame)
  const step = steps[index]
  const next = steps[index + 1]?.start ?? DATA_BUILD_DURATION + 100
  const enter = spring({ frame: frame - step.start, fps, config: { damping: 20, stiffness: 120 } })
  const exit = interpolate(frame, [next - 10, next], [1, 0], clamp)
  const verdict = step.read.reading.verdict
  const chipIn = spring({ frame: frame - step.start - 40, fps, config: { damping: 14, stiffness: 160 } })
  const color = toneColor[verdict] ?? MUTED
  return <div style={{ opacity: Math.min(enter, exit), transform: `translateY(${(1 - enter) * 28}px)` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: 40 }}>
      <span style={{ fontSize: 18, fontWeight: 800, color: SUBTLE, letterSpacing: '0.06em' }}>STEP {String(index + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}</span>
      {index > 0 && index <= FORCED && frame >= step.start + 40 && <span style={{ fontSize: 17, fontWeight: 800, padding: '6px 13px', border: `2.5px solid ${color}`, borderRadius: 5, background: '#fff', color, opacity: chipIn, transform: `scale(${0.85 + 0.15 * chipIn})`, transformOrigin: 'left center' }}>{verdictCopy[verdict].label}</span>}
    </div>
    <h2 style={{ margin: '22px 0 20px', fontSize: 60, lineHeight: 1.05, fontWeight: 760, color: INK, letterSpacing: '-0.01em' }}>{step.action}</h2>
    {step.kind === 'primer' ? <PrimerList frame={frame} fps={fps} /> : <p style={{ margin: 0, fontSize: 29, lineHeight: 1.45, color: '#41554a', maxWidth: 620 }}>{step.copy}</p>}
  </div>
}

// The roles the job asked for that this build still leaves empty.
function StillMissing({ frame, fps }: { frame: number, fps: number }) {
  const step = steps[stepAt(frame)]
  const gaps = step.read.reading.gaps
  if (!gaps.length || step.kind === 'primer') return null
  const enter = spring({ frame: frame - step.start - 30, fps, config: { damping: 18, stiffness: 120 } })
  const loud = stepAt(frame) === 3
  return <div style={{ opacity: enter, display: 'flex', flexDirection: 'column', gap: 12, padding: '16px 22px 18px', border: `2.5px dashed ${loud ? '#b0562f' : '#b5c0b9'}`, borderRadius: 10, background: '#fafbfa' }}>
    <small style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.06em', color: loud ? '#b0562f' : '#617068' }}>THE JOB STILL NEEDS</small>
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', maxWidth: 580 }}>
      {gaps.map(id => {
        const hue = hueOf('data', id)
        return <span key={id} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 22, fontWeight: 700, color: '#33443b' }}>
          <span style={{ width: 54 }}><BrickIcon hex={hue.hex} unit={6} ghost /></span>{hue.name}
        </span>
      })}
    </div>
  </div>
}

function Stamp({ frame, fps }: { frame: number, fps: number }) {
  if (frame < STAMP_AT) return null
  const verdict = steps[6].read.reading.verdict
  const slam = spring({ frame: frame - STAMP_AT, fps, config: { damping: 11, stiffness: 220, mass: 0.9 } })
  const color = toneColor[verdict]
  return <div style={{ transform: `scale(${1.6 - 0.6 * slam}) rotate(-4deg)`, opacity: Math.min(1, slam * 1.4), display: 'inline-flex', flexDirection: 'column', gap: 4, padding: '14px 22px', border: `4px solid ${color}`, borderRadius: 6, color, background: '#fff', boxShadow: '0 10px 30px #1d242014' }}>
    <small style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.08em', opacity: 0.8 }}>FINISHED MODEL</small>
    <strong style={{ fontSize: 34, fontWeight: 800 }}>{verdictCopy[verdict].label}</strong>
    <small style={{ fontSize: 16, fontWeight: 700, opacity: 0.8 }}>Links recorded, not tested</small>
  </div>
}

export function DataBuildAct() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const intro = interpolate(frame, [0, 24], [0, 1], clamp)
  const outro = interpolate(frame, [DATA_BUILD_DURATION - 20, DATA_BUILD_DURATION], [1, 0], clamp)
  const caveat = interpolate(frame, [steps[1].start, steps[1].start + 20], [0, 1], clamp)
  // The primer is read up close; the build pulls back to the whole plate.
  const zoom = interpolate(frame, [steps[1].start - 25, steps[1].start + 25], [PRIMER_ZOOM, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) })
  return <AbsoluteFill style={{ background: PAPER, fontFamily: 'Inter, sans-serif', opacity: outro }}>
    <Eyebrow opacity={intro}>ONE SYSTEM UP CLOSE · {systems.data.name.toUpperCase()}</Eyebrow>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 680 }}><StepCopy frame={frame} fps={fps} /></div>
    <div style={{ position: 'absolute', left: 120, top: 640 }}><StillMissing frame={frame} fps={fps} /></div>
    <div style={{ position: 'absolute', left: 120, bottom: 84 }}><SeatKey frame={frame} /></div>
    <div style={{ position: 'absolute', right: 20, top: 40, width: SCENE.w, height: SCENE.h, opacity: intro, overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '100%', transform: `scale(${zoom})`, transformOrigin: primerOrigin() }}>
        <MorphScene frame={frame} fps={fps} plate={PLATE} keyframes={steps.map(step => ({ at: step.start, bricks: step.bricks }))}>
          <PrimerMarks frame={frame} fps={fps} />
        </MorphScene>
      </div>
      {/* Soft edges where the zoomed plate runs out of frame. */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: (zoom - 1) / (PRIMER_ZOOM - 1), background: `linear-gradient(to right, ${PAPER} 0, #f2f5f200 140px), linear-gradient(to top, ${PAPER} 0, #f2f5f200 120px)` }} />
    </div>
    <div style={{ position: 'absolute', right: 150, top: 150 }}><Stamp frame={frame} fps={fps} /></div>
    <div style={{ position: 'absolute', left: 120, right: 120, bottom: 44, fontSize: 19, color: MUTED, opacity: caveat, textAlign: 'right' }}>
      Height shows tier, a reading aid. Studs lock only where a pairing is recorded; stacking is not data flow.
    </div>
  </AbsoluteFill>
}
