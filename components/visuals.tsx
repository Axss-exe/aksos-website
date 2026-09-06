'use client'

import { useEffect, useRef, useState } from 'react'

type Point = { x: number; y: number; label: string }
const points: Point[] = [
  { x: 12, y: 32, label: 'INSTITUTION' }, { x: 34, y: 22, label: 'POLICY' },
  { x: 56, y: 48, label: 'PROJECT' }, { x: 78, y: 27, label: 'ENTERPRISE' },
  { x: 88, y: 70, label: 'CAPITAL' }, { x: 42, y: 76, label: 'MARKET' },
]
const links = [[0,1],[1,2],[2,3],[2,5],[3,4],[5,4]]

function useInView(ref: React.RefObject<Element | null>) {
  const [visible, setVisible] = useState(true)
  useEffect(() => { const el = ref.current; if (!el) return; const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 }); observer.observe(el); return () => observer.disconnect() }, [ref])
  return visible
}

export function HeroField() {
  const ref = useRef<HTMLDivElement>(null); const canvasRef = useRef<HTMLCanvasElement>(null); const visible = useInView(ref)
  useEffect(() => { const canvas = canvasRef.current; const host = ref.current; if (!canvas || !host) return; const ctx = canvas.getContext('2d'); if (!ctx) return; let raf = 0; let stopped = false; const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; const draw = (time: number) => { if (stopped || !visible) return; const rect = host.getBoundingClientRect(); const dpr = Math.min(window.devicePixelRatio || 1, 2); const w = Math.max(1, rect.width); const h = Math.max(1, rect.height); if (canvas.width !== w * dpr || canvas.height !== h * dpr) { canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.width = `${w}px`; canvas.style.height = `${h}px` } ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,w,h); const t = reduced ? 0 : time * .00004; ctx.strokeStyle = 'rgba(26,26,26,.18)'; ctx.lineWidth = 1; for (let i=0;i<7;i++) { const x = w*(.12+i*.13)+Math.sin(t+i)*4; const y = h*(.25+(i%3)*.23); ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+w*.15,y+h*.13); ctx.stroke() } ctx.fillStyle = '#1a1a1a'; for (let i=0;i<18;i++) { const x = w*(.1+(i*37%80)/100)+Math.sin(t+i)*3; const y = h*(.15+(i*53%70)/100)+Math.cos(t+i)*2; ctx.globalAlpha = i%4===0 ? .55 : .2; ctx.fillRect(x,y,2,2) } ctx.globalAlpha=1; raf = requestAnimationFrame(draw) }; if (visible) raf=requestAnimationFrame(draw); return () => { stopped=true; cancelAnimationFrame(raf) } }, [visible])
  return <div ref={ref} className="visual hero-field" aria-label="Abstract fragments reveal partial structure beneath visible complexity"><canvas ref={canvasRef} aria-hidden="true" /><span className="visual-note">FIELD / HIDDEN STRUCTURE</span></div>
}

export function AtisRevelation() { const [stage,setStage]=useState(0); const labels=['RAW','ENTITY','RELATIONSHIP','CONTEXT','SIGNAL','INTELLIGENCE']; return <div className="revelation"><svg viewBox="0 0 100 100" role="img" aria-label="One field transforms from fragments into contextual intelligence"><g className={`revelation-stage s${stage}`}>{points.map((p,i)=><g key={p.label} className={i<=stage+1?'visible':''}><circle cx={p.x} cy={p.y} r={i<=stage+1?2.8:1.3}/>{i<=stage+1&&<text x={p.x+4} y={p.y+1}>{p.label}</text>}</g>)}{links.map(([a,b])=><line key={`${a}-${b}`} x1={points[a].x} y1={points[a].y} x2={points[b].x} y2={points[b].y} />)}</g></svg><div className="visual-controls"><span>{labels[stage]}</span><button type="button" onClick={()=>setStage((stage+1)%labels.length)}>{stage===labels.length-1?'Restart revelation':'Reveal next'}</button></div></div> }

