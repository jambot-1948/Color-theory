import type { CSSProperties, ReactNode } from 'react'
import { interpolate, spring } from 'remotion'
import { INK, SUBTLE } from '../theme'
import { clamp } from './motion'

// Type used across acts. Sizes are set for a 1920×1080 frame read from the back of a room.

export function Eyebrow({ children, opacity = 1 }: { children: ReactNode, opacity?: number }) {
  return <div style={{ position: 'absolute', left: 120, top: 96, fontSize: 17, fontWeight: 800, letterSpacing: '0.14em', color: SUBTLE, opacity }}>{children}</div>
}

// A block of copy that springs up on `start` and fades out before `end`.
export function Beat({ frame, fps, start, end, children, style }: { frame: number, fps: number, start: number, end: number, children: ReactNode, style?: CSSProperties }) {
  if (frame < start || frame > end) return null
  const enter = spring({ frame: frame - start, fps, config: { damping: 20, stiffness: 120 } })
  const exit = interpolate(frame, [end - 10, end], [1, 0], clamp)
  return <div style={{ ...style, opacity: Math.min(enter, exit), transform: `translateY(${(1 - enter) * 28}px)` }}>{children}</div>
}

export const headline: CSSProperties = { margin: '0 0 22px', fontSize: 64, lineHeight: 1.05, fontWeight: 760, color: INK, letterSpacing: '-0.01em' }
export const body: CSSProperties = { margin: 0, fontSize: 29, lineHeight: 1.45, color: '#41554a', maxWidth: 620 }
export const smallCaps: CSSProperties = { fontSize: 18, fontWeight: 800, color: SUBTLE, letterSpacing: '0.06em' }

export function Chip({ label, color, progress }: { label: string, color: string, progress: number }) {
  return <span style={{ display: 'inline-block', fontSize: 17, fontWeight: 800, padding: '6px 13px', border: `2.5px solid ${color}`, borderRadius: 5, background: '#fff', color, opacity: progress, transform: `scale(${0.85 + 0.15 * progress})`, transformOrigin: 'left center' }}>{label}</span>
}
