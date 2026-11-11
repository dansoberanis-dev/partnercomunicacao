import { useEffect, useRef } from 'react'
import { subscribeScroll } from '../lib/scroll'

/** Barra fina no topo que acompanha o quanto da página já foi lido. */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(
    () =>
      subscribeScroll(({ y, vh }) => {
        const bar = barRef.current
        if (!bar) return
        const max = document.documentElement.scrollHeight - vh
        const progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0
        bar.style.transform = `scaleX(${progress.toFixed(4)})`
      }),
    [],
  )

  return <div ref={barRef} aria-hidden="true" className="scroll-progress" />
}
