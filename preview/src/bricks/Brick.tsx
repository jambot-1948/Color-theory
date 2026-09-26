import { useId } from 'react'
import {
  BRICK_HEIGHT, PLATE_HEIGHT, STUD_HEIGHT, STUD_RADIUS,
  SEAT_COLORS, circleRadii, darken, depthSort, inkOn, leftFaceMatrix, lighten, pathFrom, projector, rightFaceMatrix,
  type Box, type Projector,
} from './iso'
import type { Seat } from './buildModel'

export type BrickState = 'seated' | 'loose' | 'clash' | 'ghost' | 'removed'

export interface SceneBrick {
  id: string
  box: Box
  hex: string
  label: string
  tag?: string
  // Product printed on the brick like a sticker. null means the capability has no product chosen yet.
  sticker?: string | null
  state: BrickState
  isNew?: boolean
  badge?: Seat
  restsAt?: number
}

const INK = '#1d2420'

// A clashing part does not seat: it is lifted and pushed off its studs.
function displaced(box: Box, state: BrickState): Box {
  if (state === 'clash') return { ...box, x: box.x + 0.7, z: box.z + 0.45 }
  if (state === 'loose') return { ...box, z: box.z + 0.14 }
  return box
}

function Studs({ box, fill, side, stroke, p, dashed }: { box: Box, fill: string, side: string, stroke: string, p: Projector, dashed?: boolean }) {
  const [rx, ry] = circleRadii(STUD_RADIUS, p.unit)
  const studs: [number, number][] = []
  for (let i = 0; i < box.w; i++) for (let j = 0; j < box.d; j++) studs.push([i, j])
  studs.sort((a, b) => a[0] + a[1] - (b[0] + b[1]))
  return <g>{studs.map(([i, j]) => {
    const [cx, cyBase] = p.point(box.x + i + 0.5, box.y + j + 0.5, box.z + box.h)
    const cyTop = cyBase - STUD_HEIGHT * p.unit
    return <g key={`${i}-${j}`}>
      {!dashed && <><ellipse cx={cx} cy={cyBase} rx={rx} ry={ry} fill={side} /><rect x={cx - rx} y={cyTop} width={rx * 2} height={cyBase - cyTop} fill={side} /></>}
      <ellipse cx={cx} cy={dashed ? cyBase : cyTop} rx={rx} ry={ry} fill={fill} stroke={stroke} strokeWidth={dashed ? 0.6 : 0.5} strokeDasharray={dashed ? '1.6 1.6' : undefined} />
    </g>
  })}</g>
}

// Split a name over at most two lines that fit the brick's long face.
function labelLines(label: string, width: number) {
  const fits = Math.floor(width * 3.1)
  if (label.length <= fits) return [label]
  const words = label.split(' ')
  let first = ''
  while (words.length && `${first} ${words[0]}`.trim().length <= fits + 2) first = `${first} ${words.shift()}`.trim()
  if (!first) first = words.shift() ?? ''
  const rest = words.join(' ')
  const second = rest.length > fits + 2 ? `${rest.slice(0, fits + 1)}…` : rest
  return second ? [first, second] : [first]
}

function fitText(text: string, width: number, size: number) {
  const fits = Math.floor((width - 0.5) / (size * 0.6))
  return text.length > fits ? `${text.slice(0, fits - 1)}…` : text
}

// A printed tile on the brick's face naming the product that fills this capability.
function Sticker({ text, width, height, unit, edge }: { text: string | null, width: number, height: number, unit: number, edge: string }) {
  const size = 0.34
  const label = text ? fitText(text, width - 0.4, size) : 'choose a product'
  const w = Math.min(width - 0.5, label.length * size * 0.6 + 0.5) * unit
  const top = height * unit * 0.48
  const tall = height * unit * 0.4
  return <g>
    <rect x={unit * 0.22} y={top} width={w} height={tall} rx={unit * 0.08} fill={text ? '#fbfcfb' : 'none'} stroke={text ? edge : '#ffffff'} strokeWidth=".7" strokeDasharray={text ? undefined : '2 1.6'} opacity={text ? 0.96 : 0.8} />
    <text x={unit * 0.47} y={top + tall * 0.68} fontSize={unit * size} fontWeight={text ? 750 : 600} fill={text ? '#1d2420' : '#ffffff'} fontStyle={text ? undefined : 'italic'} style={{ letterSpacing: 0 }}>{label}</text>
  </g>
}

