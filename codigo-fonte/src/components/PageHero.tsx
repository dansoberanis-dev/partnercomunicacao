import type { ReactNode } from 'react'
import { WorldMapHero, type WorldMapVariant } from './WorldMapHero'

interface PageHeroProps {
  eyebrow: string
  title: string
  heroVariant?: WorldMapVariant
  children?: ReactNode
}

export function PageHero({
  eyebrow,
  title,
  heroVariant = 'default',
  children,
}: PageHeroProps) {
  return (
    <section className="bg-hero relative overflow-hidden pb-20 pt-32 text-navy-foreground md:pb-28 md:pt-44">
      <div className="pointer-events-none absolute inset-0 opacity-95">
        <WorldMapHero
          className="block h-full w-full"
          variant={heroVariant}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-deep/90 via-navy-deep/65 via-38% to-transparent to-72%"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-navy-deep/75 to-transparent"
        aria-hidden
      />
      <div
        className="anim-floaty pointer-events-none absolute -right-20 top-10 size-72 rounded-full bg-sky/15 blur-3xl"
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        <p className="anim-word text-sm font-bold uppercase tracking-widest text-sky">
          {eyebrow}
        </p>
        <h1
          className="anim-word mt-3 max-w-3xl text-4xl font-extrabold md:text-6xl"
          style={{ animationDelay: '120ms' }}
        >
          {title}
        </h1>
        {children && (
          <div
            className="anim-word mt-5 max-w-2xl text-lg opacity-85"
            style={{ animationDelay: '240ms' }}
          >
            {children}
          </div>
        )}
      </div>
    </section>
  )
}
