import { useEffect, useRef, useState } from 'react'
import {
  Award,
  Camera,
  ChartLine,
  Check,
  Megaphone,
  Palette,
  Presentation,
} from 'lucide-react'
import { CtaBanner } from '../components/CtaBanner'
import { PageHero } from '../components/PageHero'
import { PageMeta } from '../components/PageMeta'
import { SOLUTIONS } from '../data/site'

const solutionIcons = [ChartLine, Megaphone, Palette, Presentation, Camera]

function SolutionCard({
  solution,
  index,
}: {
  solution: (typeof SOLUTIONS)[number]
  index: number
}) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      setSettled(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.14, rootMargin: '0px 0px -36px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || settled) return
    const timer = window.setTimeout(() => setSettled(true), 1250)
    return () => window.clearTimeout(timer)
  }, [visible, settled])

  const Icon = solutionIcons[index]
  const fromSide = index % 2 === 0 ? 'solution-from-left' : 'solution-from-right'

  return (
    <article
      ref={ref}
      id={solution.id}
      className={`solution-card ${fromSide} group relative grid scroll-mt-28 gap-8 overflow-hidden rounded-3xl border bg-card p-8 shadow-soft hover:border-sky/60 hover:shadow-xl md:grid-cols-[1fr_1.2fr] md:p-12 ${
        visible ? 'is-visible' : ''
      } ${settled ? 'is-settled' : ''}`}
    >
      {/* Feixe luminoso contínuo percorrendo a borda superior do card */}
      <span
        aria-hidden
        style={{ animationDelay: `${index * 0.65}s` }}
        className="solution-beam pointer-events-none absolute top-0 left-0 h-[3px] w-2/5 rounded-full bg-gradient-to-r from-transparent via-sky to-transparent"
      />

      {/* Numeração gigante em marca-d'água que ganha movimento no hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-6 -right-3 select-none font-display text-[9rem] font-extrabold leading-none text-secondary/70 transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-105 group-hover:text-sky/20"
      >
        0{index + 1}
      </span>

      <div className="relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm transition-transform duration-500 group-hover:scale-105">
            <span
              aria-hidden
              className="anim-spin-slow pointer-events-none absolute -inset-1.5 rounded-2xl border border-dashed border-sky/60"
            />
            <Icon className="size-6" aria-hidden />
          </div>
          <p
            style={{ transitionDelay: settled ? '0ms' : '120ms' }}
            className="solution-num font-display text-5xl font-extrabold text-sky"
          >
            0{index + 1}
          </p>
        </div>

        <div
          style={{ transitionDelay: settled ? '0ms' : '210ms' }}
          className="solution-head"
        >
          <h2 className="mt-4 text-2xl font-extrabold md:text-3xl">
            {solution.title}
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            {solution.desc}
          </p>
        </div>
      </div>

      <ul className="relative z-10 grid content-start gap-3 sm:grid-cols-2">
        {solution.items.map((item, i) => (
          <li
            key={item}
            style={{
              transitionDelay: settled ? '0ms' : `${240 + i * 75}ms`,
            }}
            className="solution-chip group/chip flex items-start gap-2.5 rounded-xl border border-transparent bg-secondary p-3.5 font-semibold hover:border-sky/50 hover:bg-background hover:shadow-sm"
          >
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors duration-200 group-hover/chip:bg-primary group-hover/chip:text-primary-foreground">
              <Check className="size-3.5" />
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

function GarantiaCard() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      setSettled(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -30px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || settled) return
    const timer = window.setTimeout(() => setSettled(true), 1100)
    return () => window.clearTimeout(timer)
  }, [visible, settled])

  return (
    <div
      ref={ref}
      className={`solution-card solution-from-right group relative flex flex-col items-start gap-5 overflow-hidden rounded-3xl border border-sky/40 bg-secondary p-8 shadow-soft hover:border-sky hover:shadow-xl md:flex-row md:items-center md:p-10 ${
        visible ? 'is-visible' : ''
      } ${settled ? 'is-settled' : ''}`}
    >
      <span
        aria-hidden
        className="solution-beam pointer-events-none absolute top-0 left-0 h-[3px] w-2/5 rounded-full bg-gradient-to-r from-transparent via-sky to-transparent"
      />
      <div className="relative flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-transform duration-500 group-hover:scale-105">
        <span
          aria-hidden
          className="anim-spin-slow pointer-events-none absolute -inset-1.5 rounded-2xl border border-dashed border-sky/70"
        />
        <Award className="size-8" aria-hidden />
      </div>
      <div
        style={{ transitionDelay: settled ? '0ms' : '200ms' }}
        className="solution-head"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-ring">
          Selo exclusivo
        </p>
        <h2 className="mt-1 text-xl font-extrabold md:text-2xl">
          GARANTIA PARTNER® de QUALIDADE
        </h2>
        <p className="mt-2 text-muted-foreground">
          Alianças estratégicas com os melhores profissionais do mercado
          publicitário nas áreas de fotografia, audiovisual, eventos
          corporativos e desenvolvimento de brindes funcionais e sustentáveis.
        </p>
      </div>
    </div>
  )
}

export function SolucoesPage() {
  return (
    <>
      <PageMeta
        title="Soluções | Consulting, Coaching, Design e Sala VIP — Partner"
        description="Consultoria em comunicação, marketing digital e SEO, design e comunicação visual, coaching e treinamentos, e produção especial Sala VIP com Garantia Partner® de Qualidade."
      />

      <PageHero
        eyebrow="Soluções"
        title="Estratégia, criação e execução integradas."
        heroVariant="solutions"
      >
        Projetos exclusivos para cada mercado, com execução focada, controle de
        budget e resultados mensurados em Relatórios Simplificados e Indicadores
        Chave de Desempenho (KPIs).
      </PageHero>

      <div className="mx-auto max-w-7xl space-y-8 overflow-x-clip px-4 py-24 md:px-8">
        {SOLUTIONS.map((solution, index) => (
          <SolutionCard
            key={solution.id}
            solution={solution}
            index={index}
          />
        ))}

        <GarantiaCard />
      </div>

      <CtaBanner />
    </>
  )
}
