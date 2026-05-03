import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  AlertTriangle,
  ShieldCheck,
  Layers,
  X,
  Plus,
  ArrowRight,
  ZapOff,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  TrendingUp,
  Workflow,
  Database,
  Eye,
} from 'lucide-react';
import { architecturalChromaticsData as DATA } from './architectural-chromatics-data';

// --- SMALL INDICATORS ---

const ComplexityBar = ({ level }: { level: string }) => {
  const levels: Record<string, number> = { low: 1, medium: 2, high: 3 };
  const current = levels[level] || 1;
  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3].map(i => (
        <div key={i} className={`h-1.5 w-4 rounded-full transition-colors ${i <= current ? 'bg-amber-400' : 'bg-gray-100'}`} />
      ))}
    </div>
  );
};

const TrustScale = ({ level }: { level: string }) => {
  const levels: Record<string, number> = { low: 1, medium: 2, high: 3 };
  const current = levels[level] || 1;
  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3].map(i => (
        <div key={i} className={`h-1.5 w-4 rounded-full transition-colors ${i <= current ? 'bg-teal-400' : 'bg-gray-100'}`} />
      ))}
    </div>
  );
};

// Evaluation dimension filter predicates — each maps a dimension name to a tool test
const DIM_FILTER: Record<string, (t: typeof DATA.tools[number]) => boolean> = {
  harmony:         t => t.pairsWellWith.length >= 3,
  contrast:        t => t.conflictsWith.length > 0,
  complexity:      t => t.complexityAdded === 'low',
  durability:      t => t.maturity === 'production',
  clarity:         t => !t.secondaryHue,
  adaptability:    t => t.patterns.length >= 2,
  operationalLoad: t => t.complexityAdded !== 'high',
  trustSurface:    t => t.trustContribution === 'high',
};

const DIM_LABELS: Record<string, string> = {
  harmony:         'Harmony',
  contrast:        'Contrast',
  complexity:      'Low Complexity',
  durability:      'Durability',
  clarity:         'Clarity',
  adaptability:    'Adaptability',
  operationalLoad: 'Operational Load',
  trustSurface:    'Trust Surface',
};

const DIM_DESCRIPTIONS: Record<string, string> = {
  harmony:         'Pairs well with 3+ other tools',
  contrast:        'Creates productive architectural tension',
  complexity:      'Low complexity to adopt and operate',
  durability:      'Production-ready maturity',
  clarity:         'Single-role focus — no secondary hue',
  adaptability:    'Appears in 2 or more patterns',
  operationalLoad: 'Low-to-medium operational burden',
  trustSurface:    'High trust and observability contribution',
};

// Plain-language examples per hue — used in palette explainer and filter bar
const HUE_EXAMPLES: Record<string, string> = {
  intent:    'prompts, goals, decisions',
  logic:     'orchestrators, workflows',
  cognition: 'LLMs, reasoning engines',
  memory:    'vector stores, retrieval',
  interface: 'UIs, dashboards',
  velocity:  'deployment, build tools',
  trust:     'evals, guardrails, logging',
};

// Pattern type → badge color
const PATTERN_TYPE_STYLES: Record<string, string> = {
  foundational: 'text-indigo-600 bg-indigo-50 border-indigo-100',
  'high-velocity': 'text-emerald-700 bg-emerald-50 border-emerald-100',
  'anti-pattern': 'text-rose-600 bg-rose-50 border-rose-100',
  structural: 'text-blue-600 bg-blue-50 border-blue-100',
};

// --- COLOR WHEEL + HARMONY ---

// Each hue's position on a 7-segment wheel (degrees, 0 = top, clockwise)
const HUE_ANGLES: Record<string, number> = {
  intent: 0,
  memory: 51.4,
  interface: 102.9,
  velocity: 154.3,
  trust: 205.7,
  logic: 257.1,
  cognition: 308.6,
};

