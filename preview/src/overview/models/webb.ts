import { darken, lighten } from '../../bricks/iso'
import { LAYER_COLORS, type OverviewModel, type Point3, type Prim } from '../types'
import { H, PLATE_H, brick, insidePolygon } from './util'

// A LEGO-style James Webb Space Telescope, laid out on a 20 x 12 grid. Front (+y) faces the box-art camera.
const SHIELD: [number, number][] = [[0.6, 6], [4.6, 0.8], [15.4, 0.8], [19.4, 6], [15.4, 11.2], [4.6, 11.2]]
const SHIELD_CENTRE: [number, number] = [10, 6]
const SHIELD_COLORS = ['#7d2766', '#962f7a', '#b8418f', '#cf6aab', '#e49bca']
const SHIELD_THICKNESS = 0.32
const HEX = 1.18
const TILT = (12 * Math.PI) / 180
const TILE_COLORS = ['#f2c230', '#e9a92a', '#e38a26']

// The 18 primary-mirror segments: two rings of hexagons around an empty centre.
const SEGMENTS: [number, number][] = []
for (let q = -2; q <= 2; q++) for (let r = -2; r <= 2; r++) {
  const distance = Math.max(Math.abs(q), Math.abs(r), Math.abs(-q - r))
  if (distance === 1 || distance === 2) SEGMENTS.push([q, r])
}

const scaled = (factor: number) => SHIELD.map(([x, y]): [number, number] => [SHIELD_CENTRE[0] + (x - SHIELD_CENTRE[0]) * factor, SHIELD_CENTRE[1] + (y - SHIELD_CENTRE[1]) * factor])

// Edges whose outward side faces the camera get a visible thickness band, so each layer reads as a plate.
function plate(group: string, outline: [number, number][], z: number, fill: string, azimuth: number): Prim[] {
  const view = [Math.sin((azimuth * Math.PI) / 180), Math.cos((azimuth * Math.PI) / 180)]
  const bands: Prim[] = []
  outline.forEach((a, i) => {
    const b = outline[(i + 1) % outline.length]
    const normal = [b[1] - a[1], -(b[0] - a[0])]
    // Outline runs clockwise in screen terms (y grows towards the viewer), so this normal points outwards.
    if (normal[0] * view[0] + normal[1] * view[1] <= 0.01) return
    bands.push({ kind: 'poly', group, fill: darken(fill, 0.22), points: [[a[0], a[1], z], [b[0], b[1], z], [b[0], b[1], z - SHIELD_THICKNESS], [a[0], a[1], z - SHIELD_THICKNESS]] })
  })
  return [...bands, { kind: 'poly', group, fill, points: outline.map(([x, y]): Point3 => [x, y, z]) }]
}

