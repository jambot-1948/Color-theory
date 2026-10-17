import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import type { SceneBrick } from '../../../preview/src/bricks/Brick'
import { BRICK_HEIGHT } from '../../../preview/src/bricks/iso'
import { MorphScene, clamp } from '../lib/motion'
import { Beat, Eyebrow, body, headline } from '../lib/type'
import { INK, PAPER } from '../theme'
import { job } from '../goal'

// Act 1: the job. Start from what the tool is for; the usual pile of tools flashes by as the answer we are not giving.
const GRAY = '#aeb8b1'
const names = ['Kubernetes', 'PostgreSQL', 'OpenAI', 'Kafka', 'Terraform', 'Pinecone', 'Next.js', 'Airflow', 'LangChain', 'Redis', 'Snowflake', 'Auth0']
const spots: [number, number, number][] = [
  [0, 0, 0], [4, 0, 0], [8, 0, 0], [0, 2, 0], [4, 2, 0], [8, 2, 0], [0, 4, 0], [4, 4, 0], [8, 4, 0],
  [2, 1, 1], [6, 3, 1], [3, 2, 2],
]
const pile: SceneBrick[] = names.map((name, index) => {
  const [x, y, level] = spots[index]
  return { id: `pile-${name}`, box: { x, y, z: level * BRICK_HEIGHT, w: 4, d: 2, h: BRICK_HEIGHT }, hex: GRAY, label: '', sticker: name, state: 'seated' }
})

const B = { job: 20, pile: 150, instead: 300, clear: 330 }
export const JOB_DURATION = 450

export function JobAct() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const fade = interpolate(frame, [0, 18], [0, 1], clamp)
  return <AbsoluteFill style={{ background: PAPER, fontFamily: 'Inter, sans-serif' }}>
    <Eyebrow opacity={fade}>CHROMATIC ARCHITECTURE · START FROM THE JOB</Eyebrow>
    <div style={{ position: 'absolute', left: 120, top: 300, width: 700 }}>
      <Beat frame={frame} fps={fps} start={B.job} end={B.clear + 90}>
        <h1 style={headline}>{job.line}</h1>
        <p style={body}>{job.detail}</p>
      </Beat>
      <Beat frame={frame} fps={fps} start={B.pile + 20} end={B.instead - 4} style={{ marginTop: 40 }}>
        <p style={{ ...body, fontSize: 32, color: INK, fontWeight: 650 }}>The usual answer is a pile of tools.</p>
      </Beat>
      <Beat frame={frame} fps={fps} start={B.instead} end={B.clear + 90} style={{ marginTop: 40 }}>
        <p style={{ ...body, fontSize: 32, color: INK, fontWeight: 650 }}>Ask what the job needs first. Then pick the parts.</p>
      </Beat>
    </div>
    <div style={{ position: 'absolute', right: 20, top: 40, width: 1100, height: 900, opacity: fade }}>
      <MorphScene frame={frame} fps={fps} plate={{ w: 12, d: 6 }} badges={false}
        keyframes={[{ at: B.pile, bricks: pile }, { at: B.clear, bricks: [] }]} />
    </div>
  </AbsoluteFill>
}
