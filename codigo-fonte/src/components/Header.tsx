import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS } from '../data/site'
import { useReloadHome } from './HomeReloadContext'
import { Logo } from './Logo'

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const reloadHome = useReloadHome()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const solidHeader = scrolled || open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solidHeader
          ? 'bg-background/95 shadow-soft backdrop-blur'
          : 'bg-gradient-to-b from-navy-deep/75 via-navy-deep/35 to-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-8">
        <Link
          to="/"
          aria-label="Partner Comunicação — página inicial"
          onClick={(e) => {
            setOpen(false)
            reloadHome(e)
          }}
        >
          <Logo
            className="h-9 w-auto md:h-11"
            variant={solidHeader ? 'transparent' : 'white'}
          />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `text-sm transition-colors ${
                  solidHeader
                    ? isActive
                      ? 'font-bold text-primary'
                      : 'font-semibold text-muted-foreground hover:text-primary'
                    : isActive
                      ? 'font-bold text-white [text-shadow:0_1px_10px_rgba(4,14,32,0.95)]'
                      : 'font-bold text-white/95 hover:text-sky [text-shadow:0_1px_10px_rgba(4,14,32,0.95)]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/contato"
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all hover:scale-105 ${
              solidHeader
                ? 'bg-primary text-primary-foreground'
                : 'bg-sky text-accent-foreground'
            }`}
          >
            Fale conosco
          </Link>
        </nav>

        <button
          type="button"
          className={`rounded-md p-2 transition-colors md:hidden ${
            solidHeader ? 'text-primary' : 'text-white'
          }`}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav
          aria-label="Menu móvel"
          className="animate-in slide-in-from-top-2 border-t bg-background px-4 pb-6 md:hidden"
        >
          {NAV_LINKS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block border-b py-4 text-lg font-semibold text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/contato"
            onClick={() => setOpen(false)}
            className="mt-5 block rounded-full bg-primary py-3 text-center font-bold text-primary-foreground"
          >
            Solicitar diagnóstico
          </Link>
        </nav>
      )}
    </header>
  )
}
