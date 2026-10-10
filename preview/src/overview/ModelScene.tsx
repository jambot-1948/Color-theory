import { useId, type ReactNode } from 'react'
import { Baseplate, IsoBrick } from '../bricks/Brick'
import { ISO_CAMERA, STUD_HEIGHT, STUD_RADIUS, darken, depthSort, pathFrom, projector, type Camera, type Projector } from '../bricks/iso'
import type { Callout, OverviewModel, Point3 } from './types'

const MANUAL: Camera = ISO_CAMERA

// Draws one overview model at a point in its swing from the assembled view (t = 0) to the system map (t = 1).
// Convex hull of screen points (monotone chain), for a cylinder's silhouette.
function hull(points: [number, number][]) {
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cross = (o: [number, number], a: [number, number], b: [number, number]) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const half = (list: [number, number][]) => list.reduce<[number, number][]>((out, point) => {
    while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], point) <= 0) out.pop()
    out.push(point)
    return out
  }, [])
  const lower = half(sorted)
  const upper = half([...sorted].reverse())
  return [...lower.slice(0, -1), ...upper.slice(0, -1)]
}

export default function ModelScene({ model, t, unit, focus }: { model: OverviewModel, t: number, unit: number, focus?: string }) {
  const titleId = useId()
  const camera: Camera = {
    azimuth: model.boxCamera.azimuth + (MANUAL.azimuth - model.boxCamera.azimuth) * t,
    elevation: model.boxCamera.elevation + (MANUAL.elevation - model.boxCamera.elevation) * t,
  }
  const base = projector(unit, camera)
  // Model coordinates are offset so the plate's corner sits at plateAt.
  const p: Projector = { ...base, point: (x, y, z) => base.point(x - model.plateAt.x, y - model.plateAt.y, z) }
  const P = (point: Point3) => p.point(...point)
  const { prims, callouts } = model.build(t)

  const extent: [number, number][] = [base.point(0, model.plate.d, -1.6), base.point(model.plate.w, model.plate.d, -1.6), base.point(model.plate.w, 0, -1.6), base.point(0, 0, 0)]
  const discPoints = (centre: Point3, radius: number, axis: 'x' | 'y' | 'z') => Array.from({ length: 28 }, (_, i) => {
    const a = (i / 28) * Math.PI * 2
    const [u, v] = [Math.cos(a) * radius, Math.sin(a) * radius]
    const point: Point3 = axis === 'y' ? [centre[0] + u, centre[1], centre[2] + v] : axis === 'x' ? [centre[0], centre[1] + u, centre[2] + v] : [centre[0] + u, centre[1] + v, centre[2]]
    return P(point)
  })

  const wrap = (group: string, key: string, children: ReactNode) => <g key={key} data-group={group}><g>{children}</g></g>
  const [rx, ry] = p.radii(STUD_RADIUS)
  const drawn = prims.map((prim, index) => {
    if (prim.kind === 'sorted') {
      prim.bricks.forEach(item => { const { x, y, z, w, d, h } = item.box; extent.push(P([x, y, z]), P([x + w, y + d, z + h]), P([x, y + d, z]), P([x + w, y, z + h])) })
      return depthSort(prim.bricks.map(item => ({ brick: item, box: item.box }))).map(({ brick }) => wrap(brick.group ?? 'none', `${index}-${brick.id}`, <IsoBrick brick={brick} p={p} />))
    }
    if (prim.kind === 'poly') {
      const points = prim.points.map(P)
      extent.push(...points)
      return wrap(prim.group, `${index}`, <path d={pathFrom(points)} fill={prim.fill} stroke={prim.stroke ?? darken(prim.fill, 0.35)} strokeWidth={prim.width ?? 0.8} strokeLinejoin="round" opacity={prim.opacity} />)
    }
    if (prim.kind === 'cylinder') {
      const [cx, cy, cz] = prim.centre
      const near = discPoints([cx, cy + prim.length / 2, cz], prim.radius, 'y')
      const far = discPoints([cx, cy - prim.length / 2, cz], prim.radius, 'y')
      extent.push(...near, ...far)
      return wrap(prim.group, `${index}`, <>
        <path d={pathFrom(hull([...near, ...far]))} fill={prim.side} stroke={darken(prim.side, 0.5)} strokeWidth=".8" strokeLinejoin="round" />
        <path d={pathFrom(near)} fill={prim.face} stroke={darken(prim.face, 0.5)} strokeWidth=".8" />
        {(prim.rings ?? []).map((ring, i) => <path key={i} d={pathFrom(discPoints([cx, cy + prim.length / 2 + 0.01, cz], ring.radius, 'y'))} fill={ring.fill} stroke={darken(ring.fill, 0.4)} strokeWidth=".7" />)}
      </>)
    }
    if (prim.kind === 'line') {
      const [a, b] = [P(prim.from), P(prim.to)]
      extent.push(a, b)
      return wrap(prim.group, `${index}`, <path d={`M ${a.join(' ')} L ${b.join(' ')}`} stroke={prim.stroke} strokeWidth={prim.width} strokeLinecap="round" fill="none" />)
    }
    if (prim.kind === 'disc') {
      const points = discPoints(prim.centre, prim.radius, prim.axis)
      extent.push(...points)
      return wrap(prim.group, `${index}`, <path d={pathFrom(points)} fill={prim.fill} stroke={prim.stroke ?? darken(prim.fill, 0.4)} strokeWidth=".8" strokeLinejoin="round" />)
    }
    return wrap(prim.group, `${index}`, prim.at.map((point, i) => {
      const [cx, cy] = P(point)
      const top = cy - p.rise(STUD_HEIGHT)
      return <g key={i}><ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={prim.side} /><rect x={cx - rx} y={top} width={rx * 2} height={cy - top} fill={prim.side} /><ellipse cx={cx} cy={top} rx={rx} ry={ry} fill={prim.fill} stroke={prim.stroke} strokeWidth=".5" /></g>
    }))
  })

  callouts.forEach(item => extent.push(P(item.anchor)))
  // Room for callouts grows as they fade in, so the box art fills the frame.
  const margin = 30 + 130 * t
  const minX = Math.min(...extent.map(c => c[0])) - margin
  const maxX = Math.max(...extent.map(c => c[0])) + margin
  const minY = Math.min(...extent.map(c => c[1])) - 30
  const maxY = Math.max(...extent.map(c => c[1])) + 12
  const shown = Math.max(0, t * 2 - 1)

  const callout = (item: Callout) => {
    const anchor = P(item.anchor)
    const end: [number, number] = [anchor[0] + item.side * 70, anchor[1] - item.lift]
    const textX = end[0] + item.side * 6
    const anchorAt = item.side > 0 ? 'start' : 'end'
    const opacity = focus ? (focus === item.group ? shown : 0) : shown
    return <g key={item.title} className={`wb-callout${focus === item.group ? ' is-active' : ''}`} opacity={opacity} aria-hidden="true">
      <circle cx={anchor[0]} cy={anchor[1]} r="3.2" fill="#1d2420" />
      <path d={`M ${anchor[0]} ${anchor[1]} L ${end[0]} ${end[1]}`} stroke="#1d2420" strokeWidth="1.5" fill="none" />
      <text x={textX} y={end[1] - 3} textAnchor={anchorAt} fontSize="16" fontWeight="800" fill="#1b2c26">{item.title}</text>
      <text x={textX} y={end[1] + 14} textAnchor={anchorAt} fontSize="13" fontWeight="600" fill="#4b5a52">{item.subtitle}</text>
    </g>
  }

  return <svg className="iso-scene wb-scene" viewBox={`${minX.toFixed(1)} ${minY.toFixed(1)} ${(maxX - minX).toFixed(1)} ${(maxY - minY).toFixed(1)}`} role="img" aria-labelledby={titleId}>
    <title id={titleId}>{model.alt}</title>
    <Baseplate w={model.plate.w} d={model.plate.d} p={base} label={model.plateLabel} />
    {drawn}
    {callouts.map(callout)}
  </svg>
}
