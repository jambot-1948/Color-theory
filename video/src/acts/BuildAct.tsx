import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
// Everything below comes from the site itself: same data, same build rules, same brick renderer.
import { architecturalChromaticsData as data } from '../../../preview/src/architectural-chromatics-data'
import { assemblyStories } from '../../../preview/src/assemblyStories'
import { slotLinks, slotTools, slotsFromTools, type SlotTool } from '../../../preview/src/bricks/capabilityModel'
import { readBuild, verdictCopy, type Seat } from '../../../preview/src/bricks/buildModel'
import { sceneBricks } from '../../../preview/src/bricks/scene'
import { Baseplate, BrickIcon, IsoBrick, type SceneBrick } from '../../../preview/src/bricks/Brick'
import { BRICK_HEIGHT, PLATE_HEIGHT, SEAT_COLORS, STUD_HEIGHT, depthSort, projector, type Box } from '../../../preview/src/bricks/iso'
import { INK, MUTED, PAPER, SUBTLE } from '../theme'

// ---------------------------------------------------------------------------
// The build: the Lean Knowledge Agent, exactly as the site's front-page hero builds it.
// ---------------------------------------------------------------------------
const slots = [...slotsFromTools('ai', ['openai', 'openai-agents-sdk', 'pinecone']), { capability: 'model-api', product: 'claude' }]
const allParts = slotTools('ai', data, slots)
const missingHues = data.recipes.find(recipe => recipe.id === 'lean-agent-runtime')?.missingHues ?? []
const links = slotLinks('ai', data, slots, assemblyStories['lean-agent-runtime'].links)

const steps = [
  { parts: 1, action: 'Place a capability', copy: 'Each brick is a capability. Colour is its role. The printed label is the product that fills it.' },
  { parts: 2, action: 'Snap on an agent runtime', copy: 'It locks because a pairing is recorded: the Agents SDK uses OpenAI models by default.' },
  { parts: 3, action: 'Snap on retrieval', copy: 'A curated recipe links them. That is an integration to build and test, not an automatic connection.' },
  { parts: 4, action: 'Force a second model', copy: 'Two products on one capability get pushed off their studs until someone names how the work splits.' },
  { parts: 3, missing: true, action: 'Read what is missing', copy: 'Take it off and the model holds. Pale placeholders mark the roles this build leaves out.' },
] as const

function readStep(index: number) {
  const step = steps[index]
  const tools = allParts.slice(0, step.parts)
  const gaps = 'missing' in step ? [...missingHues] : []
  return readBuild('ai', tools, links, { gaps })
}

// Final positions for every part and placeholder, from the site's own layout.
const layoutBricks = sceneBricks({ edition: 'ai', data, tools: allParts, layoutTools: allParts, links, ghostHues: [...missingHues] })
const ghosts = layoutBricks.filter(brick => brick.state === 'ghost')
const partBricks = allParts.map(part => layoutBricks.find(brick => brick.id === part.id)!)

// ---------------------------------------------------------------------------
// Timeline (frames at 30fps)
// ---------------------------------------------------------------------------
const STEP_START = [40, 185, 330, 475, 690]
const SHOVE_AT = 530
const GHOSTS_AT = 735
const STAMP_AT = 815
const CAVEAT_AT = 900
export const BUILD_DURATION = 1020

const stepAt = (frame: number) => STEP_START.reduce((current, start, index) => (frame >= start ? index : current), 0)

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------
const UNIT = 20
const p = projector(UNIT)
const PLATE = { w: 12, d: 6 }

function viewBox() {
  const reach = 4 * BRICK_HEIGHT + 2.6
  const floor = -PLATE_HEIGHT
  const corners = [p.point(0, PLATE.d, floor), p.point(PLATE.w, 0, reach), p.point(PLATE.w, PLATE.d, floor), p.point(0, 0, reach), p.point(PLATE.w + 1.5, 0, reach)]
  const minX = Math.min(...corners.map(c => c[0])) - 8
  const maxX = Math.max(...corners.map(c => c[0])) + 14
  const minY = Math.min(...corners.map(c => c[1])) - 4
  const maxY = Math.max(...corners.map(c => c[1])) + 8
  return `${minX} ${minY} ${maxX - minX} ${maxY - minY}`
}

interface Drawn { brick: SceneBrick, sortBox: Box, opacity: number }

