import { useEffect, useRef, useState } from 'react'
import { Eye, HeartHandshake, Leaf, Target, Users } from 'lucide-react'
import { CtaBanner } from '../components/CtaBanner'
import { PageHero } from '../components/PageHero'
import { PageMeta } from '../components/PageMeta'
import { PartnerAcrostic } from '../components/PartnerAcrostic'
import { Reveal } from '../components/Reveal'
import { PILLARS, SITE } from '../data/site'

const PRINCIPLES = [
  {
    icon: Target,
    title: 'Missão',
    text: 'Criar soluções de comunicação personalizadas, superando as necessidades e desejos dos clientes, agregando valor ao negócio por meio de inovação, competitividade e excelência.',
  },
  {
    icon: Eye,
    title: 'Visão',
    text: 'Ser referência como a melhor agência de comunicação e um dos principais parceiros corporativos, ótima empresa para trabalhar e responsável pelo ambiente com foco em sustentabilidade.',
  },
  {
    icon: HeartHandshake,
    title: 'Valores',
    text: 'Integridade, Simplicidade, Criatividade, Agilidade, Ética e Transparência.',
  },
] as const

function PrincipleCard({
  item,
  index,
}: {
  item: (typeof PRINCIPLES)[number]
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
      { threshold: 0.22, rootMargin: '0px 0px -48px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const baseDelay = index * 170

  useEffect(() => {
    if (!visible || settled) return
    const timer = window.setTimeout(() => setSettled(true), baseDelay + 1150)
    return () => window.clearTimeout(timer)
  }, [visible, settled, baseDelay])

  const Icon = item.icon

  return (
    <article
      ref={ref}
      style={{ transitionDelay: settled ? '0ms' : `${baseDelay}ms` }}
      className={`principle-card group relative overflow-hidden rounded-2xl border bg-card p-8 shadow-soft hover:border-sky/60 hover:shadow-xl ${
        visible ? 'is-visible' : ''
      } ${settled ? 'is-settled' : ''}`}
    >
      <span
        aria-hidden
        style={{ transitionDelay: `${baseDelay + 110}ms` }}
        className="principle-line absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-sky to-primary"
      />

      <div className="relative inline-flex">
        <span
          aria-hidden
          style={{ animationDelay: `${baseDelay + 220}ms` }}
          className="principle-icon-ring pointer-events-none absolute inset-0 rounded-2xl border-2 border-sky/60 opacity-0"
        />
        <span
          style={{ transitionDelay: settled ? '0ms' : `${baseDelay + 180}ms` }}
          className="principle-icon flex size-14 items-center justify-center rounded-2xl bg-secondary text-primary ring-1 ring-sky/30 group-hover:bg-primary group-hover:text-primary-foreground"
        >
          <Icon className="size-7" aria-hidden />
        </span>
      </div>

      <div
        style={{ transitionDelay: `${baseDelay + 310}ms` }}
        className="principle-title mt-5"
      >
        <h2 className="text-2xl font-bold">{item.title}</h2>
        <span
          aria-hidden
          className="mt-2 block h-0.5 w-8 rounded-full bg-sky transition-all duration-300 group-hover:w-12"
        />
      </div>

      <p
        style={{ transitionDelay: `${baseDelay + 440}ms` }}
        className="principle-caption mt-3 leading-relaxed text-muted-foreground"
      >
        {item.text}
      </p>
    </article>
  )
}

export function SobrePage() {
  return (
    <>
      <PageMeta
        title="Sobre a Partner | Consultoria em Comunicação Integrada"
        description="Conheça a Partner Comunicação: missão, visão, valores, equipe e compromisso com sustentabilidade. Uma agência feita de pessoas para pessoas."
      />

      <PageHero
        eyebrow="Quem somos"
        title="Comunicação sob medida, feita por pessoas."
        heroVariant="about"
      >
        A Partner é uma consultoria especializada em comunicação integrada e
        ações de marketing. Entendemos a cultura, os objetivos e o mercado de
        cada cliente para criar projetos exclusivos.
      </PageHero>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-24 md:grid-cols-3 md:px-8">
        {PRINCIPLES.map((item, index) => (
          <PrincipleCard key={item.title} item={item} index={index} />
        ))}
      </section>

      <PartnerAcrostic />

      <section className="bg-secondary py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-2 md:px-8">
          <Reveal>
            <h2 className="text-3xl font-extrabold md:text-4xl">
              Como fazemos
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Do briefing à implantação, cada linha de atuação é gerida por
              executivos que lideram equipes e integram canais online e offline.
              Controle do budget e capacidade de entrega completam o nosso
              modelo.
            </p>
            <ul className="mt-6 space-y-3">
              {PILLARS.map((pillar) => (
                <li key={pillar.title} className="flex gap-3">
                  <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
                  <span>
                    <strong>{pillar.title}:</strong> {pillar.desc}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={150} className="space-y-6">
            <div className="rounded-2xl bg-card p-7">
              <Users className="size-8 text-ring" aria-hidden />
              <h3 className="mt-3 text-xl font-bold">Nosso time</h3>
              <p className="mt-2 text-muted-foreground">
                Especialistas apaixonados pelo que fazem, sempre conectados às
                tendências de cada mercado, com alianças estratégicas nas áreas
                de fotografia, eventos e brindes.
              </p>
            </div>

            <div className="rounded-2xl bg-card p-7">
              <Leaf className="size-8 text-ring" aria-hidden />
              <h3 className="mt-3 text-xl font-bold">
                Sustentabilidade e responsabilidade social
              </h3>
              <p className="mt-2 text-muted-foreground">
                Acreditamos em projetos que educam jovens, socializam cidadãos e
                transformam comunidades, celebrando a sustentabilidade como a
                principal forma de desenvolvimento.
              </p>
              <blockquote className="mt-4 border-l-2 border-sky pl-4 text-sm italic text-muted-foreground">
                “Uma visão sem ação não passa de um sonho. Ação sem visão é só
                um passatempo. Mas uma visão com ação pode mudar o mundo.”
                <footer className="mt-1 font-semibold not-italic text-foreground">
                  — Joel Baker
                </footer>
              </blockquote>
            </div>

            <div className="rounded-2xl bg-card p-7">
              <h3 className="text-xl font-bold">Trabalhe conosco</h3>
              <p className="mt-2 text-muted-foreground">
                Envie seu currículo para{' '}
                <a
                  className="font-semibold text-primary underline"
                  href={`mailto:${SITE.careersEmail}`}
                >
                  {SITE.careersEmail}
                </a>
                .
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
