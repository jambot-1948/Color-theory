import type { WorkshopData, WorkshopPattern, WorkshopRecipe, WorkshopTool } from './workshopData'

export type AnalysisKind = 'recipe' | 'conflict' | 'resemblance' | 'none'

export interface StackAnalysis {
  kind: AnalysisKind
  recipe?: WorkshopRecipe
  pattern?: WorkshopPattern
  conflicts: [WorkshopTool, WorkshopTool][]
}

export function analyzeStack(tools: WorkshopTool[], data: WorkshopData): StackAnalysis {
  const ids = new Set(tools.map(tool => tool.id))
  const recipe = data.recipes.find(item => item.tools.length === ids.size && item.tools.every(id => ids.has(id)))
  const conflicts: [WorkshopTool, WorkshopTool][] = tools.flatMap((first, index) =>
    tools.slice(index + 1)
      .filter(second => first.conflictsWith.includes(second.id) || second.conflictsWith.includes(first.id))
      .map(second => [first, second] as [WorkshopTool, WorkshopTool]),
  )

  if (recipe) {
    return {
      kind: 'recipe',
      recipe,
      pattern: data.patterns.find(item => item.id === recipe.patternIds[0]),
      conflicts,
    }
  }

  if (conflicts.length) {
    return {
      kind: 'conflict',
      pattern: data.patterns.find(item => item.type === 'anti-pattern' && item.hues.filter(hue => tools.some(tool => tool.primaryHue === hue)).length >= 2),
      conflicts,
    }
  }

  const hues = new Set(tools.map(tool => tool.primaryHue))
  if (hues.size < 2) return { kind: 'none', conflicts }

  const pattern = data.patterns
    .filter(item => item.type !== 'anti-pattern' && item.hues.filter(hue => hues.has(hue)).length >= 2)
    .sort((first, second) => {
      const score = (item: WorkshopPattern) => {
        const matchingHues = item.hues.filter(hue => hues.has(hue)).length
        const toolSupport = tools.filter(tool => tool.patterns.includes(item.id)).length
        return matchingHues / new Set([...item.hues, ...hues]).size + toolSupport * 0.05
      }
      return score(second) - score(first)
    })[0]

  return { kind: pattern ? 'resemblance' : 'none', pattern, conflicts }
}