export const webb: OverviewModel = {
  id: 'telescope',
  name: 'Telescope',
  alt: 'A LEGO-style model of the James Webb Space Telescope on a display stand: the spacecraft bus, the five-layer sunshield, the instruments, and the gold 18-segment mirror.',
  plate: { w: 8, d: 6 },
  plateAt: { x: 6, y: 3 },
  plateLabel: 'Mission control',
  boxCamera: { azimuth: 0, elevation: 10 },
  parts: {
    base: { part: 'Stand & mission control' },
    foundations: { part: 'Spacecraft bus' },
    data: { part: 'Instruments' },
    ai: { part: 'Mirror' },
    harness: { part: 'Sunshield', analogy: 'Like the sunshield, it is what lets the most sensitive part do its job.' },
  },
  build(t) {
    const azimuth = 45 * t
    // Layers move apart in the manual view, like an exploded instruction page.
    const rise = 4.2 * t
    const shieldBase = 5.8 + rise
    const gap = 0.42 + 0.55 * t
    const shieldTop = shieldBase + gap * 4
    const mirrorLift = rise + 1.4 * t
    const moduleLift = 0.6 * t

    const stand = [
      brick('stand-foot', 'base', '', 9, 5, 0, 2, 2, PLATE_H, { hex: '#59606a' }),
      brick('stand-1', 'base', '', 9.5, 5.5, PLATE_H, 1, 1, H, { hex: '#59606a' }),
      brick('stand-2', 'base', '', 9.5, 5.5, PLATE_H + H, 1, 1, H, { hex: '#4d535c' }),
      brick('stand-3', 'base', '', 9.5, 5.5, PLATE_H + 2 * H, 1, 1, 3.6 - PLATE_H - 2 * H, { hex: '#59606a' }),
    ]
    const grey = LAYER_COLORS.foundations
    const bus = [
      brick('bus-1', 'foundations', 'Spacecraft', 7.5, 4, 3.6, 5, 4, H, { tag: 'Bus' }),
      brick('bus-2', 'foundations', '', 8, 4.5, 3.6 + H, 4, 3, PLATE_H, { hex: darken(grey, 0.12) }),
      brick('radiator', 'foundations', '', 12.5, 4.5, 3.8, 1, 3, H, { hex: darken(grey, 0.3) }),
      brick('solar', 'foundations', '', 1.6, 5, 4.2, 6, 2, PLATE_H, { hex: '#1f3f7a' }),
    ]
    const modules = [
      brick('module-1', 'data', 'Ingest', 15.8, 0.9, shieldTop + 0.3 + moduleLift, 3.4, 2.6, H, { tag: 'Instruments' }),
      brick('module-2', 'data', 'Store & check', 15.8, 0.9, shieldTop + 0.3 + H + moduleLift, 3.4, 2.6, H, { hex: lighten(LAYER_COLORS.data, 0.12) }),
    ]

    const shields: Prim[] = SHIELD_COLORS.flatMap((fill, index) => plate('harness', scaled(1 - index * 0.035), shieldBase + gap * index, fill, azimuth))
    const topOutline = scaled(1 - 4 * 0.035)
    const studAt: Point3[] = []
    for (let x = 1.5; x < 19; x += 1) for (let y = 1.5; y < 11; y += 1) {
      const clearOfModules = !(x > 15.4 && y < 3.8)
      if (insidePolygon([x, y], topOutline.map(([px, py]): [number, number] => [px + (px > 10 ? -0.4 : 0.4), py + (py > 6 ? -0.4 : 0.4)])) && clearOfModules) studAt.push([x, y, shieldTop])
    }

    const centre: Point3 = [10, 4.2, 11.6 + mirrorLift]
    const along = (point: Point3, du: number, dv: number): Point3 => [point[0] + du, point[1] - dv * Math.sin(TILT), point[2] + dv * Math.cos(TILT)]
    const hexagon = (cu: number, cv: number, size: number) => Array.from({ length: 6 }, (_, k) => {
      const angle = ((90 + 60 * k) * Math.PI) / 180
      return along(centre, cu + size * Math.cos(angle), cv + size * Math.sin(angle))
    })
    const tiles: Prim[] = SEGMENTS.flatMap(([q, r]) => {
      const cu = HEX * Math.sqrt(3) * (q + r / 2)
      const cv = -HEX * 1.5 * r
      const fill = TILE_COLORS[(((q - r) % 3) + 3) % 3]
      return [
        { kind: 'poly', group: 'ai', points: hexagon(cu, cv, HEX * 0.94), fill, stroke: darken(fill, 0.45), width: 0.9 },
        { kind: 'poly', group: 'ai', points: hexagon(cu, cv, HEX * 0.62), fill: lighten(fill, 0.12), stroke: darken(fill, 0.25), width: 0.6 },
        { kind: 'disc', group: 'ai', centre: along(centre, cu, cv), radius: 0.24, axis: 'y', fill: lighten(fill, 0.3), stroke: darken(fill, 0.35) },
      ] as Prim[]
    })
    const secondary: Point3 = [10, 9.6, 12.4 + mirrorLift]
    const feet = [along(centre, 0, HEX * 4.2), along(centre, -HEX * 3.4, -HEX * 2.2), along(centre, HEX * 3.4, -HEX * 2.2)]
    const struts: Prim[] = feet.map(foot => ({ kind: 'line', group: 'ai', from: foot, to: secondary, stroke: '#2b2a2e', width: 2.4 }))

    return {
      prims: [
        { kind: 'sorted', bricks: stand },
        { kind: 'sorted', bricks: bus },
        { kind: 'studs', group: 'foundations', at: [2.1, 3.1, 4.1, 5.1, 6.1, 7.1].flatMap(x => [[x, 5.5, 4.2 + PLATE_H], [x, 6.5, 4.2 + PLATE_H]] as Point3[]), fill: '#3b5c9c', side: '#162d57', stroke: '#0f2140' },
        ...shields,
        { kind: 'studs', group: 'harness', at: studAt, fill: lighten(SHIELD_COLORS[4], 0.15), side: darken(SHIELD_COLORS[4], 0.2), stroke: darken(SHIELD_COLORS[4], 0.35) },
        { kind: 'sorted', bricks: modules },
        ...tiles,
        ...struts,
        { kind: 'disc', group: 'ai', centre: secondary, radius: 0.5, axis: 'y', fill: '#3a3840', stroke: '#16151a' },
      ],
      callouts: [
        { group: 'ai', anchor: along(centre, HEX * Math.sqrt(3) * 2, HEX * 2.4), side: 1, lift: 18, title: 'Mirror · 18 segments', subtitle: 'AI application' },
        { group: 'data', anchor: [19.2, 2.2, shieldTop + 1 + moduleLift], side: 1, lift: -20, title: 'Instruments', subtitle: 'Data engineering' },
        { group: 'harness', anchor: [scaled(1 - 4 * 0.035)[0][0], scaled(1 - 4 * 0.035)[0][1], shieldTop], side: -1, lift: 24, title: 'Sunshield · 5 layers', subtitle: 'Agent harness' },
        { group: 'foundations', anchor: [7.5, 8, 4.6], side: -1, lift: -10, title: 'Spacecraft bus', subtitle: 'Foundations' },
        { group: 'base', anchor: [6, 9, -0.8], side: -1, lift: -8, title: 'Display stand', subtitle: 'Operating model' },
      ],
    }
  },
}
