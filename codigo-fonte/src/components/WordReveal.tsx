import { Fragment, useEffect, useRef } from 'react'
import { subscribeScroll } from '../lib/scroll'
import { cn, cssVars } from '../lib/utils'

export type WordPart = string | { text: string; strong?: boolean }

interface Token {
  text: string
  isWord: boolean
  strong: boolean
}

interface WordRevealProps {
  parts: readonly WordPart[]
  className?: string
}

// Fração do progresso que cada palavra usa para acender. Deve bater com o divisor
// em `.word-reveal-word` (index.css). Usada também para que a última palavra
// chegue à opacidade total exatamente quando o parágrafo termina.
const REVEAL_WINDOW = 0.16

/**
 * Parágrafo cujas palavras acendem uma a uma conforme o leitor rola a página.
 * O progresso vai para --p no parágrafo; cada palavra tem seu início (--f).
 */
export function WordReveal({ parts, className }: WordRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null)

  const tokens: Token[] = []
  for (const part of parts) {
    const piece =
      typeof part === 'string'
        ? { text: part, strong: false }
        : { text: part.text, strong: part.strong ?? false }
    for (const chunk of piece.text.split(/(\s+)/)) {
      if (chunk === '') continue
      tokens.push({ text: chunk, isWord: !/^\s+$/.test(chunk), strong: piece.strong })
    }
  }
  const wordTotal = Math.max(1, tokens.filter((token) => token.isWord).length)

  useEffect(
    () =>
      subscribeScroll(({ vh }) => {
        const el = ref.current
        if (!el) return
        const { top, height } = el.getBoundingClientRect()
        // 0 quando o parágrafo começa a entrar, 1 quando já passou da metade da tela
        const progress = (vh * 0.9 - top) / (height + vh * 0.5)
        el.style.setProperty('--p', Math.min(1, Math.max(0, progress)).toFixed(3))
      }),
    [],
  )

  let wordIndex = 0
  return (
    <p ref={ref} className={cn('word-reveal', className)}>
      {tokens.map((token, i) => {
        if (!token.isWord) return <Fragment key={i}>{token.text}</Fragment>
        const start = (wordIndex / wordTotal) * (1 - REVEAL_WINDOW)
        const style = cssVars({ '--f': start.toFixed(4) })
        wordIndex += 1
        return (
          <span
            key={i}
            style={style}
            className={cn('word-reveal-word', token.strong && 'word-reveal-strong')}
          >
            {token.text}
          </span>
        )
      })}
    </p>
  )
}
