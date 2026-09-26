import type { WorkshopData, WorkshopTool } from '../workshopData'
import { BrickIcon, BrickScene } from './Brick'
import { editionTiers, readBuild, verdictCopy, type BuildLink, type EditionId } from './buildModel'
import { sceneBricks, withSupport } from './scene'
import './bricks.css'

export interface ManualBoardProps {
  edition: EditionId
  data: WorkshopData
  tools: WorkshopTool[]
  step: number
  links: BuildLink[]
  ghostHues?: string[]
  caution?: boolean
}

export default function ManualBoard({ edition, data, tools, step, links, ghostHues, caution }: ManualBoardProps) {
  const visible = tools.slice(0, step)
  const current = visible.at(-1)
  const finished = step === tools.length
  const reading = readBuild(edition, tools, links, { caution, gaps: ghostHues })
  const bricks = withSupport(sceneBricks({ edition, data, tools: visible, layoutTools: tools, links, ghostHues: reading.gaps, newIds: current && !finished ? [current.id] : [] })
    .filter(brick => finished || brick.state !== 'ghost'))
  const hue = current && data.hues.find(item => item.id === current.primaryHue)
  const verdict = verdictCopy[reading.verdict]

  return <div className="mb-page">
    <div className="mb-page-top">
      <span className="mb-step-number" aria-label={`Step ${step}`}>{step}</span>
      {current && hue && !finished && <div className="mb-callout" aria-label={`Parts for this step: 1 ${current.name}`}>
        <BrickIcon hex={hue.hex} unit={9} />
        <span><b>1x</b><strong>{current.name}</strong><small>{hue.name}</small></span>
      </div>}
      {finished && tools.length > 0 && <div className={`mb-stamp is-${reading.verdict}`}><small>FINISHED MODEL</small><strong>{verdict.label}</strong></div>}
    </div>
    <BrickScene
      bricks={bricks}
      plate={{ w: 12, d: 6 }}
      label={`Step ${step} of ${tools.length}. ${visible.map(tool => tool.name).join(', ')}. ${finished ? verdict.label : ''}`}
      showArrow={!finished}
      frame="tall"
      showBadges={finished ? 'all' : 'new'}
      maxTier={editionTiers[edition].length}
    />
    <div className="mb-tiers" aria-label="Tiers, bottom to top">{editionTiers[edition].map((tier, index) => <span key={tier.name}><b>T{index + 1}</b>{tier.name}</span>)}</div>
    <div className="mb-page-foot"><span>Height shows tier, not call order. Studs lock only where a pairing is recorded.</span><span>{step}/{tools.length}</span></div>
  </div>
}

export function SeatNote({ edition, data, tools, step, links, ghostHues, caution }: ManualBoardProps) {
  const reading = readBuild(edition, tools, links, { caution, gaps: ghostHues })
  const hueName = (id: string) => data.hues.find(hue => hue.id === id)?.name ?? id
  if (!tools.length) return null
  if (step === tools.length && tools.length > 1) {
    const loose = reading.seats.filter(item => item.seat === 'loose').map(item => item.tool.name)
    const clashes = reading.seats.filter(item => item.seat === 'clash')
    return <div className="mb-seat is-finished"><div><strong>{verdictCopy[reading.verdict].label}</strong>{verdictCopy[reading.verdict].line}
      <ul>
        {clashes.map(item => <li key={item.tool.id}>{item.tool.name} is forced against {item.partner?.name}. {item.link?.note}</li>)}
        {loose.length > 0 && <li>No recorded partner: {loose.join(', ')}.</li>}
        {reading.shared.map(([first, second]) => <li key={`${first.id}-${second.id}`}>{first.name} and {second.name} both take the {hueName(first.primaryHue)} job. Name the boundary.</li>)}
        {reading.gaps.length > 0 && <li>Missing parts shown as outlines: {reading.gaps.map(hueName).join(', ')}.</li>}
      </ul></div></div>
  }
  const item = reading.seats[step - 1]
  if (!item) return null
  const copy = {
    base: ['On the baseplate', 'The first part. The rest of the model attaches to it.'],
    snap: [`Snaps onto ${item.partner?.name}`, item.link?.note ?? ''],
    loose: ['Sits loose', 'No pairing with an earlier part is recorded. It may still work; nothing here says it locks.'],
    clash: [`Forced against ${item.partner?.name}`, item.link?.note ?? 'A tension is recorded between these parts.'],
  }[item.seat]
  return <div className={`mb-seat is-${item.seat}`}><div><strong>{copy[0]}</strong>{copy[1]}</div></div>
}
