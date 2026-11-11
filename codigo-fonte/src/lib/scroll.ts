export interface ScrollSnapshot {
  /** Deslocamento vertical da página em px */
  y: number
  /** Altura da janela em px */
  vh: number
}

type ScrollListener = (snapshot: ScrollSnapshot) => void

const listeners = new Set<ScrollListener>()
let frame = 0

function flush() {
  frame = 0
  const snapshot: ScrollSnapshot = { y: window.scrollY, vh: window.innerHeight }
  listeners.forEach((listener) => listener(snapshot))
}

function requestFlush() {
  if (!frame) frame = window.requestAnimationFrame(flush)
}

/**
 * Assina atualizações de rolagem e redimensionamento. Todos os ouvintes
 * compartilham um único listener e rodam no máximo uma vez por quadro.
 * Retorna a função de cancelamento, que pode ser devolvida direto no useEffect.
 */
export function subscribeScroll(listener: ScrollListener): () => void {
  listeners.add(listener)
  if (listeners.size === 1) {
    window.addEventListener('scroll', requestFlush, { passive: true })
    window.addEventListener('resize', requestFlush)
  }
  requestFlush()

  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      window.removeEventListener('scroll', requestFlush)
      window.removeEventListener('resize', requestFlush)
      if (frame) window.cancelAnimationFrame(frame)
      frame = 0
    }
  }
}
