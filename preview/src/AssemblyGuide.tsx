import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { WorkshopData, WorkshopTool } from './workshopData'
import { assemblyStories, type AssemblyLinkKind, type AssemblyStory } from './assemblyStories'
import ArchitectureViews from './ArchitectureViews'
import './AssemblyGuide.css'

type LinkKind = AssemblyLinkKind | 'unclassified'
interface DiagramLink {
  first: number
  second: number
  kind: AssemblyLinkKind
  note: string
}

function linkKind(first: WorkshopTool, second: WorkshopTool): LinkKind {
  if (first.conflictsWith.includes(second.id) || second.conflictsWith.includes(first.id)) return 'tension'
  if (first.pairsWellWith.includes(second.id) || second.pairsWellWith.includes(first.id)) return 'fit'
  return 'unclassified'
}

function stepDetail(tool: WorkshopTool, earlier: WorkshopTool[]) {
  if (!earlier.length) return tool.description
  const tension = earlier.find(other => linkKind(tool, other) === 'tension')
  if (tension) return `${tool.description} The data also records a tension with ${tension.name}; review the boundary between them.`
  const fit = earlier.find(other => linkKind(tool, other) === 'fit')
  if (fit) return `${tool.description} The tool data also records a pairing with ${fit.name}.`
  return `${tool.description} No direct pairing with the earlier parts is recorded yet.`
}

function diagramLinks(tools: WorkshopTool[], story?: AssemblyStory): DiagramLink[] {
  if (story) return story.links.flatMap(link => {
    const first = tools.findIndex(tool => tool.id === link.first)
    const second = tools.findIndex(tool => tool.id === link.second)
    return first >= 0 && second >= 0 ? [{ first, second, kind: link.kind, note: link.note }] : []
  })

  return tools.flatMap((first, index) => tools.slice(index + 1).flatMap((second, offset) => {
    const kind = linkKind(first, second)
    if (kind === 'unclassified') return []
    return [{ first: index, second: index + offset + 1, kind, note: kind === 'fit' ? 'Curated pairing in the tool data.' : 'Recorded conflict in the tool data.' }]
  }))
}

