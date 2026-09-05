# AKSOS Diagram Architecture Specification

## Diagram Audit Matrix

| # | Section | Concept | Current Visual | Required Visual | User Action | State Change | What User Learns |
|---|---------|---------|-----------------|------------------|-------------|---------------|------------------|
| 1 | Hero | Make invisible legible | 78-particle ecosystem | Sparse field (70–100 particles) + pointer interaction | Move pointer | Local region clarity increases | Hidden structure exists |
| 2 | Visibility | Information fragmented | Graph | Information fragments + reveal relationships | Click "Reveal Context" | Isolation → Relationships → Context | Structure was missing |
| 3 | Perspective | Same ecosystem, different questions | 3 selectable lenses | One immutable ecosystem, three interpretive overlays | Select lens (Investor/Enterprise/Researcher) | Emphasis changes, topology unchanged | Question shapes interpretation |
| 4 | Hypothesis | Visibility is infrastructure | Text + flow | Causal sequence visual (not cards) | Auto-play or sequential reveal | Ambiguity → Visibility → Understanding → Participation | Hypothesis connects causally |
| 5 | Origin | Idea development | Text | Sequential stages (Experience → Observation → Problem → Hypothesis) | Auto or step-through | Stages activate sequentially | Thought became hypothesis |
| 6 | Zimbabwe | Hypothesis testing | Text | Abstract → Real ecosystem → Zimbabwe → Test → Learn | Sequential reveal | Stages show progression | Why Zimbabwe matters |
| 7 | ATIS | Transform information | Particle field | Same material gaining structure (7 progressive stages) | Click through stages OR auto-play | Raw → Evidence → Fact → Entities → Relationships → Context → Intelligence | Information becomes intelligence |
| 8 | Intelligence Model | Context changes meaning | Text | Zambia/Zimbabwe perspective shift | Perspective toggle | Same data, different interpretation | Location changes meaning |
| 9 | Inspectable | Provenance trace | Graph + panel | Linear sequence (STORY → RELATIONSHIP → FACT → SOURCE) | Click each stage | Reveal underlying basis | Sources are traceable |
| 10 | RITA | Connection ≠ Coherence | Ambient graph + staged evaluation | Ambiguity → Evaluation animation → Coherence → Story → Provenance | Click "Evaluate Coherence" | Ambiguity → Pattern → Understanding | Connections need meaning |
| 11 | Perspective Selector | Ecosystem + questions | Existing lens switcher | Reuse Diagram 3 ecosystem with same interaction | Select lens (4 options) | Emphasis shifts within same topology | Lens is the interaction |
| 12 | Batana | Participation pathway | Text | Human pathway (Contribute → Discover → Selection → Participation → Access) | Auto-flow or guided | Pathway reveals naturally | Participation has structure |
| 13 | Zimbabwe Detail | Ecosystem legibility | Field | Progressive categorization (Field → Focus → Structure → Understanding) | Auto or interactive reveal | Categories emerge from field | Field becomes legible |
| 14 | Experimental Loop | Learning and transferability | Text | Circular loop (Hypothesis → Test → Observe → Learn → Evaluate → Transferability) | Auto or interactive | Loop completes, remains open | Outcome is learning |
| 15 | Horizon | Regional application | Text | Expanding field with uncertainty | Reveal progressively | Field expands, stays ambiguous | Possibility, not certainty |
| 16 | Invitation | Next steps | Sparse ecosystem + CTAs | Sparse field with pathway actions (Understand/Research/Participate/Collaborate/Explore ATIS) | Real action buttons | Navigate to actual interfaces | Visual possibility → Action |

## Critical Rules Applied

1. **No Universal Hub-and-Spoke**: Each diagram uses appropriate grammar for its concept
2. **Particles Are Substrate, Not Diagram**: Particles only where concept involves ecosystem scale/ambiguity/emergence
3. **Every Interactive Element Has State Machine**: Defined trigger → transition → result → reset
4. **Section-Specific Density**: Sparse (Hero) → Fragmented (Visibility) → Structured (ATIS) → Medium (RITA) → Large (Perspective)
5. **No Decorative Visuals**: If removing a diagram doesn't reduce understanding, it gets removed or redesigned
6. **Comprehension > Wow**: Optimize for spatial clarity and conceptual accuracy

## Implementation Phases

### Phase 1: Particle Field Systems (new components)
- `EcosystemField` — sparse ambient (Hero)
- `FragmentedField` — isolated pieces + reveal interaction (Visibility)
- `AtisProgression` — same material, 7 progressive stages
- `RitaEvaluation` — ambient → frozen → staged relationships → pattern
- `ZimbabweField` — categories emerge from noise

### Phase 2: Sequence/Process Visuals (new components)
- `CausalSequence` — Hypothesis → Visibility → Understanding → Participation
- `IntellectualHistory` — Experience → Observation → Question → Hypothesis
- `ProvenanceChain` — Story → Relationship → Fact → Source (clickable)
- `PathwayFlow` — Contribute → Discover → Selection → Participation → Access
- `ExperimentalLoop` — Circular: Hypothesis → Test → Observe → Learn → Evaluate

### Phase 3: Lens/Perspective Systems (refactor existing)
- Keep existing `PerspectiveSection` structure
- Reuse same ecosystem geometry for Diagram 11
- Add lens selector for Diagram 3

### Phase 4: Integration & Testing
- Remove fake interactivity (dead nodes/buttons)
- Verify all state machines work on mobile/keyboard
- Test reduced-motion compliance
- Final audit against comprehension criteria

## No Changes Needed
- Typography system (Inter/JetBrains Mono)
- Color system (monochrome)
- Grid/spacing (12-column, 120px padding)
- Form component
- Brand marks
