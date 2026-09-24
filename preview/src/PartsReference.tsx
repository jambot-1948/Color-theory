import { ArrowRight } from 'lucide-react'
import { architecturalChromaticsData } from './architectural-chromatics-data'
import { dataEngineeringChromaticsData } from './data-engineering-chromatics-data'
import { agentHarnessChromaticsData } from './agent-harness-chromatics-data'
import './PartsReference.css'
import './WorkshopNavigation.css'

const editions = [
  { title: 'AI systems', href: '#/ai-systems', data: architecturalChromaticsData },
  { title: 'Data engineering', href: '#/data-engineering', data: dataEngineeringChromaticsData },
  { title: 'Agent harness', href: '#/agent-harness', data: agentHarnessChromaticsData },
]

export default function PartsReference() {
  return <div className="bw-app">
    <header className="bw-header"><a className="bw-brand" href="#/"><span className="bw-mark"><i /><i /><i /></span>Stack Assembly</a><nav aria-label="Main navigation"><a href="#/ai-systems">AI systems</a><a href="#/data-engineering">Data engineering</a><a href="#/agent-harness">Agent harness</a><a className="active" href="#/reference">Reference</a></nav></header>
    <main className="bw-main pr-main"><div className="bw-title"><div><h1>Parts reference</h1><p>Roles define the job. Tools are possible parts for that job.</p></div><a href="#/original">Original view <ArrowRight size={15} /></a></div>
      {editions.map(edition => <section className="pr-edition" key={edition.title}>
        <div className="pr-heading"><div><h2>{edition.title}</h2><span>{edition.data.hues.length} roles · {edition.data.tools.length} tools · {edition.data.recipes.length} examples</span></div><a href={edition.href}>Open assembly <ArrowRight size={16} /></a></div>
        <div className="pr-roles">{edition.data.hues.map(hue => <div className="pr-role" key={hue.id}><i style={{ background: hue.hex }} /><div><h3>{hue.name}</h3><p>{hue.description}</p><span>{edition.data.tools.filter(tool => tool.primaryHue === hue.id).map(tool => tool.name).join(' · ') || 'No primary part in this edition'}</span></div></div>)}</div>
      </section>)}
    </main>
  </div>
}
