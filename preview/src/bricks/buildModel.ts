import type { WorkshopData, WorkshopTool } from '../workshopData'
import { BRICK_HEIGHT, type Box } from './iso'

export type EditionId = 'ai' | 'data' | 'harness'

// How a brick seats against the parts already on the model.
//  snap  — a curated pairing or recipe link exists with an earlier part.
//  loose — nothing recorded either way; it sits, but nothing says it locks.
//  clash — a recorded or authored tension; the part is forced.
export type Seat = 'snap' | 'loose' | 'clash' | 'base'
export type LinkKind = 'fit' | 'recipe' | 'tension'

export interface BuildLink {
  first: string
  second: string
  kind: LinkKind
  note: string
}

export interface Tier {
  name: string
  hues: string[]
}

// Tiers are a reading aid: foundations sit low, surfaces sit high.
// They are not a runtime call graph.
export const editionTiers: Record<EditionId, Tier[]> = {
  ai: [
    { name: 'Platform & knowledge', hues: ['velocity', 'memory'] },
    { name: 'Model core', hues: ['cognition'] },
    { name: 'Control', hues: ['logic', 'intent'] },
    { name: 'Surface & oversight', hues: ['trust', 'interface'] },
  ],
  data: [
    { name: 'Storage & serving', hues: ['store', 'serve'] },
    { name: 'Movement', hues: ['ingest', 'transform'] },
    { name: 'Coordination', hues: ['orchestrate'] },
    { name: 'Quality & governance', hues: ['observe', 'govern'] },
  ],
  harness: [
    { name: 'Runtime & context', hues: ['runtime', 'context'] },
    { name: 'Tools & sandbox', hues: ['sandbox', 'tools'] },
    { name: 'Recovery & evidence', hues: ['evidence', 'recovery'] },
    { name: 'Permissions', hues: ['permissions'] },
  ],
}

export function tierOf(edition: EditionId, hue: string) {
  const index = editionTiers[edition].findIndex(tier => tier.hues.includes(hue))
  return index < 0 ? editionTiers[edition].length - 1 : index
}

export const PLATE_W = 12
export const PLATE_D = 6
const BRICK_W = 4
const BRICK_D = 2
const PER_ROW = 3

// Centre each tier's bricks on the plate. Up to three sit in one row; more spill into a back row.
function tierSlots(count: number) {
  const rows = count <= PER_ROW ? [count] : [PER_ROW, count - PER_ROW]
  const ys = rows.length === 1 ? [(PLATE_D - BRICK_D) / 2] : [PLATE_D / 2, PLATE_D / 2 - BRICK_D]
  return rows.flatMap((inRow, row) => Array.from({ length: inRow }, (_, index) => {
    const shown = Math.min(inRow, PER_ROW)
    const start = (PLATE_W - shown * BRICK_W) / 2
    const lap = Math.floor(index / PER_ROW)
    return { x: start + (index % PER_ROW) * BRICK_W, y: ys[Math.min(row, ys.length - 1)] - lap * 0.5, lift: lap * 0.3 }
  }))
}

export interface PlacedBrick {
  kind: 'part'
  tool: WorkshopTool
  hex: string
  hueName: string
  tier: number
  box: Box
  order: number
}

export interface GhostBrick {
  kind: 'ghost'
  hue: string
  hex: string
  hueName: string
  tier: number
  box: Box
}

// Lay out the full set once so a part never moves as later steps are added.
export function layoutBuild(edition: EditionId, data: WorkshopData, tools: WorkshopTool[], ghostHues: string[] = []) {
  const hue = (id: string) => data.hues.find(item => item.id === id) ?? { id, name: id, hex: '#8a948f' }
  const entries = [
    ...tools.map((tool, order) => ({ tool, order, hue: tool.primaryHue, tier: tierOf(edition, tool.primaryHue) })),
    ...ghostHues.map((id, index) => ({ tool: undefined, order: tools.length + index, hue: id, tier: tierOf(edition, id) })),
  ]
  const parts: PlacedBrick[] = []
  const ghosts: GhostBrick[] = []
  for (let tier = 0; tier < editionTiers[edition].length; tier++) {
    const inTier = entries.filter(entry => entry.tier === tier)
    const slots = tierSlots(inTier.length)
    inTier.forEach((entry, index) => {
      const slot = slots[index]
      const box = { x: slot.x, y: slot.y, z: tier * BRICK_HEIGHT + slot.lift, w: BRICK_W, d: BRICK_D, h: BRICK_HEIGHT }
      const info = hue(entry.hue)
      if (entry.tool) parts.push({ kind: 'part', tool: entry.tool, order: entry.order, tier, hex: info.hex, hueName: info.name, box })
      else ghosts.push({ kind: 'ghost', hue: entry.hue, tier, hex: info.hex, hueName: info.name, box })
    })
  }
  return { parts, ghosts }
}

