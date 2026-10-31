import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { editionInfo } from '../../../preview/src/bricks/editions'
import { verdictCopy, type EditionId } from '../../../preview/src/bricks/buildModel'
import { SEAT_COLORS } from '../../../preview/src/bricks/iso'
import { MorphScene, clamp } from '../lib/motion'
import { Beat, Eyebrow, caption, smallCaps } from '../lib/type'
import { INK, MUTED, PAPER } from '../theme'
import { criteria, readSystem, systems } from '../goal'

// Act 4: the set. The job needs several systems, each its own model on its own plate, on one foundation.
// The joins between systems are not recorded anywhere, so they are drawn as open sockets: nothing connects, nothing flows.
const T = { foundations: 20, data: 100, ai: 150, harness: 220, seams: 440, criteria: 660, card: 900 }
export const SET_DURATION = 1140

const toneColor: Record<string, string> = { clean: SEAT_COLORS.snap, loose: SEAT_COLORS.loose, forced: SEAT_COLORS.clash, gaps: '#56655d', caution: '#b0562f', empty: MUTED }
type Panel = { edition: EditionId, at: number, left: number, top: number, width: number, height: number, optional?: boolean }
const panels: Panel[] = [
  { edition: 'data', at: T.data, left: 50, top: 300, width: 600, height: 360 },
  { edition: 'ai', at: T.ai, left: 660, top: 300, width: 600, height: 360 },
  { edition: 'harness', at: T.harness, left: 1270, top: 300, width: 600, height: 360, optional: true },
  { edition: 'foundations', at: T.foundations, left: 480, top: 660, width: 960, height: 400 },
]
const reads = Object.fromEntries(panels.map(panel => [panel.edition, readSystem(panel.edition, systems[panel.edition].tools)])) as Record<EditionId, ReturnType<typeof readSystem>>

// Open sockets on the facing edges of the plates. An empty pair of studs marks where a link could be recorded; no line joins them.
const centre = (panel: Panel) => panel.left + panel.width / 2
const sockets = [
  { at: [650, 560], optional: false },
  { at: [centre(panels[0]), 656], optional: false },
  { at: [centre(panels[1]), 656], optional: false },
  { at: [centre(panels[2]), 656], optional: true },
]

