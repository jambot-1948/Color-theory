import { useEffect, useRef } from 'react'
import './BlendWorkshop.css'
import './WorkshopNavigation.css'

const links = [
  { id: 'foundations', label: 'Foundations', href: '#/foundations' },
  { id: 'ai', label: 'AI applications', href: '#/ai-applications' },
  { id: 'data', label: 'Data engineering', href: '#/data-engineering' },
  { id: 'harness', label: 'Agent harness', href: '#/agent-harness' },
  { id: 'growth', label: 'Growth', href: '#/growth' },
  { id: 'reference', label: 'Parts', href: '#/reference' },
]

export default function SiteHeader({ active }: { active?: string }) {
  const activeLink = useRef<HTMLAnchorElement | null>(null)
  useEffect(() => { activeLink.current?.scrollIntoView({ block: 'nearest', inline: 'center' }) }, [active])
  return <header className="bw-header"><a className="bw-brand" href="#/"><span className="bw-mark" aria-hidden="true"><i /><i /><i /></span><span className="bw-brand-copy"><span>Chromatic Architecture</span><small>Systems workbench</small></span></a><nav aria-label="Main navigation">{links.map(link => <a key={link.id} ref={active === link.id ? activeLink : undefined} className={active === link.id ? 'active' : undefined} aria-current={active === link.id ? 'page' : undefined} href={link.href}>{link.label}</a>)}</nav></header>
}
