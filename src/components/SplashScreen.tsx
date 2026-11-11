import { Logo } from './Logo'

export function SplashScreen() {
  return (
    <div
      aria-hidden
      className="splash pointer-events-none fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-background"
    >
      <Logo className="h-14 w-auto" />
      <div className="h-1 w-40 overflow-hidden rounded-full bg-secondary">
        <div className="splash-bar h-full bg-primary" />
      </div>
    </div>
  )
}