export function SetAct() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const intro = interpolate(frame, [0, 20], [0, 1], clamp)
  const dim = interpolate(frame, [T.card, T.card + 30], [1, 0.12], clamp)
  // The diagram steps back while the criteria are read, and again for the end card.
  const diagram = interpolate(frame, [T.criteria, T.criteria + 30], [1, 0.12], clamp) * (dim < 1 ? 0.55 : 1)
  const card = spring({ frame: frame - T.card - 12, fps, config: { damping: 20, stiffness: 90 } })
  const outro = interpolate(frame, [SET_DURATION - 30, SET_DURATION], [1, 0], clamp)

  return <AbsoluteFill style={{ background: PAPER, fontFamily: 'Inter, sans-serif', opacity: outro }}>
    <Eyebrow opacity={intro * dim}>THE SET · ONE JOB, SEVERAL SYSTEMS</Eyebrow>
    <div style={{ position: 'absolute', left: 120, top: 140, width: 1500, opacity: dim, zIndex: 2 }}>
      <Beat frame={frame} fps={fps} start={10} end={T.seams - 4}>
        <h2 style={{ margin: 0, fontSize: 52, lineHeight: 1.1, fontWeight: 760, color: INK }}>Several systems, each with its own parts.</h2>
        <p style={{ margin: '12px 0 0', fontSize: 27, color: '#41554a' }}>Like a set with a ship and a plane: separate models, one box.</p>
      </Beat>
      <Beat frame={frame} fps={fps} start={T.seams} end={T.criteria - 4}>
        <h2 style={{ margin: 0, fontSize: 52, lineHeight: 1.1, fontWeight: 760, color: INK }}>Nothing records how these systems join.</h2>
        <p style={{ margin: '12px 0 0', fontSize: 27, color: '#41554a' }}>An open socket is unproven, not wrong. The joins are yours to design.</p>
      </Beat>
      <Beat frame={frame} fps={fps} start={T.criteria} end={T.card + 20}>
        <h2 style={{ margin: 0, fontSize: 52, lineHeight: 1.1, fontWeight: 760, color: INK }}>Judge it by what the job cares about.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 430px)', gap: 24, marginTop: 28 }}>
          {criteria.map((item, i) => {
            const enter = spring({ frame: frame - T.criteria - 20 - i * 24, fps, config: { damping: 18, stiffness: 120 } })
            return <div key={item.id} style={{ opacity: enter, transform: `translateY(${(1 - enter) * 16}px)`, padding: '14px 18px', background: '#fff', border: '2px solid #cdd6cf', borderRadius: 8 }}>
              <div style={{ fontSize: 30, fontWeight: 780, color: INK }}>{item.label}</div>
              <div style={{ ...caption, marginTop: 4 }}>{item.why}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#2f7f7b', marginTop: 8 }}>{item.result}</div>
            </div>
          })}
        </div>
        <p style={{ ...caption, margin: '16px 0 0' }}>Criteria are editorial, chosen for this job. Not scores.</p>
      </Beat>
    </div>

    <div style={{ opacity: diagram }}>
      <svg style={{ position: 'absolute', inset: 0, width: 1920, height: 1080, overflow: 'visible' }}>
        {sockets.map((socket, index) => {
          const show = interpolate(frame, [T.seams + 20 + index * 10, T.seams + 40 + index * 10], [0, 1], clamp)
          const [x, y] = socket.at
          return <g key={index} opacity={show * (socket.optional ? 0.5 : 1)}>
            {[-11, 11].map(dx => <circle key={dx} cx={x + dx} cy={y} r="8" fill="#fff" stroke={SEAT_COLORS.loose} strokeWidth="2.5" strokeDasharray="4 3" />)}
          </g>
        })}
      </svg>

      {panels.map(panel => {
        const read = reads[panel.edition]
        const title = spring({ frame: frame - panel.at, fps, config: { damping: 18, stiffness: 120 } })
        const verdict = read.reading.verdict
        const foundation = panel.edition === 'foundations'
        return <div key={panel.edition} style={{ position: 'absolute', left: panel.left, top: panel.top, width: panel.width, height: panel.height, opacity: frame >= panel.at ? (panel.optional ? 0.6 : 1) : 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', rowGap: 6, whiteSpace: 'nowrap', justifyContent: 'center', alignItems: 'baseline', gap: 14, opacity: title, transform: `translateY(${(1 - title) * 12}px)`, ...(foundation ? { position: 'absolute', left: -330, top: 110, flexDirection: 'column', alignItems: 'flex-end', width: 320 } : {}) }}>
            <span style={{ ...smallCaps, color: INK }}>{editionInfo[panel.edition].title.toUpperCase()}</span>
            <span style={{ fontSize: 24, color: MUTED }}>{systems[panel.edition].name}</span>
            {foundation && <span style={{ ...caption, textAlign: 'right' }}>Every system above stands on it.</span>}
            {!panel.optional && <span style={{ fontSize: 22, fontWeight: 800, padding: '3px 10px', border: `2px solid ${toneColor[verdict]}`, borderRadius: 4, color: toneColor[verdict], background: '#fff' }}>{verdictCopy[verdict].label}</span>}
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: foundation ? 0 : 34, bottom: 0, border: panel.optional ? '2px dashed #c1cbc4' : 'none', borderRadius: 10 }}>
            <MorphScene frame={frame} fps={fps} keyframes={[{ at: panel.edition === 'data' ? -200 : panel.at, bricks: read.bricks }]} plate={{ w: 12, d: 6 }} badges={false} headroom={0.8}
              plateLabel={foundation ? editionInfo.foundations.plateLabel : undefined} />
          </div>
        </div>
      })}
    </div>

    <div style={{ position: 'absolute', left: 1500, top: 800, width: 340, opacity: interpolate(frame, [T.seams + 30, T.seams + 50, T.criteria - 20, T.criteria], [0, 1, 1, 0], clamp) }}>
      <p style={{ ...caption, margin: 0 }}>Open sockets: no link between systems is recorded. Height shows tier, a reading aid.</p>
    </div>

    {frame >= T.card && <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', opacity: card }}>
      <div style={{ textAlign: 'center', transform: `translateY(${(1 - card) * 24}px)` }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 34 }}>
          {editionInfo.ai.data.hues.map(hue => <span key={hue.id} style={{ width: 26, height: 12, background: hue.hex, borderRadius: 2 }} />)}
        </div>
        <h1 style={{ margin: 0, fontSize: 96, fontWeight: 780, color: INK, letterSpacing: '-0.02em' }}>Chromatic Architecture</h1>
        <p style={{ margin: '26px 0 0', fontSize: 36, color: '#41554a' }}>Start from the job. See what snaps, what’s forced, and what’s missing.</p>
        <p style={{ margin: '54px 0 0', fontSize: 24, fontWeight: 750, color: MUTED, letterSpacing: '0.04em' }}>thejambot.com</p>
      </div>
    </div>}
  </AbsoluteFill>
}
