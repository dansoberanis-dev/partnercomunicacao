import { useEffect, useRef, useState } from 'react'

const LETTERS = [
  {
    letter: 'P',
    word: 'Pessoas',
    rest: 'essoas.',
    desc: 'O negócio dos negócios são as pessoas, sempre.',
  },
  {
    letter: 'A',
    word: 'Amor',
    rest: 'mor.',
    desc: 'Somos apaixonados pelo que fazemos, por isso somos diferentes.',
  },
  {
    letter: 'R',
    word: 'Responsabilidade',
    rest: 'esponsabilidade',
    desc: 'em nossas ações.',
    inlineJoin: true,
  },
  {
    letter: 'T',
    word: 'Trabalho',
    rest: 'rabalho',
    desc: 'com dedicação e afinco. Sinônimo de credibilidade e prestígio.',
    inlineJoin: true,
  },
  {
    letter: 'N',
    word: 'Nitidez',
    rest: 'itidez.',
    desc: 'Transparência em nossas relações, interações e negociações.',
  },
  {
    letter: 'E',
    word: 'Ética',
    rest: 'tica,',
    desc: 'acima de tudo.',
    fullLine: 'Ética, acima de tudo.',
  },
  {
    letter: 'R',
    word: 'Respeito',
    rest: 'espeito',
    desc: 'às pessoas, normas e ao planeta.',
    fullLine: 'Respeito às pessoas, normas e ao planeta.',
  },
] as const

export function PartnerAcrostic() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      setRevealed(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || revealed) return
    const t = window.setTimeout(() => setRevealed(true), 1200)
    return () => window.clearTimeout(t)
  }, [visible, revealed])

  useEffect(() => {
    if (!visible || paused) return
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % LETTERS.length)
    }, 2600)
    return () => window.clearInterval(timer)
  }, [visible, paused])

  return (
    <section
      ref={sectionRef}
      className="bg-hero relative overflow-hidden py-24 text-navy-foreground"
      aria-labelledby="filosofia-partner-heading"
    >
      <div
        className="anim-floaty pointer-events-none absolute -right-24 top-10 size-80 rounded-full bg-sky/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 size-72 rounded-full bg-sky/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-sky">
            Nossa filosofia
          </p>
          <h2
            id="filosofia-partner-heading"
            className="mt-3 text-3xl font-extrabold md:text-5xl"
          >
            O significado de ser{' '}
            <span className="text-gradient">P.A.R.T.N.E.R.</span>
          </h2>
          <p className="mt-4 text-base text-navy-foreground/80 md:text-lg">
            Cada letra do nosso nome traduz o compromisso diário que guia nossas
            estratégias, entregas e relacionamentos.
          </p>
        </div>

        {/* Monograma animado P · A · R · T · N · E · R */}
        <div
          className="mt-10 flex flex-nowrap items-center justify-center gap-1.5 sm:gap-3"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          role="tablist"
          aria-label="Letras da filosofia Partner"
        >
          {LETTERS.map((item, idx) => {
            const isActive = active === idx
            return (
              <button
                key={`${item.letter}-${idx}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActive(idx)
                  setPaused(true)
                }}
                onMouseEnter={() => setActive(idx)}
                style={{
                  transitionDelay: visible && !revealed ? `${idx * 90}ms` : '0ms',
                }}
                className={`acrostic-letter group relative flex shrink-0 items-center justify-center rounded-2xl border font-display font-extrabold transition-all ${
                  revealed ? 'duration-300' : 'duration-700'
                } ${
                  visible
                    ? 'translate-y-0 scale-100 opacity-100'
                    : 'translate-y-6 scale-75 opacity-0'
                } ${
                  isActive
                    ? 'border-sky bg-sky text-navy-deep shadow-[0_0_32px_-4px_rgba(125,211,252,0.75)] -translate-y-1'
                    : 'border-white/20 bg-white/10 text-white hover:border-sky/60 hover:bg-white/15'
                }`}
              >
                {item.letter}
              </button>
            )
          })}
        </div>

        {/* Cards com surgimento sequencial sincronizados com o monograma */}
        <div
          className="mt-10 flex flex-wrap justify-center gap-4"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {LETTERS.map((item, idx) => {
            const isActive = active === idx
            const inline = 'inlineJoin' in item && item.inlineJoin
            const fullLine = 'fullLine' in item ? item.fullLine : null
            return (
              <div
                key={`card-${item.letter}-${idx}`}
                onMouseEnter={() => setActive(idx)}
                onClick={() => {
                  setActive(idx)
                  setPaused(true)
                }}
                style={{
                  transitionDelay:
                    visible && !revealed ? `${140 + idx * 95}ms` : '0ms',
                }}
                className={`group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-2xl border p-6 backdrop-blur-sm transition-all sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] ${
                  revealed ? 'duration-300' : 'duration-700'
                } ${
                  visible
                    ? 'translate-y-0 scale-100 opacity-100'
                    : 'translate-y-8 scale-95 opacity-0'
                } ${
                  isActive
                    ? 'border-sky/80 bg-white/15 shadow-[0_18px_42px_-12px_rgba(125,211,252,0.45)]'
                    : 'border-white/15 bg-white/5 hover:border-sky/50 hover:bg-white/10'
                }`}
              >
                {/* Letra d'água decorativa ao fundo */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute -right-2 -top-4 select-none font-display text-8xl font-extrabold leading-none transition-all duration-500 ${
                    isActive
                      ? 'scale-110 text-sky/20'
                      : 'text-white/5 group-hover:scale-105 group-hover:text-sky/15'
                  }`}
                >
                  {item.letter}
                </span>

                <div className="relative flex items-center gap-3">
                  <span
                    className={`flex size-11 shrink-0 items-center justify-center rounded-xl font-display text-2xl font-extrabold transition-colors duration-300 ${
                      isActive
                        ? 'bg-sky text-navy-deep'
                        : 'bg-white/15 text-sky group-hover:bg-sky group-hover:text-navy-deep'
                    }`}
                  >
                    {item.letter}
                  </span>
                  <span className="font-display text-xl font-extrabold tracking-tight text-white">
                    {item.word}
                  </span>
                </div>

                <p className="relative mt-4 text-sm leading-relaxed text-navy-foreground/85">
                  {fullLine ? (
                    fullLine
                  ) : inline ? (
                    <>
                      <strong className="text-white">{item.word}</strong>{' '}
                      {item.desc}
                    </>
                  ) : (
                    item.desc
                  )}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
