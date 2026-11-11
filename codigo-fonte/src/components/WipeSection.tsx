import { useEffect, type ReactNode } from 'react'
import { useInView } from '../hooks/useInView'
import { subscribeScroll } from '../lib/scroll'
import { cn } from '../lib/utils'

interface WipeSectionProps {
  id?: string
  className?: string
  /** `secondary` pinta um painel de fundo que entra por corte diagonal */
  tone?: 'secondary' | 'none'
  children: ReactNode
}

/**
 * Seção com transição de entrada: o fundo varre a tela na diagonal e a posição
 * relativa da seção (--sp) alimenta os orbes de parallax internos.
 */
export function WipeSection({ id, className, tone = 'none', children }: WipeSectionProps) {
  const ref = useInView<HTMLElement>({ threshold: 0.1, rootMargin: '0px 0px -15% 0px' })

  useEffect(
    () =>
      subscribeScroll(({ vh }) => {
        const el = ref.current
        if (!el) return
        const { top, height } = el.getBoundingClientRect()
        // Negativo quando a seção sobe pela tela, positivo quando ainda está abaixo
        const offset = (top + height / 2 - vh / 2) / vh
        el.style.setProperty('--sp', offset.toFixed(3))
      }),
    [ref],
  )

  return (
    <section id={id} ref={ref} data-tone={tone} className={cn('wipe-section', className)}>
      {children}
    </section>
  )
}
