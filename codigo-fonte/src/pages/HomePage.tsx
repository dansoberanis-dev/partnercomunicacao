import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Camera,
  ChartLine,
  ChevronDown,
  Megaphone,
  Palette,
  Presentation,
} from 'lucide-react'
import { CtaBanner } from '../components/CtaBanner'
import { FaqAccordion } from '../components/FaqAccordion'
import { GlobeHero } from '../components/GlobeHero'
import { InView } from '../components/InView'
import { MarqueeBand } from '../components/MarqueeBand'
import { PageMeta } from '../components/PageMeta'
import { ScrollProgress } from '../components/ScrollProgress'
import { TiltCard } from '../components/TiltCard'
import { WipeSection } from '../components/WipeSection'
import { WordReveal, type WordPart } from '../components/WordReveal'
import { FAQ, HERO, PILLARS, SOLUTIONS } from '../data/site'
import { subscribeScroll } from '../lib/scroll'

const solutionIcons = [ChartLine, Megaphone, Palette, Presentation, Camera]
const SOLUTION_ENTRY = ['left', 'bottom', 'right', 'left', 'right'] as const
const PILLAR_ENTRY = ['left', 'bottom', 'right'] as const

const MARQUEE_ITEMS = [
  'Consultoria em Comunicação',
  'Marketing Digital',
  'Design & Identidade Visual',
  'Coaching & Treinamentos',
  'Sala VIP',
  'GeoMarketing',
  'Relatórios simplificados e KPIs',
  'Garantia Partner® de Qualidade',
]

const INTRO_PARAGRAPHS: WordPart[][] = [
  [
    'Embalagem, preço, redes sociais, imprensa, atendimento: é a ',
    { text: 'percepção geral', strong: true },
    ' sobre a sua marca que decide a compra.',
  ],
  [
    'Quando cada área comunica sozinha, o cliente se confunde. Nós articulamos estratégias, canais e produtos de comunicação para que sua empresa fale com ',
    { text: 'uma só voz', strong: true },
    ' — e você veja o resultado em KPIs.',
  ],
]

function RotatingPhrase() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO.rotating.length)
    }, 2600)
    return () => clearInterval(timer)
  }, [])

  return (
    <span key={index} className="anim-word text-gradient block">
      {HERO.rotating[index]}
    </span>
  )
}

