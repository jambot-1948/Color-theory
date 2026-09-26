import type { WorkshopData, WorkshopTool } from '../workshopData'
import type { SceneBrick } from './Brick'
import { layoutBuild, seatFor, type BuildLink, type EditionId } from './buildModel'
import type { Box } from './iso'

export interface SceneInput {
  edition: EditionId
  data: WorkshopData
  // Parts on the model, in build order.
  tools: WorkshopTool[]
  // The full set the model is heading towards; fixes positions across steps.
  layoutTools?: WorkshopTool[]
  links: BuildLink[]
  ghostHues?: string[]
  removed?: WorkshopTool[]
  newIds?: string[]
  showSeats?: boolean
}

const overlaps = (a: Box, b: Box) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.d && b.y < a.y + a.d

// Height of whatever sits directly beneath a box, or the plate.
function supportBeneath(box: Box, others: Box[]) {
  return Math.max(0, ...others.filter(other => other !== box && other.z + other.h <= box.z + 1e-6 && overlaps(box, other)).map(other => other.z + other.h))
}

// Turn an ordered set of parts into positioned bricks with seat states.
export function sceneBricks({ edition, data, tools, layoutTools, links, ghostHues = [], removed = [], newIds = [], showSeats = true }: SceneInput): SceneBrick[] {
  const base = layoutTools ?? tools
  const all = [...base, ...removed.filter(tool => !base.some(item => item.id === tool.id))]
  const { parts, ghosts } = layoutBuild(edition, data, all, ghostHues)
  const shownIds = new Set([...tools, ...removed].map(tool => tool.id))
  const removedIds = new Set(removed.map(tool => tool.id))
  const bricks: SceneBrick[] = [
    ...parts.filter(part => shownIds.has(part.tool.id)).map(part => {
      const index = tools.findIndex(tool => tool.id === part.tool.id)
      const isRemoved = removedIds.has(part.tool.id)
      const { seat } = isRemoved ? { seat: 'base' as const } : seatFor(part.tool, tools.slice(0, index), links)
      const state: SceneBrick['state'] = isRemoved ? 'removed' : !showSeats ? 'seated' : seat === 'clash' ? 'clash' : seat === 'loose' ? 'loose' : 'seated'
      return { id: part.tool.id, box: part.box, hex: part.hex, label: part.tool.name, tag: part.hueName, state, isNew: newIds.includes(part.tool.id), badge: isRemoved || !showSeats ? undefined : seat }
    }),
    ...ghosts.map((ghost, index) => ({ id: `ghost-${ghost.hue}-${index}`, box: ghost.box, hex: ghost.hex, label: `${ghost.hueName}?`, tag: 'Missing', state: 'ghost' as const })),
  ]
  return withSupport(bricks)
}

// Record what each shown brick rests on so unsupported parts can be drawn hanging.
export function withSupport(bricks: SceneBrick[]) {
  const boxes = bricks.filter(brick => brick.state !== 'removed').map(brick => brick.box)
  return bricks.map(brick => ({ ...brick, restsAt: supportBeneath(brick.box, boxes) }))
}
