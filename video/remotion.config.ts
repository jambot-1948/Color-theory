import path from 'node:path'
import { Config } from '@remotion/cli/config'

// The video imports the site's real brick renderer and build rules from ../preview/src.
// Those files resolve `react` from the site's folder, so point module lookup at this project's node_modules too.
Config.overrideWebpackConfig(config => ({
  ...config,
  resolve: {
    ...config.resolve,
    modules: [path.resolve(process.cwd(), 'node_modules'), 'node_modules'],
  },
}))

Config.setVideoImageFormat('png')
Config.setConcurrency(null)
