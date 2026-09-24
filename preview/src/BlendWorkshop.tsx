import { useMemo, useState } from 'react'
import { ArrowRight, Check, Copy, Plus, Search, X } from 'lucide-react'
import { architecturalChromaticsData } from './architectural-chromatics-data'
import { dataEngineeringChromaticsData } from './data-engineering-chromatics-data'
import { agentHarnessChromaticsData } from './agent-harness-chromatics-data'
import type { WorkshopData, WorkshopTool } from './workshopData'
import AssemblyGuide from './AssemblyGuide'
import { analyzeStack } from './stackAnalysis'
import './BlendWorkshop.css'
import './WorkshopNavigation.css'

type Lens = 'Architect' | 'Operator' | 'Consultant'
const editions = {
  ai: { data: architecturalChromaticsData, title: 'AI systems', defaultTools: ['openai', 'pinecone', 'langsmith'] },
  data: { data: dataEngineeringChromaticsData, title: 'Data engineering', defaultTools: dataEngineeringChromaticsData.recipes[0].tools },
  harness: { data: agentHarnessChromaticsData, title: 'Agent harness', defaultTools: agentHarnessChromaticsData.recipes[0].tools },
} as const

export default function BlendWorkshop({ edition = 'ai' }: { edition?: keyof typeof editions }) {
  const config = editions[edition]
  const data: WorkshopData = config.data
  const presets = data.recipes.map(recipe => ({
    name: recipe.name,
    ids: recipe.tools,
    caution: recipe.patternIds.some(id => data.patterns.find(pattern => pattern.id === id)?.type === 'anti-pattern'),
  }))
  const hues = Object.fromEntries(data.hues.map(hue => [hue.id, hue])) as Record<string, (typeof data.hues)[number]>
  const [selected, setSelected] = useState<string[]>(() => {
    const shared = new URLSearchParams(location.search).get('blend')?.split(',').filter(id => data.tools.some(tool => tool.id === id)).slice(0, 8)
    return shared?.length ? shared : config.defaultTools.slice(0, 8)
  })
  const [search, setSearch] = useState('')
  const [lens, setLens] = useState<Lens>('Architect')
  const [copied, setCopied] = useState(false)
  const tools = useMemo(() => selected.map(id => data.tools.find(tool => tool.id === id)).filter((tool): tool is WorkshopTool => Boolean(tool)), [selected, data])
  const active = [...new Set(tools.map(tool => tool.primaryHue))]
  const analysis = analyzeStack(tools, data)
  const { recipe, pattern } = analysis
  const conflicts = analysis.conflicts.map(([first, second]) => `${first.name} and ${second.name} have a recorded tension. Review where their responsibilities overlap.`)
  const nextCheck = recipe?.whereItBreaks?.[0] || recipe?.symptoms?.[0] || conflicts[0] || 'Confirm who owns each integration point in this composition.'
  const readingLabel = recipe
    ? pattern?.type === 'anti-pattern' ? 'CURATED CAUTION' : 'CURATED RECIPE'
    : analysis.kind === 'conflict' ? 'RECORDED CONFLICT' : analysis.kind === 'resemblance' ? 'ROLE RESEMBLANCE' : 'NO PATTERN MATCH'
  const readingTitle = recipe?.name || pattern?.name || 'A new composition'
  const architectText = recipe?.useCase || pattern?.description || 'This selection does not yet match a named pattern in the reference.'
  const architectDetail = recipe?.whyItWorks?.join(' · ') || recipe?.whyItHappens?.join(' · ') || active.map(id => hues[id].name).join(' · ')
  const operatorText = recipe?.whereItBreaks?.[0] || recipe?.symptoms?.[0] || conflicts[0] || 'No direct conflict is recorded for these tools.'
  const operatorDetail = recipe?.whereItBreaks?.slice(1).join(' · ') || recipe?.symptoms?.slice(1).join(' · ') || pattern?.weaknesses.join(' · ') || 'Check how each part will be owned and observed.'
  const consultantText = recipe?.useCase || `${tools.map(tool => `${tool.name} covers ${hues[tool.primaryHue].name.toLowerCase()}`).join('; ')}.`
  const consultantDetail = recipe?.fix?.[0] || recipe?.whyItWorks?.join(' · ') || pattern?.strengths.join(' · ') || 'The role boundaries need a closer review.'
  const available = data.tools.filter(tool => !selected.includes(tool.id) && `${tool.name} ${tool.category} ${hues[tool.primaryHue].name}`.toLowerCase().includes(search.toLowerCase()))

  function toggle(id: string) { setSelected(current => current.includes(id) ? current.filter(item => item !== id) : current.length < 8 ? [...current, id] : current) }
  async function share() {
    const url = new URL(location.href)
    url.searchParams.set('blend', selected.join(','))
    try { await navigator.clipboard.writeText(url.toString()); setCopied(true); window.setTimeout(() => setCopied(false), 2000) }
    catch { window.prompt('Copy blend link', url.toString()) }
  }

  return <div className="bw-app">
    <header className="bw-header"><a className="bw-brand" href="#/"><span className="bw-mark"><i /><i /><i /></span>Stack Assembly</a><nav aria-label="Main navigation"><a className={edition === 'ai' ? 'active' : ''} href="#/ai-systems">AI systems</a><a className={edition === 'data' ? 'active' : ''} href="#/data-engineering">Data engineering</a><a className={edition === 'harness' ? 'active' : ''} href="#/agent-harness">Agent harness</a><a href="#/reference">Reference</a></nav></header>
    <main className="bw-main"><div className="bw-title"><div><h1>{config.title} assembly</h1><p>Choose the parts. See how they fit.</p></div><span>{data.tools.length} tools / {data.hues.length} roles</span></div>
      <div className="bw-layout"><aside className="bw-library" id="bw-tool-library"><div className="bw-section-head"><h2>Parts library</h2><span>{data.tools.length} tools</span></div><label className="bw-search"><Search size={16} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search tools or roles" /></label>
        <div className="bw-tool-list">{available.map(tool => <button key={tool.id} className="bw-tool" onClick={() => toggle(tool.id)} disabled={selected.length >= 8} title={selected.length >= 8 ? 'Remove a tool to add another' : `Add ${tool.name}`}><i style={{ background: hues[tool.primaryHue].hex }} /><span><strong>{tool.name}</strong><small>{hues[tool.primaryHue].name} · {tool.category}</small></span><Plus size={16} /></button>)}{!available.length && <p className="bw-empty">No matching tools. Try another role or category.</p>}</div>
        <div className="bw-presets"><div className="bw-section-head"><h2>Assembly examples</h2><span>{presets.length} curated</span></div>{presets.map(preset => <button key={preset.name} onClick={() => setSelected(preset.ids)}>{preset.name}{preset.caution && <small>Caution</small>}<ArrowRight size={15} /></button>)}</div>
      </aside>
      <section className="bw-workspace"><div className="bw-workspace-head"><div><span className="bw-label">CURRENT COMPOSITION</span><h2>{tools.length ? tools.map(tool => tool.name).join(' + ') : 'Start a composition'}</h2></div><button className="bw-share" onClick={share} disabled={!tools.length} title="Copy share link" aria-label="Copy share link">{copied ? <Check size={18} /> : <Copy size={18} />}</button></div><button className="bw-add-mobile" onClick={() => document.getElementById('bw-tool-library')?.scrollIntoView({ behavior: 'smooth' })}><Plus size={15} />Add tools</button>
        <div className="bw-selected"><span className="bw-label">PARTS TRAY</span>{tools.length ? tools.map(tool => <button key={tool.id} onClick={() => toggle(tool.id)} title={`Remove ${tool.name}`}><i style={{ background: hues[tool.primaryHue].hex }} />{tool.name}<X size={14} /></button>) : <p>Pick a tool from the library to begin.</p>}</div>
        <AssemblyGuide key={`${edition}-${selected.join(',')}`} tools={tools} recipeId={recipe?.id} data={data} edition={edition} />
        <div className="bw-reading"><div className="bw-section-head"><h3>Completed composition</h3></div><div className="bw-lenses" role="tablist" aria-label="Reading lens">{(['Architect', 'Operator', 'Consultant'] as Lens[]).map(item => <button key={item} role="tab" aria-selected={lens === item} className={lens === item ? 'active' : ''} onClick={() => setLens(item)}>{item}</button>)}</div>
          {tools.length ? <div className="bw-reading-copy">
            <span className="bw-label">{readingLabel}</span>
            <h4>{readingTitle}</h4>
            {lens === 'Architect' && <><p>{architectText}</p><div className="bw-insight"><strong>{recipe?.whyItHappens ? 'How it happens' : recipe ? 'Why this build' : 'Roles present'}</strong><span>{architectDetail}</span></div></>}
            {lens === 'Operator' && <><p>{operatorText}</p><div className="bw-insight"><strong>{recipe ? 'Also check' : 'Pattern trade-offs'}</strong><span>{operatorDetail}</span></div></>}
            {lens === 'Consultant' && <><p>{consultantText}</p><div className="bw-insight"><strong>{pattern?.type === 'anti-pattern' ? 'Recommended fix' : recipe ? 'Summary' : 'Pattern potential'}</strong><span>{consultantDetail}</span></div></>}
          </div> : <p className="bw-empty">Your reading appears as you add tools.</p>}
        </div>{tools.length > 0 && <div className="bw-next"><div><span className="bw-label">NEXT CHECK</span><p>{nextCheck}</p></div><ArrowRight size={20} /></div>}</section></div>
    </main></div>
}
