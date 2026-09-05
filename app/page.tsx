'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpRight, ChevronRight, Circle, Menu, Pause, Play, X } from 'lucide-react'

const nodes = [
  ['People', 18, 35], ['Enterprises', 38, 20], ['Institutions', 61, 31], ['Capital', 80, 17],
  ['Projects', 29, 72], ['Policy', 55, 77], ['Markets', 82, 67], ['Opportunity', 67, 52],
] as const

function Graph({ mode = 'ecosystem', active }: { mode?: 'ecosystem' | 'atis' | 'perspective'; active?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const parent = canvas.parentElement
    if (!parent) return
    const ctx = canvas.getContext('2d')!
    let frame = 0
    let raf = 0
    let drawRaf = 0
    let width = 0
    let height = 0
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = parent.getBoundingClientRect()
      const nextWidth = Math.max(1, Math.round(rect.width))
      const nextHeight = Math.max(1, Math.round(rect.height))
      const pixelWidth = Math.round(nextWidth * dpr)
      const pixelHeight = Math.round(nextHeight * dpr)
      if (pixelWidth === canvas.width && pixelHeight === canvas.height) return
      width = nextWidth
      height = nextHeight
      canvas.width = pixelWidth
      canvas.height = pixelHeight
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const draw = () => {
      resizeCanvas()
      if (!width || !height) return
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = '#f7f7f4'; ctx.fillRect(0, 0, width, height)
      const pts = nodes.map((n, i) => ({ x: n[1] / 100 * width, y: n[2] / 100 * height, label: n[0], i }))
      const links = [[0,1],[0,4],[1,2],[1,5],[2,3],[2,6],[2,7],[4,5],[5,6],[5,7],[6,7]]
      ctx.lineWidth = 1
      links.forEach(([a,b]) => { ctx.strokeStyle = mode === 'atis' ? '#b6b6ae' : '#c9c9c2'; ctx.beginPath(); ctx.moveTo(pts[a].x,pts[a].y); ctx.lineTo(pts[b].x,pts[b].y); ctx.stroke() })
      pts.forEach((p) => { const isActive = active === p.label; ctx.fillStyle = isActive ? '#11110f' : '#fff'; ctx.strokeStyle = '#11110f'; ctx.lineWidth = isActive ? 2 : 1; ctx.beginPath(); ctx.arc(p.x,p.y,isActive ? 7 : 5,0,Math.PI*2); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#11110f'; ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, monospace'; ctx.fillText(p.label, p.x + 10, p.y + 4) })
      if (mode === 'atis') { ctx.strokeStyle = '#11110f'; ctx.setLineDash([3,3]); ctx.strokeRect(width*.11,height*.12,width*.76,height*.72); ctx.setLineDash([]) }
      if (!paused) { frame += 1; raf = requestAnimationFrame(draw) }
    }
    const scheduleDraw = () => {
      cancelAnimationFrame(drawRaf)
      drawRaf = requestAnimationFrame(draw)
    }
    const observer = new ResizeObserver(scheduleDraw)
    observer.observe(parent)
    scheduleDraw()
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
      cancelAnimationFrame(drawRaf)
    }
  }, [active, mode, paused])
  return <div className="graph-shell"><canvas ref={ref} aria-label={`${mode} ecosystem graph`} role="img" /><button className="graph-toggle" onClick={() => setPaused(!paused)} aria-label={paused ? 'Play graph motion' : 'Pause graph motion'}>{paused ? <Play size={14}/> : <Pause size={14}/>}</button></div>
}

function SectionLabel({ children }: { children: React.ReactNode }) { return <p className="eyebrow"><span className="eyebrow-rule" />{children}</p> }
function Header() { const [open,setOpen] = useState(false); return <header className="site-header"><a className="brand" href="#top">AKSOS<span>·</span></a><nav className={open ? 'nav open' : 'nav'}>{['Problem','ATIS','RITA','Perspective','Participate'].map(x => <a key={x} href={`#${x.toLowerCase()}`} onClick={()=>setOpen(false)}>{x}</a>)}</nav><button className="menu-button" onClick={()=>setOpen(!open)} aria-label="Toggle navigation">{open ? <X/> : <Menu/>}</button></header> }

