import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn, cssVars } from '../lib/utils'

interface FaqAccordionProps {
  question: string
  answer: string
  index: number
}

/** Item de FAQ com abertura suave (grid-template-rows) e acento lateral animado. */
export function FaqAccordion({ question, answer, index }: FaqAccordionProps) {
  const [open, setOpen] = useState(false)
  const id = useId()

  return (
    <div
      className={cn('faq-item relative overflow-hidden rounded-xl border bg-card', open && 'is-open')}
      style={cssVars({ '--delay': `${index * 90}ms`, '--dir': index % 2 === 0 ? -1 : 1 })}
    >
      <span aria-hidden="true" className="faq-accent" />
      <h3 className="font-sans text-base tracking-normal">
        <button
          type="button"
          id={`${id}-trigger`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left font-bold"
        >
          {question}
          <ChevronDown aria-hidden="true" className="faq-chevron size-5 shrink-0 text-primary" />
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-trigger`}
        className="faq-panel"
      >
        <div className="faq-panel-inner">
          <p className="px-5 pb-5 text-muted-foreground">{answer}</p>
        </div>
      </div>
    </div>
  )
}
