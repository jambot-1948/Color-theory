import { useState } from 'react'
import { ArrowRight, X } from 'lucide-react'
import SiteHeader from './SiteHeader'
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
      {second ? <><h3 className={`is-${seat}`}>{text[0]}</h3><p><strong>{first.name}</strong> + <strong>{second.name}</strong>. {text[1]}</p></> : <><h3>{first.name}</h3><p>{first.description}</p><p className="pr-bench-hint">Pick a second part to test the fit. Products with a recorded pairing or tension are marked.</p></>}
      <button type="button" onClick={onClear}><X size={13} />Clear bench</button>
    </div>
  </div>
}

function Inventory({ edition }: { edition: EditionId }) {
  const { data, title, href } = editionInfo[edition]
  const [picked, setPicked] = useState<string[]>([])
  const find = (id: string) => data.tools.find(tool => tool.id === id)
  const first = picked[0] ? find(picked[0]) : undefined
  const second = picked[1] ? find(picked[1]) : undefined
  const links = recordedLinks(data.tools)
  function pick(id: string) {
    setPicked(current => current.includes(id) ? current.filter(item => item !== id) : current.length >= 2 ? [current[0], id] : [...current, id])
  }
  const tiers = editionTiers[edition]

  return <section className="pr-edition">
    <div className="pr-heading"><div><h2>{title}</h2><span>{data.hues.length} roles · {capabilityList(edition).length} capabilities · {data.tools.length} products</span></div><a href={href}>Open assembly <ArrowRight size={16} /></a></div>
    {first && <FitBench edition={edition} data={data} first={first} second={second} onClear={() => setPicked([])} />}
    <div className="pr-roles">{tiers.flatMap(tier => tier.hues.map(id => data.hues.find(hue => hue.id === id)!)).filter(Boolean).map(hue => {
      const caps = capabilityList(edition).filter(cap => cap.hue === hue.id)
      return <div className="pr-role" key={hue.id}>
        <div className="pr-role-copy"><h3><i style={{ background: hue.hex }} />{hue.name}<small>T{tierOf(edition, hue.id) + 1}</small></h3><p>{hue.description}</p></div>
        {caps.length ? caps.map(cap => <div className="pr-cap" key={cap.id}>
          <div className="pr-cap-head"><BrickIcon hex={hue.hex} unit={8} /><div><strong>{cap.name}</strong><p>{cap.summary}</p></div></div>
          <div className="pr-products">{cap.products.map(id => find(id)).filter((tool): tool is WorkshopTool => Boolean(tool)).map(tool => {
            const selected = picked.includes(tool.id)
            const relation = first && !selected ? linkBetween(links, first.id, tool.id)?.kind : undefined
            return <button type="button" key={tool.id} className={`pr-part${selected ? ' is-selected' : ''}${relation ? ` is-${relation}` : ''}${first && !selected && !relation ? ' is-dim' : ''}`} onClick={() => pick(tool.id)} aria-pressed={selected} title={tool.description}>
              <strong>{tool.name}</strong><small>{tool.category}</small>
              {relation && <span className="pr-part-mark">{relation === 'tension' ? 'Tension' : 'Pairs'}</span>}
            </button>
          })}</div>
        </div>) : <span className="pr-empty">No capability in this edition</span>}
      </div>
    })}</div>
  </section>
}

export default function PartsReference() {
  return <div className="bw-app">
    <SiteHeader active="reference" />
    <main className="bw-main pr-main"><div className="bw-title"><div><h1>Parts inventory</h1><p>Each role breaks into capabilities, and each capability can be filled by more than one product. Pick a product to see what it pairs with; pick two to test the fit.</p></div><a href="#/original">Original view <ArrowRight size={15} /></a></div>
      {editionIds.map(id => <Inventory key={id} edition={id} />)}
    </main>
  </div>
}
