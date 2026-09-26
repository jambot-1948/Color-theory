export interface WorkshopTool {
  id: string
  name: string
  primaryHue: string
  category: string
  description: string
  pairsWellWith: string[]
  conflictsWith: string[]
  patterns: string[]
}

export interface WorkshopPattern {
  id: string
  name: string
  type: 'foundational' | 'high-velocity' | 'anti-pattern' | 'structural'
  hues: string[]
  description: string
  strengths: string[]
  weaknesses: string[]
}

export interface WorkshopRecipe {
  id: string
  name: string
  tools: string[]
  patternIds: string[]
  useCase: string
  whyItWorks?: string[]
  whereItBreaks?: string[]
  whyItHappens?: string[]
  symptoms?: string[]
  fix?: string[]
  missingHues?: string[]
  upgradePath?: string[]
}

export interface WorkshopData {
  hues: { id: string, name: string, hex: string, description?: string }[]
  tools: WorkshopTool[]
  patterns: WorkshopPattern[]
  recipes: WorkshopRecipe[]
}
