import type { SceneBrick } from '../../bricks/Brick'
import { BRICK_HEIGHT, darken } from '../../bricks/iso'
import { LAYER_COLORS, type LayerId, type Point3 } from '../types'

export const H = BRICK_HEIGHT
export const PLATE_H = BRICK_HEIGHT / 3
export const FLAG = '#e0b44c'

export const color = (group: string) => LAYER_COLORS[group as LayerId] ?? LAYER_COLORS.foundations

export function brick(id: string, group: string, label: string, x: number, y: number, z: number, w: number, d: number, h = H, options: { tag?: string, hex?: string } = {}): SceneBrick {
  return { id, group, hex: options.hex ?? color(group), label, tag: options.tag, box: { x, y, z, w, d, h }, state: 'seated' }
}

export function roof(id: string, group: string, x: number, y: number, z: number, w: number, d: number, h: number, flag = true): SceneBrick {
  return { id, group, hex: darken(color(group), 0.18), label: '', box: { x, y, z, w, d, h }, state: 'seated', shape: 'roof', flag: flag ? FLAG : undefined }
}

// Lift every brick in a group by an amount, for the exploded manual view.
export function lifted(bricks: SceneBrick[], lift: Record<string, number>, t: number) {
  return bricks.map(item => ({ ...item, box: { ...item.box, z: item.box.z + (lift[item.group ?? ''] ?? 0) * t } }))
}

export function insidePolygon([x, y]: [number, number], polygon: [number, number][]) {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]
    const [xj, yj] = polygon[j]
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

export const top = (item: SceneBrick): Point3 => [item.box.x + item.box.w, item.box.y + item.box.d, item.box.z + item.box.h]
