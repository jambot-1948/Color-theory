// Isometric projection helpers for the brick manual views.
// World units are LEGO stud pitches: x runs to the right-front, y to the left-front,
// z is up. A standard brick is 1.2 units tall; a plate is 0.4.

export const BRICK_HEIGHT = 1.2
export const PLATE_HEIGHT = 0.4
export const STUD_RADIUS = 0.3
export const STUD_HEIGHT = 0.2

export const SEAT_COLORS = { snap: '#2f7f7b', loose: '#a2742f', clash: '#c84c3a', base: '#2f7f7b' } as const

const COS30 = Math.cos(Math.PI / 6)

export interface Projector {
  unit: number
  point: (x: number, y: number, z: number) => [number, number]
}

export function projector(unit: number): Projector {
  return {
    unit,
    point: (x, y, z) => [(x - y) * COS30 * unit, (x + y) * 0.5 * unit - z * unit],
  }
}

export function pathFrom(points: [number, number][]) {
  return `M ${points.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(' L ')} Z`
}

// Ellipse radii for a horizontal circle of radius r under this projection.
export function circleRadii(r: number, unit: number): [number, number] {
  return [r * unit * COS30 * Math.SQRT2, r * unit * 0.5 * Math.SQRT2]
}

// SVG matrix that maps text drawn along +x onto the front-left (+y) face of a box.
export function leftFaceMatrix(origin: [number, number]) {
  return `matrix(${COS30.toFixed(4)} 0.5 0 1 ${origin[0].toFixed(2)} ${origin[1].toFixed(2)})`
}

// SVG matrix that maps text drawn along +x onto the front-right (+x) face of a box,
// reading from its front corner towards the back. Origin is the face's top-front corner.
export function rightFaceMatrix(origin: [number, number]) {
  return `matrix(${COS30.toFixed(4)} -0.5 0 1 ${origin[0].toFixed(2)} ${origin[1].toFixed(2)})`
}

function channels(hex: string) {
  const value = hex.replace('#', '')
  const full = value.length === 3 ? value.split('').map(c => c + c).join('') : value
  return [0, 2, 4].map(index => parseInt(full.slice(index, index + 2), 16))
}

function toHex(rgb: number[]) {
  return `#${rgb.map(value => Math.round(Math.min(255, Math.max(0, value))).toString(16).padStart(2, '0')).join('')}`
}

export function mix(hex: string, target: string, amount: number) {
  const from = channels(hex)
  const to = channels(target)
  return toHex(from.map((value, index) => value + (to[index] - value) * amount))
}

export const lighten = (hex: string, amount: number) => mix(hex, '#ffffff', amount)
export const darken = (hex: string, amount: number) => mix(hex, '#000000', amount)

export function luminance(hex: string) {
  const [r, g, b] = channels(hex).map(value => {
    const c = value / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function inkOn(hex: string) {
  return luminance(hex) > 0.36 ? '#1d2420' : '#ffffff'
}

export interface Box {
  x: number
  y: number
  z: number
  w: number
  d: number
  h: number
}

// Painter's order for non-intersecting axis-aligned boxes viewed from +x +y +z.
// A box is drawn before another when it lies wholly behind or beneath it.
export function depthSort<T extends { box: Box }>(items: T[]): T[] {
  const behind = (a: Box, b: Box) =>
    a.x + a.w <= b.x + 1e-6 || a.y + a.d <= b.y + 1e-6 || a.z + a.h <= b.z + 1e-6
  const remaining = [...items]
  const sorted: T[] = []
  while (remaining.length) {
    const index = remaining.findIndex(candidate =>
      remaining.every(other => other === candidate || !behind(other.box, candidate.box) || behind(candidate.box, other.box)),
    )
    const next = index >= 0 ? index : 0
    sorted.push(remaining[next])
    remaining.splice(next, 1)
  }
  return sorted
}
