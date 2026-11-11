import { useEffect, useRef } from 'react'

interface InViewOptions {
  /** Fração do elemento que precisa estar visível para disparar a entrada */
  threshold?: number
  /** Margem da janela para antecipar ou atrasar o disparo */
  rootMargin?: string
}

/**
 * Disparo de entrada único: adiciona a classe `is-in` ao elemento na primeira
 * vez que ele aparece na tela. Os filhos animam via CSS (`.is-in .filho`).
 */
export function useInView<T extends HTMLElement>({
  threshold = 0.15,
  rootMargin = '0px 0px -12% 0px',
}: InViewOptions = {}) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-in')
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-in')
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return ref
}
