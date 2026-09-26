import type { WorkshopData, WorkshopRecipe, WorkshopTool } from '../workshopData'
import type { BuildLink, EditionId } from './buildModel'
import { capabilities, type Capability } from './capabilities'

// A slot is one capability brick in a build, optionally filled with a product.
export interface Slot {
  capability: string
  product?: string
}

// A capability brick shaped like a tool so the layout and seat logic can treat it the same way.
export interface SlotTool extends WorkshopTool {
  capability: Capability
  product?: WorkshopTool
}

export function capabilityList(edition: EditionId) {
  return capabilities[edition]
}

export function capabilityById(edition: EditionId, id: string) {
  return capabilities[edition].find(item => item.id === id)
}

export function capabilityOf(edition: EditionId, toolId: string) {
  return capabilities[edition].find(item => item.products.includes(toolId))
}

export function slotsFromTools(edition: EditionId, toolIds: string[]): Slot[] {
  const slots: Slot[] = []
  for (const id of toolIds) {
    const capability = capabilityOf(edition, id)
    if (capability && !slots.some(slot => slot.product === id)) slots.push({ capability: capability.id, product: id })
  }
  return slots
}

// The second product in the same capability gets its own brick id.
export function slotId(slots: Slot[], index: number) {
  const slot = slots[index]
  const repeat = slots.slice(0, index).filter(item => item.capability === slot.capability).length
  return repeat ? `${slot.capability}-${repeat + 1}` : slot.capability
}

export function slotTool(edition: EditionId, data: WorkshopData, slot: Slot, id = slot.capability): SlotTool | undefined {
  const capability = capabilityById(edition, slot.capability)
  if (!capability) return undefined
  const product = slot.product ? data.tools.find(tool => tool.id === slot.product) : undefined
  return {
    id,
    name: capability.name,
    primaryHue: capability.hue,
    category: product?.name ?? 'Any product',
    description: product ? `${capability.summary} ${product.name}: ${product.description}` : capability.summary,
    pairsWellWith: [],
    conflictsWith: [],
    patterns: product?.patterns ?? [],
    capability,
    product,
  }
}

export function slotTools(edition: EditionId, data: WorkshopData, slots: Slot[]) {
  return slots.map((slot, index) => slotTool(edition, data, slot, slotId(slots, index))).filter((tool): tool is SlotTool => Boolean(tool))
}

export function isCaution(data: WorkshopData, recipe: WorkshopRecipe) {
  return recipe.patternIds.some(id => data.patterns.find(pattern => pattern.id === id)?.type === 'anti-pattern')
}

// Curated recipe whose capabilities match the build exactly, and whether the products match too.
export function blueprintMatch(edition: EditionId, data: WorkshopData, slots: Slot[]) {
  const key = (ids: (string | undefined)[]) => ids.map(id => id ?? '?').sort().join('|')
  const caps = key(slots.map(slot => slot.capability))
  // Several recipes can share a blueprint; prefer the one whose products overlap most.
  const overlap = (tools: string[]) => tools.filter(id => slots.some(slot => slot.product === id)).length
  const recipe = data.recipes
    .filter(item => key(item.tools.map(id => capabilityOf(edition, id)?.id)) === caps)
    .sort((a, b) => overlap(b.tools) - overlap(a.tools))[0]
  if (!recipe) return undefined
  const exact = recipe.tools.every(id => slots.some(slot => slot.product === id)) && slots.every(slot => slot.product && recipe.tools.includes(slot.product))
  return { recipe, exact }
}

// How two capability bricks relate.
// With both products chosen, only product evidence counts: authored links, recorded pairings, or an exact curated recipe.
// Otherwise the capabilities are compared: are they combined in a curated recipe, or do any of their products pair?
export function slotLinks(edition: EditionId, data: WorkshopData, slots: Slot[], authored: BuildLink[] = []): BuildLink[] {
  const tools = slotTools(edition, data, slots)
  const match = blueprintMatch(edition, data, slots)
  const exactRecipe = match?.exact && !isCaution(data, match.recipe) ? match.recipe : undefined
  const positive = data.recipes.filter(recipe => !isCaution(data, recipe))
  const find = (id?: string) => data.tools.find(tool => tool.id === id)

  return tools.flatMap((first, index) => tools.slice(index + 1).flatMap((second): BuildLink[] => {
    const base = { first: first.id, second: second.id }
    const a = first.product
    const b = second.product
    const story = a && b ? authored.find(link => (link.first === a.id && link.second === b.id) || (link.first === b.id && link.second === a.id)) : undefined
    if (story) return [{ ...base, kind: story.kind, note: story.note }]
    if (first.capability.id === second.capability.id)
      return [{ ...base, kind: 'tension', note: `${a?.name ?? 'Two products'}${b ? ` and ${b.name}` : ''} both fill ${first.name}. Pick one, or write down which work each one owns.` }]
    if (a && b) {
      if (a.conflictsWith.includes(b.id) || b.conflictsWith.includes(a.id)) return [{ ...base, kind: 'tension', note: `${a.name} and ${b.name} have a recorded tension.` }]
      if (a.pairsWellWith.includes(b.id) || b.pairsWellWith.includes(a.id)) return [{ ...base, kind: 'fit', note: `${a.name} and ${b.name} are a curated pairing.` }]
      if (exactRecipe) return [{ ...base, kind: 'recipe', note: `${a.name} and ${b.name} are combined in the curated recipe ${exactRecipe.name}.` }]
      return []
    }
    const together = positive.find(recipe => recipe.tools.some(id => first.capability.products.includes(id)) && recipe.tools.some(id => second.capability.products.includes(id)))
    if (together) return [{ ...base, kind: 'recipe', note: `${first.name} and ${second.name} are combined in ${together.name}.` }]
    for (const x of first.capability.products) for (const y of second.capability.products) {
      const px = find(x)
      const py = find(y)
      if (px && py && (px.pairsWellWith.includes(y) || py.pairsWellWith.includes(x))) return [{ ...base, kind: 'fit', note: `Products in these capabilities have a recorded pairing, for example ${px.name} and ${py.name}.` }]
    }
    return []
  }))
}

export function encodeSlots(slots: Slot[]) {
  return slots.map(slot => slot.product ? `${slot.capability}:${slot.product}` : slot.capability).join(',')
}

export function decodeSlots(edition: EditionId, value: string | null | undefined): Slot[] {
  if (!value) return []
  const slots: Slot[] = []
  for (const part of value.split(',')) {
    const [capId, productId] = part.split(':')
    const byCap = capabilityById(edition, capId)
    // Older links carry product ids only.
    const capability = byCap ?? capabilityOf(edition, capId)
    const product = byCap ? productId : capId
    if (!capability || slots.some(slot => slot.capability === capability.id && slot.product === product)) continue
    slots.push({ capability: capability.id, product: product && capability.products.includes(product) ? product : undefined })
  }
  return slots
}
