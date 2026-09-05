'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronRight } from 'lucide-react'

type NodeGeometry = { id: string; x: number; y: number; type: 'anchor' | 'secondary' | 'base'; label: string }
type Edge = { source: string; target: string }
type ActiveLens = { activeNodes: string[]; activeEdges: Edge[] }

type GraphProps = { mode?: 'ecosystem' | 'atis' | 'perspective' | 'rita'; active?: string; lens?: string; onSelect?: (id: string) => void; onCoherent?: () => void }

const BASE_GEOMETRY: readonly NodeGeometry[] = [
  { id: 'ministry', x: 0.14, y: 0.2, type: 'anchor', label: 'MINISTRY' }, { id: 'policy', x: 0.34, y: 0.3, type: 'anchor', label: 'POLICY' },
  { id: 'project', x: 0.54, y: 0.47, type: 'anchor', label: 'PROJECT' }, { id: 'enterprise', x: 0.77, y: 0.25, type: 'anchor', label: 'ENTERPRISE' },
  { id: 'people', x: 0.2, y: 0.68, type: 'secondary', label: 'PEOPLE' }, { id: 'capital', x: 0.42, y: 0.12, type: 'secondary', label: 'CAPITAL' },
  { id: 'institution', x: 0.62, y: 0.72, type: 'secondary', label: 'INSTITUTION' }, { id: 'market', x: 0.86, y: 0.66, type: 'secondary', label: 'MARKET' },
  { id: 'founder', x: 0.07, y: 0.5, type: 'base', label: 'FOUNDER' }, { id: 'signal', x: 0.28, y: 0.86, type: 'base', label: 'SIGNAL' },
  { id: 'document', x: 0.46, y: 0.76, type: 'base', label: 'DOCUMENT' }, { id: 'network', x: 0.71, y: 0.52, type: 'base', label: 'NETWORK' },
  { id: 'place', x: 0.94, y: 0.42, type: 'base', label: 'PLACE' }, { id: 'opportunity', x: 0.66, y: 0.09, type: 'base', label: 'OPPORTUNITY' },
  { id: 'data', x: 0.1, y: 0.84, type: 'base', label: 'DATA' }, { id: 'language', x: 0.9, y: 0.86, type: 'base', label: 'LANGUAGE' },
] as const
const EDGES: readonly Edge[] = [
  { source: 'ministry', target: 'policy' }, { source: 'policy', target: 'project' }, { source: 'project', target: 'enterprise' },
  { source: 'people', target: 'project' }, { source: 'capital', target: 'enterprise' }, { source: 'institution', target: 'project' },
  { source: 'market', target: 'enterprise' }, { source: 'founder', target: 'people' }, { source: 'signal', target: 'policy' },
  { source: 'document', target: 'policy' }, { source: 'network', target: 'institution' }, { source: 'place', target: 'market' },
  { source: 'opportunity', target: 'capital' }, { source: 'data', target: 'signal' }, { source: 'language', target: 'people' },
]
const LENSES: Record<string, ActiveLens> = {
  Entrepreneur: { activeNodes: ['people', 'project', 'enterprise', 'opportunity'], activeEdges: EDGES.filter((e) => ['people', 'project', 'enterprise'].includes(e.target)) },
  Investor: { activeNodes: ['capital', 'enterprise', 'market', 'project'], activeEdges: EDGES.filter((e) => ['capital', 'enterprise', 'market'].includes(e.target)) },
  'Policy analyst': { activeNodes: ['ministry', 'policy', 'institution', 'project'], activeEdges: EDGES.filter((e) => ['policy', 'institution', 'project'].includes(e.target)) },
  'Community builder': { activeNodes: ['people', 'place', 'network', 'project'], activeEdges: EDGES.filter((e) => ['people', 'network', 'project'].includes(e.target)) },
}
const coherentIds = ['ministry', 'policy', 'project', 'enterprise']

