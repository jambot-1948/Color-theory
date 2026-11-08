import { useRef } from 'react'
import './Film.css'

// Chapter starts, in seconds, match the acts in video/ (Gap, Job, Questions, DataBuild, Set, criteria beat in Set).
const chapters = [
  { at: 0, label: 'Why this exists' },
  { at: 15, label: 'The job' },
  { at: 30, label: 'The questions' },
  { at: 61, label: 'One system up close' },
  { at: 113, label: 'The set' },
  { at: 135, label: 'Judge it' },
]
const stamp = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
const asset = (name: string) => `${import.meta.env.BASE_URL}${name}`

export default function Film() {
  const video = useRef<HTMLVideoElement | null>(null)
  const jump = (at: number) => {
    const el = video.current
    if (!el) return
    el.currentTime = at
    void el.play().catch(() => undefined)
  }
  const toSystems = () => document.getElementById('fd-editions-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return <section className="film" aria-labelledby="film-title">
    <div className="film-inner">
      <span className="film-kicker">CHROMATIC ARCHITECTURE · 2 MIN 31 SEC</span>
      <h1 id="film-title">Start from the job. See what snaps, what’s forced, and what’s missing.</h1>
      <p className="film-lede">Most projects start with a problem statement or a list of tools, and few teams have a way to see how the two fit together. This short film shows one way to do that, built from the same rules as the tool below.</p>
      <video ref={video} className="film-video" controls preload="metadata" poster={asset('film-poster.jpg')} aria-label="Chromatic Architecture overview film">
        <source src={asset('chromatic-architecture-overview.mp4')} type="video/mp4" />
      </video>
      <div className="film-chapters" role="group" aria-label="Jump to a chapter">
        {chapters.map(chapter => <button key={chapter.at} type="button" onClick={() => jump(chapter.at)}><span>{stamp(chapter.at)}</span><b>{chapter.label}</b></button>)}
      </div>
      <button type="button" className="film-go" onClick={toSystems}>Now try it: choose a system ↓</button>
    </div>
  </section>
}
