import { architecturalChromaticsData } from '../architectural-chromatics-data'
import { dataEngineeringChromaticsData } from '../data-engineering-chromatics-data'
import { agentHarnessChromaticsData } from '../agent-harness-chromatics-data'
import { foundationsData } from '../foundations-data'
import type { WorkshopData } from '../workshopData'
import type { EditionId } from './buildModel'

// plateLabel names what the baseplate stands for when it is more than ground: for Foundations, the operating model everything rests on.
export const editionInfo: Record<EditionId, { title: string, href: string, data: WorkshopData, plateLabel?: string }> = {
  foundations: { title: 'Foundations', href: '#/foundations', data: foundationsData, plateLabel: 'Product operating model · teams · ownership' },
  ai: { title: 'AI applications', href: '#/ai-applications', data: architecturalChromaticsData },
  data: { title: 'Data engineering', href: '#/data-engineering', data: dataEngineeringChromaticsData },
  harness: { title: 'Agent harness', href: '#/agent-harness', data: agentHarnessChromaticsData },
}

export const editionIds: EditionId[] = ['foundations', 'ai', 'data', 'harness']
