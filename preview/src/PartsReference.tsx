import { useState } from 'react'
import { ArrowRight, Search, X } from 'lucide-react'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
import { BrickIcon, BrickScene, type SceneBrick } from './bricks/Brick'
import { editionTiers, linkBetween, recordedLinks, seatFor, tierOf, type EditionId } from './bricks/buildModel'
import { editionIds, editionInfo } from './bricks/editions'
import { capabilityList, capabilityOf } from './bricks/capabilityModel'
import { BRICK_HEIGHT } from './bricks/iso'
import type { WorkshopData, WorkshopTool } from './workshopData'
import './bricks/bricks.css'
import './PartsReference.css'

const seatText = {
  snap: ['Snaps together', 'A curated pairing is recorded between these parts.'],
  loose: ['Sits loose', 'Nothing is recorded either way. It might work; this reference does not say it locks.'],
  clash: ['Forced', 'A tension is recorded between these parts.'],
  base: ['', ''],
} as const
const sameCapabilityText = ['Same capability', 'Both fill the same brick. In a build they are forced until one is chosen or the work is split.'] as const

function FitBench({ edition, data, first, second, onClear }: { edition: EditionId, data: WorkshopData, first: WorkshopTool, second?: WorkshopTool, onClear: () => void }) {
  const hue = (tool: WorkshopTool) => data.hues.find(item => item.id === tool.primaryHue)!
  const links = second ? recordedLinks([first, second]) : []
  const relationship = second ? linkBetween(links, first.id, second.id) : undefined
  const sameCapability = Boolean(second && capabilityOf(edition, first.id)?.id === capabilityOf(edition, second.id)?.id)
  const seat = !second ? 'base' : sameCapability ? 'clash' : seatFor(second, [first], links).seat
  const text = sameCapability ? sameCapabilityText : seatText[seat]
  const bricks: SceneBrick[] = [
    { id: first.id, box: { x: 1, y: 2, z: 0, w: 4, d: 2, h: BRICK_HEIGHT }, hex: hue(first).hex, label: first.name, tag: hue(first).name, state: 'seated' },
    ...(second ? [{ id: second.id, box: { x: 3, y: 2, z: BRICK_HEIGHT, w: 4, d: 2, h: BRICK_HEIGHT }, hex: hue(second).hex, label: second.name, tag: hue(second).name, state: seat === 'clash' ? 'clash' as const : seat === 'loose' ? 'loose' as const : 'seated' as const, isNew: true, badge: seat }] : []),
  ]
  return <div className="pr-bench" aria-live="polite">
    <div className="pr-bench-scene"><BrickScene bricks={bricks} plate={{ w: 8, d: 6 }} unit={16} maxTier={2} showArrow={false} frame="tight" showBadges="all" label={second ? `${first.name} with ${second.name}: ${text[0]}` : `${first.name} on the bench`} /></div>
    <div className="pr-bench-copy">
      <span className="bw-label">FIT BENCH</span>
      {second ? <><h3 className={`is-${seat}`}>{text[0]}</h3><p><strong>{first.name}</strong> + <strong>{second.name}</strong>. {relationship?.note ?? text[1]}</p><p className="pr-bench-hint">This verdict comes from the curated relationship notes in this reference; it is not an integration test.</p></> : <><h3>{first.name}</h3><p>{first.description}</p><p className="pr-bench-hint">Pick a second part to test the fit. Products with a recorded pairing or tension are marked.</p></>}
      <button type="button" onClick={onClear}><X size={13} />Clear bench</button>
    </div>
  </div>
}

