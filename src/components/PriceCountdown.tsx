import { useEffect, useState } from 'react'
import { PRICE_DEADLINE } from '../lib/plans'

function getRemaining() {
  const diff = PRICE_DEADLINE.getTime() - Date.now()
  if (diff <= 0) return null
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds }
}

export function PriceCountdown() {
  // Starts as `undefined` (not the real countdown) so the server-rendered
  // HTML and the client's very first render are byte-identical — computing
  // Date.now() during the initial render would produce two different values
  // (one at SSR time, one at hydration time), which is what caused React's
  // hydration-mismatch error #418. The real value is only set after mount.
  const [remaining, setRemaining] = useState<ReturnType<typeof getRemaining> | undefined>(undefined)

  useEffect(() => {
    setRemaining(getRemaining())
    const id = setInterval(() => setRemaining(getRemaining()), 1000)
    return () => clearInterval(id)
  }, [])

  if (remaining === undefined) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: 28 }}>
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.72rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--rank-gold)',
          }}
        >
          Founding Hunter pricing ends
        </p>
        <div style={{ display: 'flex', gap: 14, fontFamily: "'Space Mono', monospace", fontSize: '1.1rem', color: '#fff' }}>
          <span>--d</span>
          <span>--h</span>
          <span>--m</span>
          <span>--s</span>
        </div>
      </div>
    )
  }

  if (!remaining) {
    return (
      <p className="text-sm text-gray-400" style={{ textAlign: 'center', marginBottom: 24 }}>
        Founding Hunter pricing has ended.
      </p>
    )
  }

  const { days, hours, minutes, seconds } = remaining

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: 28 }}>
      <p
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.72rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--rank-gold)',
        }}
      >
        Founding Hunter pricing ends
      </p>
      <div style={{ display: 'flex', gap: 14, fontFamily: "'Space Mono', monospace", fontSize: '1.1rem', color: '#fff' }}>
        <span>{String(days).padStart(2, '0')}d</span>
        <span>{String(hours).padStart(2, '0')}h</span>
        <span>{String(minutes).padStart(2, '0')}m</span>
        <span>{String(seconds).padStart(2, '0')}s</span>
      </div>
    </div>
  )
}
