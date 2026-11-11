import type { ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

interface InViewProps {
  className?: string
  children: ReactNode
  threshold?: number
  rootMargin?: string
}

/** Contêiner que dispara as animações dos filhos quando entra na tela. */
export function InView({ className, children, threshold, rootMargin }: InViewProps) {
  const ref = useInView<HTMLDivElement>({ threshold, rootMargin })
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
