import type { SceneBrick } from '../bricks/Brick'
import type { Camera } from '../bricks/iso'

export type Point3 = [number, number, number]

// The five layers every overview model is read through.
export type LayerId = 'base' | 'foundations' | 'data' | 'ai' | 'harness'

export const LAYER_COLORS: Record<LayerId, string> = {
  base: '#c9b98f',
  foundations: '#7d8a92',
  data: '#2f72c4',
  ai: '#e0a92e',
  harness: '#b8418f',
}

// Drawing primitives, painted in the order given. Bricks inside a 'sorted' pass are depth-sorted together.
export type Prim =
  | { kind: 'sorted', bricks: SceneBrick[] }
  | { kind: 'poly', group: string, points: Point3[], fill: string, stroke?: string, width?: number }
  | { kind: 'line', group: string, from: Point3, to: Point3, stroke: string, width: number }
  | { kind: 'disc', group: string, centre: Point3, radius: number, axis: 'x' | 'y' | 'z', fill: string, stroke?: string }
  | { kind: 'studs', group: string, at: Point3[], fill: string, side: string, stroke: string }

export interface Callout {
  group: string
  anchor: Point3
  side: 1 | -1
  lift: number
  title: string
  subtitle: string
}

export interface ModelPart {
  part: string
  // A model-specific way to say what the layer does, appended to the shared question.
  analogy?: string
}

export interface OverviewModel {
  id: string
  name: string
  // Describes the finished model for screen readers.
  alt: string
  plate: { w: number, d: number }
  // Where the plate's corner sits in model coordinates.
  plateAt: { x: number, y: number }
  plateLabel: string
  boxCamera: Camera
  parts: Record<LayerId, ModelPart>
  build: (t: number) => { prims: Prim[], callouts: Callout[] }
}
