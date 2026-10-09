import { darken } from '../../bricks/iso'
import { LAYER_COLORS, type OverviewModel, type Point3, type Prim } from '../types'
import { H, PLATE_H, brick, lifted } from './util'

// A LEGO-style race car on a 20 x 8 pit-lane plate. The car runs along x with its nose to the right;
// its left side (+y) faces the box-art camera, so the box art is a side profile.
const BODY = '#4d535c'

function wheel(x: number, y: number, radius: number, front: boolean): Prim[] {
  const centre: Point3 = [x, y, radius]
  const at = (dy: number): Point3 => [x, y + dy, radius]
  // Front wheels show their outer face; the far wheels show the face nearest the car.
  return [
    { kind: 'disc', group: 'harness', centre: at(front ? -1.4 : 0), radius, axis: 'y', fill: '#16161a', stroke: '#000' },
    { kind: 'disc', group: 'harness', centre, radius, axis: 'y', fill: '#202024', stroke: '#000' },
    { kind: 'disc', group: 'harness', centre, radius: radius * 0.62, axis: 'y', fill: '#3a3a40', stroke: '#111' },
    { kind: 'disc', group: 'harness', centre, radius: radius * 0.42, axis: 'y', fill: LAYER_COLORS.harness, stroke: darken(LAYER_COLORS.harness, 0.4) },
    { kind: 'disc', group: 'harness', centre, radius: radius * 0.16, axis: 'y', fill: '#f2c230', stroke: '#8a6a10' },
  ]
}

export const raceCar: OverviewModel = {
  id: 'race-car',
  name: 'Race car',
  alt: 'A LEGO-style race car: chassis and nose, blue sidepods, a gold engine cover and airbox, magenta wings and halo, and four wheels with brake discs.',
  plate: { w: 20, d: 8 },
  plateAt: { x: 0, y: 0 },
  plateLabel: 'Pit wall · operating model',
  boxCamera: { azimuth: 0, elevation: 8 },
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
      brick('floor', 'foundations', '', 1.2, 1.5, 0.7, 17, 5, PLATE_H, { hex: darken(BODY, 0.2) }),
      brick('tub', 'foundations', 'Chassis', 5, 2.5, 0.7 + PLATE_H, 9, 3, H, { hex: BODY, tag: 'Chassis' }),
      brick('nose', 'foundations', '', 14, 3, 0.7 + PLATE_H, 4, 2, 0.8, { hex: BODY }),
      brick('nose-tip', 'foundations', '', 18, 3.4, 0.7 + PLATE_H, 1, 1.2, 0.5, { hex: BODY }),
      brick('pod-far', 'data', '', 6, 1.5 - spread, 0.7 + PLATE_H, 6, 1, H),
      brick('pod-near', 'data', 'Telemetry', 6, 5.5 + spread, 0.7 + PLATE_H, 6, 1, H, { tag: 'Sidepod' }),
      brick('cover', 'ai', 'Power unit', 6, 2.5, 0.7 + PLATE_H + H, 6, 3, H, { tag: 'Engine' }),
      brick('airbox', 'ai', '', 9.5, 3, 0.7 + PLATE_H + 2 * H, 2, 2, H),
      brick('wing-post', 'harness', '', 1.6, 3.5, 0.7 + PLATE_H, 1, 1, 1.8 - PLATE_H),
      brick('endplate-far', 'harness', '', 0.6, 1.4, 1.9, 2.4, 0.4, 1),
      brick('endplate-near', 'harness', '', 0.6, 6.2, 1.9, 2.4, 0.4, 1),
      brick('rear-wing', 'harness', 'Wing', 0.6, 1.4, 2.9, 2.4, 5.2, PLATE_H),
      brick('front-wing', 'harness', '', 18.2, 0.6, 0.5, 1.6, 6.8, PLATE_H),
    ], lift, t)
    const haloLift = lift.harness * t
    const halo: Point3[] = [[12.3, 2.7, 2.3 + haloLift], [13.2, 4, 3.2 + haloLift], [12.3, 5.3, 2.3 + haloLift]]
    return {
      prims: [
        ...wheel(3.5, 1.5, 1.6, false),
        ...wheel(16.5, 1.5, 1.5, false),
        { kind: 'sorted', bricks },
        { kind: 'disc', group: 'ai', centre: [12.9, 4, 2.75], radius: 0.5, axis: 'y', fill: '#f2c230', stroke: '#8a6a10' },
        { kind: 'line', group: 'harness', from: halo[0], to: halo[1], stroke: LAYER_COLORS.harness, width: 3 },
        { kind: 'line', group: 'harness', from: halo[1], to: halo[2], stroke: LAYER_COLORS.harness, width: 3 },
        { kind: 'line', group: 'harness', from: [14.2, 4, 2.0 + haloLift], to: halo[1], stroke: LAYER_COLORS.harness, width: 3 },
        ...wheel(3.5, 8, 1.6, true),
        ...wheel(16.5, 8, 1.5, true),
      ],
      callouts: [
        { group: 'ai', anchor: [11.5, 5, 0.7 + PLATE_H + 3 * H + 1.2 * t], side: 1, lift: 30, title: 'Power unit', subtitle: 'AI application' },
        { group: 'data', anchor: [7, 6.5 + spread, 1.7 + 0.3 * t], side: -1, lift: -34, title: 'Sidepods & telemetry', subtitle: 'Data engineering' },
        { group: 'harness', anchor: [0.6, 1.4, 3.3 + 0.6 * t], side: -1, lift: 30, title: 'Brakes, halo & wings', subtitle: 'Agent harness' },
        { group: 'foundations', anchor: [18, 4.2, 1.4], side: 1, lift: -34, title: 'Chassis', subtitle: 'Foundations' },
        { group: 'base', anchor: [0, 8, -0.8], side: -1, lift: -78, title: 'Pit wall', subtitle: 'Operating model' },
      ],
    }
  },
}
