import { Composition, Folder, Series } from 'remotion'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
import { JobAct, JOB_DURATION } from './acts/JobAct'
import { QuestionsAct, QUESTIONS_DURATION } from './acts/QuestionsAct'
import { DataBuildAct, DATA_BUILD_DURATION } from './acts/DataBuildAct'
import { SetAct, SET_DURATION } from './acts/SetAct'
import { PileAct, PILE_DURATION } from './acts/PileAct'
import { VocabAct, VOCAB_DURATION } from './acts/VocabAct'
import { BuildAct, BUILD_DURATION } from './acts/BuildAct'
import { GrowthAct, GROWTH_DURATION } from './acts/GrowthAct'
import { FoundationAct, FOUNDATION_DURATION } from './acts/FoundationAct'

export const FPS = 30

// The main video: the goal-first cut.
const acts = [
  { id: 'Act1-Job', component: JobAct, duration: JOB_DURATION },
  { id: 'Act2-Questions', component: QuestionsAct, duration: QUESTIONS_DURATION },
  { id: 'Act3-DataBuild', component: DataBuildAct, duration: DATA_BUILD_DURATION },
  { id: 'Act4-Set', component: SetAct, duration: SET_DURATION },
]
// Stand-alone clips. Growth is kept for the site's growth page; the rest are the previous cut's acts.
const clips = [
  { id: 'Clip-Growth', component: GrowthAct, duration: GROWTH_DURATION },
  { id: 'Clip-LeanAgentBuild', component: BuildAct, duration: BUILD_DURATION },
  { id: 'Previous-Pile', component: PileAct, duration: PILE_DURATION },
  { id: 'Previous-Vocabulary', component: VocabAct, duration: VOCAB_DURATION },
  { id: 'Previous-Foundation', component: FoundationAct, duration: FOUNDATION_DURATION },
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
    <Folder name="Acts">
      {acts.map(act => <Composition key={act.id} id={act.id} component={act.component} durationInFrames={act.duration} fps={FPS} width={1920} height={1080} />)}
    </Folder>
    <Folder name="Clips">
      {clips.map(clip => <Composition key={clip.id} id={clip.id} component={clip.component} durationInFrames={clip.duration} fps={FPS} width={1920} height={1080} />)}
    </Folder>
  </>
}
