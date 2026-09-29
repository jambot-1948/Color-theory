import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { verdictCopy } from '../../../preview/src/bricks/buildModel'
import { BrickIcon } from '../../../preview/src/bricks/Brick'
import { SEAT_COLORS } from '../../../preview/src/bricks/iso'
import { MorphScene, clamp } from '../lib/motion'
import { Eyebrow } from '../lib/type'
import { INK, MUTED, PAPER, SUBTLE } from '../theme'
import { hueOf, readSystem, systems } from '../goal'

// Act 3: one system up close. The data system is built toward the job's placeholders.
// Every verdict is read by the site's rules; the job's unfilled roles count as missing parts.
const all = systems.data.tools
const at = (count: number) => readSystem('data', all.slice(0, count), all)
const steps = [
  { start: 30, count: 0, action: 'Start from the placeholders', copy: 'The job asked the data system for seven roles. Nothing is filled yet.' },
  { start: 180, count: 3, action: 'Fill three roles', copy: 'Each brick is a capability. The printed label is the product. Fivetran, dbt and Snowflake snap: their pairings are recorded.' },
  { start: 390, count: 5, action: 'Fill two more', copy: `Every part seats. The set is still a named anti-pattern: ${at(5).match?.recipe.name ?? ''}.` },
  { start: 600, count: 5, action: 'Ask the job again', copy: 'Who may see whose work? Can we trust the numbers? Nothing in this build answers either.' },
  { start: 790, count: 7, action: 'Fill what the job asked for', copy: 'Checks and ownership seat. Now the build answers the job, not just the parts.' },
].map(step => ({ ...step, read: at(step.count) }))
const STAMP_AT = steps[4].start + 60
export const DATA_BUILD_DURATION = 1080

const toneColor: Record<string, string> = { clean: SEAT_COLORS.snap, loose: SEAT_COLORS.loose, forced: SEAT_COLORS.clash, gaps: '#56655d', caution: '#b0562f', empty: MUTED }
const stepAt = (frame: number) => steps.reduce((current, step, index) => (frame >= step.start ? index : current), 0)

function StepCopy({ frame, fps }: { frame: number, fps: number }) {
  const index = stepAt(frame)
  const step = steps[index]
  const next = steps[index + 1]?.start ?? DATA_BUILD_DURATION + 100
  const enter = spring({ frame: frame - step.start, fps, config: { damping: 20, stiffness: 120 } })
  const exit = interpolate(frame, [next - 10, next], [1, 0], clamp)
  const verdict = step.read.reading.verdict
  const chipIn = spring({ frame: frame - step.start - 40, fps, config: { damping: 14, stiffness: 160 } })
  const color = toneColor[verdict] ?? MUTED
  return <div style={{ opacity: Math.min(enter, exit), transform: `translateY(${(1 - enter) * 28}px)` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: 40 }}>
      <span style={{ fontSize: 18, fontWeight: 800, color: SUBTLE, letterSpacing: '0.06em' }}>STEP {String(index + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}</span>
      {index > 0 && index < 4 && frame >= step.start + 40 && <span style={{ fontSize: 17, fontWeight: 800, padding: '6px 13px', border: `2.5px solid ${color}`, borderRadius: 5, background: '#fff', color, opacity: chipIn, transform: `scale(${0.85 + 0.15 * chipIn})`, transformOrigin: 'left center' }}>{verdictCopy[verdict].label}</span>}
    </div>
    <h2 style={{ margin: '22px 0 20px', fontSize: 60, lineHeight: 1.05, fontWeight: 760, color: INK, letterSpacing: '-0.01em' }}>{step.action}</h2>
    <p style={{ margin: 0, fontSize: 29, lineHeight: 1.45, color: '#41554a', maxWidth: 620 }}>{step.copy}</p>
  </div>
}

// The roles the job asked for that this build still leaves empty.
function StillMissing({ frame, fps }: { frame: number, fps: number }) {
  const step = steps[stepAt(frame)]
  const gaps = step.read.reading.gaps
  if (!gaps.length || stepAt(frame) === 0) return null
  const enter = spring({ frame: frame - step.start - 30, fps, config: { damping: 18, stiffness: 120 } })
  const loud = stepAt(frame) === 3
  return <div style={{ opacity: enter, display: 'flex', flexDirection: 'column', gap: 12, padding: '16px 22px 18px', border: `2.5px dashed ${loud ? '#b0562f' : '#b5c0b9'}`, borderRadius: 10, background: '#fafbfa' }}>
    <small style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.06em', color: loud ? '#b0562f' : '#617068' }}>THE JOB STILL NEEDS</small>
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', maxWidth: 640 }}>
      {gaps.map(id => {
        const hue = hueOf('data', id)
        return <span key={id} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 22, fontWeight: 700, color: '#33443b' }}>
          <span style={{ width: 54 }}><BrickIcon hex={hue.hex} unit={6} ghost /></span>{hue.name}
        </span>
      })}
    </div>
  </div>
}

function Stamp({ frame, fps }: { frame: number, fps: number }) {
  if (frame < STAMP_AT) return null
  const verdict = steps[4].read.reading.verdict
  const slam = spring({ frame: frame - STAMP_AT, fps, config: { damping: 11, stiffness: 220, mass: 0.9 } })
  const color = toneColor[verdict]
  return <div style={{ transform: `scale(${1.6 - 0.6 * slam}) rotate(-4deg)`, opacity: Math.min(1, slam * 1.4), display: 'inline-flex', flexDirection: 'column', gap: 4, padding: '14px 22px', border: `4px solid ${color}`, borderRadius: 6, color, background: '#fff', boxShadow: '0 10px 30px #1d242014' }}>
    <small style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.08em', opacity: 0.8 }}>FINISHED MODEL</small>
    <strong style={{ fontSize: 34, fontWeight: 800 }}>{verdictCopy[verdict].label}</strong>
  </div>
}

export function DataBuildAct() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const intro = interpolate(frame, [0, 24], [0, 1], clamp)
  const outro = interpolate(frame, [DATA_BUILD_DURATION - 20, DATA_BUILD_DURATION], [1, 0], clamp)
  const caveat = interpolate(frame, [steps[1].start, steps[1].start + 20], [0, 1], clamp)
  return <AbsoluteFill style={{ background: PAPER, fontFamily: 'Inter, sans-serif', opacity: outro }}>
    <Eyebrow opacity={intro}>ONE SYSTEM UP CLOSE · {systems.data.name.toUpperCase()}</Eyebrow>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 680 }}><StepCopy frame={frame} fps={fps} /></div>
    <div style={{ position: 'absolute', left: 120, top: 660 }}><StillMissing frame={frame} fps={fps} /></div>
    <div style={{ position: 'absolute', right: 20, top: 40, width: 1160, height: 910, opacity: intro }}>
      <MorphScene frame={frame} fps={fps} plate={{ w: 12, d: 6 }} keyframes={steps.map(step => ({ at: step.start, bricks: step.read.bricks }))} />
    </div>
    <div style={{ position: 'absolute', right: 150, top: 150 }}><Stamp frame={frame} fps={fps} /></div>
    <div style={{ position: 'absolute', left: 120, right: 120, bottom: 44, fontSize: 19, color: MUTED, opacity: caveat, textAlign: 'right' }}>
      Height shows tier, a reading aid. Studs lock only where a pairing is recorded; stacking is not data flow.
    </div>
  </AbsoluteFill>
}