export default function Page() {
  const [perspective,setPerspective] = useState('Entrepreneur')
  const [rita,setRita] = useState(0)
  const [selected,setSelected] = useState('Opportunity')
  const perspectives = ['Entrepreneur','Investor','Policy analyst','Community builder']
  return <main id="top"><Header/><section className="hero section-grid"><div className="hero-copy"><SectionLabel>Research & development initiative</SectionLabel><h1>Making African ecosystems <em>legible.</em></h1><p className="lede">AKSOS is investigating whether better visibility can improve how people understand, navigate, and participate in the ecosystems around them.</p><div className="hero-meta"><span>Hypothesis 01</span><span>Visibility → understanding → participation</span></div></div><Graph/></section>
    <section id="problem" className="section split"><div><SectionLabel>The visibility gap</SectionLabel><h2>If an ecosystem is difficult to see, it becomes difficult to understand.</h2></div><div className="prose"><p>African ecosystems contain people, enterprises, institutions, government, capital, projects, policy, markets, opportunities, and relationships.</p><p>These elements are not absent. They are often distributed across places, languages, documents, conversations, and informal networks — making the whole difficult to perceive.</p><p className="muted">AKSOS begins with a question, not a claim: what changes when the relationships between these elements become easier to see?</p></div></section>
    <section className="section dark-band"><div className="band-grid"><div><SectionLabel>Persona impact</SectionLabel><h2>Different people experience the same opacity differently.</h2></div><div className="persona-list">{[['01','The founder','Cannot tell which pathway, partner, or signal is worth pursuing.'],['02','The investor','Struggles to see emerging activity before it becomes legible through conventional channels.'],['03','The institution','Sees a mandate, but not always the full field of actors it could coordinate with.']].map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>
    <section className="section hypothesis"><div className="center-copy"><SectionLabel>The AKSOS hypothesis</SectionLabel><h2>Visibility is not the destination.<br/><span>It is the precondition for participation.</span></h2><p>We are exploring whether a shared, living view of an ecosystem can help more people find context, identify relationships, and act with greater confidence.</p></div></section>
    <section className="section origin split"><div><SectionLabel>Origin</SectionLabel><h2>From scattered signals to a coherent field of view.</h2></div><div className="prose"><p>AKSOS emerged from noticing a recurring pattern: useful information exists, but the connective tissue between it is hard to hold in one mind.</p><p>The work is to design systems that preserve nuance while making relationships inspectable — without pretending that a map is the territory.</p></div></section>
    <section id="atis" className="section atis"><div className="section-heading"><div><SectionLabel>System layer / 01</SectionLabel><h2>ATIS</h2><p className="section-intro">African Transaction & Intelligence System — a conceptual system for assembling signals into a navigable ecosystem view.</p></div><div className="technical-note">CONCEPTUAL DEMONSTRATION<br/>Not live intelligence</div></div><div className="atis-grid"><Graph mode="atis"/><div className="steps">{[['Collect','Signals enter from documents, conversations, datasets, and observations.'],['Relate','Entities and events are connected through explicit relationships.'],['Contextualise','The system keeps provenance and surfaces uncertainty.']].map(([t,d],i)=><div className="step" key={t}><span>0{i+1}</span><div><h3>{t}</h3><p>{d}</p></div></div>)}</div></div></section>
    <section id="rita" className="section rita split"><div><SectionLabel>System layer / 02</SectionLabel><h2>RITA</h2><p className="section-intro">A coherence layer for asking: does this relationship hold together?</p><div className="rita-controls"><button onClick={()=>setRita(Math.max(0,rita-1))} aria-label="Previous RITA state"><ArrowUp/></button><span>{['Ambiguity','Evaluation','Convergence','Story','Provenance'][rita]}</span><button onClick={()=>setRita(Math.min(4,rita+1))} aria-label="Next RITA state"><ArrowDown/></button></div></div><div className="rita-card"><div className="rita-track">{['Ambiguity','Evaluation','Convergence','Story','Provenance'].map((x,i)=><div className={i<=rita?'rita-node active':'rita-node'} key={x}><span>{i+1}</span><small>{x}</small></div>)}</div><p>{['Many plausible relationships exist. The system should not collapse uncertainty too early.','Signals are compared, weighted, and held against their provenance.','A smaller set of relationships begins to form a coherent pattern.','The pattern becomes a usable narrative without losing its edges.','Every claim can be traced back to the record that supports it.'][rita]}</p><div className="record"><span>RECORD / {String(rita+1).padStart(2,'0')}</span><code>source: field-note-042<br/>confidence: {rita > 1 ? 'reviewed' : 'open'}<br/>status: {rita === 4 ? 'traceable' : 'in process'}</code></div></div></section>
    <section id="perspective" className="section perspective"><div className="section-heading"><div><SectionLabel>Perspective</SectionLabel><h2>The question changes the map.</h2><p className="section-intro">The underlying graph stays the same. The lens changes what becomes prominent.</p></div><div className="tabs" role="tablist">{perspectives.map(p=><button className={perspective===p?'selected':''} key={p} onClick={()=>setPerspective(p)}>{p}</button>)}</div></div><div className="perspective-grid"><Graph mode="perspective" active={selected}/><div className="lens-panel"><span className="technical-note">ACTIVE LENS / {perspective.toUpperCase()}</span><h3>{perspective === 'Entrepreneur' ? 'Where could I enter?' : perspective === 'Investor' ? 'Where is momentum forming?' : perspective === 'Policy analyst' ? 'Where are coordination gaps?' : 'Who is already moving?'}</h3><p>Select a node to inspect its role in this view.</p><div className="node-buttons">{nodes.map(n=><button className={selected===n[0]?'node-selected':''} key={n[0]} onClick={()=>setSelected(n[0])}><Circle size={9}/>{n[0]}<ChevronRight size={14}/></button>)}</div></div></div></section>
    <section className="section use-cases split"><div><SectionLabel>Use cases</SectionLabel><h2>A map becomes useful when it changes what someone can do next.</h2></div><div className="case-list">{['Discover a pathway into an unfamiliar ecosystem.','Find relationships that are invisible in a directory.','Coordinate around a shared, inspectable context.','Make a better question before making a larger decision.'].map((x,i)=><div key={x}><span>0{i+1}</span><p>{x}</p><ArrowUpRight size={18}/></div>)}</div></section>
    <section id="participate" className="section batana dark-band"><div className="band-grid"><div><SectionLabel>Participation pathway</SectionLabel><h2>Batana</h2><p className="section-intro">A way to contribute signals, context, and lived knowledge back into the field.</p></div><div className="batana-copy"><p>Batana is a working idea for participation: a bridge between the people who know an ecosystem intimately and the systems trying to represent it responsibly.</p><a href="mailto:hello@aksos.org" className="text-link">Start a conversation <ArrowUpRight size={16}/></a></div></div></section>
    <section className="section zimbabwe split"><div><SectionLabel>Testing environment</SectionLabel><h2>Why Zimbabwe?</h2></div><div className="prose"><p>Zimbabwe offers a grounded environment for asking how visibility, participation, and local knowledge interact in practice.</p><p>This is not a claim of scale or a finished pilot. It is a proposed testing context where the hypothesis can meet real people, real constraints, and real feedback.</p></div></section>
    <section className="section horizon"><div className="center-copy"><SectionLabel>Horizon</SectionLabel><h2>The next step is not more data.<br/><em>It is better questions.</em></h2><p>AKSOS is building slowly: making the system understandable, keeping the claims traceable, and learning from the people whose ecosystems it hopes to help make visible.</p><a className="primary-link" href="mailto:hello@aksos.org">Contact AKSOS <ArrowUpRight size={17}/></a></div></section>
    <footer><span className="brand">AKSOS<span>·</span></span><span>Researching visibility, understanding, and participation.</span><span>© 2026 / Working initiative</span></footer>
  </main>
}
