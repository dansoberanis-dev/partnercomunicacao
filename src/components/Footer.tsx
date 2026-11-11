import { Link } from 'react-router-dom'
import { Mail, MessageCircle, Phone } from 'lucide-react'
import { NAV_LINKS, SITE } from '../data/site'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <div className="inline-block rounded-xl bg-card p-3">
            <Logo className="h-10 w-auto" />
          </div>
          <p className="mt-4 max-w-sm text-sm opacity-80">
            Consultoria especializada em comunicação integrada e marketing.{' '}
            {SITE.tagline}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-sky">
            Páginas
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_LINKS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="opacity-80 hover:opacity-100">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/privacidade" className="opacity-80 hover:opacity-100">
                Política de Privacidade
              </Link>
            </li>
            <li>
              <Link to="/termos" className="opacity-80 hover:opacity-100">
                Termos de Uso
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-sky">
            Contato
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={SITE.phoneHref}
                className="flex items-center gap-2 opacity-80 hover:opacity-100"
              >
                <Phone className="size-4" />
                {SITE.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-2 break-all opacity-80 hover:opacity-100"
              >
                <Mail className="size-4 shrink-0" />
                {SITE.email}
              </a>
            </li>
            <li>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 opacity-80 hover:opacity-100"
              >
                <MessageCircle className="size-4" />
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-navy-foreground/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs opacity-80 md:flex-row md:justify-between md:px-8">
          <p>
            © {new Date().getFullYear()} {SITE.name}. Todos os direitos reservados.
          </p>
          <p>
            Desenvolvido por{' '}
            <a
              href="https://www.daniel-soberanis.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline-offset-2 hover:underline"
            >
              Daniel Soberanis
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
