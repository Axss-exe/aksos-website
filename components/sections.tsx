import { AKSOSLogo, ATISLogo } from '@/components/brand'
import { InterestForm } from '@/components/interest-form'
import { HeroField } from '@/components/visuals/HeroField'
import { AtisRevelation } from '@/components/visuals/AtisRevelation'
import { RitaConvergence } from '@/components/visuals/RitaConvergence'
import { ProvenanceTrace } from '@/components/visuals/ProvenanceTrace'
import { PerspectiveLens } from '@/components/visuals/PerspectiveLens'
import { ParticipationField } from '@/components/visuals/ParticipationField'
import { ZimbabweCaseStudy } from '@/components/visuals/ZimbabweCaseStudy'
import { HorizonTrajectories } from '@/components/visuals/HorizonTrajectories'
import { ClosingEntry } from '@/components/visuals/ClosingEntry'

export function Eyebrow({ children }: { children: React.ReactNode }) { return <p className="eyebrow"><span className="eyebrow-rule" />{children}</p> }
export function SiteHeader() { return <header className="site-header"><a href="#top" aria-label="AKSOS home"><AKSOSLogo compact /></a><nav aria-label="Primary navigation"><a href="#atis">ATIS</a><a href="#rita">RITA</a><a href="#perspective">Perspective</a><a href="#participate">Enter</a></nav><a className="header-link" href="#participate">Choose an entry point →</a></header> }
function Split({ id, eyebrow, title, children, visual }: { id?: string; eyebrow: string; title: React.ReactNode; children: React.ReactNode; visual: React.ReactNode }) { return <section id={id} className="journey-section split-section"><div className="section-copy"><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2><div className="prose">{children}</div></div><div className="section-visual">{visual}</div></section> }
export function HeroSection() { return <section className="hero-section" id="top"><div className="hero-copy"><Eyebrow>AKSOS // ECOSYSTEM VISIBILITY</Eyebrow><h1>Make the invisible <em>legible.</em></h1><p className="lede">Complexity contains structure. Structure creates context. Context creates relevance. AKSOS explores how relevance can become actionable understanding.</p><a className="text-link" href="#atis">Enter the visual journey →</a></div><HeroField /></section> }
export function ATISSection() { return <Split id="atis" eyebrow="01 // REVEAL" title={<><ATISLogo /> What is connected?</>} visual={<AtisRevelation />}><p>ATIS is an exploration of how fragmented information becomes understandable when relationships and context are made visible.</p><p className="statement">Information does not become intelligence by becoming larger. It becomes intelligence by becoming more legible.</p></Split> }
export function RITASection() { return <Split id="rita" eyebrow="02 // CONVERGE" title="What matters?" visual={<RitaConvergence />}><p>Relationships are easy to collect. Meaning is harder to see. RITA examines candidate relationships and lets the relevant path emerge without pretending every connection is a story.</p></Split> }
export function ProvenanceSection() { return <Split id="provenance" eyebrow="03 // TRACE" title="Why should I believe it?" visual={<ProvenanceTrace />}><p>An insight should be inspectable. Follow the relationship backward from interpretation to inference, fact and source.</p><p className="annotation">CONCEPTUAL DEMONSTRATION — no live evidence is asserted here.</p></Split> }
export function PerspectiveSection() { return <Split id="perspective" eyebrow="04 // FOCUS" title="What does it mean to me?" visual={<PerspectiveLens />}><p>The environment remains stable. Perspective changes emphasis, hierarchy and contextual significance.</p></Split> }
export function ParticipationSection() { return <Split id="participation" eyebrow="05 // ENTER / INTEGRATE" title="Where do I enter?" visual={<ParticipationField />}><p>Actors begin at the edge, bring context, ask questions and enter the shared field at the depth appropriate to them.</p></Split> }
export function ZimbabweSection() { return <Split id="zimbabwe" eyebrow="06 // DISCOVER / STORY" title="How does this work in a real environment?" visual={<ZimbabweCaseStudy />}><p>Zimbabwe is an experimental environment for testing the hypothesis. This demonstration shows the architecture of a story without fabricating live intelligence.</p></Split> }
export function HorizonSection() { return <Split id="horizon" eyebrow="07 // EMERGE" title="What could happen next?" visual={<HorizonTrajectories />}><p>Several trajectories may emerge from present conditions. AKSOS makes them easier to examine without pretending uncertainty has disappeared.</p></Split> }
export function ClosingSection() { return <section id="participate" className="closing-section journey-section"><div className="center-copy"><Eyebrow>08 // ENTER</Eyebrow><h2>The field opens.</h2><p>Choose how you want to enter the work: explore, investigate or participate.</p></div><ClosingEntry /><div id="interest-form" className="form-wrap"><InterestForm contactEmail={process.env.CONTACT_EMAIL ?? 'connect@atis.net'} /></div></section> }
export function SiteFooter() { return <footer><AKSOSLogo /><span>Exploring ecosystem visibility, intelligence and participation.</span><a href="mailto:connect@atis.net">connect@atis.net</a></footer> }
export const JourneyHeader = SiteHeader
export const Hero = HeroSection
export const ATIS = ATISSection
export const RITA = RITASection
export const Provenance = ProvenanceSection
export const Perspective = PerspectiveSection
export const Participation = ParticipationSection
export const Zimbabwe = ZimbabweSection
export const Horizon = HorizonSection
export const Closing = ClosingSection
