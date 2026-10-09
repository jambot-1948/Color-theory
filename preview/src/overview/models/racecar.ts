import type { SceneBrick } from '../../bricks/Brick'
import { LAYER_COLORS, type OverviewModel, type Point3, type Prim } from '../types'
import { H, brick, lifted } from './util'

// A Technic-style race car on a 22 x 10 pit-lane plate. The car runs along x with its nose to the right,
// and its left side (+y) faces the camera.
const DARK = '#3a3f46'
const BLACK = '#1f2226'
const PINK = '#e49bca'
const RED = '#d63a2f'
const MAGENTA = LAYER_COLORS.harness

const slope = (item: SceneBrick, to: 'x+' | 'x-', low: number): SceneBrick => ({ ...item, slope: { to, low } })
const beam = (item: SceneBrick): SceneBrick => ({ ...item, holes: true })

function wheel(x: number, y: number, radius: number, width: number): Prim {
  return {
    kind: 'cylinder', group: 'harness', centre: [x, y, radius], radius, length: width, side: '#141417', face: '#24242a',
    rings: [
      { radius: radius * 0.86, fill: '#2e2e35' },
      { radius: radius * 0.62, fill: MAGENTA },
      { radius: radius * 0.44, fill: PINK },
      { radius: radius * 0.16, fill: '#f2c230' },
    ],
  }
}

const line = (group: string, from: Point3, to: Point3, stroke = BLACK, width = 2.6): Prim => ({ kind: 'line', group, from, to, stroke, width })

