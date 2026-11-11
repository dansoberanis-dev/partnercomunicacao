import { clsx, type ClassValue } from 'clsx'
import type { CSSProperties } from 'react'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Tipagem para variáveis CSS inline, por exemplo cssVars({ '--dir': -1 }). */
export function cssVars(vars: Record<string, string | number>): CSSProperties {
  return vars as CSSProperties
}