export function EcosystemCanvas({ mode = 'ecosystem', active, lens = 'Entrepreneur', onSelect, onCoherent }: GraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number | null>(null)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [ritaStage, setRitaStage] = useState(mode === 'rita' ? 0 : 4)
  const [hovered, setHovered] = useState<string | null>(null)
  const sweepRef = useRef<{ edge: Edge; started: number }[]>([])
  const targetLens = useMemo(() => mode === 'rita' ? { activeNodes: ritaStage >= 3 ? coherentIds : [], activeEdges: ritaStage >= 2 ? EDGES.filter((e) => coherentIds.includes(e.source) && coherentIds.includes(e.target)) : [] } : (LENSES[lens] ?? LENSES.Entrepreneur), [lens, mode, ritaStage])
  const targetRef = useRef(targetLens)
  const currentRef = useRef(0)
  const previousLensRef = useRef<ActiveLens>(targetLens)
  targetRef.current = targetLens

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    if (previousLensRef.current !== targetLens && mode !== 'rita') {
      sweepRef.current = targetLens.activeEdges.map((edge, index) => ({ edge, started: performance.now() + index * 55 }))
      previousLensRef.current = targetLens
      currentRef.current = reduced ? 1 : 0
    }
  }, [targetLens, mode, reduced])

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    if (!canvas || !parent) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let width = 1; let height = 1; let dpr = 1; let visible = true; let disposed = false
    const resize = () => {
      const rect = parent.getBoundingClientRect(); const nextWidth = Math.max(1, Math.floor(rect.width)); const nextHeight = Math.max(1, Math.floor(rect.height)); const nextDpr = Math.min(window.devicePixelRatio || 1, 2)
      if (nextWidth === width && nextHeight === height && nextDpr === dpr) return
      width = nextWidth; height = nextHeight; dpr = nextDpr; canvas.width = Math.floor(width * dpr); canvas.height = Math.floor(height * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const point = (node: NodeGeometry) => ({ x: node.x * width, y: node.y * height })
    const draw = (now: number) => {
      if (disposed || !visible) return
      resize(); ctx.clearRect(0, 0, width, height)
      const geometry = BASE_GEOMETRY.filter((node) => width > 520 || node.type !== 'base' || ['founder', 'signal', 'network', 'opportunity'].includes(node.id))
      const activeState = targetRef.current; const progress = reduced ? 1 : Math.min(1, currentRef.current + 0.025); currentRef.current = progress
      const activeSet = new Set(activeState.activeNodes); const activeEdges = new Set(activeState.activeEdges.map((e) => `${e.source}:${e.target}`)); const selected = hovered ?? active
      ctx.lineWidth = 0.5; ctx.strokeStyle = 'rgba(26,26,26,0.05)'
      EDGES.forEach((edge) => { const a = geometry.find((n) => n.id === edge.source); const b = geometry.find((n) => n.id === edge.target); if (!a || !b) return; const p = point(a); const q = point(b); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke() })
      EDGES.forEach((edge) => { const key = `${edge.source}:${edge.target}`; if (!activeEdges.has(key)) return; const a = geometry.find((n) => n.id === edge.source); const b = geometry.find((n) => n.id === edge.target); if (!a || !b) return; const p = point(a); const q = point(b); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(115,115,115,0.8)'; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke() })
      geometry.forEach((node) => { const p = point(node); const isActive = activeSet.has(node.id); const isRelated = selected && (node.id === selected || EDGES.some((e) => (e.source === selected || e.target === selected) && (e.source === node.id || e.target === node.id))); const opacity = selected ? (isRelated ? 1 : isActive ? 0.4 : 0.1) : isActive ? 0.9 : node.type === 'base' ? 0.45 : 0.7; const radius = node.type === 'anchor' ? 6 : isActive ? 3.5 : 2
        ctx.globalAlpha = opacity; ctx.fillStyle = node.type === 'anchor' ? '#FFFFFF' : 'rgba(26,26,26,0.1)'; ctx.strokeStyle = node.type === 'anchor' ? '#1A1A1A' : 'rgba(26,26,26,0.3)'; ctx.lineWidth = node.type === 'anchor' ? 1 : 0.5; ctx.beginPath(); ctx.arc(p.x, p.y, radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); if ((isActive && node.type === 'anchor') || (mode === 'rita' && ritaStage >= 4 && coherentIds.includes(node.id))) { ctx.globalAlpha = 1; ctx.fillStyle = '#1A1A1A'; ctx.font = `${width < 520 ? 9 : 10}px var(--font-mono), monospace`; ctx.fillText(node.label, p.x + 12, p.y + 4) } })
      ctx.globalAlpha = 1
      sweepRef.current = sweepRef.current.filter((item) => { const elapsed = now - item.started; if (elapsed < 0) return true; if (elapsed > 300) return false; const a = geometry.find((n) => n.id === item.edge.source); const b = geometry.find((n) => n.id === item.edge.target); if (a && b) { const p = point(a); const q = point(b); const t = elapsed / 300; ctx.strokeStyle = 'rgba(26,26,26,0.95)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + (q.x - p.x) * t, p.y + (q.y - p.y) * t); ctx.stroke() } return true })
      if (!paused && !reduced) frameRef.current = requestAnimationFrame(draw)
    }
    const schedule = () => { if (frameRef.current === null) frameRef.current = requestAnimationFrame(draw) }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) schedule(); else if (frameRef.current !== null) { cancelAnimationFrame(frameRef.current); frameRef.current = null } }, { threshold: 0.01 })
    observer.observe(parent); window.addEventListener('resize', schedule, { passive: true }); schedule()
    return () => { disposed = true; observer.disconnect(); window.removeEventListener('resize', schedule); if (frameRef.current !== null) cancelAnimationFrame(frameRef.current) }
  }, [active, mode, paused, reduced, hovered, ritaStage])

  const handlePointer = (event: React.PointerEvent<HTMLCanvasElement>) => { const canvas = canvasRef.current; if (!canvas) return; const rect = canvas.getBoundingClientRect(); const x = event.clientX - rect.left; const y = event.clientY - rect.top; const hit = BASE_GEOMETRY.map((node) => ({ node, x: node.x * rect.width, y: node.y * rect.height })).map(({ node, x: nx, y: ny }) => ({ node, distance: Math.hypot(x - nx, y - ny) })).filter(({ distance }) => distance < 24).sort((a, b) => a.distance - b.distance)[0]?.node.id ?? null; setHovered(hit) }
  const select = () => { if (hovered) onSelect?.(hovered) }
  const evaluate = () => { setRitaStage(1); onCoherent?.(); window.setTimeout(() => setRitaStage(2), 300); window.setTimeout(() => setRitaStage(3), 900); window.setTimeout(() => setRitaStage(4), 1500) }
  return <div className="graph-shell"><canvas ref={canvasRef} role="img" aria-label={`${mode} ecosystem graph`} onPointerMove={handlePointer} onPointerLeave={() => setHovered(null)} onClick={select} /><button className="graph-toggle" onClick={() => setPaused((value) => !value)} aria-label={paused ? 'Resume graph animation' : 'Pause graph animation'}>{paused ? 'PLAY' : 'PAUSE'}</button>{mode === 'rita' && <button className="graph-cta" onClick={evaluate} disabled={ritaStage > 0}>Evaluate Coherence →</button>}</div>
}

export function ProvenancePanel({ entity = 'POLICY', relationship = 'POLICY ↔ PROJECT' }: { entity?: string; relationship?: string }) { return <aside className="provenance" aria-live="polite"><span className="technical-note">SYS // RELATIONSHIP_TRACE</span><strong>{entity} // REVISION_2026</strong><span className="technical-note">RELATIONSHIP</span><strong>{relationship}</strong><p><b>FACT</b> Conceptual demonstration: relationships are shown as inspectable claims rather than live evidence.</p><p className="technical-note"><b>EVIDENCE</b> DEMO // FIELD_NOTE_042<br/>SOURCE STATUS // NOT LIVE INTELLIGENCE</p></aside> }

export function RitaSequencer() { const [coherent, setCoherent] = useState(false); return <div className="rita-visual"><EcosystemCanvas mode="rita" onCoherent={() => setCoherent(true)} /><div className="rita-story" aria-live="polite">{coherent && <><span className="technical-note">SYS // COHERENT_PATTERN_DETECTED</span><strong>MINISTRY → POLICY → PROJECT → ENTERPRISE</strong><ProvenancePanel /></>}</div></div> }

export function PerspectiveGraph({ perspective, selected, onSelect }: { perspective: string; selected: string; onSelect: (value: string) => void }) { return <EcosystemCanvas mode="perspective" lens={perspective} active={selected} onSelect={onSelect} /> }

export function PerspectiveSection() {
  const [perspective, setPerspective] = useState('Entrepreneur')
  const [selected, setSelected] = useState('project')
  const options = ['Entrepreneur', 'Investor', 'Policy analyst', 'Community builder']
  const nodes = [['people','PEOPLE'],['project','PROJECT'],['enterprise','ENTERPRISE'],['opportunity','OPPORTUNITY'],['capital','CAPITAL'],['market','MARKET']] as const
  return <><div className="tabs" role="tablist">{options.map((item) => <button key={item} role="tab" aria-selected={item === perspective} onClick={() => setPerspective(item)}>{item}</button>)}</div><div className="perspective-grid"><div className="perspective-canvas"><PerspectiveGraph perspective={perspective} selected={selected} onSelect={setSelected} /></div><div className="lens-panel"><span className="technical-note">ACTIVE LENS / {perspective.toUpperCase()}</span><h3>{perspective === 'Entrepreneur' ? 'Where could I enter?' : perspective === 'Investor' ? 'Where is momentum forming?' : perspective === 'Policy analyst' ? 'Where are coordination gaps?' : 'Who is already moving?'}</h3><p>Select a node to inspect its role in this view.</p><div className="node-buttons">{nodes.map(([id, label]) => <button className={selected === id ? 'node-selected' : ''} key={id} onClick={() => setSelected(id)}><span>○</span>{label}<ChevronRight size={14} /></button>)}</div></div></div></>
}

export const graphNodes = BASE_GEOMETRY.filter((node) => node.type !== 'base').map((node) => [node.id, node.label] as const)
export const ritaNodes = coherentIds