const SEGMENT_SWEEP = 360 / 7; // 51.43°

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function wedgePath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = polarToXY(cx, cy, r, startDeg);
  const e = polarToXY(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M${cx},${cy} L${s.x},${s.y} A${r},${r} 0 ${large} 1 ${e.x},${e.y} Z`;
}

function computeHarmony(hueIds: string[]): { label: string; meaning: string } {
  const n = hueIds.length;
  if (n === 0) return { label: '', meaning: '' };
  if (n === 1) return { label: 'Monochromatic', meaning: 'Specialist depth — strong in one role' };

  const angles = hueIds.map(h => HUE_ANGLES[h] ?? 0).sort((a, b) => a - b);

  if (n === 2) {
    const diff = Math.min(
      Math.abs(angles[1] - angles[0]),
      360 - Math.abs(angles[1] - angles[0])
    );
    if (diff <= 60) return { label: 'Analogous', meaning: 'Adjacent roles that reinforce each other' };
    if (diff >= 150) return { label: 'Complementary', meaning: 'Opposite system needs in natural tension' };
    return { label: 'Split', meaning: 'Coverage with coherence — adjacent contrast' };
  }

  if (n === 3) {
    const gaps = [
      angles[1] - angles[0],
      angles[2] - angles[1],
      360 - angles[2] + angles[0],
    ];
    if (Math.max(...gaps) - Math.min(...gaps) < 70)
      return { label: 'Triadic', meaning: 'Three distinct roles in balanced tension' };
    if (Math.max(...gaps) > 200)
      return { label: 'Split-Complementary', meaning: 'One outlier balancing two adjacent roles' };
    return { label: 'Analogous+', meaning: 'Clustered roles with extended reach' };
  }

  if (n >= 5) return { label: 'Complex', meaning: 'Broad coverage — requires design discipline' };
  return { label: 'Tetradic', meaning: 'Wide architectural coverage with inherent tension' };
}

const ColorWheelMini = ({ hues }: { hues: string[] }) => {
  const cx = 44, cy = 44, r = 36, innerR = 14;
  const hueList = DATA.hues;

  // Points for the connecting overlay (center of each active hue wedge)
  const activePoints = hues.map(hId => {
    const center = HUE_ANGLES[hId] + SEGMENT_SWEEP / 2;
    const mid = (r + innerR) / 2;
    return polarToXY(cx, cy, mid, center);
  });

  const overlayPath = activePoints.length > 1
    ? activePoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + (activePoints.length > 2 ? ' Z' : '')
    : '';

  return (
    <svg viewBox="0 0 88 88" width="88" height="88" aria-hidden="true">
      {/* Segments */}
      {hueList.map(hue => {
        const start = HUE_ANGLES[hue.id];
        const end = start + SEGMENT_SWEEP;
        const isActive = hues.includes(hue.id);
        return (
          <path
            key={hue.id}
            d={wedgePath(cx, cy, r, start, end)}
            fill={hue.hex}
            opacity={isActive ? 1 : 0.12}
          />
        );
      })}
      {/* Inner circle cutout */}
      <circle cx={cx} cy={cy} r={innerR} fill="white" />
      {/* Connecting overlay */}
      {overlayPath && (
        <path
          d={overlayPath}
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinejoin="round"
          opacity="0.9"
        />
      )}
      {/* Active hue dots */}
      {activePoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="white" opacity="0.9" />
      ))}
    </svg>
  );
};

// Full labeled color wheel for the palette explainer — annular segments with hue names outside.
const ColorWheelLabeled = ({ activeHue }: { activeHue: string | null }) => {
  const cx = 130, cy = 130, outerR = 78, innerR = 26, labelR = 104;

  return (
    <svg viewBox="0 0 260 260" width="190" height="190" aria-hidden="true">
      {DATA.hues.map(hue => {
        const start = HUE_ANGLES[hue.id];
        const end = start + SEGMENT_SWEEP;
        const midAngle = start + SEGMENT_SWEEP / 2;
        const isActive = !activeHue || activeHue === hue.id;

        // Annular wedge (donut segment)
        const os = polarToXY(cx, cy, outerR, start);
        const oe = polarToXY(cx, cy, outerR, end);
        const is_ = polarToXY(cx, cy, innerR, start);
        const ie = polarToXY(cx, cy, innerR, end);
        const large = SEGMENT_SWEEP > 180 ? 1 : 0;
        const wedge = [
          `M${os.x.toFixed(1)},${os.y.toFixed(1)}`,
          `A${outerR},${outerR} 0 ${large} 1 ${oe.x.toFixed(1)},${oe.y.toFixed(1)}`,
          `L${ie.x.toFixed(1)},${ie.y.toFixed(1)}`,
          `A${innerR},${innerR} 0 ${large} 0 ${is_.x.toFixed(1)},${is_.y.toFixed(1)}`,
          'Z',
        ].join(' ');

        const labelPos = polarToXY(cx, cy, labelR, midAngle);

        return (
          <g key={hue.id} opacity={isActive ? 1 : 0.15} style={{ transition: 'opacity 0.25s' }}>
            <path d={wedge} fill={hue.hex} />
            <text
              x={labelPos.x}
              y={labelPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="8"
              fontWeight="800"
              fill={isActive ? '#4b5563' : '#9ca3af'}
              fontFamily="system-ui,sans-serif"
              letterSpacing="0.5"
            >
              {hue.name.toUpperCase()}
            </text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={innerR} fill="white" />
      <text x={cx} y={cx - 4} textAnchor="middle" fontSize="8" fontWeight="900" fill="#e5e7eb" fontFamily="system-ui,sans-serif">7</text>
      <text x={cx} y={cx + 6} textAnchor="middle" fontSize="6" fill="#e5e7eb" fontFamily="system-ui,sans-serif" letterSpacing="1">ROLES</text>
    </svg>
  );
};

// --- PATTERN DIAGRAMS ---
// One small SVG per pattern — a visual anchor for the architectural concept.
// Style: monochrome, geometric, readable at small size. Inspired by Alexander's property diagrams.

const PatternDiagram = ({ patternId, color, size = 80 }: { patternId: string; color: string; size?: number }) => {
  const props = { fill: color, stroke: color };

  const diagrams: Record<string, React.ReactElement> = {
    conductor: (
      // Hub and spoke — a central node orchestrating surrounding nodes
      <svg viewBox="0 0 80 80" width={size} height={size}>
        <circle cx="40" cy="40" r="9" {...props} />
        {[[-18,-18],[18,-18],[18,18],[-18,18],[0,-22],[22,0],[0,22],[-22,0]].slice(0,4).map(([dx,dy],i) => (
          <g key={i}>
            <line x1="40" y1="40" x2={40+(dx!)} y2={40+(dy!)} stroke={color} strokeWidth="1.5" />
            <circle cx={40+(dx!)} cy={40+(dy!)} r="5" fill="none" stroke={color} strokeWidth="1.5" />
          </g>
        ))}
      </svg>
    ),
    'reflective-loop': (
      // Circular feedback arrow — generate, evaluate, refine
      <svg viewBox="0 0 80 80" width={size} height={size}>
        <path d="M40 14 A26 26 0 1 1 14 40" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
        <polygon points="10,32 14,44 20,34" {...props} />
        <circle cx="40" cy="40" r="5" {...props} opacity="0.4"/>
      </svg>
    ),
    'long-memory-system': (
      // Stacked layers with retrieval arrow — depth of stored context
      <svg viewBox="0 0 80 80" width={size} height={size}>
        {[54, 42, 30].map((y, i) => (
          <rect key={i} x="14" y={y} width="52" height="9" rx="2" {...props} opacity={1 - i * 0.25} />
        ))}
        <line x1="40" y1="28" x2="40" y2="12" stroke={color} strokeWidth="2" />
        <polygon points="35,17 40,8 45,17" {...props} />
      </svg>
    ),
    'balanced-stack': (
      // Seven equal columns — one per hue, all represented
      <svg viewBox="0 0 80 80" width={size} height={size}>
        {DATA.hues.map((hue, i) => (
          <rect key={hue.id} x={6 + i * 10} y="18" width="7" height="44" rx="1.5" fill={hue.hex} opacity="0.85" />
        ))}
      </svg>
    ),
    'bright-demo': (
      // Starburst / spotlight — brilliant surface, fast to appear
      <svg viewBox="0 0 80 80" width={size} height={size}>
        {[0,45,90,135,180,225,270,315].map((a, i) => {
          const r1 = 18, r2 = 34;
          const p1 = polarToXY(40, 40, r1, a);
          const p2 = polarToXY(40, 40, r2, a);
          return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={color} strokeWidth="1.5" opacity="0.5" />;
        })}
        <circle cx="40" cy="40" r="14" {...props} />
        <circle cx="40" cy="40" r="22" fill="none" stroke={color} strokeWidth="1" opacity="0.3" />
      </svg>
    ),
    'thin-wrapper': (
      // Thin border around a small core — mostly shell, little inside
      <svg viewBox="0 0 80 80" width={size} height={size}>
        <rect x="10" y="10" width="60" height="60" rx="4" fill="none" stroke={color} strokeWidth="1.5" />
        <rect x="30" y="30" width="20" height="20" rx="2" {...props} opacity="0.6" />
      </svg>
    ),
    'velocity-stack': (
      // Stacked chevrons pointing upward — momentum, speed
      <svg viewBox="0 0 80 80" width={size} height={size}>
        {[0, 1, 2].map(i => (
          <polygon key={i} points="40,8 62,28 18,28" transform={`translate(0, ${i * 18})`} {...props} opacity={1 - i * 0.28} />
        ))}
      </svg>
    ),
    'muddy-mix': (
      // Three overlapping circles — unclear boundaries, tangled ownership
      <svg viewBox="0 0 80 80" width={size} height={size}>
        <circle cx="28" cy="33" r="20" {...props} opacity="0.35" />
        <circle cx="52" cy="33" r="20" {...props} opacity="0.35" />
        <circle cx="40" cy="52" r="20" {...props} opacity="0.35" />
        <circle cx="28" cy="33" r="20" fill="none" stroke={color} strokeWidth="1" />
        <circle cx="52" cy="33" r="20" fill="none" stroke={color} strokeWidth="1" />
        <circle cx="40" cy="52" r="20" fill="none" stroke={color} strokeWidth="1" />
      </svg>
    ),
    'orchestration-pileup': (
      // Shrinking layers stacking downward — multiple systems competing
      <svg viewBox="0 0 80 80" width={size} height={size}>
        {[[10,62,8],[16,50,8],[22,38,8],[28,26,8]].map(([x,y,h], i) => (
          <rect key={i} x={x} y={y} width={80 - x * 2} height={h} rx="2" {...props} opacity={1 - i * 0.18} />
        ))}
        <line x1="40" y1="22" x2="40" y2="8" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" opacity="0.4"/>
      </svg>
    ),
    'hollow-core': (
      // Bold ring with empty center — polished shell, no substance beneath
      <svg viewBox="0 0 80 80" width={size} height={size}>
        <circle cx="40" cy="40" r="30" fill="none" stroke={color} strokeWidth="10" />
        <circle cx="40" cy="40" r="8" fill="none" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.35" />
      </svg>
    ),
    'trust-gap': (
      // Chain with a broken link — capability without oversight
      <svg viewBox="0 0 80 80" width={size} height={size}>
        <rect x="8" y="32" width="22" height="16" rx="8" fill="none" stroke={color} strokeWidth="2.5" />
        <rect x="50" y="32" width="22" height="16" rx="8" fill="none" stroke={color} strokeWidth="2.5" />
        <line x1="30" y1="40" x2="36" y2="40" stroke={color} strokeWidth="2" strokeDasharray="2 2" opacity="0.5" />
        <line x1="44" y1="40" x2="50" y2="40" stroke={color} strokeWidth="2" strokeDasharray="2 2" opacity="0.5" />
        <line x1="38" y1="28" x2="42" y2="28" stroke={color} strokeWidth="2" opacity="0.6" />
        <line x1="38" y1="52" x2="42" y2="52" stroke={color} strokeWidth="2" opacity="0.6" />
      </svg>
    ),
    'retrieval-illusion': (
      // A solid shape and its slightly-off dashed mirror — surface grounding, hidden drift
      <svg viewBox="0 0 80 80" width={size} height={size}>
        <rect x="10" y="18" width="26" height="44" rx="3" {...props} />
        <rect x="44" y="24" width="26" height="44" rx="3" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
        <line x1="36" y1="40" x2="44" y2="40" stroke={color} strokeWidth="1" strokeDasharray="2" opacity="0.4" />
      </svg>
    ),
    'durable-spine': (
      // Central column with symmetric branches — reliability and structure
      <svg viewBox="0 0 80 80" width={size} height={size}>
        <rect x="35" y="8" width="10" height="64" rx="3" {...props} />
        {[18, 32, 46].map(y => (
          <g key={y}>
            <rect x="14" y={y} width="21" height="5" rx="2" {...props} opacity="0.7" />
            <rect x="45" y={y} width="21" height="5" rx="2" {...props} opacity="0.7" />
          </g>
        ))}
      </svg>
    ),
    'cognitive-core': (
      // Central filled circle with orbiting nodes — model-centric architecture
      <svg viewBox="0 0 80 80" width={size} height={size}>
        <circle cx="40" cy="40" r="26" fill="none" stroke={color} strokeWidth="1" strokeDasharray="4 3" opacity="0.35" />
        <circle cx="40" cy="40" r="12" {...props} />
        {[0, 120, 240].map((a, i) => {
          const p = polarToXY(40, 40, 26, a);
          return <circle key={i} cx={p.x} cy={p.y} r="5" {...props} opacity="0.7" />;
        })}
      </svg>
    ),
    'governance-shell': (
      // Concentric rings — protective layer wrapped around core behavior
      <svg viewBox="0 0 80 80" width={size} height={size}>
        <circle cx="40" cy="40" r="32" fill="none" stroke={color} strokeWidth="2" />
        <circle cx="40" cy="40" r="22" fill="none" stroke={color} strokeWidth="2" opacity="0.6" />
        <circle cx="40" cy="40" r="10" {...props} opacity="0.85" />
      </svg>
    ),
    'modular-palette': (
      // Four clean separated squares — clear boundaries, replaceable parts
      <svg viewBox="0 0 80 80" width={size} height={size}>
        <rect x="8" y="8" width="27" height="27" rx="3" {...props} opacity="0.9" />
        <rect x="45" y="8" width="27" height="27" rx="3" {...props} opacity="0.7" />
        <rect x="8" y="45" width="27" height="27" rx="3" {...props} opacity="0.55" />
        <rect x="45" y="45" width="27" height="27" rx="3" {...props} opacity="0.4" />
      </svg>
    ),
  };

  return diagrams[patternId] ?? (
    <svg viewBox="0 0 80 80" width={size} height={size}>
      <circle cx="40" cy="40" r="28" fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
};

// --- RELATIONSHIP WEB ---
// SVG network diagram: selected tool at center, pairings radiating up, conflicts below.

const RelationshipWeb = ({ tool }: { tool: typeof DATA.tools[number] }) => {
  const cx = 300, cy = 155, nodeR = 15, centerR = 24;

  const pairings = tool.pairsWellWith
    .map(id => DATA.tools.find(t => t.id === id))
    .filter((t): t is typeof DATA.tools[number] => !!t);

  const conflicts = tool.conflictsWith
    .map(id => DATA.tools.find(t => t.id === id))
    .filter((t): t is typeof DATA.tools[number] => !!t);

  const centerHue = DATA.hues.find(h => h.id === tool.primaryHue);

  // Pairings spread in upper arc (−120° to +120° from top)
  const pairingR = 115;
  const pairingPositions = pairings.map((_, i) => {
    const arc = Math.min((pairings.length - 1) * 48, 240);
    const start = -arc / 2;
    const angle = pairings.length > 1 ? start + (arc / (pairings.length - 1)) * i : 0;
    const rad = angle * (Math.PI / 180);
    return { x: cx + pairingR * Math.sin(rad), y: cy - pairingR * Math.cos(rad) };
  });

  // Conflicts spread in lower arc (small, centered below)
  const conflictR = 100;
  const conflictPositions = conflicts.map((_, i) => {
    const arc = Math.min((conflicts.length - 1) * 60, 100);
    const start = 180 - arc / 2;
    const angle = conflicts.length > 1 ? start + (arc / (conflicts.length - 1)) * i : 180;
    const rad = angle * (Math.PI / 180);
    return { x: cx + conflictR * Math.sin(rad), y: cy - conflictR * Math.cos(rad) };
  });

  return (
    <svg viewBox="0 0 600 290" className="w-full" style={{ maxHeight: 220 }}>
      {/* Pairing lines */}
      {pairings.map((p, i) => (
        <line key={p.id} x1={cx} y1={cy} x2={pairingPositions[i].x} y2={pairingPositions[i].y}
          stroke="#10b981" strokeWidth="1.5" opacity="0.35" />
      ))}
      {/* Conflict lines */}
      {conflicts.map((c, i) => (
        <line key={c.id} x1={cx} y1={cy} x2={conflictPositions[i].x} y2={conflictPositions[i].y}
          stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.5" />
      ))}

      {/* Pairing nodes */}
      {pairings.map((paired, i) => {
        const hue = DATA.hues.find(h => h.id === paired.primaryHue);
        const p = pairingPositions[i];
        const labelBelow = p.y < cy;
        return (
          <g key={paired.id}>
            <circle cx={p.x} cy={p.y} r={nodeR} fill={hue?.hex ?? '#e5e7eb'} opacity="0.9" />
            <text x={p.x} y={labelBelow ? p.y + nodeR + 11 : p.y - nodeR - 4}
              textAnchor="middle" fontSize="8" fill="#4b5563" fontWeight="700"
              fontFamily="system-ui,sans-serif">
              {paired.name.split(' ')[0].substring(0, 9)}
            </text>
          </g>
        );
      })}

      {/* Conflict nodes */}
      {conflicts.map((conflict, i) => {
        const p = conflictPositions[i];
        return (
          <g key={conflict.id}>
            <circle cx={p.x} cy={p.y} r={nodeR} fill="white" stroke="#f43f5e" strokeWidth="2" />
            <line x1={p.x - 7} y1={p.y - 7} x2={p.x + 7} y2={p.y + 7} stroke="#f43f5e" strokeWidth="1.5" />
            <line x1={p.x + 7} y1={p.y - 7} x2={p.x - 7} y2={p.y + 7} stroke="#f43f5e" strokeWidth="1.5" />
            <text x={p.x} y={p.y + nodeR + 11} textAnchor="middle" fontSize="8"
              fill="#9ca3af" fontWeight="700" fontFamily="system-ui,sans-serif">
              {conflict.name.split(' ')[0].substring(0, 9)}
            </text>
          </g>
        );
      })}

      {/* Center node */}
      <circle cx={cx} cy={cy} r={centerR} fill={centerHue?.hex ?? '#6b7280'} />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
        fontSize="8" fontWeight="800" fill="white" fontFamily="system-ui,sans-serif" letterSpacing="0.5">
        {tool.name.substring(0, 4).toUpperCase()}
      </text>

      {/* Legend */}
      <g transform="translate(18,272)">
        <line x1="0" y1="5" x2="14" y2="5" stroke="#10b981" strokeWidth="1.5" />
        <text x="19" y="9" fontSize="8" fill="#9ca3af" fontFamily="system-ui,sans-serif">Pairs with</text>
      </g>
      {conflicts.length > 0 && (
        <g transform="translate(110,272)">
          <line x1="0" y1="5" x2="14" y2="5" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4 2" />
          <text x="19" y="9" fontSize="8" fill="#9ca3af" fontFamily="system-ui,sans-serif">Conflicts</text>
        </g>
      )}
    </svg>
  );
};

// --- TOOL INDEX CARD (compact reference mode) ---

const ToolIndexCard = ({
  tool, onClick, isSelected, onToggleSelect, blendFull,
}: {
  tool: typeof DATA.tools[number];
  onClick: (tool: typeof DATA.tools[number]) => void;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  blendFull?: boolean;
}) => {
  const primaryHue = DATA.hues.find(h => h.id === tool.primaryHue)!;
  const secondaryHue = tool.secondaryHue ? DATA.hues.find(h => h.id === tool.secondaryHue) : null;
  const lvl: Record<string, number> = { low: 1, medium: 2, high: 3 };

  return (
    <div
      className={`flex items-center gap-4 px-4 py-2.5 bg-white border rounded-xl cursor-pointer hover:shadow-sm transition-all group
        ${isSelected ? '' : 'border-gray-100 hover:border-gray-200'}`}
      style={isSelected ? { backgroundColor: `${primaryHue.hex}0d`, borderColor: primaryHue.hex } : undefined}
      onClick={() => onClick(tool)}
    >
      {/* Name + category */}
      <div className="w-44 min-w-0 shrink-0">
        <p className="text-sm font-bold text-gray-900 group-hover:text-gray-800 transition-colors truncate leading-tight">{tool.name}</p>
        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{tool.category}</p>
      </div>

      {/* Hue dots */}
      <div className="flex -space-x-1 shrink-0">
        <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: primaryHue.hex }} title={primaryHue.name} />
        {secondaryHue && <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: secondaryHue.hex }} title={secondaryHue.name} />}
      </div>

      {/* Complexity */}
      <div className="flex flex-col gap-0.5 shrink-0 w-20">
        <p className="text-[10px] uppercase text-gray-400 font-black tracking-wider">Complexity</p>
        <div className="flex gap-0.5">{[1,2,3].map(i => <div key={i} className={`w-4 h-1 rounded-full ${i <= lvl[tool.complexityAdded] ? 'bg-amber-400' : 'bg-gray-100'}`} />)}</div>
      </div>

      {/* Trust */}
      <div className="flex flex-col gap-0.5 shrink-0 w-16">
        <p className="text-[10px] uppercase text-gray-400 font-black tracking-wider">Trust</p>
        <div className="flex gap-0.5">{[1,2,3].map(i => <div key={i} className={`w-4 h-1 rounded-full ${i <= lvl[tool.trustContribution] ? 'bg-teal-400' : 'bg-gray-100'}`} />)}</div>
      </div>

      {/* Pattern chips */}
      <div className="flex gap-1.5 flex-wrap flex-1 min-w-0">
        {tool.patterns.map(pId => {
          const pat = DATA.patterns.find(p => p.id === pId);
          if (!pat) return null;
          const hue = DATA.hues.find(h => h.id === pat.hues[0]);
          return (
            <div key={pId} title={pat.name} className="group/chip relative shrink-0 cursor-help" tabIndex={0}>
              <PatternDiagram patternId={pId} color={hue?.hex ?? '#6b7280'} size={22} />
              <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap bg-gray-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/chip:opacity-100 group-focus-within/chip:opacity-100 transition-opacity z-10">
                {pat.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Conflicts */}
      <div className="shrink-0 w-20 text-right">
        {tool.conflictsWith.length > 0
          ? <span className="text-[10px] font-black uppercase text-rose-400">{tool.conflictsWith.length} conflict{tool.conflictsWith.length > 1 ? 's' : ''}</span>
          : <span className="text-[10px] font-black uppercase text-emerald-500">clean</span>
        }
      </div>

      {/* Maturity */}
      <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter shrink-0
        ${tool.maturity === 'production' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
        {tool.maturity === 'production' ? 'prod' : 'emerging'}
      </span>

      {/* Add button */}
      <button
        onClick={e => { e.stopPropagation(); onToggleSelect(tool.id); }}
        title={blendFull && !isSelected ? '5/5 — remove a tool to add another' : undefined}
        className={`p-1.5 rounded-lg border transition-all shrink-0 ${isSelected ? 'text-white' : blendFull ? 'bg-gray-50 border-gray-100 text-gray-200 cursor-not-allowed' : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-600'}`}
        style={isSelected ? { backgroundColor: primaryHue.hex, borderColor: primaryHue.hex } : undefined}
      >
        {isSelected ? <Layers size={12} /> : <Plus size={12} />}
      </button>
    </div>
  );
};

