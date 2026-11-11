import { Link } from 'react-router-dom'
import { CircleCheck } from 'lucide-react'
import { PageMeta } from '../components/PageMeta'
import { SITE } from '../data/site'

export function ObrigadoPage() {
  return (
    <>
      <PageMeta
        title="Obrigado pelo contato | Partner Comunicação"
        description="Recebemos sua mensagem. Um especialista da Partner Comunicação entrará em contato em breve."
      />
      <section className="bg-hero flex min-h-[85vh] items-center justify-center px-4 pt-24 text-center text-navy-foreground">
        <div className="anim-word max-w-xl">
          <CircleCheck className="mx-auto size-20 text-sky" aria-hidden />
          <h1 className="mt-6 text-4xl font-extrabold md:text-5xl">
            Mensagem recebida!
          </h1>
          <p className="mt-4 text-lg opacity-85">
            Obrigado pelo contato. Um especialista vai falar com você em até 1
            dia útil. Se preferir, adiante a conversa pelo WhatsApp.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-sky px-7 py-3 font-bold text-accent-foreground"
            >
              Falar no WhatsApp
            </a>
            <Link
              to="/solucoes"
              className="rounded-full border border-navy-foreground/40 px-7 py-3 font-bold"
            >
              Ver soluções
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