export function IsoBrick({ brick, p }: { brick: SceneBrick, p: Projector }) {
  const box = displaced(brick.box, brick.state)
  const { x, y, z, w, d, h } = box
  const ghost = brick.state === 'ghost' || brick.state === 'removed'
  // A missing part is a pale placeholder brick: solid enough to hide what is behind it, so its label stays legible.
  const placeholder = brick.state === 'ghost'
  const top = placeholder ? lighten(brick.hex, 0.9) : ghost ? 'none' : lighten(brick.hex, 0.18)
  const left = placeholder ? lighten(brick.hex, 0.82) : ghost ? 'none' : brick.hex
  const right = placeholder ? lighten(brick.hex, 0.74) : ghost ? 'none' : darken(brick.hex, 0.22)
  const stroke = brick.state === 'clash' ? SEAT_COLORS.clash : ghost ? darken(brick.hex, 0.2) : darken(brick.hex, 0.5)
  const strokeWidth = brick.isNew ? 1.5 : 0.8
  const dash = ghost ? '3 2.5' : undefined
  const P = (px: number, py: number, pz: number) => p.point(px, py, pz)
  const topFace = pathFrom([P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)])
  const leftFace = pathFrom([P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)])
  const rightFace = pathFrom([P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)])
  const lines = labelLines(brick.label, w)
  const fontSize = p.unit * (ghost ? 0.4 : lines.length > 1 ? 0.46 : 0.54)
  const ink = ghost ? darken(brick.hex, 0.45) : inkOn(brick.hex)
  const floating = brick.restsAt !== undefined && brick.state !== 'ghost' && brick.restsAt < brick.box.z - 0.05
  const footprint = floating ? [P(x, y, brick.restsAt!), P(x + w, y, brick.restsAt!), P(x + w, y + d, brick.restsAt!), P(x, y + d, brick.restsAt!)] : []
  const hangers = floating ? [[P(x, y + d, z), P(x, y + d, brick.restsAt!)], [P(x + w, y + d, z), P(x + w, y + d, brick.restsAt!)], [P(x + w, y, z), P(x + w, y, brick.restsAt!)]] : []

  return <g className={`iso-brick is-${brick.state}${brick.isNew ? ' is-new' : ''}`} opacity={placeholder ? 0.9 : undefined}>
    {floating && <g className="iso-hanger" aria-hidden="true"><path d={pathFrom(footprint)} fill="rgba(29,36,32,.06)" stroke="#8b978f" strokeWidth=".8" strokeDasharray="2.5 2" />{hangers.map(([from, to], index) => <line key={index} x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} stroke="#8b978f" strokeWidth=".8" strokeDasharray="2.5 2" />)}</g>}
    {brick.state === 'loose' && <path d={pathFrom([P(x, y + d, brick.box.z), P(x + w, y + d, brick.box.z), P(x + w, y, brick.box.z)]).replace(' Z', '')} fill="none" stroke={SEAT_COLORS.loose} strokeWidth="1" strokeDasharray="2 2" />}
    <path d={leftFace} fill={left} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={dash} strokeLinejoin="round" />
    <path d={rightFace} fill={right} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={dash} strokeLinejoin="round" />
    <path d={topFace} fill={top} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={dash} strokeLinejoin="round" />
    <Studs box={box} fill={top} side={right} stroke={ghost ? stroke : darken(brick.hex, 0.35)} p={p} dashed={ghost} />
    {brick.sticker === undefined ? <text transform={leftFaceMatrix(P(x, y + d, z + h))} fontSize={fontSize} fontWeight="750" fill={ink} style={{ letterSpacing: 0 }}>
      {lines.map((line, index) => <tspan key={index} x={p.unit * 0.28} y={h * p.unit * (lines.length > 1 ? 0.44 + index * 0.4 : 0.66)}>{line}</tspan>)}
    </text> : <g transform={leftFaceMatrix(P(x, y + d, z + h))}>
      <text x={p.unit * 0.28} y={h * p.unit * 0.36} fontSize={p.unit * 0.37} fontWeight="750" fill={ink} style={{ letterSpacing: 0 }}>{fitText(brick.label, w, 0.37)}</text>
      {!ghost && <Sticker text={brick.sticker} width={w} height={h} unit={p.unit} edge={darken(brick.hex, 0.45)} />}
    </g>}
    {brick.tag && <text transform={rightFaceMatrix(P(x + w, y + d, z + h))} x={p.unit * 0.22} y={h * p.unit * 0.62} fontSize={p.unit * 0.3} fontWeight="700" fill={ghost ? ink : inkOn(right)} opacity=".85" style={{ letterSpacing: 0 }}>{brick.tag.toUpperCase().slice(0, 11)}</text>}
    {brick.state === 'removed' && <path d={`M ${P(x, y + d, z + h).join(' ')} L ${P(x + w, y + d, z).join(' ')} M ${P(x + w, y + d, z + h).join(' ')} L ${P(x, y + d, z).join(' ')}`} stroke={darken(brick.hex, 0.15)} strokeWidth="1" />}
  </g>
}

