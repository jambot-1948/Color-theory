import { Composition } from 'remotion'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
import { BuildAct, BUILD_DURATION } from './acts/BuildAct'

export const FPS = 30

export function Root() {
  return <>
    <Composition id="Act3-Build" component={BuildAct} durationInFrames={BUILD_DURATION} fps={FPS} width={1920} height={1080} />
  </>
}
