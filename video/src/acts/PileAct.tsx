import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import type { SceneBrick } from '../../../preview/src/bricks/Brick'
import { BRICK_HEIGHT } from '../../../preview/src/bricks/iso'
import { MorphScene, clamp } from '../lib/motion'
import { Beat, Eyebrow, body, headline } from '../lib/type'
import { INK, PAPER } from '../theme'

// Act 1: the pile. Products with no role, no capability, and no joins: how most stacks get drawn.
const GRAY = '#aeb8b1'
const names = ['Kubernetes', 'PostgreSQL', 'OpenAI', 'Kafka', 'Terraform', 'Pinecone', 'Next.js', 'Airflow', 'LangChain', 'Redis', 'Snowflake', 'Auth0']
// Hand-placed so it reads as a heap: a full bottom layer, then a few bricks dropped on top, off the grid.
const spots: [number, number, number][] = [
  [0, 0, 0], [4, 0, 0], [8, 0, 0], [0, 2, 0], [4, 2, 0], [8, 2, 0], [0, 4, 0], [4, 4, 0], [8, 4, 0],
  [2, 1, 1], [6, 3, 1], [3, 2, 2],
]
const pile: SceneBrick[] = names.map((name, index) => {
  const [x, y, level] = spots[index]
  return { id: `pile-${name}`, box: { x, y, z: level * BRICK_HEIGHT, w: 4, d: 2, h: BRICK_HEIGHT }, hex: GRAY, label: '', sticker: name, state: 'seated' }
})

const CLEAR_AT = 300
export const PILE_DURATION = 360

export function PileAct() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const fade = interpolate(frame, [0, 18], [0, 1], clamp)
  return <AbsoluteFill style={{ background: PAPER, fontFamily: 'Inter, sans-serif' }}>
    <Eyebrow opacity={fade}>CHROMATIC ARCHITECTURE</Eyebrow>
    <div style={{ position: 'absolute', left: 120, top: 330, width: 680 }}>
      <Beat frame={frame} fps={fps} start={24} end={CLEAR_AT + 30}>
        <h1 style={headline}>Most architecture diagrams are a pile of tools.</h1>
      </Beat>
      <Beat frame={frame} fps={fps} start={150} end={CLEAR_AT + 30}>
        <p style={{ ...body, fontSize: 34, color: INK, fontWeight: 650 }}>How things combine matters more than what they are.</p>
      </Beat>
    </div>
    <div style={{ position: 'absolute', right: 20, top: 40, width: 1200, height: 910, opacity: fade }}>
      <MorphScene frame={frame} fps={fps} plate={{ w: 12, d: 6 }} badges={false}
        keyframes={[{ at: 20, bricks: pile }, { at: CLEAR_AT, bricks: [] }]} />
    </div>
  </AbsoluteFill>
}