const PLINTH_HEIGHT = 1.1

// When the baseplate stands for something (Foundations' operating model), it sits on a labelled plinth.
export function Baseplate({ w, d, p, color = '#c9d3cc', label }: { w: number, d: number, p: Projector, color?: string, label?: string }) {
  const box: Box = { x: 0, y: 0, z: -PLATE_HEIGHT, w, d, h: PLATE_HEIGHT }
  const { x, y, z, h } = box
  const P = p.point
  const pz = z - PLINTH_HEIGHT
  const plinth = '#e7dcc3'
  return <g className="iso-plate">
    {label && <g className="iso-plinth">
      <path d={pathFrom([P(x, y + d, pz), P(x + w, y + d, pz), P(x + w, y + d, z), P(x, y + d, z)])} fill={plinth} stroke={darken(plinth, 0.35)} strokeWidth=".7" />
      <path d={pathFrom([P(x + w, y, pz), P(x + w, y + d, pz), P(x + w, y + d, z), P(x + w, y, z)])} fill={darken(plinth, 0.12)} stroke={darken(plinth, 0.35)} strokeWidth=".7" />
      <text transform={leftFaceMatrix(P(x, y + d, z))} x={p.unit * 0.4} y={p.unit * PLINTH_HEIGHT * 0.64} fontSize={p.unit * 0.4} fontWeight="750" fill={darken(plinth, 0.62)} style={{ letterSpacing: 0 }}>{label.toUpperCase()}</text>
    </g>}
    <path d={pathFrom([P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)])} fill={darken(color, 0.08)} stroke={darken(color, 0.3)} strokeWidth=".7" />
    <path d={pathFrom([P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)])} fill={darken(color, 0.18)} stroke={darken(color, 0.3)} strokeWidth=".7" />
    <path d={pathFrom([P(x, y, 0), P(x + w, y, 0), P(x + w, y + d, 0), P(x, y + d, 0)])} fill={color} stroke={darken(color, 0.3)} strokeWidth=".7" />
    <Studs box={{ ...box, z: -PLATE_HEIGHT }} fill={lighten(color, 0.2)} side={darken(color, 0.14)} stroke={darken(color, 0.25)} p={p} />
  </g>
}

function DropArrow({ brick, p }: { brick: SceneBrick, p: Projector }) {
  const box = displaced(brick.box, brick.state)
  const [cx, topY] = p.point(box.x + box.w / 2, box.y + box.d / 2, box.z + box.h + STUD_HEIGHT)
  const start = topY - p.unit * 3.4
  const end = topY - p.unit * 1.5
  const color = brick.state === 'clash' ? SEAT_COLORS.clash : INK
  return <g className="iso-arrow" aria-hidden="true">
    <line x1={cx} y1={start} x2={cx} y2={end - 5} stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    <path d={`M ${cx - 5.5} ${end - 7} L ${cx} ${end} L ${cx + 5.5} ${end - 7} Z`} fill={color} />
  </g>
}

function Badge({ brick, p }: { brick: SceneBrick, p: Projector }) {
  if (!brick.badge || brick.badge === 'base') return null
  const box = displaced(brick.box, brick.state)
  const [bx, by] = p.point(box.x + box.w, box.y, box.z + box.h)
  const color = SEAT_COLORS[brick.badge]
  const r = p.unit * 0.52
  const cx = bx + r * 0.3
  const cy = by - r * 1.1
  return <g className="iso-badge" aria-hidden="true">
    <circle cx={cx} cy={cy} r={r} fill="#fff" stroke={color} strokeWidth="1.6" />
    {brick.badge === 'snap' && <path d={`M ${cx - r * 0.45} ${cy} L ${cx - r * 0.1} ${cy + r * 0.35} L ${cx + r * 0.5} ${cy - r * 0.35}`} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />}
    {brick.badge === 'loose' && <path d={`M ${cx - r * 0.5} ${cy + r * 0.05} q ${r * 0.25} ${-r * 0.4} ${r * 0.5} 0 t ${r * 0.5} 0`} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />}
    {brick.badge === 'clash' && <path d={`M ${cx - r * 0.38} ${cy - r * 0.38} L ${cx + r * 0.38} ${cy + r * 0.38} M ${cx + r * 0.38} ${cy - r * 0.38} L ${cx - r * 0.38} ${cy + r * 0.38}`} stroke={color} strokeWidth="1.8" strokeLinecap="round" />}
  </g>
}

