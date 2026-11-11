import { useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { cn, cssVars } from '../lib/utils'

interface TiltCardProps {
  children: ReactNode
  className?: string
  /** Atraso (ms) antes da animação de entrada */
  delay?: number
  /** Lado de onde o card entra */
  from?: 'left' | 'bottom' | 'right'
}

const ENTRY_DIRECTION = { left: -1, bottom: 0, right: 1 } as const

/**
 * Envoltório de card com entrada direcional, inclinação 3D que acompanha o
 * ponteiro (mouse e caneta) e variáveis --mx/--my para o brilho do cursor.
 */
export function TiltCard({ children, className, delay = 0, from = 'bottom' }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || event.pointerType === 'touch') return
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`)
    el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`)
    el.style.setProperty('--ry', `${((px - 0.5) * 9).toFixed(2)}deg`)
    el.style.setProperty('--rx', `${((0.5 - py) * 7).toFixed(2)}deg`)
  }

  const handlePointerLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <div
      ref={ref}
      className={cn('tilt-card', className)}
      style={cssVars({ '--dir': ENTRY_DIRECTION[from], '--delay': `${delay}ms` })}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="tilt-inner">{children}</div>
    </div>
  )
}
