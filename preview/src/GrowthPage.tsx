import { useState } from 'react'
import { ArrowRight, Minus, Plus } from 'lucide-react'
import SiteHeader from './SiteHeader'
import { BrickScene } from './bricks/Brick'
import { MissingCallout } from './bricks/ManualBoard'
import { editionTiers, readBuild, verdictCopy, type EditionId } from './bricks/buildModel'
import { blueprintMatch, encodeSlots, isCaution, slotLinks, slotTools, slotsFromTools } from './bricks/capabilityModel'
import { editionIds, editionInfo } from './bricks/editions'
import { growthTracks, stageTools, type GrowthStage } from './bricks/growthTracks'
import { sceneBricks } from './bricks/scene'
import './bricks/bricks.css'
import './GrowthPage.css'

function stageModel(edition: EditionId, stage: GrowthStage) {
  const track = growthTracks[edition]
  const { data } = editionInfo[edition]
  const { ids, added, removed } = stageTools(track, stage.id)
  const slots = slotsFromTools(edition, ids)
  const tools = slotTools(edition, data, slots)
  const removedTools = slotTools(edition, data, slotsFromTools(edition, removed)).map(tool => ({ ...tool, id: `removed-${tool.id}` }))
  const match = blueprintMatch(edition, data, slots)
  const recipe = match?.exact ? match.recipe : undefined
  const links = slotLinks(edition, data, slots, stage.links)
  const reading = readBuild(edition, tools, links, { caution: stage.caution || Boolean(recipe && isCaution(data, recipe)), gaps: stage.missing })
  const newIds = tools.filter(tool => tool.product && added.includes(tool.product.id)).map(tool => tool.id)
  const bricks = sceneBricks({ edition, data, tools, links, ghostHues: reading.gaps, removed: removedTools, newIds })
  return { data, slots, tools, added, removedTools, reading, bricks, recipe }
}

function StageCard({ edition, stage, index, selected, onSelect }: { edition: EditionId, stage: GrowthStage, index: number, selected: boolean, onSelect: () => void }) {
  const { bricks, reading, added, removedTools } = stageModel(edition, stage)
  return <button type="button" className={`gr-card${selected ? ' is-selected' : ''}${stage.branch ? ' is-branch' : ''}`} onClick={onSelect} aria-pressed={selected}>
    <span className="gr-card-head"><span className="gr-horizon">{stage.branch ? '↳ ' : `${String(index + 1).padStart(2, '0')} · `}{stage.horizon}</span><span className={`gr-pill is-${reading.verdict}`}>{verdictCopy[reading.verdict].label}</span></span>
    <strong>{stage.name}</strong>
    <BrickScene bricks={bricks} plate={{ w: 12, d: 6 }} unit={14} label={`${stage.name}: ${bricks.filter(brick => brick.state !== 'ghost').map(brick => brick.label).join(', ')}`} showArrow={false} showBadges="none" maxTier={editionTiers[edition].length} plateLabel={editionInfo[edition].plateLabel} />
    <span className="gr-delta"><span><Plus size={12} />{added.length} added</span>{removedTools.length > 0 && <span><Minus size={12} />{removedTools.length} removed</span>}</span>
  </button>
}