// Tiers below the highest occupied one with no part in them: the model has nothing holding it up there.
export function unsupportedHues(edition: EditionId, tools: WorkshopTool[]) {
  const tiers = editionTiers[edition]
  const occupied = new Set(tools.map(tool => tierOf(edition, tool.primaryHue)))
  const top = Math.max(-1, ...occupied)
  return tiers.flatMap((tier, index) => index < top && !occupied.has(index) ? [tier.hues[0]] : [])
}

export function recordedLinks(tools: WorkshopTool[]): BuildLink[] {
  return tools.flatMap((first, index) => tools.slice(index + 1).flatMap((second): BuildLink[] => {
    if (first.conflictsWith.includes(second.id) || second.conflictsWith.includes(first.id))
      return [{ first: first.id, second: second.id, kind: 'tension', note: `${first.name} and ${second.name} have a recorded tension.` }]
    if (first.pairsWellWith.includes(second.id) || second.pairsWellWith.includes(first.id))
      return [{ first: first.id, second: second.id, kind: 'fit', note: `${first.name} and ${second.name} are a curated pairing.` }]
    return []
  }))
}

// A curated recipe vouches for its whole combination, even where no pairwise pairing is recorded.
export function recipeLinks(tools: WorkshopTool[], recipe?: { name: string, tools: string[] }): BuildLink[] {
  if (!recipe) return []
  return tools.flatMap((first, index) => tools.slice(index + 1)
    .filter(second => recipe.tools.includes(first.id) && recipe.tools.includes(second.id))
    .map(second => ({ first: first.id, second: second.id, kind: 'recipe' as const, note: `Combined in the curated recipe ${recipe.name}.` })))
}

export function linkBetween(links: BuildLink[], a: string, b: string) {
  return links.find(link => (link.first === a && link.second === b) || (link.first === b && link.second === a))
}

// Seat each part against the parts added before it.
export function seatFor(tool: WorkshopTool, earlier: WorkshopTool[], links: BuildLink[]): { seat: Seat, partner?: WorkshopTool, link?: BuildLink } {
  if (!earlier.length) return { seat: 'base' }
  for (const other of earlier) {
    const link = linkBetween(links, tool.id, other.id)
    if (link?.kind === 'tension') return { seat: 'clash', partner: other, link }
  }
  for (const other of [...earlier].reverse()) {
    const link = linkBetween(links, tool.id, other.id)
    if (link) return { seat: 'snap', partner: other, link }
  }
  return { seat: 'loose' }
}

// Two parts with the same role and category, and no recorded pairing, claim the same job.
export function sharedJobs(tools: WorkshopTool[], links: BuildLink[]) {
  return tools.flatMap((first, index) => tools.slice(index + 1)
    .filter(second => second.primaryHue === first.primaryHue && second.category === first.category && !linkBetween(links, first.id, second.id))
    .map(second => [first, second] as const))
}

export type Verdict = 'clean' | 'loose' | 'forced' | 'caution' | 'empty'

export interface BuildReading {
  verdict: Verdict
  seats: { tool: WorkshopTool, seat: Seat, partner?: WorkshopTool, link?: BuildLink }[]
  shared: (readonly [WorkshopTool, WorkshopTool])[]
  gaps: string[]
}

export function readBuild(edition: EditionId, tools: WorkshopTool[], links: BuildLink[], options: { caution?: boolean, gaps?: string[] } = {}): BuildReading {
  const seats = tools.map((tool, index) => ({ tool, ...seatFor(tool, tools.slice(0, index), links) }))
  const shared = sharedJobs(tools, links)
  const gaps = options.gaps ?? unsupportedHues(edition, tools)
  const verdict: Verdict = !tools.length ? 'empty'
    : seats.some(item => item.seat === 'clash') ? 'forced'
    : options.caution ? 'caution'
    : seats.some(item => item.seat === 'loose') || shared.length || gaps.length ? 'loose'
    : 'clean'
  return { verdict, seats, shared, gaps }
}

export const verdictCopy: Record<Verdict, { label: string, line: string }> = {
  clean: { label: 'Snaps together', line: 'Every part locks onto a recorded partner and every tier beneath the top is filled.' },
  loose: { label: 'Holds, with loose parts', line: 'The model stands, but some parts have no recorded partner, share a job, or rest over an empty tier.' },
  forced: { label: 'Forced fit', line: 'At least one part is pressed against a recorded tension. It stands only until something pushes on it.' },
  caution: { label: 'Looks built, reads wrong', line: 'The parts seat, but this combination is a named cautionary pattern. Read what it leaves out.' },
  empty: { label: 'Empty baseplate', line: 'Add a part to start the model.' },
}
