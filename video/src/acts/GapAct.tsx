import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { editionInfo } from '../../../preview/src/bricks/editions'
import { clamp } from '../lib/motion'
import { Beat, Eyebrow, caption } from '../lib/type'
import { INK, MUTED, PAPER } from '../theme'
import { job } from '../goal'

// Act 0: why this exists. Projects start from a problem statement or a tool list, and nothing joins the two.
const B = { two: 20, gap: 170, bridge: 300 }
export const GAP_DURATION = 450
const tools = ['Snowflake', 'Kubernetes', 'OpenAI', 'Airflow', 'Auth0', 'Kafka']
const hues = editionInfo.ai.data.hues

function Card({ title, children, at, left, frame, fps }: { title: string, children: React.ReactNode, at: number, left: number, frame: number, fps: number }) {
  const enter = spring({ frame: frame - at, fps, config: { damping: 20, stiffness: 110 } })
  return <div style={{ position: 'absolute', left, top: 560, width: 660, height: 240, padding: '26px 32px', background: '#fff', border: '2px solid #cdd6cf', borderRadius: 10, opacity: enter, transform: `translateY(${(1 - enter) * 24}px)` }}>
    <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '0.06em', color: MUTED }}>{title}</div>
    <div style={{ marginTop: 18 }}>{children}</div>
  </div>
}

export function GapAct() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const fade = interpolate(frame, [0, 18], [0, 1], clamp)
  const outro = interpolate(frame, [GAP_DURATION - 20, GAP_DURATION], [1, 0], clamp)
  const sockets = interpolate(frame, [B.gap + 20, B.gap + 45], [0, 1], clamp)
  const bridge = interpolate(frame, [B.bridge, B.bridge + 50], [0, 1], clamp)
  const h2 = { margin: 0, fontSize: 56, lineHeight: 1.1, fontWeight: 760, color: INK } as const

  return <AbsoluteFill style={{ background: PAPER, fontFamily: 'Inter, sans-serif', opacity: outro }}>
    <Eyebrow opacity={fade}>WHY THIS EXISTS</Eyebrow>
    <div style={{ position: 'absolute', left: 120, top: 170, width: 1500 }}>
      <Beat frame={frame} fps={fps} start={B.two} end={B.gap - 4}>
        <h2 style={h2}>Most projects kick off with people describing the problem statement, or listing the tools they want to use.</h2>
      </Beat>
      <Beat frame={frame} fps={fps} start={B.gap} end={B.bridge - 4}>
        <h2 style={h2}>No one really has a good way to figure out how the two fit together.</h2>
      </Beat>
      <Beat frame={frame} fps={fps} start={B.bridge} end={GAP_DURATION - 10}>
        <h2 style={h2}>This is why we want to build something like this: to help bridge that gap.</h2>
      </Beat>
    </div>

    <Card title="THE PROBLEM STATEMENT" at={B.two + 30} left={120} frame={frame} fps={fps}>
      <p style={{ margin: 0, fontSize: 34, lineHeight: 1.3, fontWeight: 650, color: INK }}>“{job.line}”</p>
    </Card>
    <Card title="THE LIST OF TOOLS" at={B.two + 60} left={1140} frame={frame} fps={fps}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {tools.map(name => <span key={name} style={{ fontSize: 26, fontWeight: 700, padding: '8px 16px', background: '#e6ebe7', borderRadius: 6, color: '#33443b' }}>{name}</span>)}
      </div>
    </Card>

    <svg style={{ position: 'absolute', inset: 0, width: 1920, height: 1080 }}>
      {[0, 1].map(i => <g key={i} opacity={sockets * (1 - bridge)}>
        {[-11, 11].map(dx => <circle key={dx} cx={960 + dx} cy={650 + i * 50} r="8" fill="#fff" stroke="#a2742f" strokeWidth="2.5" strokeDasharray="4 3" />)}
      </g>)}
    </svg>
    <div style={{ position: 'absolute', left: 790, top: 650, width: 340, display: 'flex', opacity: bridge }}>
      {hues.map((hue, i) => <span key={hue.id} style={{ flex: 1, height: 44, background: hue.hex, borderRadius: i === 0 ? '6px 0 0 6px' : i === hues.length - 1 ? '0 6px 6px 0' : 0, transform: `scaleY(${interpolate(bridge, [i / 10, i / 10 + 0.4], [0, 1], clamp)})` }} />)}
    </div>
    <div style={{ ...caption, position: 'absolute', left: 790, top: 740, width: 340, textAlign: 'center', opacity: sockets * (1 - bridge) }}>Nothing joins them.</div>
  </AbsoluteFill>
}