function Inventory({ edition, query }: { edition: EditionId, query: string }) {
  const { data, title, href } = editionInfo[edition]
  const [picked, setPicked] = useState<string[]>([])
  const [relatedOnly, setRelatedOnly] = useState(false)
  const find = (id: string) => data.tools.find(tool => tool.id === id)
  const first = picked[0] ? find(picked[0]) : undefined
  const second = picked[1] ? find(picked[1]) : undefined
  const links = recordedLinks(data.tools)
  function pick(id: string) {
    setPicked(current => current.includes(id) ? current.filter(item => item !== id) : current.length >= 2 ? [current[0], id] : [...current, id])
  }
  const tiers = editionTiers[edition]
  const firstCapability = first ? capabilityOf(edition, first.id)?.id : undefined
  const roleRows = tiers.flatMap(tier => tier.hues.map(id => data.hues.find(hue => hue.id === id)!)).filter(Boolean).map(hue => {
    const caps = capabilityList(edition).filter(cap => cap.hue === hue.id).map(cap => ({
      ...cap,
      products: cap.products.map(id => find(id)).filter((tool): tool is WorkshopTool => Boolean(tool)).filter(tool => {
        const matchesQuery = !query || `${tool.name} ${tool.category} ${tool.description} ${cap.name} ${cap.summary} ${hue.name}`.toLowerCase().includes(query)
        const selected = picked.includes(tool.id)
        const related = !first || selected || cap.id === firstCapability || Boolean(linkBetween(links, first.id, tool.id))
        return matchesQuery && (!relatedOnly || related)
      }),
    })).filter(cap => cap.products.length)
    return { hue, caps }
  }).filter(row => row.caps.length)

  return <section className="pr-edition" id={`parts-${edition}`}>
    <div className="pr-heading"><div><h2>{title}</h2><span>{data.hues.length} roles · {capabilityList(edition).length} capabilities · {data.tools.length} products</span></div><div className="pr-heading-actions">{first && <button type="button" className={relatedOnly ? 'active' : ''} aria-pressed={relatedOnly} onClick={() => setRelatedOnly(value => !value)}>Related to {first.name}</button>}<a href={href}>Open assembly <ArrowRight size={16} /></a></div></div>
    {first && <FitBench edition={edition} data={data} first={first} second={second} onClear={() => setPicked([])} />}
    {!roleRows.length ? <div className="pr-no-results"><strong>No matching parts in {title}.</strong><span>Try a product, capability, or role name.</span></div> : <div className="pr-roles">{roleRows.map(({ hue, caps }) => <div className="pr-role" key={hue.id}>
        <div className="pr-role-copy"><h3><i style={{ background: hue.hex }} />{hue.name}<small>T{tierOf(edition, hue.id) + 1}</small></h3><p>{hue.description}</p></div>
        {caps.length ? caps.map(cap => <div className="pr-cap" key={cap.id}>
          <div className="pr-cap-head"><BrickIcon hex={hue.hex} unit={8} /><div><strong>{cap.name}</strong><p>{cap.summary}</p></div></div>
          <div className="pr-products">{cap.products.map(tool => {
            const selected = picked.includes(tool.id)
            const relation = first && !selected ? linkBetween(links, first.id, tool.id)?.kind : undefined
            return <button type="button" key={tool.id} className={`pr-part${selected ? ' is-selected' : ''}${relation ? ` is-${relation}` : ''}${first && !selected && !relation ? ' is-dim' : ''}`} onClick={() => pick(tool.id)} aria-pressed={selected} title={tool.description}>
              <strong>{tool.name}</strong><small>{tool.category}</small>
              {relation && <span className="pr-part-mark">{relation === 'tension' ? 'Tension' : 'Pairs'}</span>}
            </button>
          })}</div>
        </div>) : <span className="pr-empty">No capability in this edition</span>}
      </div>)}</div>}
  </section>
}

export default function PartsReference() {
  const [search, setSearch] = useState('')
  const query = search.trim().toLowerCase()
  return <div className="bw-app">
    <SiteHeader active="reference" />
    <main className="bw-main pr-main"><div className="bw-title"><div><h1>Parts inventory</h1><p>Find a capability or product, then place two products on the fit bench to inspect their recorded relationship.</p></div><a href="#/original">Original chromatic view <ArrowRight size={15} /></a></div>
      <div className="pr-toolbar"><label className="pr-search"><Search size={17} /><span className="bw-visually-hidden">Search every system</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search products, capabilities, or roles" /></label><nav aria-label="Jump to system">{editionIds.map(id => <button type="button" key={id} onClick={() => document.getElementById(`parts-${id}`)?.scrollIntoView({ behavior: 'smooth' })}>{editionInfo[id].title}</button>)}</nav></div>
      {editionIds.map(id => <Inventory key={id} edition={id} query={query} />)}
    </main>
    <SiteFooter />
  </div>
}
