import { useState, useEffect } from 'react'
import './index.css'
import ArchitecturalChromatics from './ArchitecturalChromatics'
import BlendWorkshop from './BlendWorkshop'
import PartsReference from './PartsReference'
import FrontDoor from './FrontDoor'
import GrowthPage from './GrowthPage'

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

  if (route === '/' || route === '') return <FrontDoor />
  if (route === '/ai-applications' || route === '/ai-systems') return <BlendWorkshop key="ai" edition="ai" />
  if (route === '/data-engineering') return <BlendWorkshop key="data" edition="data" />
  if (route === '/agent-harness') return <BlendWorkshop key="harness" edition="harness" />
  if (route === '/growth') return <GrowthPage key="growth-ai" edition="ai" />
  if (route === '/growth/data') return <GrowthPage key="growth-data" edition="data" />
  if (route === '/growth/harness') return <GrowthPage key="growth-harness" edition="harness" />
  if (route === '/reference') return <PartsReference />
  if (route === '/original') return <ArchitecturalChromatics />
  return <FrontDoor />
}
