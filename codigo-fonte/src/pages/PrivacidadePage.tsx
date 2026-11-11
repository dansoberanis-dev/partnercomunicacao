import { PageHero } from '../components/PageHero'
import { PageMeta } from '../components/PageMeta'
import { SITE } from '../data/site'

export function PrivacidadePage() {
  return (
    <>
      <PageMeta
        title="Política de Privacidade | Partner Comunicação"
        description="Saiba como a Partner Comunicação coleta, usa e protege seus dados pessoais em conformidade com a LGPD (Lei 13.709/2018)."
      />

      <PageHero eyebrow="Legal" title="Política de Privacidade" />

      <article className="mx-auto max-w-3xl space-y-5 px-4 py-16 text-muted-foreground md:px-8 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground">
        <p>
          A {SITE.name} respeita sua privacidade e trata dados pessoais conforme
          a Lei Geral de Proteção de Dados (LGPD – Lei 13.709/2018).
        </p>

        <h2>1. Dados coletados</h2>
        <p>
          Nome, empresa, e-mail, telefone e mensagem enviados voluntariamente
          pelo formulário, além de dados de navegação (cookies, IP, páginas
          visitadas).
        </p>

        <h2>2. Finalidade</h2>
        <p>
          Responder solicitações, enviar propostas comerciais, melhorar o site e
          cumprir obrigações legais.
        </p>

        <h2>3. Compartilhamento</h2>
        <p>
          Não vendemos dados. Podemos compartilhá-los com fornecedores que
          operam o site (hospedagem e análise), sob dever de confidencialidade.
        </p>

        <h2>4. Cookies</h2>
        <p>
          Utilizamos cookies essenciais e de análise. Você pode aceitar todos ou
          apenas os essenciais no aviso de cookies, e gerenciá-los no seu
          navegador.
        </p>

        <h2>5. Seus direitos</h2>
        <p>
          Você pode solicitar acesso, correção, portabilidade, anonimização ou
          exclusão dos seus dados e revogar o consentimento a qualquer momento.
        </p>

        <h2>6. Segurança e retenção</h2>
        <p>
          Adotamos medidas técnicas para proteger seus dados e os mantemos
          apenas pelo tempo necessário às finalidades informadas.
        </p>

        <h2>7. Contato</h2>
        <p>
          Dúvidas ou solicitações:{' '}
          <a
            className="font-semibold text-primary underline"
            href={`mailto:${SITE.email}`}
          >
            {SITE.email}
          </a>
          .
        </p>
      </article>
    </>
  )
}
