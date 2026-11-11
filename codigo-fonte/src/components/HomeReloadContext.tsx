import { createContext, useContext, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'

type ReloadHomeHandler = (event?: MouseEvent<HTMLElement>) => void

const HomeReloadContext = createContext<ReloadHomeHandler>(() => {})

export function HomeReloadProvider({
  onSoftReset,
  children,
}: {
  onSoftReset: () => void
  children: React.ReactNode
}) {
  const navigate = useNavigate()

  const reloadHome: ReloadHomeHandler = (event) => {
    event?.preventDefault()

    try {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual'
      }
    } catch {
      // Ignora em contextos restritos
    }

    window.scrollTo({ top: 0, behavior: 'auto' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    let isPreview = Boolean(window.__PARTNER_STANDALONE_PREVIEW__)
    let protocol = ''
    let pathname = ''
    try {
      protocol = window.location.protocol
      pathname = window.location.pathname
      if (protocol === 'about:' || protocol === 'blob:' || protocol === 'data:') {
        isPreview = true
      }
    } catch {
      isPreview = true
    }

    if (isPreview) {
      navigate('/', { replace: true })
      onSoftReset()
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'auto' })
      })
      return
    }

    if (protocol === 'file:' || pathname.endsWith('.html')) {
      try {
        if (window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search)
        }
      } catch {
        // Alguns navegadores bloqueiam replaceState em file://
      }
      window.location.reload()
      return
    }

    if (pathname === '/' && !window.location.hash && !window.location.search) {
      window.location.reload()
    } else {
      window.location.assign('/')
    }
  }

  return (
    <HomeReloadContext.Provider value={reloadHome}>
      {children}
    </HomeReloadContext.Provider>
  )
}

export function useReloadHome() {
  return useContext(HomeReloadContext)
}
