import { Check } from 'lucide-react'
import { CtaBanner } from '../components/CtaBanner'
import { PageHero } from '../components/PageHero'
import { PageMeta } from '../components/PageMeta'
import { Reveal } from '../components/Reveal'
import { SOLUTIONS } from '../data/site'

export function SolucoesPage() {
  return (
    <>
      <PageMeta
        title="Soluções | Branding, Marketing Digital, Design e Treinamentos — Partner"
        description="Consultoria em comunicação, marketing digital e redes sociais, design e identidade visual, palestras e treinamentos, eventos e audiovisual."
      />

      <PageHero
        eyebrow="Soluções"
        title="Estratégia, criação e execução integradas."
      >
        Projetos exclusivos para cada mercado, com execução focada, controle de
        budget e resultados mensurados em relatórios e KPIs.
      </PageHero>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-24 md:px-8">
        {SOLUTIONS.map((solution, index) => (
          <Reveal key={solution.id}>
            <article
              id={solution.id}
              className="grid scroll-mt-28 gap-8 rounded-3xl border bg-card p-8 md:grid-cols-[1fr_1.2fr] md:p-12"
            >
              <div>
                <p className="font-display text-5xl font-extrabold text-sky">
                  0{index + 1}
                </p>
                <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">
                  {solution.title}
                </h2>
                <p className="mt-3 text-muted-foreground">{solution.desc}</p>
              </div>

              <ul className="grid content-start gap-3 sm:grid-cols-2">
                {solution.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 rounded-xl bg-secondary p-3 font-semibold"
                  >
                    <Check className="mt-0.5 size-5 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>

      <CtaBanner />
    </>
  )
}