function PartGlyph({ role, color, y }: { role: string, color: string, y: number }) {
  const top = y + 17
  if (role === 'interface') return <g><rect x="89" y={top + 5} width="43" height="27" rx="2" fill={color} /><rect x="94" y={top + 9} width="33" height="18" rx="1" fill="#fff" opacity=".88" /><rect x="86" y={top + 32} width="49" height="4" rx="1" fill={color} opacity=".7" /></g>
  if (role === 'memory') return <g>{[0, 1, 2].map(index => <g key={index}><rect x={89 + index * 3} y={top + 4 + index * 9} width="38" height="10" rx="1" fill={color} opacity={.65 + index * .17} /><line x1={93 + index * 3} y1={top + 7 + index * 9} x2={117 + index * 3} y2={top + 7 + index * 9} stroke="#fff" opacity=".65" /></g>)}</g>
  if (role === 'logic') return <g><rect x="89" y={top + 4} width="43" height="29" rx="1" fill={color} opacity=".13" stroke={color} /><path d={`M 95 ${top + 11} H 115 V ${top + 26} H 125 M 115 ${top + 18} H 125`} fill="none" stroke={color} strokeWidth="3" strokeLinecap="square" /><circle cx="95" cy={top + 11} r="3" fill={color} /><circle cx="125" cy={top + 18} r="3" fill={color} /><circle cx="125" cy={top + 26} r="3" fill={color} /></g>
  if (role === 'cognition') return <g><polygon points={`90,${top + 12} 100,${top + 3} 126,${top + 3} 134,${top + 12} 124,${top + 22} 98,${top + 22}`} fill={color} opacity=".88" /><polygon points={`98,${top + 22} 124,${top + 22} 124,${top + 35} 98,${top + 35}`} fill={color} /><polygon points={`124,${top + 22} 134,${top + 12} 134,${top + 26} 124,${top + 35}`} fill={color} opacity=".65" /><circle cx="111" cy={top + 12} r="3" fill="#fff" opacity=".85" /></g>
  if (role === 'velocity') return <g><rect x="87" y={top + 14} width="49" height="17" rx="1" fill={color} /><rect x="92" y={top + 8} width="10" height="7" rx="1" fill={color} opacity=".7" /><rect x="110" y={top + 8} width="10" height="7" rx="1" fill={color} opacity=".7" /><rect x="95" y={top + 31} width="9" height="4" fill={color} opacity=".55" /><rect x="120" y={top + 31} width="9" height="4" fill={color} opacity=".55" /></g>
  if (role === 'trust') return <g><path d={`M 89 ${top + 7} L 110 ${top + 2} L 132 ${top + 7} L 132 ${top + 24} L 110 ${top + 36} L 89 ${top + 24} Z`} fill={color} opacity=".18" stroke={color} strokeWidth="2" /><path d={`M 99 ${top + 19} L 107 ${top + 25} L 122 ${top + 12}`} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></g>
  if (['ingest', 'invocation'].includes(role)) return <g><path d={`M 89 ${top + 7} H 113 V ${top + 15} H 130 V ${top + 31} H 89 Z`} fill={color} opacity=".8" /><path d={`M 98 ${top + 22} H 125 M 118 ${top + 16} L 125 ${top + 22} L 118 ${top + 28}`} fill="none" stroke="#fff" strokeWidth="3" /></g>
  if (['transform', 'execution'].includes(role)) return <g><rect x="89" y={top + 6} width="43" height="29" fill={color} opacity=".2" stroke={color} /><path d={`M 96 ${top + 13} H 125 M 96 ${top + 21} H 116 M 96 ${top + 29} H 125`} stroke={color} strokeWidth="3" /></g>
  if (['orchestrate', 'resilience'].includes(role)) return <g><circle cx="110" cy={top + 20} r="16" fill="none" stroke={color} strokeWidth="4" /><path d={`M 110 ${top + 9} V ${top + 21} L 120 ${top + 26}`} fill="none" stroke={color} strokeWidth="3" /></g>
  if (['store', 'state'].includes(role)) return <g>{[0, 1, 2].map(index => <ellipse key={index} cx="110" cy={top + 10 + index * 10} rx="21" ry="7" fill={color} opacity={.45 + index * .2} stroke="#fff" />)}</g>
  if (['serve', 'scaling'].includes(role)) return <g><rect x="89" y={top + 12} width="17" height="22" fill={color} /><rect x="110" y={top + 5} width="17" height="29" fill={color} opacity=".75" /><path d={`M 94 ${top + 19} H 101 M 115 ${top + 12} H 122`} stroke="#fff" strokeWidth="2" /></g>
  if (['observe', 'observability'].includes(role)) return <g><path d={`M 89 ${top + 20} Q 110 ${top - 2} 132 ${top + 20} Q 110 ${top + 43} 89 ${top + 20}`} fill={color} opacity=".18" stroke={color} strokeWidth="2" /><circle cx="110" cy={top + 20} r="7" fill={color} /></g>
  if (['govern', 'security'].includes(role)) return <g><path d={`M 90 ${top + 5} L 110 ${top + 1} L 131 ${top + 5} V ${top + 22} Q 126 ${top + 31} 110 ${top + 37} Q 94 ${top + 31} 90 ${top + 22} Z`} fill={color} opacity=".25" stroke={color} strokeWidth="2" /><path d={`M 101 ${top + 20} L 108 ${top + 26} L 121 ${top + 13}`} fill="none" stroke={color} strokeWidth="3" /></g>
  return <g><rect x="89" y={top + 7} width="34" height="27" rx="1" fill={color} opacity=".85" /><path d={`M 122 ${top + 7} L 136 ${top + 20} L 122 ${top + 34} Z`} fill={color} /><line x1="95" y1={top + 14} x2="116" y2={top + 14} stroke="#fff" opacity=".7" /></g>
}

