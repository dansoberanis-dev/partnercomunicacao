import { useEffect, useState } from 'react'
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
import heroGlobe from '../assets/hero-globe.jpg'
import { CtaBanner } from '../components/CtaBanner'
import { PageMeta } from '../components/PageMeta'
import { Reveal } from '../components/Reveal'
import { FAQ, HERO, PILLARS, SOLUTIONS } from '../data/site'

const solutionIcons = [ChartLine, Megaphone, Palette, Presentation, Camera]

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
  return (
    <>
      <PageMeta
        title="Partner Comunicação Integrada | Agência de Comunicação e Marketing"
        description="Comunicação integrada, branding, marketing digital, design e treinamentos para empresas. Uma mensagem única em todos os canais. Agende um diagnóstico gratuito."
      />

      <section className="bg-hero relative flex min-h-[100svh] items-center overflow-hidden pt-20 text-navy-foreground">
        <img
          src={heroGlobe}
          alt="Globo terrestre iluminado por conexões de luz, simbolizando comunicação integrada"
          width={1280}
          height={806}
          fetchPriority="high"
          className="anim-kenburns absolute inset-0 h-full w-full object-cover opacity-45 md:left-1/4 md:w-3/4 md:opacity-70"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-transparent"
          aria-hidden
        />
        <div
          className="anim-spin-slow absolute -right-40 top-1/2 size-[640px] -translate-y-1/2 rounded-full border border-dashed border-sky/30"
          aria-hidden
        />
        <div
          className="anim-floaty absolute -left-24 bottom-10 size-72 rounded-full bg-sky/20 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto w-full max-w-7xl px-4 py-16 md:px-8">
          <p className="anim-word inline-block rounded-full border border-sky/40 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky">
            {HERO.eyebrow}
          </p>
          <h1 className="mt-6 max-w-4xl text-5xl font-extrabold leading-[1.05] sm:text-6xl md:text-7xl lg:text-8xl">
            <span
              className="anim-word block"
              style={{ animationDelay: '100ms' }}
            >
              {HERO.titleStart}
            </span>
            <RotatingPhrase />
          </h1>
          <p
            className="anim-word mt-6 max-w-xl text-lg opacity-85 md:text-xl"
            style={{ animationDelay: '300ms' }}
          >
            {HERO.subtitle}
          </p>
          <div
            className="anim-word mt-10 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: '450ms' }}
          >
            <Link
              to={HERO.primaryCta.to}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-sky px-8 py-4 font-bold text-accent-foreground transition-transform hover:scale-105"
            >
              {HERO.primaryCta.label}{' '}
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to={HERO.secondaryCta.to}
              className="inline-flex items-center justify-center rounded-full border border-navy-foreground/40 px-8 py-4 font-bold transition-colors hover:bg-navy-foreground/10"
            >
              {HERO.secondaryCta.label}
            </Link>
          </div>
        </div>

        <a
          href="#integrada"
          aria-label="Rolar para a próxima seção"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-sky"
        >
          <ChevronDown className="size-8" />
        </a>
      </section>

      <section
        id="integrada"
        className="mx-auto grid max-w-7xl gap-12 px-4 py-24 md:grid-cols-2 md:px-8"
      >
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-widest text-ring">
            Comunicação integrada
          </p>
          <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">
            Ruído na mensagem custa tempo e dinheiro.
          </h2>
        </Reveal>
        <Reveal delay={150} className="space-y-4 text-lg text-muted-foreground">
          <p>
            Embalagem, preço, redes sociais, imprensa, atendimento: é a{' '}
            <strong className="text-foreground">percepção geral</strong> sobre a
            sua marca que decide a compra.
          </p>
          <p>
            Quando cada área comunica sozinha, o cliente se confunde. Nós
            articulamos estratégias, canais e produtos de comunicação para que
            sua empresa fale com{' '}
            <strong className="text-foreground">uma só voz</strong> — e você
            veja o resultado em KPIs.
          </p>
        </Reveal>
      </section>

      <section className="bg-secondary py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-ring">
              Soluções
            </p>
            <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">
              Tudo que sua marca precisa, em um só parceiro.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SOLUTIONS.map((solution, index) => {
              const Icon = solutionIcons[index]
              return (
                <Reveal key={solution.id} delay={index * 80}>
                  <Link
                    to={`/solucoes#${solution.id}`}
                    className="group flex h-full flex-col rounded-2xl border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-soft"
                  >
                    <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <Icon className="size-6" />
                    </span>
                    <h3 className="mt-5 text-xl font-bold">{solution.title}</h3>
                    <p className="mt-2 flex-1 text-muted-foreground">
                      {solution.desc}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1 font-bold text-primary">
                      Saiba mais{' '}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <Reveal className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-ring">
            Nossos pilares
          </p>
          <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">
            Resultados com selo Partner.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PILLARS.map((pillar, index) => (
            <Reveal
              key={pillar.title}
              delay={index * 120}
              className="rounded-2xl border-t-4 border-primary bg-card p-8 shadow-soft"
            >
              <p className="font-display text-5xl font-extrabold text-sky">
                0{index + 1}
              </p>
              <h3 className="mt-3 text-2xl font-bold">{pillar.title}</h3>
              <p className="mt-2 text-muted-foreground">{pillar.desc}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 text-center text-muted-foreground">
          Atendemos{' '}
          <strong className="text-foreground">
            indústria, governo, terceiro setor e profissionais liberais
          </strong>{' '}
          em todo o Brasil.
        </Reveal>
      </section>

      <section className="bg-secondary py-24">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <Reveal>
            <h2 className="text-center text-3xl font-extrabold md:text-4xl">
              Perguntas frequentes
            </h2>
          </Reveal>

          <div className="mt-10 space-y-3">
            {FAQ.map((item, index) => (
              <Reveal key={item.q} delay={index * 60}>
                <details className="group rounded-xl border bg-card p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-bold">
                    {item.q}
                    <ChevronDown className="size-5 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-muted-foreground">{item.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
