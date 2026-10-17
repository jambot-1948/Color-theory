import type { ReactNode } from 'react'
import { interpolate, spring } from 'remotion'
import { Baseplate, IsoBrick, type SceneBrick } from '../../../preview/src/bricks/Brick'
import type { Seat } from '../../../preview/src/bricks/buildModel'
import { BRICK_HEIGHT, PLATE_HEIGHT, SEAT_COLORS, STUD_HEIGHT, depthSort, projector, type Box, type Projector } from '../../../preview/src/bricks/iso'
import { INK } from '../theme'

// Shared motion for every act: parts drop in on a spring, move between steps, and lift away when removed.
// The bricks themselves are the site's IsoBrick, so nothing here redraws the grammar.

export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const
const PLINTH_HEIGHT = 1.1

export function viewBoxFor(p: Projector, plate: { w: number, d: number }, maxTier = 4, plinth = false, headroom = 2.6) {
  const reach = maxTier * BRICK_HEIGHT + headroom
  const floor = -PLATE_HEIGHT - (plinth ? PLINTH_HEIGHT : 0)
  const corners = [p.point(0, plate.d, floor), p.point(plate.w, 0, reach), p.point(plate.w, plate.d, floor), p.point(0, 0, reach), p.point(plate.w + 1.5, 0, reach)]
  const minX = Math.min(...corners.map(c => c[0])) - 8
  const maxX = Math.max(...corners.map(c => c[0])) + 14
  const minY = Math.min(...corners.map(c => c[1])) - 4
  const maxY = Math.max(...corners.map(c => c[1])) + 8
  return `${minX} ${minY} ${maxX - minX} ${maxY - minY}`
}

// Where IsoBrick actually draws a part once its seat is applied. Used for depth order and badge placement.
export function drawnBox(box: Box, state: SceneBrick['state']): Box {
  if (state === 'clash') return { ...box, x: box.x + 0.7, z: box.z + 0.45 }
  if (state === 'loose') return { ...box, z: box.z + 0.14 }
  return box
}