export function RitaConvergence() { const [step,setStep]=useState(0); const chain=['MINISTRY','POLICY','PROJECT','ENTERPRISE']; return <div className="rita-visual"><svg viewBox="0 0 100 100" role="img" aria-label="Candidate relationships converge into a coherent story">{chain.map((label,i)=><g key={label} className={i<=step?'trace-active':''}><circle cx={18+i*21} cy={52} r="3"/><text x={18+i*21} y="42" textAnchor="middle">{label}</text>{i<chain.length-1&&<line x1={21+i*21} y1="52" x2={36+i*21} y2="52"/>}</g>)}<path className={step>=2?'trace-active':''} d="M10 26 C28 6 45 82 65 24 S85 70 96 38" /></svg><div className="visual-controls"><span>{step<2?'CANDIDATE RELATIONSHIPS':'COHERENT STORY'}</span><button type="button" onClick={()=>setStep(step<3?step+1:0)}>{step===0?'Evaluate coherence':'Continue trace'}</button></div>{step>=3&&<p className="annotation">SYS // COHERENT_PATTERN_DETECTED<br />CONCEPTUAL DEMONSTRATION — inspect the relationship before treating it as a claim.</p>}</div> }

export function ProvenanceTrace() { const [depth,setDepth]=useState(0); const chain=['INSIGHT','INFERENCE','RELATIONSHIP','FACT','SOURCE']; return <div className="provenance-visual"><svg viewBox="0 0 100 100" role="img" aria-label="Evidence chain traced from insight back to source">{chain.map((label,i)=><g key={label} className={i<=depth?'trace-active':''}><circle cx="18+i*16" cy={i%2?62:38} r="3"/><text x={18+i*16} y={i%2?75:25} textAnchor="middle">{label}</text>{i<chain.length-1&&<line x1={21+i*16} y1={i%2?62:38} x2={31+i*16} y2={i%2?38:62}/>}</g>)}</svg><div className="visual-controls"><span>FACT ≠ INFERENCE</span><button type="button" onClick={()=>setDepth(depth<4?depth+1:0)}>{depth===4?'Restart trace':'Trace backward'}</button></div><p className="annotation">CONCEPTUAL DEMONSTRATION — no live evidence is asserted here.</p></div> }

export function PerspectiveLens() { const [lens,setLens]=useState('ENTERPRISE'); return <div className="perspective-visual"><div className="lens-tabs">{['ENTERPRISE','INVESTOR','RESEARCHER'].map(item=><button key={item} type="button" aria-pressed={lens===item} onClick={()=>setLens(item)}>{item}</button>)}</div><svg viewBox="0 0 100 70" role="img" aria-label={`The same ecosystem emphasized through the ${lens} perspective`}>{points.map((p,i)=><g key={p.label} className={i<({ENTERPRISE:4,INVESTOR:5,RESEARCHER:2}[lens as string]??3)?'lens-focus':''}><circle cx={p.x} cy={p.y*.7} r="3"/><text x={p.x+4} y={p.y*.7+1}>{p.label}</text></g>)}{links.map(([a,b])=><line key={`${a}-${b}`} x1={points[a].x} y1={points[a].y*.7} x2={points[b].x} y2={points[b].y*.7}/>)}</svg><p className="annotation">ONE ENVIRONMENT / DIFFERENT QUESTIONS</p></div> }

export function ParticipationField() { return <div className="participation-visual" role="img" aria-label="Entry trajectories move from the edge into a shared intelligence field"><svg viewBox="0 0 100 80"><path d="M4 18 C28 18 24 40 52 40 S72 40 96 40"/><path d="M4 62 C28 62 32 48 52 40"/><circle cx="52" cy="40" r="5"/><text x="56" y="37">SHARED FIELD</text><text x="5" y="14">ENTERPRISE</text><text x="5" y="75">RESEARCHER</text></svg><p className="annotation">INGRESS → INTEGRATION</p></div> }

export function ZimbabweCaseStudy() { const [step,setStep]=useState(0); const labels=['ENVIRONMENT','EVENT','RELATIONSHIPS','CONSEQUENCE','OPPORTUNITY']; return <div className="case-study"><div className="case-line"><span style={{width:`${(step+1)*20}%`}} /></div><strong>{labels[step]}</strong><p>CONCEPTUAL DEMONSTRATION // Zimbabwe is an experimental environment, not a fabricated live intelligence feed.</p><button type="button" onClick={()=>setStep((step+1)%labels.length)}>Advance story →</button></div> }

export function HorizonTrajectories() { const [selected,setSelected]=useState(0); const paths=['ENERGY → INFRASTRUCTURE → INDUSTRIAL DEMAND','POLICY → CAPITAL → PROJECTS','RESEARCH → EVIDENCE → ACTION']; return <div className="horizon-visual"><svg viewBox="0 0 100 80" role="img" aria-label="Several possible trajectories emerge from present conditions">{paths.map((path,i)=><path key={path} className={selected===i?'trajectory-active':''} d={`M5 ${20+i*20} C35 ${15+i*16} 55 ${35-i*8} 95 ${10+i*25}`}/>)}</svg><div className="visual-controls">{paths.map((path,i)=><button key={path} type="button" aria-pressed={selected===i} onClick={()=>setSelected(i)}>Trajectory {i+1}</button>)}</div><p className="annotation">EMERGING SIGNAL // possibility, not prediction</p></div> }

export function ClosingEntry() { return <div className="closing-entry"><a href="#problem">EXPLORE →</a><a href="#atis">INVESTIGATE →</a><a href="#interest-form">PARTICIPATE →</a></div> }

export function ZimbabwePlaceholder() { return <ZimbabweCaseStudy /> }
export function useGraphState() { return { geometry: points, relationships: links } }
export const immutableGeometry = points
export const graphNodes = points
export const graphLenses = { ENTERPRISE: ['PROJECT','ENTERPRISE'], INVESTOR: ['CAPITAL','MARKET'], RESEARCHER: ['POLICY','EVIDENCE'] }
export const ritaNodes = ['MINISTRY','POLICY','PROJECT','ENTERPRISE']
export type Perspective = 'ENTERPRISE' | 'INVESTOR' | 'RESEARCHER'
export { useInView }
