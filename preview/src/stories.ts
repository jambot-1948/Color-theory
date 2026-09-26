import { assemblyStories, type AssemblyStory } from './assemblyStories'
import { dataStories } from './dataStories'

// Authored step stories for every edition, keyed by recipe id.
export const allStories: Record<string, AssemblyStory> = { ...assemblyStories, ...dataStories }