function BuildDiagram({ tools, links, showAllLinks, data }: { tools: WorkshopTool[], links: DiagramLink[], showAllLinks: boolean, data: WorkshopData }) {
  const height = Math.max(160, 38 + tools.length * 76)
  const drawnLinks = showAllLinks ? links : links.filter(link => link.second === tools.length - 1)

  return <svg className="ag-diagram" viewBox={`0 0 470 ${height}`} role="img" aria-label={`Assembly with ${tools.map(tool => tool.name).join(', ')}. ${drawnLinks.filter(link => link.kind !== 'tension').length} supporting relationships and ${drawnLinks.filter(link => link.kind === 'tension').length} tensions shown.`}>
    <defs><marker id="ag-step-arrow" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 1 L7 4 L1 7" fill="none" stroke="#a7b1ab" strokeWidth="1.3" /></marker></defs>
    {tools.slice(0, -1).map((tool, index) => <line key={tool.id} x1="37" y1={97 + index * 76} x2="37" y2={112 + index * 76} stroke="#a7b1ab" strokeWidth="1.5" markerEnd="url(#ag-step-arrow)" />)}
    {drawnLinks.map((link, index) => {
      const y1 = 68 + link.first * 76
      const y2 = 68 + link.second * 76
      const bend = 365 + (index % 4) * 18
      return <path key={`${link.first}-${link.second}`} d={`M 337 ${y1} C ${bend} ${y1}, ${bend} ${y2}, 337 ${y2}`} fill="none" stroke={link.kind === 'tension' ? '#c84c3a' : link.kind === 'recipe' ? '#65766c' : '#3f8f8c'} strokeWidth="2.2" strokeDasharray={link.kind === 'tension' ? '5 4' : undefined}><title>{link.note}</title></path>
    })}
    {tools.map((tool, index) => {
      const hue = data.hues.find(item => item.id === tool.primaryHue)!
      const y = 36 + index * 76
      const newest = index === tools.length - 1
      return <g key={tool.id}>
        <circle cx="37" cy={y + 32} r="15" fill={newest ? '#1d2b26' : '#fff'} stroke={newest ? '#1d2b26' : '#c9d2cc'} />
        <text x="37" y={y + 36} textAnchor="middle" fontSize="11" fontWeight="700" fill={newest ? '#fff' : '#53635a'}>{index + 1}</text>
        <rect x="70" y={y} width="267" height="64" rx="3" fill={newest ? '#f6f9f7' : '#fff'} stroke={newest ? '#70847a' : '#cdd6d0'} strokeWidth={newest ? '1.8' : '1'} />
        <rect x="70" y={y} width="9" height="64" fill={hue.hex} />
        <PartGlyph role={tool.primaryHue} color={hue.hex} y={y} />
        <text x="146" y={y + 36} fontSize="14" fontWeight="700" fill="#1e2c25">{tool.name.length > 20 ? `${tool.name.slice(0, 18)}…` : tool.name}</text>
        <text x="146" y={y + 53} fontSize="9" fill="#69776e">{hue.name.toUpperCase()} · {tool.category.toUpperCase()}</text>
        <rect x="331" y={y + 27} width="13" height="10" rx="1" fill="#fff" stroke="#b9c6bd" />
      </g>
    })}
  </svg>
}

