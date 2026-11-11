import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const STORAGE_KEY = 'partner-cookie-consent'

function readConsent(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function writeConsent(value: string) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // Ignore storage errors in restricted sandboxed previews
  }
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!readConsent()) {
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  const accept = (value: 'accepted' | 'essential') => {
    writeConsent(value)
    setVisible(false)
  }

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="animate-in slide-in-from-bottom-4 fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-2xl border bg-card p-5 shadow-soft md:inset-x-6"
    >
      <p className="text-sm text-muted-foreground">
        Usamos cookies para melhorar sua experiência e analisar o tráfego,
        conforme a LGPD. Saiba mais na nossa{' '}
        <Link to="/privacidade" className="font-semibold text-primary underline">
          Política de Privacidade
        </Link>
        .
      </p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => accept('accepted')}
          className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground"
        >
          Aceitar
        </button>
        <button
          type="button"
          onClick={() => accept('essential')}
          className="rounded-full border px-5 py-2 text-sm font-semibold text-foreground"
        >
          Apenas essenciais
        </button>
      </div>
    </div>
  )
}