export function SeatBadge({ p, box, seat, scale }: { p: Projector, box: Box, seat: Exclude<Seat, 'base'>, scale: number }) {
  const [bx, by] = p.point(box.x + box.w, box.y, box.z + box.h)
  const color = SEAT_COLORS[seat]
  const r = p.unit * 0.52
  const cx = bx + r * 0.3
  const cy = by - r * 1.1
  return <g transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`}>
    <circle cx={cx} cy={cy} r={r} fill="#fff" stroke={color} strokeWidth="1.6" />
    {seat === 'snap' && <path d={`M ${cx - r * 0.45} ${cy} L ${cx - r * 0.1} ${cy + r * 0.35} L ${cx + r * 0.5} ${cy - r * 0.35}`} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />}
    {seat === 'loose' && <path d={`M ${cx - r * 0.5} ${cy + r * 0.05} q ${r * 0.25} ${-r * 0.4} ${r * 0.5} 0 t ${r * 0.5} 0`} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />}
    {seat === 'clash' && <path d={`M ${cx - r * 0.38} ${cy - r * 0.38} L ${cx + r * 0.38} ${cy + r * 0.38} M ${cx + r * 0.38} ${cy - r * 0.38} L ${cx - r * 0.38} ${cy + r * 0.38}`} stroke={color} strokeWidth="1.8" strokeLinecap="round" />}
  </g>
}

export function DropArrow({ p, box, opacity, clash }: { p: Projector, box: Box, opacity: number, clash?: boolean }) {
  const [cx, topY] = p.point(box.x + box.w / 2, box.y + box.d / 2, box.z + box.h + STUD_HEIGHT)
  const start = topY - p.unit * 3.4
  const end = topY - p.unit * 1.5
  const color = clash ? SEAT_COLORS.clash : INK
  return <g opacity={opacity}>
    <line x1={cx} y1={start} x2={cx} y2={end - 5} stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    <path d={`M ${cx - 5.5} ${end - 7} L ${cx} ${end} L ${cx + 5.5} ${end - 7} Z`} fill={color} />
  </g>
}

export interface Keyframe {
  at: number
  bricks: SceneBrick[]
}

interface MorphProps {
  frame: number
  fps: number
  keyframes: Keyframe[]
  plate: { w: number, d: number }
  unit?: number
  plateLabel?: string
  plateOpacity?: number
  badges?: boolean
  maxTier?: number
  headroom?: number
  children?: ReactNode
}

// Steps between keyframes: kept parts glide to their new seat, new parts drop in (staggered),
// placeholders fade in, and parts that leave lift off and fade.
export function MorphScene({ frame, fps, keyframes, plate, unit = 20, plateLabel, plateOpacity = 1, badges = true, maxTier = 4, headroom = 2.6, children }: MorphProps) {
  const p = projector(unit)
  const index = keyframes.reduce((current, key, i) => (frame >= key.at ? i : current), -1)
  const drawn: { brick: SceneBrick, sortBox: Box, opacity: number }[] = []
  const pops: { key: string, box: Box, seat: Exclude<Seat, 'base'>, scale: number }[] = []

  if (index >= 0) {
    const key = keyframes[index]
    const prev = index > 0 ? keyframes[index - 1] : undefined
    const t = frame - key.at
    const prevById = new Map((prev?.bricks ?? []).map(brick => [brick.id, brick]))
    const arriving = key.bricks.filter(brick => brick.state !== 'ghost' && brick.state !== 'removed' && !prevById.has(brick.id))

    key.bricks.forEach(brick => {
      const before = prevById.get(brick.id)
      const target = brick.box
      let box = target
      let opacity = 1
      let settled = true
      if (brick.state === 'ghost') {
        const order = key.bricks.filter(item => item.state === 'ghost').indexOf(brick)
        const local = t - 24 - order * 8
        if (!before) {
          if (local < 0) return
          const s = spring({ frame: local, fps, config: { damping: 16, stiffness: 110 } })
          box = { ...target, z: target.z + (1 - s) * 1.6 }
          opacity = interpolate(local, [0, 10], [0, 1], clamp)
        }
      } else if (before && before.state !== 'ghost') {
        const s = spring({ frame: t, fps, config: { damping: 18, stiffness: 90 } })
        const from = before.box
        box = { ...target, x: from.x + (target.x - from.x) * s, y: from.y + (target.y - from.y) * s, z: from.z + (target.z - from.z) * s }
        settled = s > 0.98
        if (brick.state === 'removed') opacity = interpolate(t, [0, 16], [1, 0.55], clamp)
      } else {
        const order = arriving.indexOf(brick)
        const local = t - 6 - Math.max(0, order) * 9
        if (local < 0) return
        const s = spring({ frame: local, fps, config: { damping: 13, stiffness: 140, mass: 0.8 } })
        box = { ...target, z: target.z + (1 - s) * 7 }
        opacity = interpolate(local, [0, 5], [0, 1], clamp)
        settled = local > 18
        if (badges && brick.badge && brick.badge !== 'base' && local > 12) {
          const pop = spring({ frame: local - 12, fps, config: { damping: 10, stiffness: 200 } })
          pops.push({ key: brick.id, box: drawnBox(target, brick.state), seat: brick.badge, scale: pop })
        }
      }
      drawn.push({ brick: { ...brick, box, isNew: false, badge: undefined, restsAt: settled ? brick.restsAt : undefined }, sortBox: drawnBox(target, brick.state), opacity })
    })

    // Parts that left since the last step lift away.
    prev?.bricks.filter(brick => brick.state !== 'removed' && !key.bricks.some(item => item.id === brick.id)).forEach(brick => {
      const lift = interpolate(t, [0, 20], [0, 1], clamp)
      if (lift >= 1) return
      drawn.push({ brick: { ...brick, box: { ...brick.box, z: brick.box.z + (brick.state === 'ghost' ? 0 : lift * 6) }, badge: undefined, restsAt: undefined }, sortBox: drawnBox(brick.box, brick.state), opacity: 1 - lift })
    })
  }

  const sorted = depthSort(drawn.map(item => ({ ...item, box: item.sortBox })))
  return <svg viewBox={viewBoxFor(p, plate, maxTier, Boolean(plateLabel), headroom)} style={{ width: '100%', height: '100%', overflow: 'visible', fontFamily: 'Inter, sans-serif' }}>
    <g opacity={plateOpacity}><Baseplate w={plate.w} d={plate.d} p={p} label={plateLabel} /></g>
    {sorted.map(item => <g key={item.brick.id} opacity={item.opacity}><IsoBrick brick={item.brick} p={p} /></g>)}
    {pops.map(pop => <SeatBadge key={pop.key} p={p} box={pop.box} seat={pop.seat} scale={pop.scale} />)}
    {children}
  </svg>
}
