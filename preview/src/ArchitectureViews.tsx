import { useState } from 'react'
import { ArrowDown, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import './ArchitectureViews.css'

const journey = [
  { title: 'Ask', place: 'Experience', detail: 'A person submits a question in a browser interface. The interface and its hosting are choices this recipe has not made.' },
  { title: 'Receive', place: 'Application', detail: 'A backend endpoint receives the request. Authentication, authorization, and rate limits must be designed here; they are not supplied by the three named parts.' },
  { title: 'Retrieve', place: 'Application to external service', detail: 'The SDK sends the question to the OpenAI model, which can request the retrieval tool. Your tool queries Pinecone and returns indexed material; the connection is not automatic.' },
  { title: 'Generate', place: 'Application to external service', detail: 'The SDK returns the tool results to the model, which writes the answer. This loop can repeat; the prompts and data sent need review.' },
  { title: 'Return', place: 'Application to experience', detail: 'The backend returns an answer to the browser. Source display, errors, and evaluation remain product decisions.' },
] as const

export default function ArchitectureViews({ view }: { view: 'map' | 'journey' }) {
  const [phase, setPhase] = useState(0)

  if (view === 'journey') return <div className="av-journey">
    <div className="av-flow" aria-label="Proposed request path">{journey.map((item, index) => <button key={item.title} type="button" className={phase === index ? 'active' : ''} onClick={() => setPhase(index)} aria-current={phase === index ? 'step' : undefined}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong><small>{item.place}</small></button>)}</div>
    <div className="av-current" aria-live="polite"><span>REQUEST STEP {phase + 1} / {journey.length}</span><h4>{journey[phase].title}</h4><p>{journey[phase].detail}</p><div className="av-controls"><button type="button" onClick={() => setPhase(value => Math.max(0, value - 1))} disabled={phase === 0} aria-label="Previous request step"><ChevronLeft size={17} /></button><button type="button" onClick={() => setPhase(value => Math.min(journey.length - 1, value + 1))} disabled={phase === journey.length - 1} aria-label="Next request step"><ChevronRight size={17} /></button></div></div>
    <p className="av-caveat">Illustrative request path, not an implemented or tested integration.</p>
  </div>

  return <div className="av-map">
    <div className="av-tier"><div className="av-tier-label"><span>01</span><strong>Experience</strong><small>Presentation</small></div><div className="av-tier-body"><h4>Browser interface</h4><p>Question in, answer out. Product UI not chosen in this recipe.</p><small>RUNS ON: USER DEVICE · UI HOSTING TO CHOOSE</small></div></div>
    <div className="av-map-arrow"><ArrowDown size={17} /><span>HTTPS REQUEST / RESPONSE</span></div>
    <div className="av-tier"><div className="av-tier-label"><span>02</span><strong>Application</strong><small>Logic</small></div><div className="av-tier-body"><h4>API + OpenAI Agents SDK</h4><p>Your backend owns the endpoint and retrieval tool. The SDK coordinates model and tool calls.</p><small>RUNS ON: SERVER, CONTAINER, OR SERVERLESS · NOT CHOSEN</small></div></div>
    <div className="av-map-arrow"><ArrowDown size={17} /><span>BACKEND-OWNED API CALLS</span></div>
    <div className="av-tier"><div className="av-tier-label"><span>03</span><strong>External services</strong><small>Model + data</small></div><div className="av-tier-body av-services"><div><h4>OpenAI model API</h4><p>Generates from the supplied question and context.</p></div><div><h4>Pinecone index</h4><p>Returns retrieved material through your tool.</p></div><small>MANAGED SERVICES · DATA ACCESS AND INDEX UPDATES TO DESIGN</small></div></div>
    <div className="av-boundaries"><div><ArrowRight size={15} /><span>Keep API credentials on the backend, never in the browser.</span></div><div><ArrowRight size={15} /><span>Authentication, observability, failures, and deployment are open decisions.</span></div><div><ArrowRight size={15} /><span>The Agents SDK sends traces to OpenAI by default; decide whether that is acceptable.</span></div></div>
    <p className="av-caveat">Proposed placement for this recipe. The named products are not a complete application.</p>
  </div>
}
