import type { ReactNode } from 'react'

interface PageHeroProps {
  eyebrow: string
  title: string
  children?: ReactNode
}

export function PageHero({ eyebrow, title, children }: PageHeroProps) {
  return (
    <section className="bg-hero relative overflow-hidden pb-20 pt-32 text-navy-foreground md:pt-40">
      <div
        className="anim-floaty absolute -right-20 top-10 size-72 rounded-full bg-sky/20 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
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
