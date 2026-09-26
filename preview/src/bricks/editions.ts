import { architecturalChromaticsData } from '../architectural-chromatics-data'
import { dataEngineeringChromaticsData } from '../data-engineering-chromatics-data'
import { agentHarnessChromaticsData } from '../agent-harness-chromatics-data'
import type { WorkshopData } from '../workshopData'
import type { EditionId } from './buildModel'

export const editionInfo: Record<EditionId, { title: string, href: string, data: WorkshopData }> = {
  ai: { title: 'AI applications', href: '#/ai-applications', data: architecturalChromaticsData },
  data: { title: 'Data engineering', href: '#/data-engineering', data: dataEngineeringChromaticsData },
  harness: { title: 'Agent harness', href: '#/agent-harness', data: agentHarnessChromaticsData },
}

export const editionIds: EditionId[] = ['ai', 'data', 'harness']
