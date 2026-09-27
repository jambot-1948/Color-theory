import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { architecturalChromaticsData as data } from '../../../preview/src/architectural-chromatics-data'
import { Baseplate, IsoBrick, type SceneBrick } from '../../../preview/src/bricks/Brick'
import { editionTiers } from '../../../preview/src/bricks/buildModel'
import { BRICK_HEIGHT, pathFrom, projector } from '../../../preview/src/bricks/iso'
import { clamp, viewBoxFor } from '../lib/motion'
import { Beat, Eyebrow, body, headline, smallCaps } from '../lib/type'
import { INK, MUTED, PAPER } from '../theme'

// Act 2: picture, then word. One brick gains each part of the grammar in turn.
const GRAY = '#aeb8b1'
const cognition = data.hues.find(hue => hue.id === 'cognition')!
const products = ['openai', 'claude', 'ollama'].map(id => data.tools.find(tool => tool.id === id)!.name)
const tiers = editionTiers.ai
const MODEL_TIER = tiers.findIndex(tier => tier.hues.includes('cognition'))

const B = { brick: 20, colour: 170, label: 350, tier: 560, recap: 740 }
export const VOCAB_DURATION = 900

function mixHex(a: string, b: string, t: number) {
  const ch = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16))
  const [x, y] = [ch(a), ch(b)]
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('')}`
}

// The seven-role wheel, drawn from the same hues and order as the site.
function Wheel({ active, reveal }: { active: string, reveal: number }) {
  const size = 360
  const c = size / 2
  const sweep = 360 / data.hues.length
  const polar = (r: number, deg: number) => [c + r * Math.sin((deg * Math.PI) / 180), c - r * Math.cos((deg * Math.PI) / 180)]
  return <svg viewBox={`-60 -30 ${size + 120} ${size + 60}`} style={{ width: 480, overflow: 'visible', fontFamily: 'Inter, sans-serif' }}>
    {data.hues.map((hue, index) => {
      const shown = interpolate(reveal, [index / 9, index / 9 + 0.3], [0, 1], clamp)
      const start = index * sweep - sweep / 2 + 1
      const end = start + sweep - 2
      const [x1, y1] = polar(150, start), [x2, y2] = polar(150, end), [x3, y3] = polar(92, end), [x4, y4] = polar(92, start)
      const on = hue.id === active
      const [lx, ly] = polar(200, index * sweep)
      return <g key={hue.id} opacity={shown * (on ? 1 : 0.35)}>
        <path d={`M ${x1} ${y1} A 150 150 0 0 1 ${x2} ${y2} L ${x3} ${y3} A 92 92 0 0 0 ${x4} ${y4} Z`} fill={hue.hex} stroke={on ? INK : 'none'} strokeWidth={on ? 3 : 0} />
        <text x={lx} y={ly + 6} textAnchor="middle" fontSize={on ? 22 : 18} fontWeight={on ? 800 : 650} fill={on ? INK : MUTED}>{hue.name}</text>
      </g>
    })}
    <text x={c} y={c + 8} textAnchor="middle" fontSize="18" fontWeight="800" fill={MUTED} opacity={reveal} letterSpacing="1.5">7 ROLES</text>
  </svg>
}

export function VocabAct() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const unit = 30
  const p = projector(unit)
  const plate = { w: 8, d: 4 }

  // Picture beats
  const arrive = spring({ frame: frame - B.brick, fps, config: { damping: 13, stiffness: 140, mass: 0.8 } })
  const colour = interpolate(frame, [B.colour + 20, B.colour + 50], [0, 1], clamp)
  const swapEvery = 60
  const labelIndex = Math.floor((frame - B.label - 20) / swapEvery)
  const sticker = frame < B.label + 20 ? null : products[Math.min(products.length - 1, Math.max(0, labelIndex))]
  const bump = frame >= B.label + 20 && labelIndex < products.length ? Math.sin(Math.min(1, ((frame - B.label - 20) % swapEvery) / 10) * Math.PI) * 0.35 : 0
  const rise = spring({ frame: frame - B.tier - 20, fps, config: { damping: 15, stiffness: 100 } })
  const z = (1 - arrive) * 7 + bump + rise * MODEL_TIER * BRICK_HEIGHT

  const brick: SceneBrick = {
    id: 'vocab', box: { x: 1, y: 1, z, w: 6, d: 2, h: BRICK_HEIGHT },
    hex: mixHex(GRAY, cognition.hex, colour), label: 'Model API', tag: colour > 0.5 ? cognition.name : undefined,
    sticker: frame >= B.label ? sticker : undefined, state: 'seated',
  }

  // Tier shelves: faint outlines at each tier's height, labelled, shown only for the height beat.
  const shelves = interpolate(frame, [B.tier, B.tier + 20, B.recap + 20, B.recap + 40], [0, 1, 1, 0], clamp)
  const wheelIn = interpolate(frame, [B.colour, B.colour + 40, B.label - 10, B.label + 10], [0, 1, 1, 0], clamp)
  const outro = interpolate(frame, [VOCAB_DURATION - 20, VOCAB_DURATION], [1, 0], clamp)

  const terms = [
    { at: B.brick, picture: 'Brick', word: 'Capability' },
    { at: B.colour, picture: 'Colour', word: 'Role' },
    { at: B.label, picture: 'Printed label', word: 'Product' },
    { at: B.tier, picture: 'Height', word: 'Tier' },
  ]

  return <AbsoluteFill style={{ background: PAPER, fontFamily: 'Inter, sans-serif', opacity: outro }}>
    <Eyebrow>THE VOCABULARY</Eyebrow>
    <div style={{ position: 'absolute', left: 120, top: 300, width: 680 }}>
      <Beat frame={frame} fps={fps} start={B.brick + 10} end={B.colour}>
        <h2 style={headline}>A brick is a capability.</h2><p style={body}>Something the system must be able to do, like calling a model.</p>
      </Beat>
      <Beat frame={frame} fps={fps} start={B.colour} end={B.label}>
        <h2 style={headline}>Colour is its role.</h2><p style={body}>Each system has seven roles. A model API plays Cognition.</p>
      </Beat>
      <Beat frame={frame} fps={fps} start={B.label} end={B.tier}>
        <h2 style={headline}>The label is the product.</h2>
        <p style={body}>Swap the product and the capability stays.</p>
        <div style={{ display: 'flex', gap: 14, marginTop: 30 }}>{products.map(name => <span key={name} style={{ fontSize: 24, fontWeight: 750, padding: '8px 14px', borderRadius: 5, border: `2px solid ${name === sticker ? INK : '#c7d3c8'}`, color: name === sticker ? INK : '#8b9a90', background: name === sticker ? '#fff' : 'transparent' }}>{name}</span>)}</div>
      </Beat>
      <Beat frame={frame} fps={fps} start={B.tier} end={B.recap}>
        <h2 style={headline}>Height is its tier.</h2><p style={{ ...body, maxWidth: 520 }}>Platforms and knowledge sit low; surfaces and oversight sit high. A reading aid, not data flow.</p>
      </Beat>
      <Beat frame={frame} fps={fps} start={B.recap} end={VOCAB_DURATION}>
        <h2 style={headline}>Four things to read on every brick.</h2>
      </Beat>
    </div>

    {/* Picture → word recap strip builds up as each term is introduced */}
    <div style={{ position: 'absolute', left: 120, bottom: 96, display: 'flex', gap: 14 }}>
      {terms.map(term => {
        const show = spring({ frame: frame - term.at - 30, fps, config: { damping: 18, stiffness: 140 } })
        if (frame < term.at + 30) return null
        return <div key={term.word} style={{ opacity: show, transform: `translateY(${(1 - show) * 12}px)`, padding: '12px 18px', background: '#fff', border: '1.5px solid #d3ddd5', borderRadius: 6 }}>
          <div style={smallCaps}>{term.picture.toUpperCase()}</div>
          <div style={{ fontSize: 26, fontWeight: 760, color: INK, marginTop: 4 }}>= {term.word}</div>
        </div>
      })}
    </div>

    <div style={{ position: 'absolute', right: 30, top: 60, width: 960, height: 880 }}>
      <svg viewBox={viewBoxFor(p, plate, tiers.length, false, 1.4)} style={{ width: '100%', height: '100%', overflow: 'visible', fontFamily: 'Inter, sans-serif' }}>
        <Baseplate w={plate.w} d={plate.d} p={p} />
        {tiers.map((tier, index) => {
          const zt = index * BRICK_HEIGHT
          const on = index === MODEL_TIER
          const edge = [p.point(0.2, 0.2, zt), p.point(plate.w - 0.2, 0.2, zt), p.point(plate.w - 0.2, plate.d - 0.2, zt), p.point(0.2, plate.d - 0.2, zt)]
          const [lx, ly] = p.point(0, plate.d, zt)
          return <g key={tier.name} opacity={shelves * (index === 0 ? 0.6 : 1)}>
            {index > 0 && <path d={pathFrom(edge)} fill="none" stroke={on ? cognition.hex : '#9aa7a0'} strokeWidth={on ? 1.6 : 1} strokeDasharray="4 3" />}
            <text x={lx - 16} y={ly + 5} textAnchor="end" fontSize={on ? 11.5 : 10} fontWeight={on ? 800 : 650} fill={on ? INK : MUTED}>{tier.name}</text>
          </g>
        })}
        {frame >= B.brick && <IsoBrick brick={brick} p={p} />}
      </svg>
    </div>

    <div style={{ position: 'absolute', right: 110, top: 130, opacity: wheelIn, transform: `scale(${0.9 + 0.1 * wheelIn})` }}>
      <Wheel active="cognition" reveal={interpolate(frame, [B.colour, B.colour + 40], [0, 1], clamp)} />
    </div>
  </AbsoluteFill>
}
