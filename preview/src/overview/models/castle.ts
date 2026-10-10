import type { OverviewModel } from '../types'
import { H, brick, lifted, roof } from './util'

const CREST = H / 2

// A fairy-tale LEGO castle on an 18 x 8 plate it covers edge to edge. Front (+y) faces the box-art camera.
const castle = [
  // Foundations: the courtyard, curtain walls, turrets, and the squat tower that keep it standing.
  brick('court', 'foundations', '', 0, 0, 0, 18, 6),
  brick('turret-left', 'foundations', 'Login', 0, 5, 0, 3, 3, 6 * H),
  roof('turret-left-roof', 'foundations', 0, 5, 6 * H, 3, 3, 5),
  brick('wall-left', 'foundations', 'Front end', 3, 6, 0, 4, 2, 2 * H, { tag: 'Walls' }),
  brick('crest-l1', 'foundations', '', 3, 6, 2 * H, 1, 2, CREST),
  brick('crest-l2', 'foundations', '', 5, 6, 2 * H, 1, 2, CREST),
  brick('wall-right', 'foundations', 'Back end', 11, 6, 0, 4, 2, 2 * H),
  brick('crest-r1', 'foundations', '', 11, 6, 2 * H, 1, 2, CREST),
  brick('crest-r2', 'foundations', '', 13, 6, 2 * H, 1, 2, CREST),
  brick('turret-right-1', 'foundations', 'Cloud & CI/CD', 11, 1, H, 4, 3, H, { tag: 'Rooms' }),
  brick('turret-right-2', 'foundations', 'Monitoring', 11, 1, 2 * H, 4, 3),
  brick('turret-right-3', 'foundations', '', 11, 1, 3 * H, 4, 3, 3 * H),
  roof('turret-right-roof', 'foundations', 11, 1, 6 * H, 4, 3, 5.6),
  brick('keep-right', 'foundations', 'Data', 15, 4, 0, 3, 4, 3 * H),
  brick('keep-right-c1', 'foundations', '', 15, 4, 3 * H, 1, 1, CREST),
  brick('keep-right-c2', 'foundations', '', 17, 4, 3 * H, 1, 1, CREST),
  brick('keep-right-c3', 'foundations', '', 15, 7, 3 * H, 1, 1, CREST),
  brick('keep-right-c4', 'foundations', '', 17, 7, 3 * H, 1, 1, CREST),
  // Slender turrets flanking the gate: decoration for the box art, set aside in the manual view.
  brick('flank-left', 'deco', '', 5, 4, H, 2, 2, 5 * H),
  roof('flank-left-roof', 'deco', 5, 4, 6 * H, 2, 2, 3.6),
  brick('flank-right', 'deco', '', 11, 4, H, 2, 2, 5 * H),
  roof('flank-right-roof', 'deco', 11, 4, 6 * H, 2, 2, 3.6),
  // Data: the storeroom hall behind the left wall.
  brick('stores-1', 'data', 'Ingest', 2, 1, H, 4, 3, H, { tag: 'Stores' }),
  brick('stores-2', 'data', 'Store', 2, 1, 2 * H, 4, 3),
  brick('stores-3', 'data', 'Quality & catalog', 2, 1, 3 * H, 4, 3),
  brick('stores-4', 'data', '', 2, 1, 4 * H, 4, 3),
  roof('stores-roof', 'data', 2, 1, 5 * H, 4, 3, 5),
  // AI application: the tall spire everyone sees first.
  brick('keep-1', 'ai', 'Knowledge', 7.5, 1.5, H, 3, 3),
  brick('keep-2', 'ai', 'Model', 7.5, 1.5, 2 * H, 3, 3),
  brick('keep-3', 'ai', 'Agent', 7.5, 1.5, 3 * H, 3, 3),
  brick('keep-4', 'ai', 'Interface', 7.5, 1.5, 4 * H, 3, 3, H, { tag: 'Tower' }),
  brick('keep-5', 'ai', '', 7.5, 1.5, 5 * H, 3, 3, 3 * H),
  brick('spire-1', 'ai', '', 8, 2, 8 * H, 2, 2, 3 * H),
  roof('spire-roof', 'ai', 8, 2, 11 * H, 2, 2, 7),
  // Agent harness: the peaked gatehouse between the castle and the world.
  brick('gate-left', 'harness', '', 7, 6, 0, 1, 2, 2 * H),
  brick('gate-right', 'harness', '', 10, 6, 0, 1, 2, 2 * H),
  brick('gate-top', 'harness', 'Gatehouse', 7, 6, 2 * H, 4, 2, H, { tag: 'Harness' }),
  roof('gate-roof', 'harness', 7, 6, 3 * H, 4, 2, 2.2, false),
]

const lift = { foundations: 0, deco: 0, data: 0.5, harness: 0, ai: 2.4 }

export const castleModel: OverviewModel = {
  id: 'castle',
  name: 'Castle',
  alt: 'A LEGO-style fairy-tale castle: walls and turrets, a storeroom hall, a gatehouse, and a tall central spire.',
  plate: { w: 18, d: 8 },
  plateAt: { x: 0, y: 0 },
  plateLabel: 'Product operating model · teams · ownership',
  boxCamera: { azimuth: 0, elevation: 12 },
  parts: {
    base: { part: 'Baseplate' },
    foundations: { part: 'Walls & turrets' },
    data: { part: 'Storerooms' },
    ai: { part: 'Spire' },
    harness: { part: 'Gatehouse', analogy: 'Like the gatehouse, it decides what reaches the spire.' },
  },
  build(t) {
    return {
      prims: [{ kind: 'sorted', bricks: lifted(castle, lift, t) }],
      callouts: [
        { group: 'ai', anchor: [10, 1.5, 8 * H + 2.4 * t], side: 1, lift: 20, title: 'AI application', subtitle: 'The spire' },
        { group: 'data', anchor: [2, 2.5, 4 * H + 0.5 * t], side: -1, lift: 70, title: 'Data engineering', subtitle: 'The storerooms' },
        { group: 'harness', anchor: [7, 8, 2.5 * H], side: -1, lift: -60, title: 'Agent harness', subtitle: 'The gatehouse' },
        { group: 'foundations', anchor: [18, 6, 2.5 * H], side: 1, lift: -4, title: 'Foundations', subtitle: 'Walls & turrets' },
        { group: 'base', anchor: [18, 4, -0.8], side: 1, lift: -20, title: 'Operating model', subtitle: 'The baseplate' },
      ],
    }
  },
}
