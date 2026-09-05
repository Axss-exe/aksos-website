export function AKSOSLogo({ compact = false }: { compact?: boolean }) {
  return <span className={`brand-mark ${compact ? 'brand-mark-compact' : ''}`}><img src="/aksos-symbol-traced.svg" alt="" width="28" height="28" /><span>AKSOS</span></span>
}

export function ATISLogo({ compact = false }: { compact?: boolean }) {
  return <span className={`brand-mark ${compact ? 'brand-mark-compact' : ''}`}><img src="/atis-symbol-traced.svg" alt="" width="24" height="24" /><span>ATIS</span></span>
}
