import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { editionInfo } from '../../../preview/src/bricks/editions'
import { slotLinks, slotTools, slotsFromTools } from '../../../preview/src/bricks/capabilityModel'
import type { BuildLink, EditionId } from '../../../preview/src/bricks/buildModel'
import { sceneBricks } from '../../../preview/src/bricks/scene'
import { assemblyStories } from '../../../preview/src/assemblyStories'
import { dataStories } from '../../../preview/src/dataStories'
import { harnessStories } from '../../../preview/src/harnessStories'
import { foundationsStories } from '../../../preview/src/foundationsStories'
import { MorphScene, clamp } from '../lib/motion'
import { Beat, Eyebrow, body, headline, smallCaps } from '../lib/type'
import { INK, MUTED, PAPER } from '../theme'

// Act 5: pull back. Foundations is the plinth; three more systems build on it.
function recipeModel(edition: EditionId, recipeId: string, stories: Record<string, { links: BuildLink[] }>) {
  const { data } = editionInfo[edition]
  const recipe = data.recipes.find(item => item.id === recipeId)!
  const slots = slotsFromTools(edition, recipe.tools)
  const tools = slotTools(edition, data, slots)
  const links = slotLinks(edition, data, slots, stories[recipeId]?.links)
  return { name: recipe.name, bricks: sceneBricks({ edition, data, tools, links }) }
}

const foundation = recipeModel('foundations', 'watched-app', foundationsStories)
const upper = [
  { edition: 'ai' as const, ...recipeModel('ai', 'internal-knowledge-agent', assemblyStories) },
  { edition: 'data' as const, ...recipeModel('data', 'modern-data-stack', dataStories) },
  { edition: 'harness' as const, ...recipeModel('harness', 'governed-operator', harnessStories) },
]

const T = { hold: 20, shrink: 170, upper: 210, card: 450 }
export const FOUNDATION_DURATION = 660

export function FoundationAct() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const shrink = interpolate(frame, [T.shrink, T.shrink + 45], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) })
  const dim = interpolate(frame, [T.card, T.card + 30], [1, 0.14], clamp)
  const card = spring({ frame: frame - T.card - 12, fps, config: { damping: 20, stiffness: 90 } })
  const intro = interpolate(frame, [0, 20], [0, 1], clamp)
  const outro = interpolate(frame, [FOUNDATION_DURATION - 30, FOUNDATION_DURATION], [1, 0], clamp)

  // Foundations starts large on the right, then settles along the bottom as the base of the whole picture.
  const box = {
    left: interpolate(shrink, [0, 1], [730, 520]), top: interpolate(shrink, [0, 1], [40, 500]),
    width: interpolate(shrink, [0, 1], [1170, 880]), height: interpolate(shrink, [0, 1], [960, 580]),
  }

  return <AbsoluteFill style={{ background: PAPER, fontFamily: 'Inter, sans-serif', opacity: outro }}>
    <Eyebrow opacity={intro * interpolate(frame, [T.shrink, T.shrink + 20], [1, 0], clamp)}>THE FOUNDATION</Eyebrow>
    <div style={{ position: 'absolute', left: 120, top: 300, width: 600 }}>
      <Beat frame={frame} fps={fps} start={T.hold} end={T.shrink + 10}>
        <h2 style={headline}>Every system sits on a foundation.</h2>
        <p style={body}>Front end, back end, data, login, delivery, platform, operations. Under all of it, the operating model: teams and ownership.</p>
      </Beat>
    </div>

    <div style={{ opacity: dim }}>
      <div style={{ position: 'absolute', ...box, opacity: intro }}>
        <MorphScene frame={frame} fps={fps} keyframes={[{ at: -100, bricks: foundation.bricks }]} plate={{ w: 12, d: 6 }} plateLabel={editionInfo.foundations.plateLabel} badges={false} />
      </div>
      <div style={{ position: 'absolute', left: 120, top: 820, width: 440, textAlign: 'right', opacity: shrink }}>
        <div style={{ ...smallCaps, color: INK }}>FOUNDATIONS</div>
        <div style={{ fontSize: 17, color: MUTED, marginTop: 4 }}>{foundation.name}, on the operating model</div>
      </div>

      {upper.map((item, i) => {
        const start = T.upper + i * 24
        const title = spring({ frame: frame - start, fps, config: { damping: 18, stiffness: 120 } })
        return <div key={item.edition} style={{ position: 'absolute', left: 20 + i * 630, top: 40, width: 620, height: 480 }}>
          <div style={{ textAlign: 'center', opacity: frame >= start ? title : 0, transform: `translateY(${(1 - title) * 12}px)` }}>
            <div style={{ ...smallCaps, color: INK }}>{editionInfo[item.edition].title.toUpperCase()}</div>
            <div style={{ fontSize: 17, color: MUTED, marginTop: 4 }}>{item.name}</div>
          </div>
          <div style={{ width: 620, height: 420, marginTop: 6 }}>
            <MorphScene frame={frame} fps={fps} keyframes={[{ at: start, bricks: item.bricks }]} plate={{ w: 12, d: 6 }} badges={false} headroom={0.6} plateOpacity={frame >= start ? title : 0} />
          </div>
          {/* Each system rests on Foundations */}
          <svg style={{ position: 'absolute', left: 0, top: 450, width: 620, height: 80, overflow: 'visible', opacity: interpolate(frame, [start + 20, start + 40], [0, 1], clamp) }}>
            <path d={`M 310 0 L ${310 + (1 - i) * 190} 70`} stroke="#9aa7a0" strokeWidth="2" strokeDasharray="6 5" fill="none" />
          </svg>
        </div>
      })}
    </div>

    {frame >= T.card && <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', opacity: card }}>
      <div style={{ textAlign: 'center', transform: `translateY(${(1 - card) * 24}px)` }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 34 }}>
          {editionInfo.ai.data.hues.map(hue => <span key={hue.id} style={{ width: 26, height: 12, background: hue.hex, borderRadius: 2 }} />)}
        </div>
        <h1 style={{ margin: 0, fontSize: 96, fontWeight: 780, color: INK, letterSpacing: '-0.02em' }}>Chromatic Architecture</h1>
        <p style={{ margin: '26px 0 0', fontSize: 36, color: '#41554a' }}>What snaps, what’s forced, and what’s missing.</p>
        <p style={{ margin: '54px 0 0', fontSize: 24, fontWeight: 750, color: MUTED, letterSpacing: '0.04em' }}>thejambot.com</p>
      </div>
    </div>}
  </AbsoluteFill>
}