// --- TOOL CARD ---

const ToolCard = ({
  tool,
  onClick,
  isSelected,
  onToggleSelect,
  blendFull,
}: {
  tool: typeof DATA.tools[number];
  onClick: (tool: typeof DATA.tools[number]) => void;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  blendFull?: boolean;
}) => {
  const primaryHue = DATA.hues.find(h => h.id === tool.primaryHue)!;
  const secondaryHue = tool.secondaryHue ? DATA.hues.find(h => h.id === tool.secondaryHue) : null;

  return (
    <div
      className={`group border rounded-xl p-5 transition-all cursor-pointer flex flex-col h-full
        ${isSelected ? 'border-transparent scale-[1.02]' : 'border-gray-100 shadow-sm hover:shadow-md'}`}
      style={{
        backgroundColor: isSelected ? `${primaryHue.hex}0d` : `${primaryHue.hex}06`,
        boxShadow: isSelected ? `0 0 0 2px ${primaryHue.hex}, 0 4px 6px -1px rgb(0 0 0 / 0.1)` : undefined,
      }}
      onClick={() => onClick(tool)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-gray-900 leading-tight group-hover:text-gray-800 transition-colors">{tool.name}</h3>
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{tool.category}</p>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onToggleSelect(tool.id); }}
          title={blendFull && !isSelected ? '5/5 — remove a tool to add another' : undefined}
          className={`p-1.5 rounded-lg border transition-all ${isSelected ? 'text-white shadow-lg' : blendFull ? 'bg-gray-50 border-gray-100 text-gray-200 cursor-not-allowed' : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300'}`}
          style={isSelected ? { backgroundColor: primaryHue.hex, borderColor: primaryHue.hex } : undefined}
        >
          {isSelected ? <Layers size={14} /> : <Plus size={14} />}
        </button>
      </div>

      <p className="text-xs text-gray-500 mb-4 flex-1 line-clamp-3 leading-relaxed">{tool.description}</p>

      {/* Pattern chips — visual anchors for which patterns this tool participates in */}
      {tool.patterns.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-4">
          {tool.patterns.map(pId => {
            const pat = DATA.patterns.find(p => p.id === pId);
            if (!pat) return null;
            const hue = DATA.hues.find(h => h.id === pat.hues[0]);
            return (
              <div key={pId} title={pat.name} className="cursor-help hover:scale-110 transition-transform">
                <PatternDiagram patternId={pId} color={hue?.hex ?? '#6b7280'} size={28} />
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
        <div className="flex -space-x-1.5">
          <div className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: primaryHue.hex }} title={primaryHue.name} />
          {secondaryHue && (
            <div className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: secondaryHue.hex }} title={secondaryHue.name} />
          )}
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter
          ${tool.maturity === 'production' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
          {tool.maturity}
        </span>
      </div>
    </div>
  );
};

// --- PATTERN CARD ---

const PatternCard = ({ pattern }: { pattern: typeof DATA.patterns[number] }) => {
  const typeStyle = PATTERN_TYPE_STYLES[pattern.type] || 'text-gray-500 bg-gray-50 border-gray-100';
  const primaryHue = DATA.hues.find(h => h.id === pattern.hues[0]);
  const diagramColor = primaryHue?.hex ?? '#6b7280';
  const harmony = computeHarmony(pattern.hues);

  return (
    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">

      {/* Visual header — diagram + wheel side by side */}
      <div className="flex items-stretch border-b border-gray-50" style={{ backgroundColor: `${diagramColor}08` }}>

        {/* Pattern diagram */}
        <div className="flex items-center justify-center p-6 flex-1">
          <PatternDiagram patternId={pattern.id} color={diagramColor} />
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-100 self-stretch" />

        {/* Color wheel + harmony */}
        <div className="flex flex-col items-center justify-center gap-3 p-5 w-36 shrink-0">
          <ColorWheelMini hues={pattern.hues} />
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">
              {harmony.label}
            </p>
            <p className="text-[10px] text-gray-400 leading-snug font-medium">
              {harmony.meaning}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-5 p-7">
        {/* Name + badges */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-black text-gray-900 leading-tight">{pattern.name}</h3>
          <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest border shrink-0 ${typeStyle}`}>
            {pattern.type.replace('-', ' ')}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed font-medium">{pattern.description}</p>

        {/* Strengths / Weaknesses */}
        {(pattern.strengths?.length > 0 || pattern.weaknesses?.length > 0) && (
          <div className="grid grid-cols-2 gap-4 pt-2">
            {pattern.strengths?.length > 0 && (
              <div>
                <p className="text-[10px] uppercase font-black text-emerald-600 tracking-widest mb-2">Strengths</p>
                <ul className="space-y-1">
                  {pattern.strengths.map(s => (
                    <li key={s} className="flex items-start gap-1.5 text-xs text-gray-600 font-medium">
                      <CheckCircle2 size={11} className="text-emerald-400 shrink-0 mt-0.5" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {pattern.weaknesses?.length > 0 && (
              <div>
                <p className="text-[10px] uppercase font-black text-rose-500 tracking-widest mb-2">Weaknesses</p>
                <ul className="space-y-1">
                  {pattern.weaknesses.map(w => (
                    <li key={w} className="flex items-start gap-1.5 text-xs text-gray-600 font-medium">
                      <XCircle size={11} className="text-rose-300 shrink-0 mt-0.5" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Watch for */}
        {pattern.watchFor?.length > 0 && (
          <div className="pt-3 border-t border-gray-50">
            <p className="text-[10px] uppercase font-black text-amber-600 tracking-widest mb-2 flex items-center gap-1.5">
              <Eye size={10} /> Watch For
            </p>
            <div className="flex flex-wrap gap-1.5">
              {pattern.watchFor.map(w => (
                <span key={w} className="text-[10px] px-2 py-0.5 bg-amber-50 border border-amber-100 text-amber-800 rounded-full font-medium">
                  {w}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- DIAGRAM VIEW ---

const MetaphorBridgeDiagram = () => {
  const pairs = [
    { left: 'Pigment',       right: 'Tool',                color: '#C84C3A' },
    { left: 'Primary Hue',   right: 'Architectural Role',  color: '#4A6FA5' },
    { left: 'Color Wheel',   right: 'Role Spectrum',       color: '#2D9B8A' },
    { left: 'Harmony',       right: 'Stack Composition',   color: '#E8A838' },
    { left: 'Analogous',     right: 'Adjacent Roles',      color: '#7C5CBF' },
    { left: 'Complementary', right: 'Opposing Roles',      color: '#D4567E' },
    { left: 'Composition',   right: 'Architecture',        color: '#2ECC71' },
    { left: 'Muddy Mix',     right: 'Anti-Pattern',        color: '#94a3b8' },
  ];
  const rowH = 36, startY = 46, svgH = startY + pairs.length * rowH + 12;
  return (
    <svg viewBox={`0 0 500 ${svgH}`} className="w-full">
      <defs>
        <marker id="mb-arr" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill="#d1d5db" />
        </marker>
      </defs>
      <text x="115" y="20" textAnchor="middle" fontSize="7.5" fontWeight="900" fill="#d1d5db" fontFamily="system-ui,sans-serif" letterSpacing="2">COLOR THEORY</text>
      <text x="375" y="20" textAnchor="middle" fontSize="7.5" fontWeight="900" fill="#d1d5db" fontFamily="system-ui,sans-serif" letterSpacing="2">AI ARCHITECTURE</text>
      <line x1="10" y1="28" x2="220" y2="28" stroke="#f3f4f6" strokeWidth="1" />
      <line x1="280" y1="28" x2="490" y2="28" stroke="#f3f4f6" strokeWidth="1" />
      {pairs.map((p, i) => {
        const cy = startY + i * rowH + rowH / 2;
        return (
          <g key={p.left}>
            <circle cx="22" cy={cy} r="5" fill={p.color} />
            <text x="36" y={cy + 4} fontSize="11" fontWeight="700" fill="#374151" fontFamily="system-ui,sans-serif">{p.left}</text>
            <line x1="228" y1={cy} x2="272" y2={cy} stroke="#e5e7eb" strokeWidth="1.5" markerEnd="url(#mb-arr)" />
            <text x="284" y={cy + 4} fontSize="11" fontWeight="700" fill="#4f46e5" fontFamily="system-ui,sans-serif">{p.right}</text>
          </g>
        );
      })}
    </svg>
  );
};

const DataModelDiagram = () => {
  const hH = 30, fH = 17, pad = 10;
  type E = { label: string; count: string; color: string; x: number; y: number; w: number; fields: string[] };
  const entities: E[] = [
    { label: 'HUE',     count: `×${DATA.hues.length}`,     color: '#64748b', x: 10,  y: 105, w: 150,
      fields: ['id', 'name', 'hex', 'description'] },
    { label: 'TOOL',    count: `×${DATA.tools.length}`,    color: '#4f46e5', x: 265, y: 10,  w: 180,
      fields: ['id, name, category', 'primaryHue', 'secondaryHue', 'patterns[ ]', 'pairsWellWith[ ]', 'conflictsWith[ ]'] },
    { label: 'PATTERN', count: `×${DATA.patterns.length}`, color: '#d97706', x: 545, y: 105, w: 150,
      fields: ['id, name, type', 'hues[ ]', 'strengths[ ]', 'weaknesses[ ]', 'watchFor[ ]'] },
    { label: 'RECIPE',  count: `×${DATA.recipes.length}`,  color: '#059669', x: 265, y: 250, w: 180,
      fields: ['id, name', 'tools[ ]', 'patternIds[ ]', 'useCase', 'whyItWorks[ ]'] },
  ];
  const nh = (e: E) => hH + e.fields.length * fH + pad * 2;
  return (
    <svg viewBox="0 0 710 415" className="w-full">
      <defs>
        <marker id="dm-arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#9ca3af" />
        </marker>
      </defs>
      {/* TOOL → HUE */}
      <line x1="265" y1="88" x2="160" y2="158" stroke="#cbd5e1" strokeWidth="1.5" markerEnd="url(#dm-arr)" />
      <text x="198" y="109" textAnchor="middle" fontSize="8" fill="#cbd5e1" fontFamily="system-ui,sans-serif">primaryHue</text>
      {/* TOOL → PATTERN */}
      <line x1="445" y1="88" x2="545" y2="158" stroke="#cbd5e1" strokeWidth="1.5" markerEnd="url(#dm-arr)" />
      <text x="503" y="109" textAnchor="middle" fontSize="8" fill="#cbd5e1" fontFamily="system-ui,sans-serif">patterns[ ]</text>
      {/* RECIPE → TOOL */}
      <line x1="355" y1="250" x2="355" y2="168" stroke="#cbd5e1" strokeWidth="1.5" markerEnd="url(#dm-arr)" />
      <text x="370" y="213" fontSize="8" fill="#cbd5e1" fontFamily="system-ui,sans-serif">tools[ ]</text>
      {/* RECIPE → PATTERN */}
      <line x1="445" y1="322" x2="617" y2="252" stroke="#cbd5e1" strokeWidth="1.5" markerEnd="url(#dm-arr)" />
      <text x="546" y="300" fontSize="8" fill="#cbd5e1" fontFamily="system-ui,sans-serif">patternIds[ ]</text>
      {/* TOOL self-loop (pairs/conflicts) */}
      <path d="M 318,10 C 302,-28 418,-28 402,10" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 2" markerEnd="url(#dm-arr)" />
      <text x="360" y="-8" textAnchor="middle" fontSize="8" fill="#cbd5e1" fontFamily="system-ui,sans-serif">pairs / conflicts</text>
      {/* PATTERN → HUE (hues[]) — bottom arc */}
      <path d="M 617,248 C 617,396 85,396 85,222" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 2" markerEnd="url(#dm-arr)" />
      <text x="355" y="408" textAnchor="middle" fontSize="8" fill="#cbd5e1" fontFamily="system-ui,sans-serif">pattern.hues[ ]</text>
      {/* Nodes */}
      {entities.map(e => {
        const h = nh(e);
        return (
          <g key={e.label}>
            <rect x={e.x} y={e.y} width={e.w} height={h} rx="8" fill="white" stroke="#e5e7eb" strokeWidth="1.5" />
            <rect x={e.x + 1.5} y={e.y + 1.5} width={e.w - 3} height={h - 3} rx="6.5" fill={e.color} opacity="0.05" />
            <text x={e.x + 10} y={e.y + 20} fontSize="10" fontWeight="900" fill={e.color} fontFamily="system-ui,sans-serif" letterSpacing="0.8">{e.label}</text>
            <text x={e.x + e.w - 10} y={e.y + 20} textAnchor="end" fontSize="9" fontWeight="700" fill={e.color} fontFamily="system-ui,sans-serif" opacity="0.5">{e.count}</text>
            <line x1={e.x + 8} y1={e.y + hH} x2={e.x + e.w - 8} y2={e.y + hH} stroke={e.color} strokeWidth="0.75" opacity="0.2" />
            {e.fields.map((field, fi) => (
              <text key={fi} x={e.x + 14} y={e.y + hH + pad + fi * fH + 12}
                fontSize="8.5" fill="#9ca3af" fontFamily="'Courier New', monospace">
                {field}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
};

const UserLoopDiagram = () => {
  const cx = 350, cy = 185, r = 128, nodeR = 42;
  const nodes = [
    { label: 'BROWSE',  sub: ['filter', 'search · hue'],   color: '#6366f1', angle: 270 },
    { label: 'BLEND',   sub: ['select', 'up to 5 tools'],  color: '#8b5cf6', angle: 342 },
    { label: 'ANALYZE', sub: ['harmony', 'health · score'], color: '#f59e0b', angle: 54  },
    { label: 'EXPORT',  sub: ['manifest', 'share · URL'],   color: '#10b981', angle: 126 },
    { label: 'RETURN',  sub: ['saved', 'blend · iterate'],  color: '#14b8a6', angle: 198 },
  ];
  const pos = (angle: number) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };
  return (
    <svg viewBox="0 0 700 370" className="w-full" style={{ maxHeight: 370 }}>
      <defs>
        <marker id="ul-arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#d1d5db" />
        </marker>
      </defs>
      {/* Edges */}
      {nodes.map((_, i) => {
        const from = pos(nodes[i].angle);
        const to   = pos(nodes[(i + 1) % nodes.length].angle);
        const dx = to.x - from.x, dy = to.y - from.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const ux = dx / len, uy = dy / len;
        return (
          <line key={i}
            x1={from.x + ux * nodeR} y1={from.y + uy * nodeR}
            x2={to.x   - ux * nodeR} y2={to.y   - uy * nodeR}
            stroke="#e5e7eb" strokeWidth="2" markerEnd="url(#ul-arr)" />
        );
      })}
      {/* Nodes */}
      {nodes.map(n => {
        const p = pos(n.angle);
        return (
          <g key={n.label}>
            <circle cx={p.x} cy={p.y} r={nodeR} fill={n.color} opacity="0.08" />
            <circle cx={p.x} cy={p.y} r={nodeR} fill="none" stroke={n.color} strokeWidth="2" />
            <text x={p.x} y={p.y - 7}  textAnchor="middle" fontSize="9"   fontWeight="900" fill={n.color}   fontFamily="system-ui,sans-serif" letterSpacing="0.5">{n.label}</text>
            <text x={p.x} y={p.y + 5}  textAnchor="middle" fontSize="7.5" fontWeight="600" fill="#9ca3af"   fontFamily="system-ui,sans-serif">{n.sub[0]}</text>
            <text x={p.x} y={p.y + 16} textAnchor="middle" fontSize="7"               fill="#c4c9d4"   fontFamily="system-ui,sans-serif">{n.sub[1]}</text>
          </g>
        );
      })}
      {/* Center */}
      <text x={cx} y={cy - 5}  textAnchor="middle" fontSize="9"  fontWeight="900" fill="#e5e7eb" fontFamily="system-ui,sans-serif">THE</text>
      <text x={cx} y={cy + 7}  textAnchor="middle" fontSize="9"  fontWeight="900" fill="#e5e7eb" fontFamily="system-ui,sans-serif">LOOP</text>
    </svg>
  );
};

// --- MAIN PAGE ---

export default function ArchitecturalChromatics() {
  const [search, setSearch] = useState('');
  const [activeHue, setActiveHue] = useState<string | null>(null);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [inspectedTool, setInspectedTool] = useState<typeof DATA.tools[number] | null>(null);
  const [view, setView] = useState<'landscape' | 'recipes' | 'diagram'>('landscape');
  const [compactMode, setCompactMode] = useState(false);
  const [blendCopied, setBlendCopied] = useState(false);
  const [pendingBlendRecipe, setPendingBlendRecipe] = useState<string | null>(null);
  const [activeDimensions, setActiveDimensions] = useState<string[]>([]);
  const [soWhatOpen, setSoWhatOpen] = useState(() => {
    try { return localStorage.getItem('ac-sowhat-collapsed') !== 'true'; } catch { return true; }
  });

  // Restore blend from URL or localStorage on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const blendParam = params.get('blend');
    if (blendParam) {
      const ids = blendParam.split(',').filter(id => DATA.tools.some(t => t.id === id));
      if (ids.length > 0) { setSelectedTools(ids.slice(0, 5)); return; }
    }
    try {
      const saved = localStorage.getItem('ac-blend');
      if (saved) {
        const ids = JSON.parse(saved) as string[];
        const valid = ids.filter((id: string) => DATA.tools.some(t => t.id === id));
        if (valid.length > 0) setSelectedTools(valid.slice(0, 5));
      }
    } catch {}
  }, []);

  // Escape key closes tool modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setInspectedTool(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Sync blend to URL + localStorage whenever it changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (selectedTools.length > 0) {
      params.set('blend', selectedTools.join(','));
      localStorage.setItem('ac-blend', JSON.stringify(selectedTools));
    } else {
      params.delete('blend');
      localStorage.removeItem('ac-blend');
    }
    const query = params.toString();
    window.history.replaceState({}, '', window.location.pathname + (query ? '?' + query : ''));
  }, [selectedTools]);

  const filteredTools = useMemo(() => {
    return DATA.tools.filter(tool => {
      const matchesSearch =
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.toLowerCase().includes(search.toLowerCase()) ||
        tool.category.toLowerCase().includes(search.toLowerCase());
      const matchesHue = !activeHue || tool.primaryHue === activeHue || tool.secondaryHue === activeHue;
      const matchesDimensions = activeDimensions.every(dim => DIM_FILTER[dim]?.(tool) ?? true);
      return matchesSearch && matchesHue && matchesDimensions;
    });
  }, [search, activeHue, activeDimensions]);

  const toggleToolSelection = (toolId: string) => {
    setSelectedTools(prev =>
      prev.includes(toolId) ? prev.filter(id => id !== toolId) : prev.length < 5 ? [...prev, toolId] : prev
    );
  };

  const mixAnalytics = useMemo(() => {
    if (selectedTools.length === 0) return null;
    const tools = DATA.tools.filter(t => selectedTools.includes(t.id));
    const hues = Array.from(new Set(tools.flatMap(t => [t.primaryHue, t.secondaryHue].filter(Boolean)))) as string[];

    const warnings: { type: string; msg: string }[] = [];
    const conflicts: string[] = [];

    tools.forEach(t => {
      t.conflictsWith.forEach(conflictId => {
        if (selectedTools.includes(conflictId)) {
          const other = DATA.tools.find(c => c.id === conflictId);
          if (other && !conflicts.includes(`${t.name} + ${other.name}`) && !conflicts.includes(`${other.name} + ${t.name}`)) {
            conflicts.push(`${t.name} + ${other.name}`);
          }
        }
      });
    });

    if (!hues.includes('trust')) warnings.push({ type: 'Trust Gap', msg: 'No governance or observability layer.' });
    if (tools.filter(t => ['Framework', 'Orchestrator', 'Workflow Engine'].includes(t.category)).length > 1) {
      warnings.push({ type: 'Orchestration Pileup', msg: 'Multiple flow control layers may conflict.' });
    }

    // Complexity + trust scores (1=low, 2=medium, 3=high)
    const lvl: Record<string, number> = { low: 1, medium: 2, high: 3 };
    const complexityScore = tools.reduce((s, t) => s + (lvl[t.complexityAdded] ?? 1), 0);
    const trustScore = tools.reduce((s, t) => s + (lvl[t.trustContribution] ?? 1), 0);
    const maxScore = tools.length * 3;

    // Best pattern match — which named pattern do the most selected tools share?
    const bestPattern = DATA.patterns
      .map(p => ({ pattern: p, score: tools.filter(t => t.patterns.includes(p.id)).length }))
      .filter(e => e.score > 0)
      .sort((a, b) => b.score - a.score)[0]?.pattern ?? null;

    // Harmony of the full composition
    const harmony = computeHarmony(hues);

    return {
      dominantHues: hues,
      warnings,
      conflicts,
      complexityScore,
      trustScore,
      maxScore,
      bestPattern,
      harmony,
    };
  }, [selectedTools]);

  const saveBlend = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setBlendCopied(true);
      setTimeout(() => setBlendCopied(false), 2000);
    });
  };

  const exportManifest = () => {
    if (!mixAnalytics || selectedTools.length === 0) return;
    const tools = DATA.tools.filter(t => selectedTools.includes(t.id));
    const lines = [
      '# Stack Manifest — Architectural Chromatics',
      '',
      `**Composition:** ${tools.map(t => t.name).join(' + ')}`,
      `**Harmony:** ${mixAnalytics.harmony.label} — ${mixAnalytics.harmony.meaning}`,
      `**Complexity:** ${mixAnalytics.complexityScore} / ${mixAnalytics.maxScore}  |  **Trust:** ${mixAnalytics.trustScore} / ${mixAnalytics.maxScore}`,
      mixAnalytics.bestPattern
        ? `**Closest Pattern:** ${mixAnalytics.bestPattern.name} — ${mixAnalytics.bestPattern.description}`
        : '',
      '',
      '## Tools',
      '',
      ...tools.flatMap(t => [
        `### ${t.name}`,
        `*${t.category} · ${t.maturity} · complexity: ${t.complexityAdded} · trust: ${t.trustContribution}*`,
        '',
        t.description,
        '',
        t.pairsWellWith.length > 0
          ? `**Pairs well with:** ${t.pairsWellWith.map(id => DATA.tools.find(tt => tt.id === id)?.name ?? id).join(', ')}`
          : '',
        t.conflictsWith.length > 0
          ? `**Conflicts with:** ${t.conflictsWith.map(id => DATA.tools.find(tt => tt.id === id)?.name ?? id).join(', ')}`
          : '',
        `**Note:** ${t.notes}`,
        '',
      ]),
      '## Health',
      '',
      ...(mixAnalytics.conflicts.length > 0 ? [`**Conflicts:** ${mixAnalytics.conflicts.join(', ')}`] : []),
      ...mixAnalytics.warnings.map(w => `**${w.type}:** ${w.msg}`),
      (mixAnalytics.conflicts.length === 0 && mixAnalytics.warnings.length === 0)
        ? '✓ High Resonance — no conflicts or warnings detected.'
        : '',
      '',
      '---',
      `*Architectural Chromatics v${DATA.site.version} · thejambot.com*`,
    ].filter(line => line !== undefined);

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stack-manifest-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-gray-900 font-sans selection:bg-indigo-100 pb-32">

      {/* DOMAIN NAV */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex">
          <a href="#/" className="px-4 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 border-gray-900 text-gray-900 -mb-px">
            AI Stack
          </a>
          <a href="#/data-engineering" className="px-4 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 border-transparent text-gray-400 hover:text-gray-600 transition-colors -mb-px">
            Data Engineering
          </a>
          <a href="#/agent-harness" className="px-4 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 border-transparent text-gray-400 hover:text-gray-600 transition-colors -mb-px">
            Agent Harness
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-8 pb-6 px-6 border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-1">
              {DATA.hues.slice(0, 3).map(h => (
                <div key={h.id} className="w-1.5 h-4 rounded-full" style={{ backgroundColor: h.hex }} />
              ))}
            </div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
              Architectural Chromatics v{DATA.site.version}
            </span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-3 tracking-tight max-w-4xl">
            Modern systems are{' '}
            <span style={{ color: '#C84C3A' }}>Chromatic.</span>
          </h1>
          <p className="text-base text-gray-500 font-medium mb-5 max-w-2xl leading-snug">
            A reference tool for AI stack composition. How things combine matters more than what they are individually.
          </p>
          <div className="flex flex-wrap gap-2" role="tablist">
            <button
              role="tab"
              aria-selected={view === 'landscape'}
              onClick={() => setView('landscape')}
              className={`px-5 py-2 rounded-lg font-black text-xs uppercase tracking-widest transition-colors
                ${view === 'landscape' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}
            >
              Landscape
            </button>
            <button
              role="tab"
              aria-selected={view === 'recipes'}
              onClick={() => setView('recipes')}
              className={`px-5 py-2 rounded-lg font-black text-xs uppercase tracking-widest transition-colors
                ${view === 'recipes' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}
            >
              Recipes
            </button>
            <button
              role="tab"
              aria-selected={view === 'diagram'}
              onClick={() => setView('diagram')}
              className={`px-5 py-2 rounded-lg font-black text-xs uppercase tracking-widest transition-colors
                ${view === 'diagram' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}
            >
              Context
            </button>
          </div>
        </div>
      </section>

      {/* PLAIN ENGLISH — so what / why this framing matters */}
      <section className="bg-[#fafafa] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">

          {/* Collapse toggle */}
          <button
            onClick={() => setSoWhatOpen(o => {
              const next = !o;
              try { localStorage.setItem('ac-sowhat-collapsed', next ? 'false' : 'true'); } catch {}
              return next;
            })}
            className="w-full flex items-center justify-between py-5 text-left group"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-gray-600 transition-colors">
              The Palette, in Plain English
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 group-hover:text-gray-500 transition-colors">
              {soWhatOpen ? '↑ collapse' : '↓ expand'}
            </span>
          </button>

          {soWhatOpen && (
            <div className="pb-16 space-y-16">

              {/* Block 1 — the vocabulary problem */}
              <div className="max-w-3xl">
                <p className="text-xl font-black text-gray-900 mb-4 leading-snug">
                  There's a vocabulary problem at the center of AI stack design.
                </p>
                <p className="text-base text-gray-600 leading-relaxed mb-3">
                  When a system misbehaves in production, the diagnostic conversation usually stalls — not because the answer is hard to find, but because there's no agreed framework for describing what went wrong.
                </p>
                <p className="text-base text-gray-600 leading-relaxed">
                  Color theory gives you that framework. Not because AI and paint have anything in common, but because the structural problems are the same: too many things doing the same job, whole categories of responsibility left uncovered, or combinations that look right but produce mud.
                </p>
              </div>

              {/* Block 2 — hues are roles, not brands */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-5">
                  Hues are roles, not brands
                </p>
                <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-3xl">
                  The seven hues aren't tool categories — they're categories of <em>architectural responsibility</em>. Every production AI system needs most of them covered, in some form, by something.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl">
                  {([
                    { id: 'intent',    plain: 'Who frames the problem and shapes what the model is trying to do' },
                    { id: 'logic',     plain: 'Who controls the flow — retries, branching, sequencing' },
                    { id: 'cognition', plain: 'Who reasons and generates' },
                    { id: 'memory',    plain: 'Who holds context across time and retrieval' },
                    { id: 'interface', plain: 'Who faces the user' },
                    { id: 'velocity',  plain: 'Who keeps delivery moving' },
                    { id: 'trust',     plain: "Who verifies the system is doing what you think it's doing" },
                  ] as { id: string; plain: string }[]).map(({ id, plain }) => {
                    const hue = DATA.hues.find(h => h.id === id);
                    return (
                      <div key={id} className="flex items-start gap-3 p-3 border border-gray-100 rounded-xl shadow-sm" style={{ backgroundColor: hue?.hex ? `${hue.hex}09` : 'white' }}>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-wider mb-1" style={{ color: hue?.hex }}>{hue?.name}</p>
                          <p className="text-xs text-gray-500 leading-snug">{plain}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex items-center p-3 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                    <p className="text-xs text-gray-500 italic leading-snug">
                      A stack heavy on Cognition and Velocity with nothing in Trust isn't missing a tool — it's missing a <em>conversation</em>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Block 3 — coverage is a diagnostic */}
              <div className="flex flex-col lg:flex-row gap-12 items-start">
                <div className="flex-1 max-w-xl">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-5">
                    Coverage is a diagnostic
                  </p>
                  <p className="text-base text-gray-600 leading-relaxed mb-3">
                    When you plot your current stack against the wheel, the gaps are the story. Not "we need more tools" — the opposite. The gaps tell you which architectural responsibilities have no owner.
                  </p>
                  <p className="text-base text-gray-600 leading-relaxed">
                    A RAG system with no Trust layer means nobody is watching whether retrieval is actually grounding the model. A workflow with no Logic layer means the model is making control-flow decisions it shouldn't. These are the most common failure modes in production AI.
                  </p>
                </div>
                <div className="flex gap-10 items-end shrink-0">
                  <div className="flex flex-col items-center gap-3">
                    <ColorWheelMini hues={['cognition', 'velocity', 'interface']} />
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase tracking-wider text-gray-600">Typical Early Stack</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">3 of 7 roles covered</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <ColorWheelMini hues={['intent', 'logic', 'cognition', 'memory', 'trust', 'interface']} />
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase tracking-wider text-gray-600">Production-Ready</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">6 of 7 roles covered</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Block 4 — combinations have names */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-5">
                  Combinations have names
                </p>
                <p className="text-base text-gray-600 leading-relaxed mb-3 max-w-3xl">
                  Two orchestrators in the same stack is an <em>Orchestration Pileup</em>. A polished UI over a hollow backend is a <em>Hollow Core</em>. Strong cognition with a generate-evaluate-refine loop is a <em>Reflective Loop</em>. Combinations have consequences.
                </p>
                <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-3xl">
                  The patterns in this tool are recurring combinations with names — because they show up constantly. Naming them is what lets you say "we're building a Bright Demo, not a Durable Spine" and have that mean something to the room.
                </p>
                <div className="flex flex-wrap gap-4">
                  {(['reflective-loop', 'hollow-core', 'durable-spine'] as string[]).map(patId => {
                    const pat = DATA.patterns.find(p => p.id === patId);
                    const hue = DATA.hues.find(h => h.id === pat?.hues[0]);
                    const typeStyle = PATTERN_TYPE_STYLES[pat?.type ?? 'foundational'];
                    return pat ? (
                      <div key={patId} className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm">
                        <PatternDiagram patternId={patId} color={hue?.hex ?? '#6b7280'} size={44} />
                        <div>
                          <p className="text-xs font-black text-gray-800 mb-1.5">{pat.name}</p>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${typeStyle}`}>
                            {pat.type}
                          </span>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Bridge — latency acknowledgment */}
              <p className="text-sm text-gray-400 italic leading-relaxed max-w-2xl">
                A muddy color mix is obvious in seconds. A muddy stack takes 18 months to reveal itself. That gap is exactly why naming the patterns matters before you build.
              </p>

              {/* Block 5 — the payoff */}
              <div className="max-w-3xl">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-5">
                  The payoff
                </p>
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <p className="text-sm text-gray-500 font-mono leading-relaxed mb-4">
                    You're at a client site. Someone asks why the system keeps drifting off-task.
                    The stack is Vercel + OpenAI + Supabase. Beautiful demo. No Logic, no Trust.
                  </p>
                  <p className="text-base text-gray-800 font-black leading-relaxed">
                    Hollow Core. The hues name it before you ask another question.
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed mt-4">
                    You don't need to enumerate every missing component. You just need to know which hues are absent and which pattern you're looking at. The rest follows.
                  </p>
                </div>
              </div>

            </div>
          )}
        </div>
      </section>

      {/* PALETTE EXPLAINER — non-sticky, educational */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="flex flex-col lg:flex-row items-start gap-14">

            {/* Wheel + legend */}
            <div className="shrink-0 flex flex-col items-center gap-5">
              <ColorWheelLabeled activeHue={activeHue} />
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-gray-400">
                  <div className="w-6 h-px bg-emerald-400" />
                  Adjacent — reinforces
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-gray-400">
                  <svg width="24" height="2"><line x1="0" y1="1" x2="24" y2="1" stroke="#f87171" strokeWidth="1.5" strokeDasharray="4 2" /></svg>
                  Opposite — tensions
                </div>
              </div>
            </div>

            {/* Explanation + hue chips */}
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-5">
                The Palette — 7 Architectural Roles
              </p>
              <p className="text-base text-gray-600 leading-relaxed mb-3 max-w-2xl">
                Every tool in an AI system plays an architectural role. These seven roles — mapped as hues on a color wheel — describe what a tool <em>does</em> in a stack, not what it <em>is</em>.
              </p>
              <p className="text-sm text-gray-500 leading-relaxed mb-10 max-w-2xl">
                <strong className="text-gray-700 font-black">Adjacent hues reinforce each other</strong> — they share concerns and compose naturally into cohesive layers.{' '}
                <strong className="text-gray-700 font-black">Opposite hues create productive tension</strong> — each covers the other's blind spots.
                A stack built from a single hue runs deep but fragile. Harmonic coverage across multiple roles builds resilience.
              </p>

              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                {DATA.hues.map(hue => (
                  <button
                    key={hue.id}
                    onClick={() => setActiveHue(activeHue === hue.id ? null : hue.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl text-left transition-all border group shadow-sm`}
                    style={activeHue === hue.id
                      ? { borderColor: hue.hex, backgroundColor: `${hue.hex}0d` }
                      : { borderColor: '#f3f4f6', backgroundColor: 'white' }}
                  >
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-wider leading-none mb-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full shrink-0 inline-block" style={{ backgroundColor: hue.hex }} />
                        <span style={{ color: activeHue === hue.id ? hue.hex : undefined }}>{hue.name}</span>
                      </p>
                      <p className="text-[10px] text-gray-500 leading-tight">{hue.description}</p>
                      <p className="text-[10px] text-gray-400 italic mt-1">{HUE_EXAMPLES[hue.id]}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HUE LEGEND — sticky */}
      <section className="bg-white/90 border-b border-gray-100 py-3 overflow-x-auto sticky top-0 z-30 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex gap-6 whitespace-nowrap items-center">
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 pr-4 border-r border-gray-100 shrink-0">
            Palette
          </div>
          {DATA.hues.map(hue => (
            <button
              key={hue.id}
              onClick={() => setActiveHue(activeHue === hue.id ? null : hue.id)}
              className={`group flex items-center gap-2 text-left transition-all ${activeHue && activeHue !== hue.id ? 'opacity-30 grayscale' : 'opacity-100'}`}
            >
              <div
                className="w-2 h-5 rounded-full transition-transform group-hover:scale-y-110 shrink-0"
                style={{ backgroundColor: hue.hex }}
              />
              <span className="text-[10px] font-black uppercase text-gray-900 tracking-wider">{hue.name}</span>
            </button>
          ))}
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-16">

        {/* LANDSCAPE VIEW */}
        {view === 'landscape' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

            {/* Sidebar */}
            <aside className="lg:col-span-3 space-y-12">
              <div>
                <h4 className="text-[10px] font-black uppercase text-gray-400 mb-6 tracking-[0.2em]">Filter</h4>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search tools..."
                    className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-gray-400/15 focus:border-gray-400 transition-all placeholder:text-gray-300 font-medium"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Properties</h4>
                  {activeDimensions.length > 0 && (
                    <button
                      onClick={() => setActiveDimensions([])}
                      className="text-[10px] font-black uppercase tracking-wider text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="space-y-1.5">
                  {DATA.evaluationDimensions.map(dim => {
                    const isActive = activeDimensions.includes(dim);
                    const matchCount = DATA.tools.filter(t => DIM_FILTER[dim]?.(t) ?? true).length;
                    return (
                      <button
                        key={dim}
                        onClick={() => setActiveDimensions(prev =>
                          prev.includes(dim) ? prev.filter(d => d !== dim) : [...prev, dim]
                        )}
                        title={DIM_DESCRIPTIONS[dim]}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-left transition-all border
                          ${isActive
                            ? 'bg-gray-900 border-gray-900 text-white'
                            : 'bg-white border-gray-100 text-gray-600 hover:border-gray-300 hover:text-gray-900'}`}
                      >
                        <span className="text-[10px] font-black uppercase tracking-wider">{DIM_LABELS[dim]}</span>
                        <span className={`text-[10px] font-bold tabular-nums shrink-0 ${isActive ? 'text-gray-400' : 'text-gray-300'}`}>
                          {matchCount}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* Tool Grid */}
            <section className="lg:col-span-9">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">Architectural Spectrum</h2>
                  <p className="text-sm text-gray-500 font-medium">
                    {filteredTools.length} pigment{filteredTools.length !== 1 ? 's' : ''} matching your current lens.
                  </p>
                </div>
                {/* View toggle */}
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl shrink-0">
                  <button
                    onClick={() => setCompactMode(false)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all
                      ${!compactMode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setCompactMode(true)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all
                      ${compactMode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Index
                  </button>
                </div>
              </div>

              {/* Column headers for index mode */}
              {compactMode && (
                <div className="flex items-center gap-4 px-4 mb-2">
                  <div className="w-1 shrink-0" />
                  <div className="w-44 shrink-0"><p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Tool</p></div>
                  <div className="w-6 shrink-0" />
                  <div className="w-20 shrink-0"><p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Complexity</p></div>
                  <div className="w-16 shrink-0"><p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Trust</p></div>
                  <div className="flex-1"><p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Patterns</p></div>
                  <div className="w-20 text-right shrink-0"><p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Conflicts</p></div>
                </div>
              )}

              {compactMode ? (
                <div className="flex flex-col gap-2">
                  {filteredTools.map(tool => (
                    <ToolIndexCard
                      key={tool.id}
                      tool={tool}
                      onClick={setInspectedTool}
                      isSelected={selectedTools.includes(tool.id)}
                      onToggleSelect={toggleToolSelection}
                      blendFull={selectedTools.length >= 5}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredTools.map(tool => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      onClick={setInspectedTool}
                      isSelected={selectedTools.includes(tool.id)}
                      onToggleSelect={toggleToolSelection}
                      blendFull={selectedTools.length >= 5}
                    />
                  ))}
                </div>
              )}

              {/* PATTERNS SECTION */}
              <div className="mt-20">
                <div className="flex items-center gap-4 mb-10 pt-10 border-t border-gray-100">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">{DATA.patterns.length} patterns</span>
                  <div className="flex-1 h-[1px] bg-gray-100" />
                </div>
                <div className="flex items-center gap-6 mb-4">
                  <h2 className="text-3xl font-black text-gray-900">Compositional Patterns</h2>
                  <div className="flex-1 h-[1px] bg-gray-100" />
                </div>
                <p className="text-sm text-gray-500 font-medium mb-12">
                  Recurring architectural forms — how tools combine, what they produce, and where they break.
                </p>

                {/* Pattern type groups */}
                {(['foundational', 'structural', 'high-velocity', 'anti-pattern'] as const).map(type => {
                  const group = DATA.patterns.filter(p => p.type === type);
                  if (!group.length) return null;
                  return (
                    <div key={type} className="mb-16">
                      <div className="flex items-center gap-3 mb-8">
                        <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border ${PATTERN_TYPE_STYLES[type]}`}>
                          {type.replace('-', ' ')}
                        </span>
                        <div className="flex-1 h-[1px] bg-gray-100" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {group.map(pattern => (
                          <PatternCard key={pattern.id} pattern={pattern} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* RECIPES VIEW */}
        {view === 'recipes' && (
          <div className="space-y-16">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Canonical Starter Recipes</h2>
              <p className="text-gray-500 font-medium">
                Pre-vetted tool combinations that achieve high harmonic resonance for specific organizational goals.
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
              {DATA.recipes.map(recipe => {
                const isMuddy = recipe.id === 'muddy-agent-recipe';
                return (
                  <div
                    key={recipe.id}
                    className={`flex flex-col rounded-[3rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border-2
                      ${isMuddy ? 'border-rose-200 bg-rose-50/30' : 'border-gray-100 bg-white'}`}
                  >
                    {/* Header */}
                    <div className={`px-10 py-10 border-b flex justify-between items-start
                      ${isMuddy ? 'border-rose-100 bg-rose-50' : 'border-gray-50 bg-gray-50/50'}`}>
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          {isMuddy ? (
                            <AlertOctagon className="text-rose-500" size={24} />
                          ) : (
                            <div className="flex -space-x-1">
                              {recipe.tools.map(tId => {
                                const tool = DATA.tools.find(t => t.id === tId);
                                const hue = DATA.hues.find(h => h.id === tool?.primaryHue);
                                return <div key={tId} className="w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: hue?.hex }} />;
                              })}
                            </div>
                          )}
                          <span className={`text-[10px] font-black uppercase tracking-[0.2em]
                            ${isMuddy ? 'text-rose-600' : 'text-indigo-500'}`}>
                            {isMuddy ? 'Anti-Pattern' : 'Canonical Recipe'}
                          </span>
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight">{recipe.name}</h3>
                      </div>
                      <Workflow size={24} className={isMuddy ? 'text-rose-200' : 'text-gray-200'} />
                    </div>

                    <div className="p-10 flex-1 space-y-12">
                      {/* Use Case */}
                      <div>
                        <h4 className="text-[10px] uppercase font-black text-gray-400 mb-3 tracking-widest">Use Case</h4>
                        <p className="text-sm font-bold text-gray-700">{recipe.useCase}</p>
                      </div>

                      {/* Tools */}
                      <div>
                        <h4 className="text-[10px] uppercase font-black text-gray-400 mb-4 tracking-widest">Tools</h4>
                        <div className="flex flex-wrap gap-2">
                          {recipe.tools.map(tId => {
                            const tool = DATA.tools.find(t => t.id === tId);
                            const hue = DATA.hues.find(h => h.id === tool?.primaryHue);
                            return (
                              <span key={tId} className="px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-xs font-bold text-gray-600 shadow-sm flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: hue?.hex }} />
                                {tool?.name}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Missing Hues */}
                      {!isMuddy && recipe.missingHues && recipe.missingHues.length > 0 && (
                        <div>
                          <h4 className="text-[10px] uppercase font-black text-amber-500 mb-4 tracking-widest">Spectral Gaps</h4>
                          <div className="flex flex-wrap gap-2">
                            {recipe.missingHues.map(hId => {
                              const hue = DATA.hues.find(h => h.id === hId);
                              return (
                                <span key={hId} className="px-3 py-1.5 bg-amber-50/50 border border-amber-100 rounded-lg text-[10px] font-black text-amber-700 uppercase tracking-tighter flex items-center gap-2 opacity-80">
                                  <div className="w-1.5 h-1.5 rounded-full grayscale opacity-50 shrink-0" style={{ backgroundColor: hue?.hex }} />
                                  {hId}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Pros / cons — always single column, separated by a rule */}
                      {isMuddy ? (
                        <div className="space-y-8 pt-2">
                          <div>
                            <h4 className="text-[10px] uppercase font-black text-rose-600 mb-4 tracking-widest">Why it happens</h4>
                            <ul className="space-y-3">
                              {recipe.whyItHappens?.map(item => (
                                <li key={item} className="flex items-start gap-3 text-sm text-rose-800 font-medium leading-relaxed">
                                  <AlertTriangle size={14} className="shrink-0 mt-1 text-rose-400" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {recipe.symptoms && recipe.symptoms.length > 0 && (
                            <>
                              <div className="h-px bg-rose-100" />
                              <div>
                                <h4 className="text-[10px] uppercase font-black text-rose-600 mb-4 tracking-widest">Symptoms</h4>
                                <ul className="space-y-3">
                                  {recipe.symptoms.map(item => (
                                    <li key={item} className="flex items-start gap-3 text-sm text-rose-800 font-medium leading-relaxed">
                                      <AlertOctagon size={14} className="shrink-0 mt-1 text-rose-400" />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </>
                          )}
                          <div className="h-px bg-rose-100" />
                          <div>
                            <h4 className="text-[10px] uppercase font-black text-rose-600 mb-4 tracking-widest">Architectural Fix</h4>
                            <ul className="space-y-3">
                              {recipe.fix?.map(item => (
                                <li key={item} className="flex items-start gap-3 text-sm text-gray-700 font-medium leading-relaxed">
                                  <CheckCircle2 size={14} className="shrink-0 mt-1 text-emerald-500" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-8 pt-2">
                          <div>
                            <h4 className="text-[10px] uppercase font-black text-emerald-600 mb-4 tracking-widest">Why it works</h4>
                            <ul className="space-y-3">
                              {recipe.whyItWorks?.map(item => (
                                <li key={item} className="flex items-start gap-3 text-sm text-gray-700 font-medium leading-relaxed">
                                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-1" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="h-px bg-gray-100" />
                          <div>
                            <h4 className="text-[10px] uppercase font-black text-rose-600 mb-4 tracking-widest">Where it breaks</h4>
                            <ul className="space-y-3">
                              {recipe.whereItBreaks?.map(item => (
                                <li key={item} className="flex items-start gap-3 text-sm text-gray-700 font-medium leading-relaxed">
                                  <XCircle size={14} className="text-rose-400 shrink-0 mt-1" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Anti-pattern load CTA */}
                      {isMuddy && (
                        <div className="pt-4 flex justify-end">
                          {pendingBlendRecipe === recipe.id ? (
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] text-rose-400 font-bold">Replaces your current blend.</span>
                              <button
                                onClick={() => { setSelectedTools(recipe.tools.slice(0, 5)); setView('landscape'); setPendingBlendRecipe(null); }}
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-white bg-rose-500 px-3 py-1.5 rounded-lg hover:bg-rose-600 transition-colors">
                                Load Anyway
                              </button>
                              <button
                                onClick={() => setPendingBlendRecipe(null)}
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 hover:text-rose-600 transition-colors">
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                if (selectedTools.length > 0) { setPendingBlendRecipe(recipe.id); }
                                else { setSelectedTools(recipe.tools.slice(0, 5)); setView('landscape'); }
                              }}
                              className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 group flex items-center gap-2 hover:text-rose-700 transition-colors">
                              Load Anti-Pattern to See Warnings <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                          )}
                        </div>
                      )}

                      {/* Upgrade path */}
                      {!isMuddy && recipe.upgradePath && recipe.upgradePath.length > 0 && (
                        <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex items-center gap-3">
                            <TrendingUp size={16} className="text-indigo-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Upgrade Path</span>
                            <div className="flex gap-2">
                              {recipe.upgradePath.map(uId => {
                                const tool = DATA.tools.find(t => t.id === uId);
                                return (
                                  <span key={uId} className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                                    {tool?.name ?? uId}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                          {pendingBlendRecipe === recipe.id ? (
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] text-gray-500 font-bold">Replaces your current blend.</span>
                              <button
                                onClick={() => { setSelectedTools(recipe.tools.slice(0, 5)); setView('landscape'); setPendingBlendRecipe(null); }}
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-white bg-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors">
                                Load Anyway
                              </button>
                              <button
                                onClick={() => setPendingBlendRecipe(null)}
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-600 transition-colors">
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                if (selectedTools.length > 0) { setPendingBlendRecipe(recipe.id); }
                                else { setSelectedTools(recipe.tools.slice(0, 5)); setView('landscape'); }
                              }}
                              className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700 group flex items-center gap-2 hover:text-gray-900 transition-colors">
                              Load into Blend <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* DIAGRAM VIEW */}
        {view === 'diagram' && (
          <div className="space-y-12">
            <div className="max-w-3xl mx-auto text-center mb-4">
              <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">How It Fits Together</h2>
              <p className="text-gray-500 font-medium leading-relaxed">
                Three lenses: the conceptual metaphor, the data model, and the path through the tool.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Panel 1 — Metaphor Bridge */}
              <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                <div className="px-8 py-6 border-b border-gray-50">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">Layer 1 — Conceptual</p>
                  <h3 className="text-xl font-black text-gray-900">The Metaphor Bridge</h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">Color theory concepts mapped to AI architecture</p>
                </div>
                <div className="p-6">
                  <MetaphorBridgeDiagram />
                </div>
              </div>

              {/* Panel 2 — Data Model */}
              <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                <div className="px-8 py-6 border-b border-gray-50">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">Layer 2 — Structural</p>
                  <h3 className="text-xl font-black text-gray-900">The Data Model</h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">How Hue, Tool, Pattern, and Recipe relate to each other</p>
                </div>
                <div className="p-6">
                  <DataModelDiagram />
                </div>
              </div>
            </div>

            {/* Panel 3 — User Loop */}
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
              <div className="px-8 py-6 border-b border-gray-50">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">Layer 3 — Interaction</p>
                <h3 className="text-xl font-black text-gray-900">The Loop</h3>
                <p className="text-xs text-gray-500 font-medium mt-1">How a consultant moves through the tool — from discovery to a saved, shareable composition</p>
              </div>
              <div className="p-8">
                <UserLoopDiagram />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* EMPTY BLEND HINT — only visible when no tools selected */}
      {selectedTools.length === 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2.5 bg-white border border-gray-200 shadow-sm rounded-full px-5 py-3 pointer-events-none z-40">
          <Plus size={12} className="text-indigo-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Select a tool above to start composing
          </span>
        </div>
      )}

      {/* BLEND PREVIEW BAR — fixed bottom */}
      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl bg-gray-900/95 text-white rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] transition-all duration-700 z-50 p-5 border border-white/10 backdrop-blur-xl
        ${selectedTools.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-40 opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col lg:flex-row items-center gap-10">

          {/* Tool pills */}
          <div className="flex items-center gap-6 lg:border-r lg:border-white/10 lg:pr-10 w-full lg:w-auto">
            <div className="flex -space-x-3">
              {selectedTools.map(id => {
                const tool = DATA.tools.find(t => t.id === id);
                return (
                  <div key={id} className="w-12 h-12 rounded-2xl border-2 border-gray-900 bg-white flex items-center justify-center text-xs font-black text-gray-900 group relative cursor-pointer hover:-translate-y-1 transition-transform">
                    {tool?.name.substring(0, 2).toUpperCase()}
                    <button onClick={() => toggleToolSelection(id)} aria-label={`Remove ${tool?.name ?? 'tool'}`} className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={10} strokeWidth={4} aria-hidden="true" />
                    </button>
                  </div>
                );
              })}
              {Array.from({ length: 5 - selectedTools.length }).map((_, i) => (
                <div key={i} className="w-12 h-12 rounded-2xl border-2 border-dashed border-gray-700 flex items-center justify-center text-gray-600">
                  <Plus size={16} aria-hidden="true" />
                </div>
              ))}
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-0.5">The Composition</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase">{selectedTools.length} / 5 Tools</p>
            </div>
          </div>

          {/* Analysis — 4 columns */}
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-6 w-full">

            {/* Hues */}
            <div>
              <p className="text-[10px] uppercase text-gray-500 mb-2 font-black tracking-widest">Hues</p>
              <div className="flex gap-1.5 flex-wrap">
                {mixAnalytics?.dominantHues.map(h => {
                  const hue = DATA.hues.find(hu => hu.id === h);
                  return hue ? (
                    <div key={h} className="w-4 h-4 rounded-md border border-white/10" style={{ backgroundColor: hue.hex }} title={hue.name} />
                  ) : null;
                })}
              </div>
              {mixAnalytics?.harmony.label && (
                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-wider mt-1.5">{mixAnalytics.harmony.label}</p>
              )}
            </div>

            {/* Complexity + Trust bars */}
            <div>
              <p className="text-[10px] uppercase text-gray-500 mb-2 font-black tracking-widest">Ops Load</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-600 uppercase font-black w-16 tracking-wider">Complexity</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: mixAnalytics?.maxScore ?? 0 }).map((_, i) => (
                      <div key={i} className={`w-2 h-1.5 rounded-full ${i < (mixAnalytics?.complexityScore ?? 0) ? 'bg-amber-400' : 'bg-white/10'}`} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-600 uppercase font-black w-16 tracking-wider">Trust</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: mixAnalytics?.maxScore ?? 0 }).map((_, i) => (
                      <div key={i} className={`w-2 h-1.5 rounded-full ${i < (mixAnalytics?.trustScore ?? 0) ? 'bg-teal-400' : 'bg-white/10'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Best pattern match */}
            <div>
              <p className="text-[10px] uppercase text-gray-500 mb-2 font-black tracking-widest">Closest Pattern</p>
              {mixAnalytics?.bestPattern ? (
                <div className="flex items-center gap-2">
                  <div className="opacity-70">
                    <PatternDiagram
                      patternId={mixAnalytics.bestPattern.id}
                      color={DATA.hues.find(h => h.id === mixAnalytics.bestPattern!.hues[0])?.hex ?? '#fff'}
                      size={22}
                    />
                  </div>
                  <p className="text-[10px] text-white font-bold leading-tight">{mixAnalytics.bestPattern.name}</p>
                </div>
              ) : (
                <p className="text-[10px] text-gray-600 italic">Select more tools</p>
              )}
            </div>

            {/* Health */}
            <div>
              <p className="text-[10px] uppercase text-gray-500 mb-2 font-black tracking-widest">Health</p>
              <div className="space-y-1.5">
                {(mixAnalytics?.conflicts.length ?? 0) > 0 && (
                  <div className="flex items-start gap-1.5 text-rose-400">
                    <ZapOff size={11} strokeWidth={3} className="shrink-0 mt-0.5" />
                    <span className="text-[10px] font-black uppercase leading-tight">{mixAnalytics!.conflicts[0]}</span>
                  </div>
                )}
                {mixAnalytics?.warnings.map(w => (
                  <div key={w.type} className="flex items-start gap-1.5 text-amber-400">
                    <AlertTriangle size={11} strokeWidth={3} className="shrink-0 mt-0.5" />
                    <span className="text-[10px] font-black uppercase leading-tight">{w.type}</span>
                  </div>
                ))}
                {(mixAnalytics?.conflicts.length ?? 0) === 0 && (mixAnalytics?.warnings.length ?? 0) === 0 && (
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck size={11} strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase tracking-widest">High Resonance</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={saveBlend}
              className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all
                ${blendCopied ? 'bg-emerald-400 text-white scale-105' : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'}`}>
              {blendCopied ? '✓ Link Copied' : 'Share Blend'}
            </button>
            <button
              onClick={exportManifest}
              className="bg-white text-gray-900 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-indigo-400 hover:text-white hover:scale-105 shadow-xl shadow-white/5">
              Export Manifest
            </button>
          </div>
        </div>
      </div>

      {/* TOOL DETAIL MODAL */}
      {inspectedTool && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/80 backdrop-blur-xl"
          onClick={() => setInspectedTool(null)}
        >
          <div
            className="bg-white w-full max-w-3xl rounded-[3rem] shadow-[0_64px_128px_-16px_rgba(0,0,0,0.5)] overflow-y-auto relative border border-white/20 max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setInspectedTool(null)}
              className="sticky top-4 float-right mr-4 p-2.5 rounded-2xl bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-all hover:rotate-90 z-10 shadow-md border border-gray-200"
            >
              <X size={20} strokeWidth={2.5} />
            </button>

            <div className="h-4 w-full" style={{ backgroundColor: DATA.hues.find(h => h.id === inspectedTool.primaryHue)?.hex }} />

            <div className="p-12">
              <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center font-black text-3xl text-gray-300">
                  {inspectedTool.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-4xl font-black text-gray-900 tracking-tight">{inspectedTool.name}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-indigo-600 font-black tracking-widest uppercase text-xs">{inspectedTool.category}</p>
                    <div className="w-1 h-1 bg-gray-200 rounded-full" />
                    <p className="text-gray-400 font-black tracking-widest uppercase text-[10px]">{inspectedTool.maturity}</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mb-8">{inspectedTool.description}</p>

              {/* Relationship web */}
              <div className="mb-10 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-3">Relationship Map</p>
                <RelationshipWeb tool={inspectedTool} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div>
                  <h4 className="text-[10px] uppercase font-black text-gray-400 mb-6 tracking-widest">System Profile</h4>
                  <div className="space-y-8">
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-500 mb-2">
                        <span>Complexity Added</span>
                        <span className="text-gray-900 font-black">{inspectedTool.complexityAdded}</span>
                      </div>
                      <ComplexityBar level={inspectedTool.complexityAdded} />
                    </div>
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-500 mb-2">
                        <span>Trust Contribution</span>
                        <span className="text-gray-900 font-black">{inspectedTool.trustContribution}</span>
                      </div>
                      <TrustScale level={inspectedTool.trustContribution} />
                    </div>
                  </div>

                  <div className="mt-10">
                    <h4 className="text-[10px] uppercase font-black text-gray-400 mb-4 tracking-widest">Hues</h4>
                    <div className="flex gap-3">
                      {[inspectedTool.primaryHue, inspectedTool.secondaryHue].filter(Boolean).map(hId => {
                        const hue = DATA.hues.find(h => h.id === hId);
                        return hue ? (
                          <div key={hId} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-100 bg-gray-50">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hue.hex }} />
                            <span className="text-[10px] font-black uppercase text-gray-600 tracking-wider">{hue.name}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>

                  <div className="mt-10">
                    <h4 className="text-[10px] uppercase font-black text-gray-400 mb-4 tracking-widest">Patterns</h4>
                    <div className="flex flex-wrap gap-2">
                      {inspectedTool.patterns.map(p => (
                        <span key={p} className="px-3 py-1.5 bg-gray-50 rounded-lg text-[10px] font-black text-gray-600 border border-gray-100 uppercase tracking-tighter">
                          {p.replace(/-/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-10">
                  <div>
                    <h4 className="text-[10px] uppercase font-black text-gray-400 mb-4 tracking-widest">Relationship Mapping</h4>
                    <div className="space-y-4">
                      {inspectedTool.pairsWellWith.length > 0 && (
                        <div>
                          <p className="text-[10px] font-black uppercase text-emerald-600 mb-1 tracking-wide">Harmonic Pairings</p>
                          <p className="text-xs text-gray-500 font-medium leading-relaxed">
                            {inspectedTool.pairsWellWith.map(id => DATA.tools.find(t => t.id === id)?.name).filter(Boolean).join(', ')}
                          </p>
                        </div>
                      )}
                      {inspectedTool.conflictsWith.length > 0 && (
                        <div>
                          <p className="text-[10px] font-black uppercase text-rose-500 mb-1 tracking-wide">Incompatible Tools</p>
                          <p className="text-xs text-gray-500 font-medium leading-relaxed">
                            {inspectedTool.conflictsWith.map(id => DATA.tools.find(t => t.id === id)?.name).filter(Boolean).join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {(() => {
                    const toolRecipes = DATA.recipes.filter(r => r.tools.includes(inspectedTool.id));
                    if (toolRecipes.length === 0) return null;
                    return (
                      <div>
                        <h4 className="text-[10px] uppercase font-black text-gray-400 mb-4 tracking-widest">Appears In</h4>
                        <div className="flex flex-wrap gap-2">
                          {toolRecipes.map(r => {
                            const isMuddy = r.id === 'muddy-agent-recipe';
                            return (
                              <button
                                key={r.id}
                                onClick={() => { setInspectedTool(null); setView('recipes'); }}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black border uppercase tracking-tighter transition-colors
                                  ${isMuddy
                                    ? 'bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100'
                                    : 'bg-indigo-50 border-indigo-100 text-indigo-600 hover:bg-indigo-100'}`}
                              >
                                {r.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
                    <h4 className="text-[10px] uppercase font-black text-amber-900 mb-2 tracking-widest">Architectural Note</h4>
                    <p className="text-xs text-amber-900/70 font-medium leading-relaxed italic">
                      "{inspectedTool.notes}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-12 py-8 flex justify-between items-center border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400">
                  <Database size={14} />
                </div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
                  v{DATA.site.version}
                </span>
              </div>
              <button
                onClick={() => {
                  toggleToolSelection(inspectedTool.id);
                  setInspectedTool(null);
                }}
                className={`px-10 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all
                  ${selectedTools.includes(inspectedTool.id) ? 'bg-rose-500 text-white' : 'bg-gray-900 text-white shadow-xl shadow-gray-900/20'}`}
              >
                {selectedTools.includes(inspectedTool.id) ? 'Remove Pigment' : 'Add to Blend'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
