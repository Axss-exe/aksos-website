'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronRight, RotateCcw } from 'lucide-react'

type Particle = { id: string; x: number; y: number; cluster: number; label?: string; anchor?: boolean }
type Lens = { anchors: string[]; secondary: string[]; edges: [string, string][] }
type Perspective = 'Investor' | 'Enterprise' | 'Researcher'

const hash = (n: number) => {
  const x = Math.sin(n * 91.173 + 17.41) * 43758.5453
  return x - Math.floor(x)
}

const PARTICLES: readonly Particle[] = Object.freeze(Array.from({ length: 88 }, (_, index) => {
  const cluster = index % 5
  const centers = [[.18, .25], [.39, .68], [.6, .31], [.77, .72], [.87, .24]] as const
  const center = centers[cluster]
  const ring = Math.floor(index / 5)
  const angle = hash(index + 3) * Math.PI * 2
  const radius = .025 + hash(index + 19) * (.07 + ring * .006)
  const anchor = [0, 5, 18, 31, 45, 60, 74].includes(index)
  const labels = ['INSTITUTION', 'POLICY', 'PROJECT', 'ENTERPRISE', 'CAPITAL', 'MARKET', 'PEOPLE']
  return Object.freeze({ id: `p-${index}`, x: Math.min(.96, Math.max(.04, center[0] + Math.cos(angle) * radius)), y: Math.min(.94, Math.max(.06, center[1] + Math.sin(angle) * radius)), cluster, anchor, label: anchor ? labels[[0, 5, 18, 31, 45, 60, 74].indexOf(index)] : undefined })
}))

const EDGES: readonly [string, string][] = Object.freeze([
  ['p-0', 'p-5'], ['p-5', 'p-18'], ['p-18', 'p-31'], ['p-31', 'p-45'], ['p-45', 'p-60'], ['p-60', 'p-74'],
  ['p-5', 'p-31'], ['p-18', 'p-45'], ['p-31', 'p-60'], ['p-0', 'p-18'],
])
const PERSPECTIVES: Record<Perspective, Lens> = {
  Investor: { anchors: ['p-45', 'p-60', 'p-74'], secondary: ['p-5', 'p-18', 'p-31'], edges: [EDGES[4], EDGES[5], EDGES[6]] },
  Enterprise: { anchors: ['p-31', 'p-45', 'p-60'], secondary: ['p-18', 'p-74', 'p-5'], edges: [EDGES[3], EDGES[4], EDGES[8]] },
  Researcher: { anchors: ['p-0', 'p-5', 'p-18'], secondary: ['p-31', 'p-45', 'p-60'], edges: [EDGES[0], EDGES[1], EDGES[2]] },
}