function Badge({ box, seat, scale }: { box: Box, seat: Exclude<Seat, 'base'>, scale: number }) {
  const [bx, by] = p.point(box.x + box.w, box.y, box.z + box.h)
  const color = SEAT_COLORS[seat]
  const r = UNIT * 0.52
  const cx = bx + r * 0.3
  const cy = by - r * 1.1
  return <g transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`}>
    <circle cx={cx} cy={cy} r={r} fill="#fff" stroke={color} strokeWidth="1.6" />
    {seat === 'snap' && <path d={`M ${cx - r * 0.45} ${cy} L ${cx - r * 0.1} ${cy + r * 0.35} L ${cx + r * 0.5} ${cy - r * 0.35}`} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />}
    {seat === 'loose' && <path d={`M ${cx - r * 0.5} ${cy + r * 0.05} q ${r * 0.25} ${-r * 0.4} ${r * 0.5} 0 t ${r * 0.5} 0`} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />}
    {seat === 'clash' && <path d={`M ${cx - r * 0.38} ${cy - r * 0.38} L ${cx + r * 0.38} ${cy + r * 0.38} M ${cx + r * 0.38} ${cy - r * 0.38} L ${cx - r * 0.38} ${cy + r * 0.38}`} stroke={color} strokeWidth="1.8" strokeLinecap="round" />}
  </g>
}

function DropArrow({ box, opacity, clash }: { box: Box, opacity: number, clash?: boolean }) {
  const [cx, topY] = p.point(box.x + box.w / 2, box.y + box.d / 2, box.z + box.h + STUD_HEIGHT)
  const start = topY - UNIT * 3.4
  const end = topY - UNIT * 1.5
  const color = clash ? SEAT_COLORS.clash : INK
  return <g opacity={opacity}>
    <line x1={cx} y1={start} x2={cx} y2={end - 5} stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    <path d={`M ${cx - 5.5} ${end - 7} L ${cx} ${end} L ${cx + 5.5} ${end - 7} Z`} fill={color} />
  </g>
}

function Scene({ frame, fps }: { frame: number, fps: number }) {
  const drawn: Drawn[] = []
  const badges: { key: string, box: Box, seat: Exclude<Seat, 'base'>, scale: number }[] = []
  const arrows: { key: string, box: Box, opacity: number, clash?: boolean }[] = []
  const seats = readStep(3).seats
  const inFinal = frame >= STEP_START[4]
  const badgeFade = interpolate(frame, [STEP_START[4], STEP_START[4] + 12], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  partBricks.forEach((brick, index) => {
    const start = STEP_START[index] + 8
    if (frame < start) return
    const t = frame - start
    const drop = spring({ frame: t, fps, config: { damping: 13, stiffness: 140, mass: 0.8 } })
    const isForced = seats[index].seat === 'clash'
    let box: Box = { ...brick.box, z: brick.box.z + (1 - drop) * 7 }
    let state: SceneBrick['state'] = 'seated'
    let opacity = interpolate(t, [0, 5], [0, 1], { extrapolateRight: 'clamp' })
    let sortBox = brick.box

    if (isForced && frame >= SHOVE_AT) {
      // Lands, then gets pushed off its studs. IsoBrick displaces a clash brick by (+0.7 x, +0.45 z); ease into that.
      const shove = spring({ frame: frame - SHOVE_AT, fps, config: { damping: 9, stiffness: 180, mass: 0.7 } })
      const shake = Math.sin((frame - SHOVE_AT) * 1.9) * 0.1 * Math.max(0, 1 - (frame - SHOVE_AT) / 18)
      state = 'clash'
      box = { ...box, x: box.x - 0.7 * (1 - shove) + shake, z: box.z - 0.45 * (1 - shove) }
      sortBox = { ...brick.box, x: brick.box.x + 0.7, z: brick.box.z + 0.45 }
    }
    if (isForced && inFinal) {
      const lift = interpolate(frame, [STEP_START[4], STEP_START[4] + 28], [0, 1], { extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) })
      box = { ...box, z: box.z + lift * 9 }
      opacity *= 1 - lift
      if (lift >= 1) return
    }

    drawn.push({ brick: { ...brick, box, state, badge: undefined, isNew: false, restsAt: undefined }, sortBox, opacity })

    const seat = seats[index].seat
    const badgeStart = isForced ? SHOVE_AT + 6 : start + 12
    // Earlier checks step aside while the forced part arrives, so its ✕ is read on its own.
    const makeRoom = isForced ? 1 : interpolate(frame, [STEP_START[3], STEP_START[3] + 10], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    if (seat !== 'base' && frame >= badgeStart && badgeFade * makeRoom > 0) {
      const pop = spring({ frame: frame - badgeStart, fps, config: { damping: 10, stiffness: 200 } })
      badges.push({ key: brick.id, box: isForced ? sortBox : brick.box, seat, scale: pop * badgeFade * makeRoom })
    }
    const arrowOpacity = interpolate(frame, [start - 14, start - 4, start + 10, start + 20], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    if (arrowOpacity > 0) arrows.push({ key: brick.id, box: brick.box, opacity: arrowOpacity, clash: isForced })
  })
  // Arrows lead the brick in.
  partBricks.forEach((brick, index) => {
    const start = STEP_START[index] + 8
    if (frame >= start - 14 && frame < start) arrows.push({ key: `${brick.id}-lead`, box: brick.box, opacity: interpolate(frame, [start - 14, start - 4], [0, 1], { extrapolateRight: 'clamp' }), clash: seats[index].seat === 'clash' })
  })

  ghosts.forEach((ghost, index) => {
    const start = GHOSTS_AT + index * 12
    if (frame < start) return
    const settle = spring({ frame: frame - start, fps, config: { damping: 16, stiffness: 110 } })
    drawn.push({ brick: { ...ghost, box: { ...ghost.box, z: ghost.box.z + (1 - settle) * 1.6 } }, sortBox: ghost.box, opacity: interpolate(frame - start, [0, 10], [0, 1], { extrapolateRight: 'clamp' }) })
  })

  const sorted = depthSort(drawn.map(item => ({ ...item, box: item.sortBox })))
  return <svg viewBox={viewBox()} style={{ width: '100%', height: '100%', overflow: 'visible', fontFamily: 'Inter, sans-serif' }}>
    <Baseplate w={PLATE.w} d={PLATE.d} p={p} />
    {sorted.map(item => <g key={item.brick.id} opacity={item.opacity}><IsoBrick brick={item.brick} p={p} /></g>)}
    {badges.map(badge => <Badge key={badge.key} box={badge.box} seat={badge.seat} scale={badge.scale} />)}
    {arrows.map(arrow => <DropArrow key={arrow.key} box={arrow.box} opacity={arrow.opacity} clash={arrow.clash} />)}
  </svg>
}

// ---------------------------------------------------------------------------
// Words
// ---------------------------------------------------------------------------
const toneColor: Record<string, string> = { clean: SEAT_COLORS.snap, snap: SEAT_COLORS.snap, loose: SEAT_COLORS.loose, forced: SEAT_COLORS.clash, gaps: '#56655d', caution: '#b0562f', base: MUTED }

function chipFor(index: number) {
  const reading = readStep(index)
  if ('missing' in steps[index]) return { tone: reading.verdict, label: verdictCopy[reading.verdict].label }
  const newest = reading.seats.at(-1)
  if (!newest || newest.seat === 'base') return { tone: 'base', label: 'On the baseplate' }
  if (newest.seat === 'clash') return { tone: 'forced', label: 'Forced: one capability, two products' }
  if (newest.seat === 'snap') return { tone: 'snap', label: `Snaps onto ${(newest.partner as SlotTool | undefined)?.product?.name ?? newest.partner?.name}` }
  return { tone: 'loose', label: 'Sits loose' }
}

function StepCopy({ frame, fps }: { frame: number, fps: number }) {
  const index = stepAt(frame)
  const step = steps[index]
  const start = STEP_START[index]
  const next = STEP_START[index + 1] ?? BUILD_DURATION + 100
  const enter = spring({ frame: frame - start, fps, config: { damping: 20, stiffness: 120 } })
  const exit = interpolate(frame, [next - 10, next], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const chipAt = index === 3 ? SHOVE_AT + 8 : index === 4 ? STAMP_AT : start + 22
  const chipIn = spring({ frame: frame - chipAt, fps, config: { damping: 14, stiffness: 160 } })
  const chip = chipFor(index)
  const color = toneColor[chip.tone] ?? MUTED

  return <div style={{ opacity: Math.min(enter, exit), transform: `translateY(${(1 - enter) * 28}px)` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: 40 }}>
      <span style={{ fontSize: 18, fontWeight: 800, color: SUBTLE, letterSpacing: '0.06em' }}>STEP {String(index + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}</span>
      {frame >= chipAt && index !== 4 && <span style={{ fontSize: 17, fontWeight: 800, padding: '6px 13px', border: `2.5px solid ${color}`, borderRadius: 5, background: '#fff', color, opacity: chipIn, transform: `scale(${0.85 + 0.15 * chipIn})`, transformOrigin: 'left center' }}>{chip.label}</span>}
    </div>
    <h2 style={{ margin: '22px 0 20px', fontSize: 64, lineHeight: 1.05, fontWeight: 760, color: INK, letterSpacing: '-0.01em' }}>{step.action}</h2>
    <p style={{ margin: 0, fontSize: 29, lineHeight: 1.45, color: '#41554a', maxWidth: 600 }}>{step.copy}</p>
  </div>
}

function StepTicks({ frame }: { frame: number }) {
  const active = stepAt(frame)
  return <div style={{ display: 'flex', gap: 6 }}>
    {steps.map((step, index) => <span key={step.action} style={{ width: 52, height: 42, display: 'grid', placeItems: 'center', fontSize: 16, fontWeight: 750, color: index === active ? '#173c2b' : '#8b9a90', background: index === active ? '#e1eae2' : 'transparent', border: `1.5px solid ${index === active ? '#91a99a' : 'transparent'}`, borderRadius: 4 }}>{String(index + 1).padStart(2, '0')}</span>)}
  </div>
}

function MissingParts({ frame, fps }: { frame: number, fps: number }) {
  if (frame < GHOSTS_AT + 10) return null
  const enter = spring({ frame: frame - GHOSTS_AT - 10, fps, config: { damping: 18, stiffness: 120 } })
  return <div style={{ opacity: enter, transform: `translateY(${(1 - enter) * 16}px)`, display: 'flex', flexDirection: 'column', gap: 12, padding: '16px 22px 18px', border: '2.5px dashed #b5c0b9', borderRadius: 10, background: '#fafbfa' }}>
    <small style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.06em', color: '#617068' }}>MISSING PARTS</small>
    <div style={{ display: 'flex', gap: 26 }}>
      {missingHues.map((id, index) => {
        const hue = data.hues.find(item => item.id === id)
        const show = interpolate(frame, [GHOSTS_AT + index * 12, GHOSTS_AT + index * 12 + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        return <span key={id} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 22, fontWeight: 700, color: '#33443b', opacity: show }}>
          <span style={{ width: 54 }}><BrickIcon hex={hue?.hex ?? '#8a948f'} unit={6} ghost /></span>{hue?.name ?? id}
        </span>
      })}
    </div>
  </div>
}

function Stamp({ frame, fps }: { frame: number, fps: number }) {
  if (frame < STAMP_AT) return null
  const reading = readStep(4)
  const slam = spring({ frame: frame - STAMP_AT, fps, config: { damping: 11, stiffness: 220, mass: 0.9 } })
  const color = toneColor[reading.verdict]
  return <div style={{ transform: `scale(${1.6 - 0.6 * slam}) rotate(-4deg)`, opacity: Math.min(1, slam * 1.4), display: 'inline-flex', flexDirection: 'column', gap: 4, padding: '14px 22px', border: `4px solid ${color}`, borderRadius: 6, color, background: '#fff', boxShadow: '0 10px 30px #1d242014' }}>
    <small style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.08em', opacity: 0.8 }}>FINISHED MODEL</small>
    <strong style={{ fontSize: 34, fontWeight: 800 }}>{verdictCopy[reading.verdict].label}</strong>
  </div>
}

// ---------------------------------------------------------------------------
export function BuildAct() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const intro = interpolate(frame, [0, 24], [0, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })
  const caveat = interpolate(frame, [CAVEAT_AT, CAVEAT_AT + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const outro = interpolate(frame, [BUILD_DURATION - 20, BUILD_DURATION], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return <AbsoluteFill style={{ background: PAPER, fontFamily: 'Inter, sans-serif', opacity: outro }}>
    <div style={{ position: 'absolute', left: 120, top: 96, fontSize: 17, fontWeight: 800, letterSpacing: '0.14em', color: SUBTLE, opacity: intro }}>THE BUILD · LEAN KNOWLEDGE AGENT</div>

    <div style={{ position: 'absolute', left: 120, top: 300, width: 660 }}><StepCopy frame={frame} fps={fps} /></div>
    <div style={{ position: 'absolute', left: 120, bottom: 96, opacity: intro }}><StepTicks frame={frame} /></div>

    <div style={{ position: 'absolute', right: 20, top: 40, width: 1200, height: 910, opacity: intro, transform: `translateY(${(1 - intro) * 30}px)` }}>
      <Scene frame={frame} fps={fps} />
    </div>
    <div style={{ position: 'absolute', right: 150, top: 150 }}><Stamp frame={frame} fps={fps} /></div>
    <div style={{ position: 'absolute', left: 120, top: 640 }}><MissingParts frame={frame} fps={fps} /></div>

    <div style={{ position: 'absolute', left: 120, right: 120, bottom: 44, fontSize: 19, color: MUTED, opacity: caveat, textAlign: 'right' }}>
      Stacking shows relationships and tiers, not runtime wiring or data flow.
    </div>
  </AbsoluteFill>
}
