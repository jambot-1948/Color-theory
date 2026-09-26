import { assemblyStories, type AssemblyStory } from './assemblyStories'
import { dataStories } from './dataStories'
import { harnessStories } from './harnessStories'
import { foundationsStories } from './foundationsStories'

// Authored step stories for every edition, keyed by recipe id.
export const allStories: Record<string, AssemblyStory> = { ...assemblyStories, ...dataStories, ...harnessStories, ...foundationsStories }