function useCanvasField(active: Set<string>, activeEdges: readonly [string, string][], options?: { drift?: boolean; labels?: boolean; onPick?: (id: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hoverRef = useRef<string | null>(null)
  const visibleRef = useRef(true)
  const [hovered, setHovered] = useState<string | null>(null)
  useEffect(() => {
    const canvas = canvasRef.current; const parent = canvas?.parentElement
    if (!canvas || !parent) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    let raf = 0; let stopped = false; let width = 1; let height = 1; let dpr = 1
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const resize = () => { const rect = parent.getBoundingClientRect(); const nextW = Math.max(1, Math.floor(rect.width)); const nextH = Math.max(1, Math.floor(rect.height)); const nextDpr = Math.min(2, window.devicePixelRatio || 1); if (nextW === width && nextH === height && nextDpr === dpr) return; width = nextW; height = nextH; dpr = nextDpr; canvas.width = width * dpr; canvas.height = height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0) }
    const draw = (now: number) => { if (stopped || !visibleRef.current) return; resize(); ctx.clearRect(0, 0, width, height); const t = reduced || !options?.drift ? 0 : now * .000018
      const point = (p: Particle) => ({ x: p.x * width + Math.sin(t + p.cluster) * 2, y: p.y * height + Math.cos(t + p.cluster * 1.4) * 2 })
      ctx.lineWidth = .5; ctx.strokeStyle = 'rgba(26,26,26,.07)'; EDGES.forEach(([a, b]) => { const pa = PARTICLES.find((p) => p.id === a); const pb = PARTICLES.find((p) => p.id === b); if (!pa || !pb) return; const x = point(pa); const y = point(pb); ctx.beginPath(); ctx.moveTo(x.x, x.y); ctx.lineTo(y.x, y.y); ctx.stroke() })
      ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(115,115,115,.8)'; activeEdges.forEach(([a, b]) => { const pa = PARTICLES.find((p) => p.id === a); const pb = PARTICLES.find((p) => p.id === b); if (!pa || !pb) return; const x = point(pa); const y = point(pb); ctx.beginPath(); ctx.moveTo(x.x, x.y); ctx.lineTo(y.x, y.y); ctx.stroke() })
      PARTICLES.forEach((particle) => { const p = point(particle); const isActive = active.has(particle.id); const isHover = hoverRef.current === particle.id; const opacity = hoverRef.current ? (isHover || EDGES.some(([a, b]) => (a === hoverRef.current || b === hoverRef.current) && (a === particle.id || b === particle.id)) ? 1 : .12) : isActive ? .78 : .22; ctx.globalAlpha = opacity; ctx.beginPath(); ctx.arc(p.x, p.y, particle.anchor && isActive ? 5.5 : 1.8, 0, Math.PI * 2); ctx.fillStyle = particle.anchor && isActive ? '#fff' : '#1a1a1a'; ctx.fill(); if (particle.anchor && isActive) { ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 1; ctx.stroke(); if (options?.labels) { ctx.globalAlpha = 1; ctx.font = `${width < 520 ? 9 : 10}px monospace`; ctx.fillStyle = '#1a1a1a'; ctx.fillText(particle.label ?? '', p.x + 11, p.y + 3) } } }); ctx.globalAlpha = 1; raf = requestAnimationFrame(draw) }
    const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw) }; const observer = new IntersectionObserver(([entry]) => { visibleRef.current = entry.isIntersecting; if (entry.isIntersecting) schedule(); else cancelAnimationFrame(raf) }); observer.observe(parent); window.addEventListener('resize', schedule, { passive: true }); schedule()
    return () => { stopped = true; cancelAnimationFrame(raf); observer.disconnect(); window.removeEventListener('resize', schedule) }
  }, [active, activeEdges, options?.drift, options?.labels])
  const pick = (event: React.PointerEvent<HTMLCanvasElement>) => { const canvas = canvasRef.current; if (!canvas) return; const rect = canvas.getBoundingClientRect(); const x = (event.clientX - rect.left) / rect.width; const y = (event.clientY - rect.top) / rect.height; const match = PARTICLES.map((p) => ({ p, d: Math.hypot(p.x - x, p.y - y) })).filter(({ d }) => d < .07).sort((a, b) => a.d - b.d)[0]?.p.id ?? null; hoverRef.current = match; setHovered(match); if (match) options?.onPick?.(match) }
  return { canvasRef, pick, hovered }
}

export function CanvasContainer({ ariaLabel = 'Interactive AKSOS canvas diagram', caption = 'CANVAS // spatial reasoning' }: { ariaLabel?: string; caption?: string }) { const active = useMemo(() => new Set<string>(), []); const field = useCanvasField(active, [], { drift: true }); return <div className="diagram-shell canvas-container"><canvas ref={field.canvasRef} aria-label={ariaLabel} role="img" onPointerMove={field.pick} onPointerLeave={() => {}} /><span className="diagram-caption">{caption}</span></div> }

export function EcosystemField() { return <CanvasContainer ariaLabel="A quiet ecosystem field with latent clusters" caption="FIELD // latent structure" /> }

