import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'

export function NotFoundPage() {
  return (
    <>
      <PageMeta title="Página não encontrada | Partner Comunicação" />
      <div className="bg-hero relative flex min-h-screen items-center justify-center overflow-hidden px-4 text-navy-foreground">
        <div
          className="anim-floaty absolute right-0 top-20 size-80 rounded-full bg-sky/20 blur-3xl"
          aria-hidden
        />
        <div className="relative max-w-lg text-center">
          <p className="text-gradient font-display text-8xl font-extrabold md:text-9xl">
            404
          </p>
          <h1 className="mt-4 text-2xl font-bold md:text-3xl">
            Ops! Essa mensagem se perdeu no caminho.
          </h1>
          <p className="mt-3 opacity-80">
            A página que você procura não existe ou foi movida. Mas a gente sabe
            exatamente para onde levar você.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="rounded-full bg-sky px-6 py-3 font-bold text-accent-foreground"
            >
              Voltar ao início
            </Link>
            <Link
              to="/contato"
              className="rounded-full border border-navy-foreground/40 px-6 py-3 font-bold"
            >
              Falar com a Partner
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
