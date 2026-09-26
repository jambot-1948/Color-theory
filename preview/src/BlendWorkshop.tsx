import { useMemo, useState } from 'react'
import { ArrowRight, Check, Copy, Plus, Search, X } from 'lucide-react'
import { architecturalChromaticsData } from './architectural-chromatics-data'
import { dataEngineeringChromaticsData } from './data-engineering-chromatics-data'
import { agentHarnessChromaticsData } from './agent-harness-chromatics-data'
import type { WorkshopData } from './workshopData'
import AssemblyGuide from './AssemblyGuide'
import { analyzeStack } from './stackAnalysis'
import './BlendWorkshop.css'
import './WorkshopNavigation.css'
import SiteHeader from './SiteHeader'
import { assemblyStories } from './assemblyStories'
import { blueprintMatch, capabilityList, decodeSlots, encodeSlots, isCaution, slotLinks, slotTools, slotsFromTools, type Slot } from './bricks/capabilityModel'

type Lens = 'Architect' | 'Operator' | 'Consultant'
const editions = {
  ai: { data: architecturalChromaticsData, title: 'AI systems', defaultTools: ['openai', 'pinecone', 'langsmith'] },
  data: { data: dataEngineeringChromaticsData, title: 'Data engineering', defaultTools: dataEngineeringChromaticsData.recipes[0].tools },
  harness: { data: agentHarnessChromaticsData, title: 'Agent harness', defaultTools: agentHarnessChromaticsData.recipes[0].tools },
} as const