export const raceCar: OverviewModel = {
  id: 'race-car',
  name: 'Race car',
  alt: 'A Technic-style LEGO race car: a dark chassis with beams and suspension links, long blue sidepods, a yellow engine cover and cockpit with a red-capped air intake, magenta and pink wings, and four large tyres with pink hubs.',
  plate: { w: 22, d: 10 },
  plateAt: { x: -1, y: -1 },
  plateLabel: 'Pit wall · operating model',
  boxCamera: { azimuth: 28, elevation: 20 },
  parts: {
    base: { part: 'Pit wall & crew' },
    foundations: { part: 'Chassis' },
    data: { part: 'Sidepods & telemetry' },
    ai: { part: 'Power unit' },
    harness: { part: 'Brakes, halo & wings', analogy: 'Like brakes on a race car, it is what lets you go fast.' },
  },
  build(t) {
    const spread = 0.8 * t
    const lift = { foundations: 0, data: 0.3, ai: 1.2, harness: 0.6 }
    const bricks = lifted([
      // Chassis: floor, Technic beams, tub, nose, and diffuser.
      brick('floor', 'foundations', '', 1.4, 1.9, 0.6, 16.5, 4.2, 0.4, { hex: BLACK }),
      slope(brick('diffuser', 'foundations', '', 0.6, 2.2, 0.6, 0.8, 3.6, 0.7, { hex: BLACK }), 'x-', 0.3),
      beam(brick('tub', 'foundations', '', 5, 2.9, 1.0, 9, 2.2, H, { hex: DARK, tag: 'Chassis' })),
      slope(brick('nose', 'foundations', '', 14, 3.3, 1.0, 4.6, 1.4, 1.0, { hex: DARK }), 'x+', 0.35),
      brick('nose-tip', 'foundations', '', 18.6, 3.5, 1.0, 0.8, 1, 0.35, { hex: DARK }),
      // Sidepods: one long blue layer each side, tapering to the rear.
      beam(brick('pod-far', 'data', '', 6, 1.9 - spread, 1.0, 7, 1, H)),
      slope(brick('pod-far-tail', 'data', '', 4, 1.9 - spread, 1.0, 2, 1, H), 'x-', 0.3),
      beam(brick('pod-near', 'data', 'Telemetry', 6, 5.1 + spread, 1.0, 7, 1, H, { tag: 'Sidepod' })),
      slope(brick('pod-near-tail', 'data', '', 4, 5.1 + spread, 1.0, 2, 1, H), 'x-', 0.3),
      // Power unit: engine cover, fin, cockpit surround, and the red-capped air intake.
      beam(brick('cover', 'ai', 'Power unit', 6, 2.9, 2.2, 6, 2.2, H, { tag: 'Engine' })),
      slope(brick('cover-tail', 'ai', '', 3.8, 3.1, 2.2, 2.2, 1.8, H), 'x-', 0.25),
      slope(brick('fin', 'ai', '', 6.2, 3.85, 3.4, 3.2, 0.5, 0.9), 'x-', 0.2),
      brick('airbox', 'ai', '', 9.6, 3.3, 3.4, 1.6, 1.4, H),
      brick('airbox-cap', 'ai', '', 9.6, 3.3, 3.4 + H, 1.6, 1.4, 0.35, { hex: RED }),
      slope(brick('cockpit-far', 'ai', '', 12, 2.9, 2.2, 2.4, 0.6, 0.8), 'x+', 0.3),
      slope(brick('cockpit-near', 'ai', '', 12, 4.5, 2.2, 2.4, 0.6, 0.8), 'x+', 0.3),
      // Wings: magenta main planes with pink flaps, on a dark pylon.
      brick('wing-pylon', 'foundations', '', 1.8, 3.6, 1.0, 1, 0.8, 2.0, { hex: DARK }),
      slope(brick('endplate-far', 'harness', '', 0.4, 0.9, 1.8, 2.6, 0.3, 2.0), 'x+', 1),
      slope(brick('endplate-near', 'harness', '', 0.4, 6.8, 1.8, 2.6, 0.3, 2.0), 'x+', 1),
      brick('rear-wing', 'harness', 'Wing', 0.4, 1.2, 3.0, 2.6, 5.6, 0.35),
      brick('rear-flap', 'harness', '', 0.7, 1.2, 3.35, 1.8, 5.6, 0.3, { hex: PINK }),
      brick('front-wing', 'harness', '', 17.6, 0.4, 0.55, 2.2, 7.2, 0.35),
      brick('front-flap', 'harness', '', 17.9, 0.5, 0.9, 1.4, 7.0, 0.3, { hex: PINK }),
    ], lift, t)

    const haloLift = lift.harness * t
    const shadow: Point3[] = Array.from({ length: 32 }, (_, i) => {
      const a = (i / 32) * Math.PI * 2
      return [10 + Math.cos(a) * 10.4, 4 + Math.sin(a) * 4.6, 0.02]
    })
    return {
      prims: [
        { kind: 'poly', group: 'foundations', points: shadow, fill: '#1d2420', stroke: 'none', opacity: 0.16 },
        // Far side first: wheels, axles, and suspension links behind the body.
        wheel(3.6, 0.9, 1.75, 1.6),
        wheel(16.4, 1.0, 1.55, 1.4),
        line('foundations', [3.6, 0.9, 1.75], [3.6, 7.1, 1.75], '#5b6068', 2.2),
        line('foundations', [16.4, 1.0, 1.55], [16.4, 7.0, 1.55], '#5b6068', 2.2),
        line('foundations', [16.4, 1.7, 1.55], [14.6, 3.3, 1.3]),
        line('foundations', [16.4, 1.7, 1.55], [15.6, 3.3, 2.0]),
        line('foundations', [3.6, 1.7, 1.75], [5.2, 2.9, 1.4]),
        { kind: 'sorted', bricks },
        { kind: 'disc', group: 'ai', centre: [12.9, 4, 3.0 + lift.ai * t], radius: 0.48, axis: 'y', fill: '#f4f4f4', stroke: '#555' },
        { kind: 'disc', group: 'ai', centre: [13.2, 4.05, 3.05 + lift.ai * t], radius: 0.22, axis: 'y', fill: '#22262b', stroke: '#000' },
        line('harness', [12.2, 2.9, 2.6 + haloLift], [13.1, 4, 3.5 + haloLift], MAGENTA, 3),
        line('harness', [13.1, 4, 3.5 + haloLift], [12.2, 5.1, 2.6 + haloLift], MAGENTA, 3),
        line('harness', [14.3, 4, 2.4 + haloLift], [13.1, 4, 3.5 + haloLift], MAGENTA, 3),
        // Near side: suspension links, then the near wheels in front of everything.
        line('foundations', [16.4, 6.3, 1.55], [14.6, 4.7, 1.3]),
        line('foundations', [16.4, 6.3, 1.55], [15.6, 4.7, 2.0]),
        line('foundations', [16.4, 6.3, 1.2], [15.0, 4.7, 0.9], '#5b6068', 2.2),
        line('foundations', [3.6, 6.3, 1.75], [5.2, 5.1, 1.4]),
        line('foundations', [3.6, 6.3, 2.2], [5.4, 5.1, 2.1], '#5b6068', 2.2),
        wheel(3.6, 7.1, 1.75, 1.6),
        wheel(16.4, 7.0, 1.55, 1.4),
      ],
      callouts: [
        { group: 'ai', anchor: [11.2, 3.3, 3.4 + H + 0.35 + 1.2 * t], side: 1, lift: 30, title: 'Power unit', subtitle: 'AI application' },
        { group: 'data', anchor: [6.5, 6.1 + spread, 1.6 + 0.3 * t], side: -1, lift: -64, title: 'Sidepods & telemetry', subtitle: 'Data engineering' },
        { group: 'harness', anchor: [0.4, 1.2, 3.65 + 0.6 * t], side: -1, lift: 30, title: 'Brakes, halo & wings', subtitle: 'Agent harness' },
        { group: 'foundations', anchor: [19.4, 4.5, 1.35], side: 1, lift: -30, title: 'Chassis', subtitle: 'Foundations' },
        { group: 'base', anchor: [12, 9, -0.8], side: 1, lift: -30, title: 'Pit wall', subtitle: 'Operating model' },
      ],
    }
  },
}
