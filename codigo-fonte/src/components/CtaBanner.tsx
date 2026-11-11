import { Link } from 'react-router-dom'
import { SITE } from '../data/site'

export function CtaBanner() {
  return (
    <section className="px-4 py-20 md:px-8">
      <div className="bg-hero relative mx-auto max-w-6xl overflow-hidden rounded-3xl px-6 py-14 text-center text-navy-foreground md:px-16">
        <div
          className="anim-floaty absolute -left-16 -top-16 size-60 rounded-full bg-sky/25 blur-3xl"
          aria-hidden
        />
        <h2 className="relative text-3xl font-extrabold md:text-5xl">
          Sua marca falando{' '}
          <span className="text-gradient">uma só língua</span>.
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl opacity-85">
          Agende um diagnóstico gratuito e descubra onde estão os ruídos que
          custam tempo e dinheiro à sua empresa.
        </p>
        <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/contato"
            className="rounded-full bg-sky px-8 py-4 font-bold text-accent-foreground transition-transform hover:scale-105"
          >
            Quero meu diagnóstico
          </Link>
          <a
            href={SITE.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-navy-foreground/40 px-8 py-4 font-bold"
          >
            Chamar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