export default function BlendWorkshop({ edition = 'ai' }: { edition?: keyof typeof editions }) {
  const config = editions[edition]
  const data: WorkshopData = config.data
  const caps = capabilityList(edition)
  const presets = data.recipes.map(recipe => ({ name: recipe.name, slots: slotsFromTools(edition, recipe.tools), caution: isCaution(data, recipe) }))
  const hues = Object.fromEntries(data.hues.map(hue => [hue.id, hue])) as Record<string, (typeof data.hues)[number]>
  const [slots, setSlots] = useState<Slot[]>(() => {
    const params = new URLSearchParams(location.search)
    const shared = decodeSlots(edition, params.get('build') ?? params.get('blend')).slice(0, 8)
    return shared.length ? shared : slotsFromTools(edition, [...config.defaultTools])
  })
  const [search, setSearch] = useState('')
  const [lens, setLens] = useState<Lens>('Architect')
  const [copied, setCopied] = useState(false)
  const tools = useMemo(() => slotTools(edition, data, slots), [edition, data, slots])
  const active = [...new Set(tools.map(tool => tool.primaryHue))]
  const match = blueprintMatch(edition, data, slots)
  const recipe = match?.recipe
  const story = recipe && edition === 'ai' ? assemblyStories[recipe.id] : undefined
  const links = slotLinks(edition, data, slots, story?.links)
  const pattern = recipe ? data.patterns.find(item => item.id === recipe.patternIds[0]) : analyzeStack(tools, data).pattern
  const tensions = links.filter(link => link.kind === 'tension').map(link => link.note)
  const swapped = match && !match.exact ? slots.filter(slot => slot.product && !match.recipe.tools.includes(slot.product)).map(slot => data.tools.find(tool => tool.id === slot.product)?.name).filter(Boolean) : []
  const unfilled = tools.filter(tool => !tool.product).map(tool => tool.name)
  const nextCheck = unfilled.length ? `Choose a product for ${unfilled.join(', ')}. The blueprint holds; the fit depends on which products you pick.` : recipe?.whereItBreaks?.[0] || recipe?.symptoms?.[0] || tensions[0] || 'Confirm who owns each integration point in this composition.'
  const readingLabel = recipe
    ? isCaution(data, recipe) ? 'CURATED CAUTION' : match?.exact ? 'CURATED RECIPE' : 'CURATED BLUEPRINT'
    : tensions.length ? 'RECORDED CONFLICT' : pattern ? 'ROLE RESEMBLANCE' : 'NO PATTERN MATCH'
  const readingTitle = recipe?.name || pattern?.name || 'A new composition'
  const blueprintNote = match && !match.exact ? (swapped.length ? `Same capabilities as ${recipe?.name}, filled with different products: ${swapped.join(', ')}.` : `Same capabilities as ${recipe?.name}. Choose products to compare with the curated build.`) : ''
  const architectText = [blueprintNote, recipe?.useCase || pattern?.description || 'This selection does not yet match a named pattern in the reference.'].filter(Boolean).join(' ')
  const architectDetail = recipe?.whyItWorks?.join(' · ') || recipe?.whyItHappens?.join(' · ') || active.map(id => hues[id].name).join(' · ')
  const operatorText = recipe?.whereItBreaks?.[0] || recipe?.symptoms?.[0] || tensions[0] || 'No direct conflict is recorded for these parts.'
  const operatorDetail = recipe?.whereItBreaks?.slice(1).join(' · ') || recipe?.symptoms?.slice(1).join(' · ') || pattern?.weaknesses.join(' · ') || 'Check how each part will be owned and observed.'
  const consultantText = recipe?.useCase || `${tools.map(tool => `${tool.name}${tool.product ? ` (${tool.product.name})` : ''} covers ${hues[tool.primaryHue].name.toLowerCase()}`).join('; ')}.`
  const consultantDetail = recipe?.fix?.[0] || recipe?.whyItWorks?.join(' · ') || pattern?.strengths.join(' · ') || 'The role boundaries need a closer review.'
  const query = search.toLowerCase()
  const available = caps.filter(cap => !slots.some(slot => slot.capability === cap.id) && `${cap.name} ${cap.summary} ${hues[cap.hue].name} ${cap.products.map(id => data.tools.find(tool => tool.id === id)?.name).join(' ')}`.toLowerCase().includes(query))
  const productName = (id: string) => data.tools.find(tool => tool.id === id)?.name ?? id

  function add(id: string) { setSlots(current => current.length < 8 ? [...current, { capability: id }] : current) }
  function remove(index: number) { setSlots(current => current.filter((_, position) => position !== index)) }
  function fill(index: number, product: string) { setSlots(current => current.map((slot, position) => position === index ? { ...slot, product: product || undefined } : slot)) }
  async function share() {
    const url = new URL(location.href)
    url.searchParams.delete('blend')
    url.searchParams.set('build', encodeSlots(slots))
    try { await navigator.clipboard.writeText(url.toString()); setCopied(true); window.setTimeout(() => setCopied(false), 2000) }
    catch { window.prompt('Copy build link', url.toString()) }
  }

  return <div className="bw-app">
    <SiteHeader active={edition} />
    <main className="bw-main"><div className="bw-title"><div><h1>{config.title} assembly</h1><p>Choose the capabilities you need. Then choose which products fill them.</p></div><span>{caps.length} capabilities / {data.tools.length} products</span></div>
      <div className="bw-layout"><aside className="bw-library" id="bw-tool-library"><div className="bw-presets"><div className="bw-section-head"><h2>Assembly examples</h2><span>{presets.length} curated</span></div>{presets.map(preset => <button key={preset.name} onClick={() => setSlots(preset.slots)}>{preset.name}{preset.caution && <small>Caution</small>}<ArrowRight size={15} /></button>)}</div><div className="bw-section-head"><h2>Parts</h2><span>{caps.length} capabilities</span></div><label className="bw-search"><Search size={16} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search capabilities or products" /></label>
        <div className="bw-tool-list">{available.map(cap => <button key={cap.id} className="bw-tool" onClick={() => add(cap.id)} disabled={slots.length >= 8} title={slots.length >= 8 ? 'Remove a part to add another' : cap.summary}><i style={{ background: hues[cap.hue].hex }} /><span><strong>{cap.name}</strong><small>{hues[cap.hue].name} · {cap.products.map(productName).join(', ')}</small></span><Plus size={16} /></button>)}{!available.length && <p className="bw-empty">No matching capabilities. Try a product or role name.</p>}</div>

      </aside>
      <section className="bw-workspace"><div className="bw-workspace-head"><div><span className="bw-label">CURRENT BUILD</span><h2>{tools.length ? tools.map(tool => tool.name).join(' + ') : 'Start a build'}</h2>{tools.length > 0 && <p className="bw-products">{tools.map(tool => tool.product?.name ?? `any ${tool.name.toLowerCase()}`).join(' · ')}</p>}</div><button className="bw-share" onClick={share} disabled={!tools.length} title="Copy share link" aria-label="Copy share link">{copied ? <Check size={18} /> : <Copy size={18} />}</button></div><button className="bw-add-mobile" onClick={() => document.getElementById('bw-tool-library')?.scrollIntoView({ behavior: 'smooth' })}><Plus size={15} />Add parts</button>
        <div className="bw-slots"><span className="bw-label">PARTS TRAY · CAPABILITY, THEN PRODUCT</span>{tools.length ? <div className="bw-slot-list">{tools.map((tool, index) => <div key={tool.id} className={`bw-slot${tool.product ? '' : ' is-empty'}`}><i style={{ background: hues[tool.primaryHue].hex }} /><span className="bw-slot-name"><strong>{tool.name}</strong><small>{hues[tool.primaryHue].name}</small></span><label><span className="bw-visually-hidden">Product for {tool.name}</span><select value={tool.product?.id ?? ''} onChange={event => fill(index, event.target.value)}><option value="">Any product</option>{tool.capability.products.map(id => <option key={id} value={id}>{productName(id)}</option>)}</select></label><button onClick={() => remove(index)} title={`Remove ${tool.name}`} aria-label={`Remove ${tool.name}`}><X size={14} /></button></div>)}</div> : <p>Pick a capability from the parts list to begin.</p>}</div>
        <AssemblyGuide key={`${edition}-${encodeSlots(slots)}`} tools={tools} links={links} recipeId={recipe?.id} exact={match?.exact} data={data} edition={edition} />
        <div className="bw-reading"><div className="bw-section-head"><h3>Completed composition</h3></div><div className="bw-lenses" role="tablist" aria-label="Reading lens">{(['Architect', 'Operator', 'Consultant'] as Lens[]).map(item => <button key={item} role="tab" aria-selected={lens === item} className={lens === item ? 'active' : ''} onClick={() => setLens(item)}>{item}</button>)}</div>
          {tools.length ? <div className="bw-reading-copy">
            <span className="bw-label">{readingLabel}</span>
            <h4>{readingTitle}</h4>
            {lens === 'Architect' && <><p>{architectText}</p><div className="bw-insight"><strong>{recipe?.whyItHappens ? 'How it happens' : recipe ? 'Why this build' : 'Roles present'}</strong><span>{architectDetail}</span></div></>}
            {lens === 'Operator' && <><p>{operatorText}</p><div className="bw-insight"><strong>{recipe ? 'Also check' : 'Pattern trade-offs'}</strong><span>{operatorDetail}</span></div></>}
            {lens === 'Consultant' && <><p>{consultantText}</p><div className="bw-insight"><strong>{pattern?.type === 'anti-pattern' ? 'Recommended fix' : recipe ? 'Summary' : 'Pattern potential'}</strong><span>{consultantDetail}</span></div></>}
          </div> : <p className="bw-empty">Your reading appears as you add parts.</p>}
        </div>{tools.length > 0 && <div className="bw-next"><div><span className="bw-label">NEXT CHECK</span><p>{nextCheck}</p></div><ArrowRight size={20} /></div>}</section></div>
    </main></div>
}
