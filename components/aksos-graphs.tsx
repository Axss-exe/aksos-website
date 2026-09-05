'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronRight } from 'lucide-react'

type Particle = { id: string; x: number; y: number; vx: number; vy: number; radius: number; cluster: number; label?: string; anchor?: boolean }
type Link = { source: string; target: string }
type Lens = { nodes: string[]; edges: Link[] }

const seed = (value: number) => {
  const x = Math.sin(value * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

const PARTICLES: readonly Particle[] = Array.from({ length: 78 }, (_, index) => {
  const cluster = index % 3
  const centers = [[0.22, 0.35], [0.56, 0.58], [0.8, 0.28]][cluster]
  const angle = seed(index + 4) * Math.PI * 2
  const distance = 0.04 + seed(index + 12) * 0.2
  const anchor = [0, 1, 2, 24, 25, 48, 49].includes(index)
  const labels = ['MINISTRY', 'POLICY', 'PROJECT', 'ENTERPRISE', 'PEOPLE', 'CAPITAL', 'MARKET']
  return { id: `particle-${index}`, x: Math.max(0.05, Math.min(0.95, centers[0] + Math.cos(angle) * distance)), y: Math.max(0.08, Math.min(0.9, centers[1] + Math.sin(angle) * distance)), vx: (seed(index + 30) - 0.5) * 0.00012, vy: (seed(index + 60) - 0.5) * 0.00012, radius: anchor ? 4.5 : 1.2 + seed(index + 90) * 1.2, cluster, label: anchor ? labels[[0, 1, 2, 3, 4, 5, 6].indexOf(index)] : undefined, anchor }
})
const ANCHORS = PARTICLES.filter((p) => p.anchor)
const LINKS: readonly Link[] = [{ source: 'particle-0', target: 'particle-1' }, { source: 'particle-1', target: 'particle-2' }, { source: 'particle-2', target: 'particle-3' }, { source: 'particle-0', target: 'particle-24' }, { source: 'particle-24', target: 'particle-25' }, { source: 'particle-25', target: 'particle-48' }, { source: 'particle-48', target: 'particle-49' }]
const LENSES: Record<string, Lens> = { Entrepreneur: { nodes: ['particle-24', 'particle-25', 'particle-2', 'particle-3'], edges: LINKS.slice(2, 5) }, Investor: { nodes: ['particle-5', 'particle-25', 'particle-3', 'particle-49'], edges: LINKS.slice(3) }, 'Policy analyst': { nodes: ['particle-0', 'particle-1', 'particle-2', 'particle-48'], edges: LINKS.slice(0, 3) }, 'Community builder': { nodes: ['particle-24', 'particle-25', 'particle-48'], edges: LINKS.slice(3) } }

export function BrandMark({ atis = false, compact = false }: { atis?: boolean; compact?: boolean }) {
  return <span className={`brand-mark ${compact ? 'brand-mark-compact' : ''}`}><img src={atis ? '/atis-symbol-traced.svg' : '/aksos-symbol-traced.svg'} alt="" /><span>{atis ? 'ATIS' : 'AKSOS'}</span></span>
}

export function EcosystemCanvas({ mode = 'ecosystem', lens = 'Entrepreneur', onSelect }: { mode?: 'ecosystem' | 'atis' | 'rita' | 'perspective'; lens?: string; onSelect?: (id: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({ hovered: '', paused: false, reduced: false, visible: true, stage: mode === 'rita' ? 0 : 4, start: 0, transition: 1 })
  const [paused, setPaused] = useState(false)
  const [stage, setStage] = useState(mode === 'rita' ? 0 : 4)
  const target = mode === 'rita' ? { nodes: stage >= 3 ? ['particle-0', 'particle-1', 'particle-2', 'particle-3'] : [], edges: stage >= 2 ? LINKS.slice(0, 3) : [] } : (LENSES[lens] ?? LENSES.Entrepreneur)
  const targetRef = useRef(target); targetRef.current = target
  useEffect(() => { stateRef.current.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; stateRef.current.paused = paused }, [paused])
  useEffect(() => {
    const canvas = canvasRef.current; const parent = canvas?.parentElement; if (!canvas || !parent) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    let width = 1, height = 1, dpr = 1, raf = 0, disposed = false
    const resize = () => { const rect = parent.getBoundingClientRect(); const nextW = Math.max(1, Math.floor(rect.width)); const nextH = Math.max(1, Math.floor(rect.height)); const nextDpr = Math.min(window.devicePixelRatio || 1, 2); if (nextW === width && nextH === height && nextDpr === dpr) return; width = nextW; height = nextH; dpr = nextDpr; canvas.width = width * dpr; canvas.height = height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0) }
    const position = (p: Particle) => ({ x: p.x * width, y: p.y * height })
    const draw = (now: number) => { if (disposed || !stateRef.current.visible) return; resize(); const state = stateRef.current; const motion = !state.reduced && !state.paused; ctx.clearRect(0, 0, width, height); const active = new Set(targetRef.current.nodes); const hovered = state.hovered
      if (motion && mode === 'ecosystem') PARTICLES.forEach((p) => { p.x += p.vx; p.y += p.vy; if (p.x < .04 || p.x > .96) p.vx *= -1; if (p.y < .06 || p.y > .94) p.vy *= -1 })
      ctx.lineWidth = .5; ctx.strokeStyle = 'rgba(26,26,26,.06)'; LINKS.forEach((link) => { const a = PARTICLES.find((p) => p.id === link.source); const b = PARTICLES.find((p) => p.id === link.target); if (!a || !b) return; const p = position(a); const q = position(b); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke() })
      ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(115,115,115,.72)'; targetRef.current.edges.forEach((link) => { const a = PARTICLES.find((p) => p.id === link.source); const b = PARTICLES.find((p) => p.id === link.target); if (!a || !b) return; const p = position(a); const q = position(b); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke() })
      PARTICLES.forEach((particle) => { const p = position(particle); const isActive = active.has(particle.id); const isHovered = hovered === particle.id; const opacity = hovered ? (isHovered || LINKS.some((l) => (l.source === hovered || l.target === hovered) && (l.source === particle.id || l.target === particle.id)) ? 1 : .12) : mode === 'rita' && stage < 2 ? .15 : isActive ? .85 : .32; ctx.globalAlpha = opacity; ctx.fillStyle = particle.anchor ? '#fff' : '#1a1a1a'; ctx.strokeStyle = particle.anchor ? '#1a1a1a' : 'rgba(26,26,26,.24)'; ctx.lineWidth = particle.anchor ? 1 : .5; ctx.beginPath(); ctx.arc(p.x, p.y, particle.anchor ? 5 : particle.radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); if ((particle.anchor && isActive) || (mode === 'rita' && stage >= 4 && particle.anchor)) { ctx.globalAlpha = 1; ctx.fillStyle = '#1a1a1a'; ctx.font = `${width < 520 ? 9 : 10}px monospace`; ctx.fillText(particle.label ?? '', p.x + 11, p.y + 3) } }); ctx.globalAlpha = 1; if (motion) raf = requestAnimationFrame(draw) }
    const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw) }; const observer = new IntersectionObserver(([entry]) => { stateRef.current.visible = entry.isIntersecting; if (entry.isIntersecting) schedule(); else cancelAnimationFrame(raf) }, { threshold: .01 }); observer.observe(parent); window.addEventListener('resize', schedule, { passive: true }); schedule(); return () => { disposed = true; observer.disconnect(); window.removeEventListener('resize', schedule); cancelAnimationFrame(raf) }
  }, [mode, paused, stage])
  const hit = (event: React.PointerEvent<HTMLCanvasElement>) => { const canvas = canvasRef.current; if (!canvas) return; const rect = canvas.getBoundingClientRect(); const x = (event.clientX - rect.left) / rect.width; const y = (event.clientY - rect.top) / rect.height; const closest = PARTICLES.map((p) => ({ p, distance: Math.hypot(x - p.x, y - p.y) })).filter(({ distance }) => distance < .06).sort((a, b) => a.distance - b.distance)[0]?.p; stateRef.current.hovered = closest?.id ?? ''; if (closest?.anchor) onSelect?.(closest.id) }
  const evaluate = () => { if (stage > 0) return; setStage(1); window.setTimeout(() => setStage(2), 300); window.setTimeout(() => setStage(3), 900); window.setTimeout(() => setStage(4), 1500) }
  return <div className="graph-shell"><canvas ref={canvasRef} role="img" aria-label={`${mode} ecosystem field`} onPointerMove={hit} onPointerLeave={() => { stateRef.current.hovered = '' }} onClick={hit} /><button className="graph-toggle" onClick={() => setPaused((value) => !value)}>{paused ? 'PLAY' : 'PAUSE'}</button>{mode === 'rita' && <button className="graph-cta" onClick={evaluate} disabled={stage > 0}>Evaluate Coherence →</button>}</div>
}

export function ProvenancePanel({ entity = 'POLICY', relationship = 'POLICY ↔ PROJECT' }: { entity?: string; relationship?: string }) { return <aside className="provenance" aria-live="polite"><span className="technical-note">SYS // RELATIONSHIP_TRACE</span><strong>{entity} // REVISION_2026</strong><span className="technical-note">RELATIONSHIP</span><strong>{relationship}</strong><p><b>FACT</b> Conceptual demonstration: inspectable relationships, not live intelligence.</p><p className="technical-note"><b>EVIDENCE</b> DEMO // FIELD_NOTE_042<br />SOURCE STATUS // NOT LIVE INTELLIGENCE</p></aside> }
export function RitaSequencer() { const [coherent, setCoherent] = useState(false); return <div className="rita-visual"><EcosystemCanvas mode="rita" onSelect={() => setCoherent(true)} /><div className="rita-story" aria-live="polite">{coherent && <><span className="technical-note">SYS // COHERENT_PATTERN_DETECTED</span><strong>MINISTRY → POLICY → PROJECT → ENTERPRISE</strong><ProvenancePanel /></>}</div></div> }
export function PerspectiveSection() { const [perspective, setPerspective] = useState('Entrepreneur'); const [selected, setSelected] = useState('particle-2'); const options = Object.keys(LENSES); return <><div className="tabs" role="tablist">{options.map((item) => <button key={item} role="tab" aria-selected={item === perspective} onClick={() => setPerspective(item)}>{item}</button>)}</div><div className="perspective-grid"><div className="perspective-canvas"><EcosystemCanvas mode="perspective" lens={perspective} onSelect={setSelected} /></div><div className="lens-panel"><span className="technical-note">ACTIVE LENS / {perspective.toUpperCase()}</span><h3>{perspective === 'Entrepreneur' ? 'Where could I enter?' : perspective === 'Investor' ? 'Where is momentum forming?' : perspective === 'Policy analyst' ? 'Where are coordination gaps?' : 'Who is already moving?'}</h3><p>Select a particle to inspect its role in this view.</p><div className="node-buttons">{['MINISTRY','POLICY','PROJECT','ENTERPRISE','PEOPLE','CAPITAL'].map((label, i) => <button className={selected === `particle-${[0,1,2,3,24,25][i]}` ? 'node-selected' : ''} key={label} onClick={() => setSelected(`particle-${[0,1,2,3,24,25][i]}`)}><span>○</span>{label}<ChevronRight size={14} /></button>)}</div></div></div></> }
export const graphNodes = ANCHORS.map((node) => [node.id, node.label ?? ''] as const)
export const ritaNodes = ['particle-0', 'particle-1', 'particle-2', 'particle-3']

export function EcosystemField() { return <EcosystemCanvas mode="ecosystem" /> }
export function AtisField() { return <EcosystemCanvas mode="atis" /> }
export function PerspectiveGraph({ perspective, onSelect }: { perspective: string; selected?: string; onSelect?: (value: string) => void }) { return <EcosystemCanvas mode="perspective" lens={perspective} onSelect={onSelect} /> }
export function AtisLogo() { return <BrandMark atis compact /> }
export function AksosLogo() { return <BrandMark /> }

export const immutableGeometry = PARTICLES
export const graphLenses = LENSES