export function FragmentedField() { const [revealed, setRevealed] = useState(false); const active = useMemo(() => new Set(revealed ? ['p-0', 'p-5', 'p-18', 'p-31', 'p-45', 'p-60'] : []), [revealed]); const field = useCanvasField(active, revealed ? EDGES.slice(0, 5) : [], { labels: revealed }); return <div className="diagram-shell fragmented-diagram"><canvas ref={field.canvasRef} aria-label="Information fragments that can reveal context" role="img" onPointerMove={field.pick} /><div className="diagram-control"><button type="button" onClick={() => setRevealed((value) => !value)}>{revealed ? 'Reset fragments' : 'Reveal context'} <ChevronRight size={14} /></button><span>{revealed ? 'FRAGMENTATION → RELATIONSHIPS → CONTEXT' : 'DOCUMENT / POLICY / PROJECT / MARKET'}</span></div></div> }

export function PerspectiveSection() { const [perspective, setPerspective] = useState<Perspective>('Investor'); const lens = PERSPECTIVES[perspective]; const active = useMemo(() => new Set([...lens.anchors, ...lens.secondary]), [lens]); const field = useCanvasField(active, lens.edges, { labels: true }); return <div className="perspective-system"><div className="tabs" role="tablist" aria-label="Ecosystem perspective"><span className="technical-note">ONE ECOSYSTEM / DIFFERENT QUESTIONS</span>{(Object.keys(PERSPECTIVES) as Perspective[]).map((item) => <button key={item} type="button" role="tab" aria-selected={item === perspective} onClick={() => setPerspective(item)}>{item}</button>)}</div><div className="perspective-grid"><div className="diagram-shell perspective-diagram"><canvas ref={field.canvasRef} aria-label={`Shared ecosystem through the ${perspective} lens`} role="img" onPointerMove={field.pick} /></div><aside className="lens-panel"><span className="technical-note">ACTIVE LENS // {perspective.toUpperCase()}</span><h3>{perspective === 'Investor' ? 'Where is momentum forming?' : perspective === 'Enterprise' ? 'Where could I enter?' : 'What evidence connects?'}</h3><p>The particles, coordinates and underlying relationships remain constant. Only emphasis changes.</p><button className="reset-button" type="button" onClick={() => setPerspective('Investor')}><RotateCcw size={14} /> Reset lens</button></aside></div></div> }

const atisStages = ['RAW INFORMATION', 'EVIDENCE', 'FACT', 'ENTITIES', 'RELATIONSHIPS', 'CONTEXT', 'INTELLIGENCE']
export function AtisProgression() { const [stage, setStage] = useState(0); return <div className="atis-progression"><div className="atis-material"><div className="material-fragments" data-stage={stage}>{Array.from({ length: 12 }, (_, i) => <span key={i} style={{ '--i': i } as React.CSSProperties} />)}</div><div className="material-structure">{stage >= 2 && <span>SUPPORTED STATEMENT</span>}{stage >= 3 && <span>MINISTRY · POLICY · PROJECT</span>}{stage >= 4 && <span>POLICY → PROJECT → ENTERPRISE</span>}{stage >= 5 && <span>WHY IT MATTERS HERE</span>}{stage >= 6 && <strong>CONTEXTUAL INTELLIGENCE</strong>}</div></div><div className="stage-controls"><span className="technical-note">STAGE {stage + 1} / 7</span><strong>{atisStages[stage]}</strong><button type="button" onClick={() => setStage((value) => value === atisStages.length - 1 ? 0 : value + 1)}>{stage === atisStages.length - 1 ? 'Restart transformation' : `Reveal ${atisStages[stage + 1] ?? 'next stage'}`} <ChevronRight size={14} /></button></div><div className="stage-list" role="list">{atisStages.map((item, index) => <button type="button" key={item} aria-current={index === stage} onClick={() => setStage(index)}>{String(index + 1).padStart(2, '0')} {item}</button>)}</div></div> }

const sequence = ['EXPERIENCE', 'OBSERVATION', 'QUESTION', 'HYPOTHESIS']
export function IntellectualHistory() { const [step, setStep] = useState(0); return <div className="sequence-diagram"><div className="sequence-track">{sequence.map((item, i) => <button type="button" key={item} className={i <= step ? 'is-active' : ''} onClick={() => setStep(i)}><span>{String(i + 1).padStart(2, '0')}</span>{item}{i < sequence.length - 1 && <i>↓</i>}</button>)}</div><p>{step === 3 ? 'A question became a hypothesis worth testing.' : 'Click each stage to follow the idea becoming a hypothesis.'}</p></div> }

const provenance = [{ label: 'STORY', text: 'A possible pattern needs inspection.' }, { label: 'RELATIONSHIP', text: 'POLICY ↔ PROJECT' }, { label: 'FACT', text: 'Conceptual demonstration: the relationship is traceable.' }, { label: 'SOURCE', text: 'DEMO // FIELD_NOTE_042 — not live intelligence' }]
export function ProvenanceChain() { const [selected, setSelected] = useState(0); return <div className="provenance-chain"><div className="provenance-steps">{provenance.map((item, i) => <button type="button" key={item.label} className={i === selected ? 'is-active' : ''} onClick={() => setSelected(i)}>{item.label}<ChevronRight size={14} /></button>)}</div><div className="provenance-detail" aria-live="polite"><span className="technical-note">TRACE // {provenance[selected].label}</span><strong>{provenance[selected].text}</strong></div></div> }

export function RitaSequencer() { const [phase, setPhase] = useState(0); const steps = ['AMBIGUITY', 'EVALUATION', 'COHERENCE', 'STORY', 'PROVENANCE']; return <div className="rita-system"><div className={`rita-board phase-${phase}`}><div className="rita-clusters"><span /><span /><span /></div>{phase >= 2 && <div className="rita-chain"><b>MINISTRY</b><i>↓</i><b>POLICY</b><i>↓</i><b>PROJECT</b><i>↓</i><b>ENTERPRISE</b></div>}</div><div className="rita-controls"><span className="technical-note">RITA // {steps[phase]}</span><button type="button" onClick={() => setPhase((value) => value < 4 ? value + 1 : 0)}>{phase === 0 ? 'Evaluate coherence' : phase === 4 ? 'Replay evaluation' : `Continue to ${steps[phase + 1]}`} <ChevronRight size={14} /></button></div>{phase >= 3 && <div className="rita-result" aria-live="polite"><strong>SYS // COHERENT_PATTERN_DETECTED</strong><p>CONNECTION ≠ COHERENCE → COHERENCE → STORY</p>{phase === 4 && <ProvenanceChain />}</div>}</div> }

export function PathwayFlow() { const [step, setStep] = useState(0); const items = ['CONTRIBUTE CONTEXT', 'DISCOVER', 'SELECTION', 'DEEPER PARTICIPATION', 'ATIS ACCESS WHERE APPROPRIATE']; return <div className="pathway-flow">{items.map((item, i) => <button type="button" className={i <= step ? 'is-active' : ''} key={item} onClick={() => setStep(i)}><span>{item}</span>{i < items.length - 1 && <i>↓</i>}</button>)}</div> }

export const immutableGeometry = PARTICLES
export const graphLenses = PERSPECTIVES
export const graphNodes = PARTICLES.filter((particle) => particle.anchor).map((particle) => [particle.id, particle.label ?? ''] as const)
export const ritaNodes = ['MINISTRY', 'POLICY', 'PROJECT', 'ENTERPRISE']
export const EcosystemCanvas = EcosystemField
export const AtisField = AtisProgression
export const PerspectiveGraph = PerspectiveSection
export const AtisLogo = () => null
export const AksosLogo = () => null
export function ProvenancePanel() { return <ProvenanceChain /> }
export function BrandMark() { return null }
export function useGraphState() { return { particles: PARTICLES, edges: EDGES } }

export type { Perspective }

