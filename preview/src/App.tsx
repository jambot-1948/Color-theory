import { useState, useEffect } from 'react'
import './index.css'
import ArchitecturalChromatics from './ArchitecturalChromatics'
import DataEngineeringChromatics from './DataEngineeringChromatics'

function getRoute(): string {
  return window.location.hash.replace('#', '') || '/'
}

export default function App() {
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const handler = () => setRoute(getRoute())
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  if (route === '/data-engineering') return <DataEngineeringChromatics />
  return <ArchitecturalChromatics />
}
