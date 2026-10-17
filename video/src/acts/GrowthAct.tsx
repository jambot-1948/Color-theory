import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { editionInfo } from '../../../preview/src/bricks/editions'
import { growthTracks, stageTools, type GrowthStage } from '../../../preview/src/bricks/growthTracks'
import { blueprintMatch, isCaution, slotLinks, slotTools, slotsFromTools } from '../../../preview/src/bricks/capabilityModel'
import { readBuild, verdictCopy } from '../../../preview/src/bricks/buildModel'
import { sceneBricks } from '../../../preview/src/bricks/scene'
import { SEAT_COLORS } from '../../../preview/src/bricks/iso'
import { MorphScene, clamp, type Keyframe } from '../lib/motion'
import { Beat, Chip, Eyebrow, body, headline, smallCaps } from '../lib/type'
import { INK, MUTED, PAPER } from '../theme'

// Act 4: Foundations grows over a year, then rewinds to show the wrong turn.
// Stages, parts, gaps, and verdicts all come from the site's authored growth track; the logic mirrors GrowthPage.
const edition = 'foundations'
const track = growthTracks[edition]
const { data, plateLabel } = editionInfo[edition]

function stageModel(stage: GrowthStage) {
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
  return { reading, bricks }
}

const byId = (id: string) => track.stages.find(stage => stage.id === id)!
const STEP = 180
type Shot = { stage: GrowthStage, at: number, rewind?: boolean }
const shots: Shot[] = [
  { stage: byId('prototype'), at: 30 },
  { stage: byId('pilot'), at: 30 + STEP },
  { stage: byId('production'), at: 30 + STEP * 2 },
  { stage: byId('scale'), at: 30 + STEP * 3 },
  { stage: byId('prototype'), at: 30 + STEP * 4, rewind: true },
  { stage: byId('platform-first'), at: 30 + STEP * 4 + 90 },
]
export const GROWTH_DURATION = shots.at(-1)!.at + 260

const models = shots.map(shot => stageModel(shot.stage))
const keyframes: Keyframe[] = shots.map((shot, index) => ({ at: shot.at, bricks: models[index].bricks }))

const tone: Record<string, string> = { clean: SEAT_COLORS.snap, loose: SEAT_COLORS.loose, gaps: '#56655d', forced: SEAT_COLORS.clash, caution: '#b0562f' }
const horizons = ['Week 1', 'Month 1', 'Quarter 1', 'Year 1']

function Timeline({ frame, index }: { frame: number, index: number }) {
  const shot = shots[index]
  const onBranch = shot.stage.branch || shot.rewind
  const activeMain = shot.stage.branch ? -1 : horizons.indexOf(shot.stage.horizon)
  const branchIn = interpolate(frame, [shots[4].at, shots[4].at + 20], [0, 1], clamp)
  return <div style={{ position: 'absolute', left: 120, bottom: 70, width: 740 }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {horizons.map((h, i) => <div key={h} style={{ display: 'flex', alignItems: 'center', flex: i < horizons.length - 1 ? 1 : 'none' }}>
        <span style={{ fontSize: 17, fontWeight: 800, padding: '8px 12px', borderRadius: 4, border: `1.5px solid ${i === activeMain ? '#91a99a' : 'transparent'}`, background: i === activeMain ? '#e1eae2' : 'transparent', color: i === activeMain ? '#173c2b' : i < activeMain || (onBranch && i === 0) ? '#56665a' : '#9aa7a0', whiteSpace: 'nowrap' }}>{h}</span>
        {i < horizons.length - 1 && <span style={{ flex: 1, height: 2, background: '#c7d3c8', margin: '0 8px' }} />}
      </div>)}
    </div>
    <div style={{ opacity: branchIn, display: 'flex', alignItems: 'center', marginLeft: 36, marginTop: 4 }}>
      <span style={{ width: 2, height: 28, background: '#d9a58d', marginRight: 12 }} />
      <span style={{ width: 70, height: 2, background: '#d9a58d', marginRight: 10 }} />
      <span style={{ fontSize: 17, fontWeight: 800, padding: '8px 12px', borderRadius: 4, border: `1.5px solid ${shot.stage.branch ? '#b0562f' : 'transparent'}`, background: shot.stage.branch ? '#fbefe9' : 'transparent', color: '#b0562f', whiteSpace: 'nowrap' }}>Month 1 · wrong turn</span>
    </div>
  </div>
}

export function GrowthAct() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const index = shots.reduce((current, shot, i) => (frame >= shot.at ? i : current), 0)
  const intro = interpolate(frame, [0, 20], [0, 1], clamp)
  const outro = interpolate(frame, [GROWTH_DURATION - 20, GROWTH_DURATION], [1, 0], clamp)

  return <AbsoluteFill style={{ background: PAPER, fontFamily: 'Inter, sans-serif', opacity: outro }}>
    <Eyebrow opacity={intro}>GROWTH · FOUNDATIONS</Eyebrow>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 700 }}>
      {shots.map((shot, i) => {
        const end = shots[i + 1]?.at ?? GROWTH_DURATION
        const { reading } = models[i]
        const chipAt = shot.at + 40
        if (shot.rewind) return <Beat key={i} frame={frame} fps={fps} start={shot.at} end={end}>
          <div style={smallCaps}>REWIND TO WEEK 1</div>
          <h2 style={{ ...headline, marginTop: 20 }}>Same start. A different next move.</h2>
        </Beat>
        return <Beat key={i} frame={frame} fps={fps} start={shot.at} end={end}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: 40 }}>
            <span style={{ ...smallCaps, color: shot.stage.caution ? '#b0562f' : smallCaps.color }}>{shot.stage.horizon.toUpperCase()}</span>
            {frame >= chipAt && <Chip label={verdictCopy[reading.verdict].label} color={tone[reading.verdict] ?? MUTED} progress={spring({ frame: frame - chipAt, fps, config: { damping: 14, stiffness: 160 } })} />}
          </div>
          <h2 style={{ ...headline, marginTop: 20, color: shot.stage.caution ? '#9b3f22' : INK }}>{shot.stage.name}</h2>
          <p style={body}>{shot.stage.summary}</p>
          <p style={{ ...body, fontSize: 23, color: MUTED, marginTop: 22, maxWidth: 600 }}><b style={{ color: INK }}>Watch for: </b>{shot.stage.watch}</p>
        </Beat>
      })}
    </div>
    <Timeline frame={frame} index={index} />
    <div style={{ position: 'absolute', right: 10, top: 30, width: 1170, height: 960, opacity: intro }}>
      <MorphScene frame={frame} fps={fps} keyframes={keyframes} plate={{ w: 12, d: 6 }} plateLabel={plateLabel} />
    </div>
  </AbsoluteFill>
}