export default function AssemblyGuide({ tools, recipeId, data, edition }: { tools: WorkshopTool[], recipeId?: string, data: WorkshopData, edition: string }) {
  const hasArchitecture = edition === 'ai' && recipeId === 'lean-agent-runtime'
  const [view, setView] = useState<'parts' | 'map' | 'journey'>('parts')
  const story = edition === 'ai' && recipeId ? assemblyStories[recipeId] : undefined
  const orderedTools = story
    ? story.steps.map(item => tools.find(tool => tool.id === item.toolId)).filter((tool): tool is WorkshopTool => Boolean(tool))
    : recipeId ? data.recipes.find(recipe => recipe.id === recipeId)?.tools.map(id => tools.find(tool => tool.id === id)).filter((tool): tool is WorkshopTool => Boolean(tool)) ?? tools : tools
  const [step, setStep] = useState(orderedTools.length)
  const [showAllLinks, setShowAllLinks] = useState(
    orderedTools.length <= 3 || Boolean(story?.links.some(link => link.kind === 'tension')),
  )
  const visible = orderedTools.slice(0, step)
  const current = visible.at(-1)
  const earlier = visible.slice(0, -1)
  const links = diagramLinks(visible, story)
  const storyStep = story?.steps.find(item => item.toolId === current?.id)
  const introducedLinks = story ? links.filter(link => link.second === visible.length - 1) : []
  const unclassifiedPairs = story ? 0 : visible.flatMap((first, index) => visible.slice(index + 1).map(second => linkKind(first, second))).filter(kind => kind === 'unclassified').length

  return <div className="ag-guide">
    <div className="ag-head"><div><h3>Assembly guide</h3><p>{story ? 'Curated sequence for this recipe.' : recipeId ? 'Parts shown in recipe order; lines mark recorded pairings, not data flow.' : 'One possible build order for understanding this stack.'}</p></div><span>{hasArchitecture && view !== 'parts' ? 'WORKED EXAMPLE' : orderedTools.length ? `STEP ${String(step).padStart(2, '0')} / ${String(orderedTools.length).padStart(2, '0')}` : 'NO PARTS YET'}</span></div>
    {hasArchitecture && <div className="ag-view-tabs" role="tablist" aria-label="Recipe view">{([['parts', 'Parts'], ['map', 'System map'], ['journey', 'Follow a request']] as const).map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={view === id} onClick={() => setView(id)}>{label}</button>)}</div>}
    {hasArchitecture && view !== 'parts' ? <ArchitectureViews view={view} /> : orderedTools.length ? <div className="ag-layout">
      <div className="ag-board">
        <div className="ag-board-head"><span>ASSEMBLY STATE</span><span>{visible.length} OF {orderedTools.length} PARTS</span></div>
        <BuildDiagram tools={visible} links={links} showAllLinks={showAllLinks} data={data} />
        <div className="ag-board-legend"><span><i className="ag-fit" />Curated fit</span>{story?.links.some(link => link.kind === 'recipe') && <span><i className="ag-recipe" />Recipe link</span>}<span><i className="ag-tension" />Design tension</span><button onClick={() => setShowAllLinks(value => !value)}>{showAllLinks ? 'Show step links' : 'Show all links'}</button>{!story && <span>{unclassifiedPairs} unclassified pairs</span>}</div>
      </div>
      <div className="ag-instructions">
        <div className="ag-step-list" aria-label="Assembly steps">{orderedTools.map((tool, index) => {
          const hue = data.hues.find(item => item.id === tool.primaryHue)!
          return <button key={tool.id} className={step === index + 1 ? 'ag-step active' : 'ag-step'} onClick={() => setStep(index + 1)} aria-current={step === index + 1 ? 'step' : undefined}>
            <span className="ag-step-number">{String(index + 1).padStart(2, '0')}</span><span className="ag-part-color" style={{ background: hue.hex }} /><span className="ag-step-name"><strong>{tool.name}</strong><small>{story?.steps[index]?.action || `${hue.name} · ${tool.category}`}</small></span>
          </button>
        })}</div>
        <div className="ag-step-note"><span className="bw-label">ADD THIS PART</span><h4>{storyStep?.action || current?.name}</h4><p>{storyStep?.explanation || (current && stepDetail(current, earlier))}</p>{introducedLinks.length > 0 && <div className="ag-link-notes">{introducedLinks.map(link => <div key={`${link.first}-${link.second}`}><i className={`ag-${link.kind}`} /><span>{link.note}</span></div>)}</div>}</div>
        <div className="ag-navigation"><button onClick={() => setStep(value => Math.max(1, value - 1))} disabled={step === 1} aria-label="Previous assembly step"><ChevronLeft size={17} /></button><span>{step} / {orderedTools.length}</span><button onClick={() => setStep(value => Math.min(orderedTools.length, value + 1))} disabled={step === orderedTools.length} aria-label="Next assembly step"><ChevronRight size={17} /></button></div>
      </div>
    </div> : <p className="bw-empty">Choose a tool from the parts library to start an assembly.</p>}
  </div>
}
