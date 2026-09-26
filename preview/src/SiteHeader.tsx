import './BlendWorkshop.css'
import './WorkshopNavigation.css'

const links = [
  { id: 'ai', label: 'AI applications', href: '#/ai-applications' },
  { id: 'data', label: 'Data engineering', href: '#/data-engineering' },
  { id: 'harness', label: 'Agent harness', href: '#/agent-harness' },
  { id: 'growth', label: 'Growth', href: '#/growth' },
  { id: 'reference', label: 'Parts', href: '#/reference' },
]

export default function SiteHeader({ active }: { active?: string }) {
  return <header className="bw-header"><a className="bw-brand" href="#/"><span className="bw-mark"><i /><i /><i /></span>Chromatic Architecture</a><nav aria-label="Main navigation">{links.map(link => <a key={link.id} className={active === link.id ? 'active' : undefined} aria-current={active === link.id ? 'page' : undefined} href={link.href}>{link.label}</a>)}</nav></header>
}
