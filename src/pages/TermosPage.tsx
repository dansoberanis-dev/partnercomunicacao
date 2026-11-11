import { PageHero } from '../components/PageHero'
import { PageMeta } from '../components/PageMeta'
import { SITE } from '../data/site'

export function TermosPage() {
  return (
    <>
      <PageMeta
        title="Termos de Uso | Partner Comunicação"
        description="Condições de uso do site da Partner Comunicação Integrada: propriedade intelectual, responsabilidades e legislação aplicável."
      />

      <PageHero eyebrow="Legal" title="Termos de Uso" />

      <article className="mx-auto max-w-3xl space-y-5 px-4 py-16 text-muted-foreground md:px-8 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground">
        <p>Ao acessar este site, você concorda com os termos abaixo.</p>

        <h2>1. Uso do site</h2>
        <p>
          O conteúdo tem caráter informativo sobre os serviços da {SITE.name}. É
          proibido utilizá-lo para fins ilícitos ou que prejudiquem terceiros.
        </p>

        <h2>2. Propriedade intelectual</h2>
        <p>
          Marca Partner®, logotipos, textos e imagens são protegidos por lei e
          não podem ser reproduzidos sem autorização prévia.
        </p>

        <h2>3. Responsabilidade</h2>
        <p>
          Empenhamo-nos para manter as informações corretas e atualizadas, mas
          elas podem mudar sem aviso. Links externos são de responsabilidade de
          seus titulares.
        </p>

        <h2>4. Privacidade</h2>
        <p>
          O tratamento de dados pessoais segue nossa Política de Privacidade.
        </p>

        <h2>5. Legislação</h2>
        <p>
          Estes termos são regidos pelas leis brasileiras. Fica eleito o foro da
          comarca de São Paulo/SP.
        </p>

        <h2>6. Contato</h2>
        <p>
          <a
            className="font-semibold text-primary underline"
            href={`mailto:${SITE.email}`}
          >
            {SITE.email}
          </a>
        </p>
      </article>
    </>
  )
}
