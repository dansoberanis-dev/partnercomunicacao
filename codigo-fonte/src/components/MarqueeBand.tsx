import { useEffect, useRef } from 'react'

interface MarqueeBandProps {
  items: readonly string[]
}

const BASE_SPEED = 0.9 // px por quadro, em repouso
const MAX_BOOST = 24 // aceleração máxima ao rolar rápido

/**
 * Faixa de palavras-chave em movimento contínuo. A velocidade aumenta com a
 * rolagem e o sentido se inverte quando o visitante sobe a página.
 */
export function MarqueeBand({ items }: MarqueeBandProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const track = trackRef.current
    if (!wrap || !track) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let half = 0
    const measure = () => {
      half = track.scrollWidth / 2
    }
    measure()
    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    resizeObserver?.observe(track)

    let x = 0
    let boost = 0
    let direction = -1
    let lastY = window.scrollY
    let frame = 0

    const step = () => {
      const y = window.scrollY
      const delta = y - lastY
      lastY = y
      if (delta !== 0) direction = delta > 0 ? -1 : 1
      const target = Math.min(Math.abs(delta) * 1.4, MAX_BOOST)
      boost = (boost + (target - boost) * 0.12) * 0.94
      x += direction * (BASE_SPEED + boost)
      if (half > 0) {
        if (x <= -half) x += half
        else if (x >= 0) x -= half
      }
      track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`
      frame = window.requestAnimationFrame(step)
    }

    const start = () => {
      if (!frame) {
        lastY = window.scrollY
        frame = window.requestAnimationFrame(step)
      }
    }
    const stop = () => {
      window.cancelAnimationFrame(frame)
      frame = 0
    }

    // Só gasta processamento enquanto a faixa está visível
    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    if (observer) observer.observe(wrap)
    else start()

    return () => {
      observer?.disconnect()
      resizeObserver?.disconnect()
      stop()
    }
  }, [])

  const renderGroup = (key: number) => (
    <div key={key} className="flex shrink-0 items-center">
      {items.map((item) => (
        <span
          key={item}
          className="flex shrink-0 items-center gap-6 pr-6 text-sm font-extrabold uppercase tracking-[0.22em] md:text-base"
        >
          {item}
          <span aria-hidden="true" className="size-2 rotate-45 bg-sky" />
        </span>
      ))}
    </div>
  )

  return (
    <div ref={wrapRef} aria-hidden="true" className="marquee-band">
      <div ref={trackRef} className="flex w-max items-center will-change-transform">
        {renderGroup(0)}
        {renderGroup(1)}
      </div>
    </div>
  )
}
