import { Composition, Series } from 'remotion'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
import { PileAct, PILE_DURATION } from './acts/PileAct'
import { VocabAct, VOCAB_DURATION } from './acts/VocabAct'
import { BuildAct, BUILD_DURATION } from './acts/BuildAct'
import { GrowthAct, GROWTH_DURATION } from './acts/GrowthAct'
import { FoundationAct, FOUNDATION_DURATION } from './acts/FoundationAct'

export const FPS = 30

const acts = [
  { id: 'Act1-Pile', component: PileAct, duration: PILE_DURATION },
  { id: 'Act2-Vocabulary', component: VocabAct, duration: VOCAB_DURATION },
  { id: 'Act3-Build', component: BuildAct, duration: BUILD_DURATION },
  { id: 'Act4-Growth', component: GrowthAct, duration: GROWTH_DURATION },
  { id: 'Act5-Foundation', component: FoundationAct, duration: FOUNDATION_DURATION },
]
const total = acts.reduce((sum, act) => sum + act.duration, 0)

function Overview() {
  return <Series>
    {acts.map(act => <Series.Sequence key={act.id} durationInFrames={act.duration}><act.component /></Series.Sequence>)}
  </Series>
}

export function Root() {
  return <>
    <Composition id="Overview" component={Overview} durationInFrames={total} fps={FPS} width={1920} height={1080} />
    {acts.map(act => <Composition key={act.id} id={act.id} component={act.component} durationInFrames={act.duration} fps={FPS} width={1920} height={1080} />)}
  </>
}