export function HomePage() {
  const heroRef = useRef<HTMLElement>(null)

  // Parallax de saída do hero: --hp vai de 0 (topo) a 1 (hero rolado para fora)
  useEffect(
    () =>
      subscribeScroll(({ y }) => {
        const hero = heroRef.current
        if (!hero) return
        const range = Math.max(hero.offsetHeight * 0.85, 1)
        hero.style.setProperty('--hp', Math.min(1, Math.max(0, y / range)).toFixed(3))
      }),
    [],
  )

  return (
    <>
      <PageMeta
        title="Partner Comunicação Integrada | Agência de Comunicação e Marketing"
        description="Comunicação integrada, branding, marketing digital, design e treinamentos para empresas. Uma mensagem única em todos os canais. Agende um diagnóstico gratuito."
      />
      <ScrollProgress />

      <section
        ref={heroRef}
        className="bg-hero relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-20 pb-12 text-navy-foreground md:flex-row md:items-center md:pb-0"
      >
        <div
          className="hidden md:block md:absolute md:inset-0 md:z-[1] md:bg-gradient-to-r md:from-navy/85 md:via-navy/35 md:via-38% md:to-transparent md:to-62%"
          aria-hidden
        />
        <div
          className="anim-spin-slow pointer-events-none absolute -right-40 top-1/2 hidden size-[640px] -translate-y-1/2 rounded-full border border-dashed border-sky/30 md:block"
          aria-hidden
        />
        <div
          className="anim-floaty pointer-events-none absolute -left-24 bottom-10 size-72 rounded-full bg-sky/20 blur-3xl"
          aria-hidden
        />

        <div className="hero-copy relative z-10 order-2 mx-auto w-full max-w-7xl px-4 pt-4 pb-4 md:order-none md:px-8 md:py-16">
          <div className="md:max-w-[50%] lg:max-w-[49%]">
            <p className="anim-word inline-block rounded-full border border-sky/40 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-sky sm:px-4 sm:py-1.5 sm:text-xs">
              {HERO.eyebrow}
            </p>
            <h1 className="mt-4 text-[2rem] font-extrabold leading-[1.08] sm:text-5xl md:mt-6 md:text-[2.45rem] lg:text-[3.1rem] xl:text-[3.75rem]">
              <span className="anim-word block" style={{ animationDelay: '100ms' }}>
                {HERO.titleStart}
              </span>
              <RotatingPhrase />
            </h1>
            <p
              className="anim-word mt-4 max-w-xl text-base opacity-85 sm:text-lg md:mt-6 md:text-lg lg:text-xl"
              style={{ animationDelay: '300ms' }}
            >
              {HERO.subtitle}
            </p>
            <div
              className="anim-word mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-10"
              style={{ animationDelay: '450ms' }}
            >
              <Link
                to={HERO.primaryCta.to}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-sky px-7 py-3.5 font-bold text-accent-foreground transition-transform hover:scale-105 md:px-8 md:py-4"
              >
                {HERO.primaryCta.label}{' '}
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to={HERO.secondaryCta.to}
                className="inline-flex items-center justify-center rounded-full border border-navy-foreground/40 px-7 py-3.5 font-bold transition-colors hover:bg-navy-foreground/10 md:px-8 md:py-4"
              >
                {HERO.secondaryCta.label}
              </Link>
            </div>
          </div>
        </div>

        <div className="hero-globe pointer-events-none relative order-1 -mb-2 h-[330px] w-full shrink-0 sm:h-[410px] md:order-none md:mb-0 md:absolute md:inset-y-0 md:left-[26%] md:right-0 md:h-auto md:w-[74%]">
          <div className="anim-kenburns h-full w-full">
            <GlobeHero className="block h-full w-full" />
          </div>
        </div>

        <a
          href="#integrada"
          aria-label="Rolar para a próxima seção"
          className="hero-cue absolute bottom-3 left-1/2 z-10 -translate-x-1/2 animate-bounce text-sky md:bottom-6"
        >
          <ChevronDown className="size-8" />
        </a>
      </section>

      <section
        id="integrada"
        className="mx-auto grid max-w-7xl gap-12 px-4 py-24 md:grid-cols-2 md:px-8"
      >
        <InView>
          <p className="rise text-sm font-bold uppercase tracking-widest text-ring">
            Comunicação integrada
          </p>
          <h2
            className="title-wipe mt-3 text-3xl font-extrabold md:text-5xl"
            style={{ transitionDelay: '150ms' }}
          >
            Ruído na mensagem custa tempo e dinheiro.
          </h2>
        </InView>
        <div className="space-y-4 text-lg text-muted-foreground">
          {INTRO_PARAGRAPHS.map((parts, index) => (
            <WordReveal key={index} parts={parts} />
          ))}
        </div>
      </section>

      <InView className="marquee-enter">
        <MarqueeBand items={MARQUEE_ITEMS} />
      </InView>

      <WipeSection tone="secondary" className="py-24">
        <div
          aria-hidden="true"
          className="parallax-orb pointer-events-none absolute -left-24 top-24 size-80 rounded-full bg-sky/25 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <InView className="max-w-2xl">
            <p className="rise text-sm font-bold uppercase tracking-widest text-ring">
              Soluções
            </p>
            <h2
              className="title-wipe mt-3 text-3xl font-extrabold md:text-5xl"
              style={{ transitionDelay: '120ms' }}
            >
              Tudo que sua marca precisa, em um só parceiro.
            </h2>
          </InView>

          <InView className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SOLUTIONS.map((solution, index) => {
              const Icon = solutionIcons[index]
              return (
                <TiltCard
                  key={solution.id}
                  className="h-full"
                  delay={index * 110}
                  from={SOLUTION_ENTRY[index]}
                >
                  <Link
                    to={`/solucoes#${solution.id}`}
                    className="group home-card flex h-full flex-col rounded-2xl border bg-card p-7"
                  >
                    <span aria-hidden="true" className="home-card-spot" />
                    <span aria-hidden="true" className="home-card-shine" />
                    <span className="home-card-icon flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <span aria-hidden="true" className="home-ripple" />
                      <Icon className="size-6" />
                    </span>
                    <h3 className="mt-5 text-xl font-bold">{solution.title}</h3>
                    <p className="mt-2 flex-1 text-muted-foreground">{solution.desc}</p>
                    <span className="mt-5 inline-flex items-center gap-1 font-bold text-primary">
                      Saiba mais{' '}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span aria-hidden="true" className="home-card-line" />
                  </Link>
                </TiltCard>
              )
            })}
          </InView>
        </div>
      </WipeSection>

      <WipeSection className="py-24">
        <div
          aria-hidden="true"
          className="parallax-orb pointer-events-none absolute -right-24 top-20 size-96 rounded-full bg-sky/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <InView className="text-center">
            <p className="rise text-sm font-bold uppercase tracking-widest text-ring">
              Nossos pilares
            </p>
            <h2
              className="title-wipe mt-3 text-3xl font-extrabold md:text-5xl"
              style={{ transitionDelay: '120ms' }}
            >
              Resultados com selo Partner.
            </h2>
          </InView>

          <InView className="mt-12 grid gap-6 md:grid-cols-3">
            {PILLARS.map((pillar, index) => (
              <TiltCard
                key={pillar.title}
                className="h-full"
                delay={index * 140}
                from={PILLAR_ENTRY[index]}
              >
                <article className="pillar-card h-full rounded-2xl bg-card p-8 shadow-soft">
                  <span aria-hidden="true" className="pillar-top" />
                  <span aria-hidden="true" className="pillar-glow" />
                  <p className="font-display text-5xl font-extrabold leading-none text-sky">
                    <span className="pillar-roll">
                      <span>0{index + 1}</span>
                    </span>
                  </p>
                  <h3 className="mt-3 text-2xl font-bold">{pillar.title}</h3>
                  <p className="mt-2 text-muted-foreground">{pillar.desc}</p>
                </article>
              </TiltCard>
            ))}
          </InView>

          <InView className="mt-14 text-center text-muted-foreground">
            <p className="rise">
              Atendemos{' '}
              <strong className="text-foreground">
                indústria, governo, terceiro setor e profissionais liberais
              </strong>{' '}
              em todo o Brasil.
            </p>
          </InView>
        </div>
      </WipeSection>

      <WipeSection tone="secondary" className="py-24">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <InView>
            <h2 className="title-wipe text-center text-3xl font-extrabold md:text-4xl">
              Perguntas frequentes
            </h2>
          </InView>

          <InView className="mt-10 space-y-3">
            {FAQ.map((item, index) => (
              <FaqAccordion key={item.q} question={item.q} answer={item.a} index={index} />
            ))}
          </InView>
        </div>
      </WipeSection>

      <InView>
        <div className="cta-enter">
          <CtaBanner />
        </div>
      </InView>
    </>
  )
}