function StageDetail({ edition, stage }: { edition: EditionId, stage: GrowthStage }) {
  const { data, slots, tools, bricks, reading, added, removedTools, recipe } = stageModel(edition, stage)
  const hue = (id: string) => data.hues.find(item => item.id === id)
  const parent = stage.from && growthTracks[edition].stages.find(item => item.id === stage.from)
  return <section className="gr-detail" aria-live="polite">
    <div className="gr-detail-scene">
      <div className="mb-page-top"><div className={`mb-stamp is-${reading.verdict}`}><small>{stage.horizon.toUpperCase()}{parent ? ` · FROM ${parent.name.toUpperCase()}` : ''}</small><strong>{verdictCopy[reading.verdict].label}</strong></div><MissingCallout data={data} gaps={reading.gaps} /></div>
      <BrickScene bricks={bricks} plate={{ w: 12, d: 6 }} unit={20} label={`${stage.name}. ${verdictCopy[reading.verdict].label}.`} showArrow={false} showBadges="all" maxTier={editionTiers[edition].length} plateLabel={editionInfo[edition].plateLabel} />
      <div className="mb-tiers">{editionTiers[edition].map((tier, index) => <span key={tier.name}><b>T{index + 1}</b>{tier.name}</span>)}</div>
    </div>
    <div className="gr-detail-copy">
      <span className="bw-label">{stage.branch ? 'WRONG TURN' : 'STAGE'}</span>
      <h2>{stage.name}</h2>
      <p className="gr-summary">{stage.summary}</p>
      <div className="gr-changes">
        {added.map(id => { const tool = tools.find(item => item.product?.id === id); const info = tool && hue(tool.primaryHue); return tool && info ? <div key={id} className="gr-change is-add"><Plus size={14} /><i style={{ background: info.hex }} /><span><strong>{tool.name}</strong><small>{tool.product?.name} · {info.name}</small></span></div> : null })}
        {removedTools.map(tool => { const info = hue(tool.primaryHue); return <div key={tool.id} className="gr-change is-remove"><Minus size={14} /><i style={{ background: info?.hex }} /><span><strong>{tool.name}</strong><small>{tool.product?.name} taken off the model</small></span></div> })}
      </div>
      <dl className="gr-notes"><div><dt>Why now</dt><dd>{stage.why}</dd></div><div><dt>Watch for</dt><dd>{stage.watch}</dd></div>{recipe && <div><dt>Matches</dt><dd>{recipe.name}, a curated {isCaution(data, recipe) ? 'cautionary ' : ''}recipe in {editionInfo[edition].title}.</dd></div>}</dl>
      <ul className="gr-reading">
        {reading.seats.filter(item => item.seat === 'clash').map(item => <li key={item.tool.id} className="is-clash">{item.tool.name} is forced against {item.partner?.name}. {item.link?.note}</li>)}
        {reading.shared.map(([first, second]) => <li key={`${first.id}-${second.id}`} className="is-loose">{first.name} and {second.name} both take the {hue(first.primaryHue)?.name} job.</li>)}
        {reading.seats.filter(item => item.seat === 'loose').length > 0 && <li className="is-loose">No recorded partner: {reading.seats.filter(item => item.seat === 'loose').map(item => item.tool.name).join(', ')}.</li>}
        {reading.gaps.length > 0 && <li className="is-gap">Still missing, shown as pale placeholder bricks: {reading.gaps.map(id => hue(id)?.name ?? id).join(', ')}.</li>}
      </ul>
      <a className="gr-open" href={`?build=${encodeSlots(slots)}${editionInfo[edition].href}`}>Open this model in the assembly <ArrowRight size={15} /></a>
    </div>
  </section>
}

export default function GrowthPage({ edition }: { edition: EditionId }) {
  const track = growthTracks[edition]
  const main = track.stages.filter(stage => !stage.branch)
  const branches = track.stages.filter(stage => stage.branch)
  const [selectedId, setSelectedId] = useState(main[0].id)
  const selected = track.stages.find(stage => stage.id === selectedId) ?? main[0]

  return <div className="bw-app">
    <SiteHeader active="growth" />
    <main className="bw-main gr-main">
      <div className="bw-title"><div><h1>Build over time</h1><p>The same model at four points in its life, and one wrong turn. New parts are outlined in bold; removed parts are crossed out.</p></div></div>
      <div className="gr-tabs" role="tablist" aria-label="System">{editionIds.map(id => <a key={id} role="tab" aria-selected={id === edition} className={id === edition ? 'active' : undefined} href={`#/growth${id === 'ai' ? '' : `/${id}`}`}>{editionInfo[id].title}</a>)}</div>
      <div className="gr-track-head"><h2>{track.title}</h2><p>{track.intro}</p></div>
      <div className="gr-line">
        {main.map((stage, index) => <div key={stage.id} className="gr-slot" style={{ gridColumn: index + 1 }}>
          <StageCard edition={edition} stage={stage} index={index} selected={stage.id === selected.id} onSelect={() => setSelectedId(stage.id)} />
          {index < main.length - 1 && <span className="gr-arrow" aria-hidden="true"><ArrowRight size={18} /></span>}
        </div>)}
        {branches.map(stage => {
          const parentIndex = main.findIndex(item => item.id === stage.from)
          return <div key={stage.id} className="gr-slot gr-branch-slot" style={{ gridColumn: Math.min(main.length, parentIndex + 2) }}>
            <span className="gr-branch-note">Branches from {main[parentIndex]?.name}</span>
            <StageCard edition={edition} stage={stage} index={parentIndex} selected={stage.id === selected.id} onSelect={() => setSelectedId(stage.id)} />
          </div>
        })}
      </div>
      <StageDetail key={`${edition}-${selected.id}`} edition={edition} stage={selected} />
      <p className="gr-caveat">Height shows tier, not call order or data flow. These paths are authored illustrations built from the curated tool data. They are not the only healthy order, and the time horizons are typical rather than prescriptive.</p>
    </main>
  </div>
}