export interface SceneProps {
  bricks: SceneBrick[]
  plate: { w: number, d: number }
  unit?: number
  label: string
  showArrow?: boolean
  showBadges?: 'new' | 'all' | 'none'
  className?: string
  maxTier?: number
  frame?: 'tall' | 'tight'
  plateLabel?: string
}

export function BrickScene({ bricks, plate, unit = 18, label, showArrow = true, showBadges = 'new', className, maxTier = 4, frame, plateLabel }: SceneProps) {
  const p = projector(unit)
  const titleId = useId()
  // Frame the whole plate plus the tallest possible model so the camera never jumps between steps.
  const reach = maxTier * BRICK_HEIGHT + ((frame ?? (showArrow ? 'tall' : 'tight')) === 'tall' ? 2.6 : 0.9)
  const floor = -PLATE_HEIGHT - (plateLabel ? PLINTH_HEIGHT : 0)
  const corners = [p.point(0, plate.d, floor), p.point(plate.w, 0, reach), p.point(plate.w, plate.d, floor), p.point(0, 0, reach), p.point(plate.w + 1.5, 0, reach)]
  const minX = Math.min(...corners.map(c => c[0])) - 8
  const maxX = Math.max(...corners.map(c => c[0])) + 14
  const minY = Math.min(...corners.map(c => c[1])) - 4
  const maxY = Math.max(...corners.map(c => c[1])) + 8
  const sorted = depthSort(bricks.map(brick => ({ brick, box: displaced(brick.box, brick.state) })))
  const newest = bricks.find(brick => brick.isNew)

  return <svg className={`iso-scene${className ? ` ${className}` : ''}`} viewBox={`${minX.toFixed(1)} ${minY.toFixed(1)} ${(maxX - minX).toFixed(1)} ${(maxY - minY).toFixed(1)}`} role="img" aria-labelledby={titleId}>
    <title id={titleId}>{label}</title>
    <Baseplate w={plate.w} d={plate.d} p={p} label={plateLabel} />
    {sorted.map(({ brick }) => <g key={brick.id} className={brick.isNew ? 'iso-drop' : undefined}><IsoBrick brick={brick} p={p} /></g>)}
    {bricks.filter(brick => showBadges === 'all' ? brick.state !== 'ghost' && brick.state !== 'removed' : showBadges === 'new' && brick.isNew).map(brick => <Badge key={`badge-${brick.id}`} brick={brick} p={p} />)}
    {showArrow && newest && <DropArrow brick={newest} p={p} />}
  </svg>
}

// A single brick for parts callouts and inventories.
export function BrickIcon({ hex, label, width = 4, depth = 2, unit = 12, tag, ghost }: { hex: string, label?: string, width?: number, depth?: number, unit?: number, tag?: string, ghost?: boolean }) {
  const p = projector(unit)
  const box: Box = { x: 0, y: 0, z: 0, w: width, d: depth, h: BRICK_HEIGHT }
  const corners = [p.point(0, depth, 0), p.point(width, 0, BRICK_HEIGHT + STUD_HEIGHT), p.point(width, depth, 0), p.point(0, 0, BRICK_HEIGHT + STUD_HEIGHT)]
  const minX = Math.min(...corners.map(c => c[0])) - 2
  const maxX = Math.max(...corners.map(c => c[0])) + 2
  const minY = Math.min(...corners.map(c => c[1])) - 3
  const maxY = Math.max(...corners.map(c => c[1])) + 2
  return <svg className="iso-icon" viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`} aria-hidden="true">
    <IsoBrick p={p} brick={{ id: 'icon', box, hex, label: label ?? '', tag, state: ghost ? 'ghost' : 'seated' }} />
  </svg>
}
