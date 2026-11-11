import { useState, type ReactNode } from 'react'
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom'
import { CookieBanner } from './components/CookieBanner'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { HomeReloadProvider } from './components/HomeReloadContext'
import { ScrollManager } from './components/ScrollManager'
import { SplashScreen } from './components/SplashScreen'
import { WhatsAppFloat } from './components/WhatsAppFloat'
import { ContatoPage } from './pages/ContatoPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ObrigadoPage } from './pages/ObrigadoPage'
import { PrivacidadePage } from './pages/PrivacidadePage'
import { SobrePage } from './pages/SobrePage'
import { SolucoesPage } from './pages/SolucoesPage'
import { TermosPage } from './pages/TermosPage'

declare global {
  interface Window {
    __PARTNER_STANDALONE_PREVIEW__?: boolean
  }
}

function useMemoryRouterMode(): boolean {
  if (typeof window === 'undefined') return false
  if (window.__PARTNER_STANDALONE_PREVIEW__) return true
  try {
    const { protocol, pathname } = window.location
    return (
      protocol === 'about:' ||
      protocol === 'blob:' ||
      protocol === 'data:' ||
      protocol === 'file:' ||
      pathname.endsWith('.html')
    )
  } catch {
    return true
  }
}

function RouterShell({ children }: { children: ReactNode }) {
  if (useMemoryRouterMode()) {
    return <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>
  }
  return <BrowserRouter>{children}</BrowserRouter>
}

export function App() {
  const [resetKey, setResetKey] = useState(0)

  return (
    <RouterShell>
      <HomeReloadProvider onSoftReset={() => setResetKey((prev) => prev + 1)}>
        <ScrollManager key={`scroll-${resetKey}`} />
        <SplashScreen key={`splash-${resetKey}`} />
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-primary focus:p-3 focus:text-primary-foreground"
        >
          Pular para o conteúdo
        </a>
        <Header />
        <main id="conteudo" key={`main-${resetKey}`}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sobre" element={<SobrePage />} />
            <Route path="/solucoes" element={<SolucoesPage />} />
            <Route path="/contato" element={<ContatoPage />} />
            <Route path="/obrigado" element={<ObrigadoPage />} />
            <Route path="/privacidade" element={<PrivacidadePage />} />
            <Route path="/termos" element={<TermosPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppFloat />
        <CookieBanner />
      </HomeReloadProvider>
    </RouterShell>
  )
}

export default App
