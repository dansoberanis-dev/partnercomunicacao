import { Eye, HeartHandshake, Leaf, Target, Users } from 'lucide-react'
import { CtaBanner } from '../components/CtaBanner'
import { PageHero } from '../components/PageHero'
import { PageMeta } from '../components/PageMeta'
import { Reveal } from '../components/Reveal'
import { PILLARS, SITE } from '../data/site'

const PRINCIPLES = [
  {
    icon: Target,
    title: 'Missão',
    text: 'Criar soluções de comunicação personalizadas que superem as expectativas dos clientes, agregando valor ao negócio por meio de inovação, competitividade e excelência.',
  },
  {
    icon: Eye,
    title: 'Visão',
    text: 'Ser referência como agência de comunicação e um dos principais parceiros corporativos de nossos clientes — e uma ótima empresa para se trabalhar.',
  },
  {
    icon: HeartHandshake,
    title: 'Valores',
    text: 'Inovação, excelência, respeito e ética empresarial em todas as relações com nossos públicos.',
  },
] as const

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
      >
        A Partner é uma consultoria especializada em comunicação integrada e
        ações de marketing. Entendemos a cultura, os objetivos e o mercado de
        cada cliente para criar projetos exclusivos.
      </PageHero>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-24 md:grid-cols-3 md:px-8">
        {PRINCIPLES.map((item, index) => (
          <Reveal
            key={item.title}
            delay={index * 120}
            className="rounded-2xl border bg-card p-8 shadow-soft"
          >
            <item.icon className="size-10 text-ring" aria-hidden />
            <h2 className="mt-4 text-2xl font-bold">{item.title}</h2>
            <p className="mt-2 text-muted-foreground">{item.text}</p>
          </Reveal>
        ))}
      </section>

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
                Acreditamos em projetos que educam jovens e transformam
                comunidades, e celebramos a sustentabilidade como forma de
                desenvolvimento.
              </p>
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
