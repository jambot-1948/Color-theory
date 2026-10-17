import { editionInfo } from '../../preview/src/bricks/editions'
import { blueprintMatch, isCaution, slotLinks, slotTools, slotsFromTools } from '../../preview/src/bricks/capabilityModel'
import { readBuild, type EditionId } from '../../preview/src/bricks/buildModel'
import { sceneBricks } from '../../preview/src/bricks/scene'
import type { SceneBrick } from '../../preview/src/bricks/Brick'
import { allStories } from '../../preview/src/stories'

// The job the goal-first cut is anchored on, and the questions that name the roles it needs.
// Authored for the video: the site's data holds recipes and pairings, not jobs.
// Which roles each question asks for is editorial; everything built from them is computed.

export const job = {
  line: 'Say you need a tool to explore how a project team works.',
  detail: 'Its tickets, commits and conversations, in one place people can question.',
}

export interface Question {
  text: string
  note?: string
  asks: Partial<Record<EditionId, string[]>>
  optional?: boolean
}

export const questions: Question[] = [
  { text: 'Where does the team’s data come from, and how fresh must it be?', note: 'Collect it nightly and model it in one place.', asks: { data: ['ingest', 'transform', 'store', 'orchestrate'] } },
  { text: 'Who may see whose work?', note: 'This is people data.', asks: { data: ['govern'], foundations: ['trust'] } },
  { text: 'Can we trust the numbers?', asks: { data: ['observe'] } },
  { text: 'How will people ask?', note: 'Dashboards, and questions in plain language.', asks: { data: ['serve'], ai: ['cognition', 'memory', 'interface'], foundations: ['experience'] } },
  { text: 'Does it only answer, or also act?', note: 'Acting adds a system of its own.', asks: { harness: ['permissions', 'evidence'] }, optional: true },
]

export const jobHues = (edition: EditionId) => [...new Set(questions.flatMap(question => question.asks[edition] ?? []))]

// The systems the job leads to. Products are chosen from curated recipes where one fits.
export const systems = {
  data: { edition: 'data' as const, name: 'Team data', tools: ['fivetran', 'dbt', 'snowflake', 'trino', 'airflow', 'great-expectations', 'datahub'] },
  ai: { edition: 'ai' as const, name: 'Ask in plain language', tools: ['openai', 'pinecone', 'langchain', 'langgraph', 'langsmith'] },
  foundations: { edition: 'foundations' as const, name: 'Login, app and delivery', tools: ['nextjs', 'nodejs', 'postgresql', 'heroku', 'auth0', 'github-actions'] },
  harness: { edition: 'harness' as const, name: 'Only if it acts', tools: [] as string[] },
}

export const hueOf = (edition: EditionId, id: string) => editionInfo[edition].data.hues.find(hue => hue.id === id)!

// Read a build the way the site does, with the job's unfilled roles counted as missing parts.
export function readSystem(edition: EditionId, toolIds: string[], layoutIds: string[] = toolIds) {
  const { data } = editionInfo[edition]
  const slots = slotsFromTools(edition, toolIds)
  const tools = slotTools(edition, data, slots)
  const match = blueprintMatch(edition, data, slots)
  const links = slotLinks(edition, data, slots, match ? allStories[match.recipe.id]?.links : undefined)
  const filled = new Set(tools.map(tool => tool.primaryHue))
  const gaps = jobHues(edition).filter(hue => !filled.has(hue))
  const reading = readBuild(edition, tools, links, { caution: match ? isCaution(data, match.recipe) : false, gaps })

  // Lay out the finished set once, so each part and each placeholder keeps its seat across steps.
  const layoutTools = slotTools(edition, data, slotsFromTools(edition, layoutIds))
  const layoutFilled = new Set(layoutTools.map(tool => tool.primaryHue))
  const extraGhosts = jobHues(edition).filter(hue => !layoutFilled.has(hue))
  const full = sceneBricks({ edition, data, tools: layoutTools, layoutTools, links, ghostHues: extraGhosts })
  const parts = sceneBricks({ edition, data, tools, layoutTools, links, ghostHues: extraGhosts }).filter(brick => brick.state !== 'ghost')
  const shown = new Set(parts.map(brick => brick.id))
  const ghostFor = (hue: string): SceneBrick | undefined => {
    const info = hueOf(edition, hue)
    const part = full.find(brick => brick.state !== 'ghost' && layoutTools.find(tool => tool.id === brick.id)?.primaryHue === hue)
    if (part) return shown.has(part.id) ? undefined : { id: `ghost-${hue}`, box: part.box, hex: info.hex, label: info.name, tag: 'Missing', state: 'ghost' }
    const ghost = full.find(brick => brick.state === 'ghost' && brick.label === info.name)
    return ghost && { ...ghost, id: `ghost-${hue}` }
  }
  const ghosts = gaps.map(ghostFor).filter((brick): brick is SceneBrick => Boolean(brick))
  return { tools, links, reading, match, parts, ghosts, ghostFor, bricks: [...parts, ...ghosts] }
}
