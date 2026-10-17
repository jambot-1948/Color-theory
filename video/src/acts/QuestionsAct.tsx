import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { editionInfo } from '../../../preview/src/bricks/editions'
import type { EditionId } from '../../../preview/src/bricks/buildModel'
import type { SceneBrick } from '../../../preview/src/bricks/Brick'
import { MorphScene, clamp } from '../lib/motion'
import { Beat, Eyebrow, smallCaps } from '../lib/type'
import { INK, MUTED, PAPER, SUBTLE } from '../theme'
import { hueOf, questions, readSystem, systems } from '../goal'

// Act 2: the questions. Each one asks for roles; each role has a colour and lands as a placeholder
// on the system that owns it. Colour = role is taught here, in context. No products yet.
const Q_START = questions.map((_, index) => 70 + index * 150)
const SUMMARY_AT = Q_START.at(-1)! + 190
export const QUESTIONS_DURATION = SUMMARY_AT + 190

const order: EditionId[] = ['data', 'ai', 'foundations', 'harness']
const cells: Record<EditionId, { left: number, top: number }> = {
  data: { left: 820, top: 70 }, ai: { left: 1360, top: 70 },
  foundations: { left: 820, top: 560 }, harness: { left: 1360, top: 560 },
}
const layouts = Object.fromEntries(order.map(edition => [edition, readSystem(edition, [], systems[edition].tools)])) as Record<EditionId, ReturnType<typeof readSystem>>

// Placeholders asked for up to and including question `upto`.
function ghostsUpTo(edition: EditionId, upto: number): SceneBrick[] {
  const hues = questions.slice(0, upto + 1).flatMap(question => question.asks[edition] ?? [])
  return [...new Set(hues)].map(hue => layouts[edition].ghostFor(hue)).filter((brick): brick is SceneBrick => Boolean(brick))
}

function HueChip({ edition, hue, progress }: { edition: EditionId, hue: string, progress: number }) {
  const info = hueOf(edition, hue)
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '6px 12px 6px 8px', border: '2px solid #cdd6cf', borderRadius: 5, background: '#fff', opacity: progress, transform: `translateY(${(1 - progress) * 10}px)` }}>
    <span style={{ width: 22, height: 22, borderRadius: 3, background: info.hex }} />
    <span style={{ fontSize: 15, fontWeight: 800, color: SUBTLE, letterSpacing: '0.05em' }}>{editionInfo[edition].title.toUpperCase()}</span>
    <span style={{ fontSize: 20, fontWeight: 750, color: INK }}>{info.name}</span>
  </span>
}

export function QuestionsAct() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const intro = interpolate(frame, [0, 20], [0, 1], clamp)
  const outro = interpolate(frame, [QUESTIONS_DURATION - 24, QUESTIONS_DURATION], [1, 0], clamp)
  const current = Q_START.reduce((at, start, index) => (frame >= start ? index : at), -1)
  const summary = interpolate(frame, [SUMMARY_AT, SUMMARY_AT + 20], [0, 1], clamp)

  return <AbsoluteFill style={{ background: PAPER, fontFamily: 'Inter, sans-serif', opacity: outro }}>
    <Eyebrow opacity={intro}>THE QUESTIONS · WHAT THE JOB NEEDS</Eyebrow>

    <div style={{ position: 'absolute', left: 120, top: 170, width: 640 }}>
      <Beat frame={frame} fps={fps} start={10} end={QUESTIONS_DURATION}>
        <p style={{ margin: 0, fontSize: 27, lineHeight: 1.4, color: '#41554a' }}>Each question asks for roles. Each role has a colour. A pale placeholder marks it until a product fills it.</p>
      </Beat>
      <ol style={{ listStyle: 'none', margin: '40px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {questions.map((question, index) => {
          if (frame < Q_START[index]) return null
          const enter = spring({ frame: frame - Q_START[index], fps, config: { damping: 20, stiffness: 120 } })
          const active = index === current && frame < SUMMARY_AT
          const hues = order.flatMap(edition => (question.asks[edition] ?? []).map(hue => ({ edition, hue })))
          return <li key={question.text} style={{ opacity: enter * (active ? 1 : 0.5), transform: `translateY(${(1 - enter) * 20}px)` }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: SUBTLE, minWidth: 30 }}>{String(index + 1).padStart(2, '0')}</span>
              <span style={{ fontSize: active ? 34 : 23, lineHeight: 1.2, fontWeight: active ? 760 : 650, color: INK }}>{question.text}</span>
            </div>
            {active && <div style={{ marginLeft: 46 }}>
              {question.note && <p style={{ margin: '10px 0 0', fontSize: 22, color: MUTED }}>{question.note}</p>}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14 }}>
                {hues.map((item, i) => <HueChip key={`${item.edition}-${item.hue}`} edition={item.edition} hue={item.hue} progress={spring({ frame: frame - Q_START[index] - 18 - i * 6, fps, config: { damping: 18, stiffness: 140 } })} />)}
              </div>
            </div>}
          </li>
        })}
      </ol>
    </div>

    {order.map(edition => {
      const optional = edition === 'harness'
      const keyframes = Q_START.map((at, index) => ({ at, bricks: ghostsUpTo(edition, index) }))
      const asked = ghostsUpTo(edition, questions.length - 1).length
      const shownAsked = ghostsUpTo(edition, Math.max(0, current)).length * (current >= 0 ? 1 : 0)
      return <div key={edition} style={{ position: 'absolute', ...cells[edition], width: 520, height: 470, opacity: intro * (optional ? 0.62 : 1) }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ ...smallCaps, color: INK }}>{editionInfo[edition].title.toUpperCase()}</span>
          <span style={{ fontSize: 17, fontWeight: 700, color: MUTED }}>{optional ? 'Only if it acts' : `${shownAsked} of ${asked} roles asked`}</span>
        </div>
        <div style={{ width: 520, height: 430, border: optional ? '2px dashed #c1cbc4' : 'none', borderRadius: 10, marginTop: 8 }}>
          <MorphScene frame={frame} fps={fps} keyframes={keyframes} plate={{ w: 12, d: 6 }} badges={false} headroom={1.4}
            plateLabel={edition === 'foundations' ? editionInfo.foundations.plateLabel : undefined} />
        </div>
      </div>
    })}

    <div style={{ position: 'absolute', left: 120, top: 830, width: 640, opacity: summary, transform: `translateY(${(1 - summary) * 16}px)` }}>
      <p style={{ margin: 0, fontSize: 38, lineHeight: 1.15, fontWeight: 760, color: INK }}>One job. Three systems, and a fourth if it acts.</p>
      <p style={{ margin: '12px 0 0', fontSize: 24, color: MUTED }}>Roles first. Products second.</p>
    </div>
    <div style={{ position: 'absolute', right: 60, bottom: 26, fontSize: 18, color: MUTED, opacity: intro }}>The questions are a starting checklist, not a rule.</div>
  </AbsoluteFill>
}
