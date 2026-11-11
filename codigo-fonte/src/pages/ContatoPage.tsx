import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LoaderCircle, Mail, MessageCircle, Phone } from 'lucide-react'
import { PageHero } from '../components/PageHero'
import { PageMeta } from '../components/PageMeta'
import { Reveal } from '../components/Reveal'
import { SITE, SOLUTIONS } from '../data/site'

type ContactErrors = Partial<
  Record<'nome' | 'email' | 'telefone' | 'mensagem' | 'aceite', string>
>

export function validateContact(values: Record<string, FormDataEntryValue>) {
  const errors: ContactErrors = {}
  const nome = String(values.nome ?? '')
  const email = String(values.email ?? '')
  const telefone = String(values.telefone ?? '')
  const mensagem = String(values.mensagem ?? '')
  const aceite = String(values.aceite ?? '')

  if (!nome || nome.trim().length < 2) {
    errors.nome = 'Informe seu nome completo.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = 'Informe um e-mail válido.'
  }
  if (telefone.replace(/\D/g, '').length < 10) {
    errors.telefone = 'Informe um telefone com DDD.'
  }
  if (!mensagem || mensagem.trim().length < 10) {
    errors.mensagem = 'Conte um pouco mais (mínimo 10 caracteres).'
  }
  if (aceite !== 'on') {
    errors.aceite = 'É preciso aceitar a Política de Privacidade.'
  }

  return errors
}

const inputClass =
  'mt-1 w-full rounded-xl border border-input bg-card px-4 py-3 outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30 aria-[invalid=true]:border-destructive'

export function ContatoPage() {
  const navigate = useNavigate()
  const [errors, setErrors] = useState<ContactErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const nextErrors = validateContact(Object.fromEntries(new FormData(form)))
    setErrors(nextErrors)

    const keys = Object.keys(nextErrors)
    if (keys.length > 0) {
      const firstField = form.querySelector<HTMLElement>(`[name="${keys[0]}"]`)
      firstField?.focus()
      return
    }

    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    navigate('/obrigado')
  }

  const FieldError = ({ k }: { k: keyof ContactErrors }) =>
    errors[k] ? (
      <p
        id={`${k}-err`}
        role="alert"
        className="mt-1 text-sm font-semibold text-destructive"
      >
        {errors[k]}
      </p>
    ) : null

  const channels = [
    {
      href: SITE.phoneHref,
      icon: Phone,
      label: 'Telefone',
      value: SITE.phone,
    },
    {
      href: SITE.whatsapp,
      icon: MessageCircle,
      label: 'WhatsApp',
      value: 'Resposta rápida',
    },
    {
      href: `mailto:${SITE.email}`,
      icon: Mail,
      label: 'E-mail',
      value: SITE.email,
    },
  ]

  return (
    <>
      <PageMeta
        title="Contato | Agende um Diagnóstico Gratuito — Partner Comunicação"
        description="Fale com os especialistas da Partner Comunicação. Telefone (11) 4562-0333, WhatsApp e e-mail. Agende uma visita e um diagnóstico gratuito."
      />

      <PageHero
        eyebrow="Contato"
        title="Vamos construir uma mensagem clara e única?"
        heroVariant="people"
      >
        Mais que um fornecedor, somos um parceiro estratégico. Consulte nossos
        especialistas e agende uma visita.
      </PageHero>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-[1fr_1.4fr] md:px-8">
        <Reveal className="space-y-4">
          {channels.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              target={channel.label === 'WhatsApp' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border bg-card p-5 transition hover:shadow-soft"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <channel.icon className="size-5" />
              </span>
              <span>
                <span className="block text-sm text-muted-foreground">
                  {channel.label}
                </span>
                <span className="break-all font-bold">{channel.value}</span>
              </span>
            </a>
          ))}
        </Reveal>

        <Reveal delay={120}>
          <form
            noValidate
            onSubmit={onSubmit}
            aria-label="Formulário de contato"
            className="space-y-5 rounded-3xl border bg-card p-6 shadow-soft md:p-10"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block font-semibold">
                Nome*
                <input
                  name="nome"
                  autoComplete="name"
                  className={inputClass}
                  aria-invalid={!!errors.nome}
                  aria-describedby="nome-err"
                />
                <FieldError k="nome" />
              </label>

              <label className="block font-semibold">
                Empresa
                <input
                  name="empresa"
                  autoComplete="organization"
                  className={inputClass}
                />
              </label>

              <label className="block font-semibold">
                E-mail*
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={inputClass}
                  aria-invalid={!!errors.email}
                  aria-describedby="email-err"
                />
                <FieldError k="email" />
              </label>

              <label className="block font-semibold">
                Telefone/WhatsApp*
                <input
                  name="telefone"
                  type="tel"
                  autoComplete="tel"
                  className={inputClass}
                  aria-invalid={!!errors.telefone}
                  aria-describedby="telefone-err"
                />
                <FieldError k="telefone" />
              </label>
            </div>

            <label className="block font-semibold">
              Interesse
              <select name="interesse" className={inputClass} defaultValue="">
                <option value="">Selecione uma solução</option>
                {SOLUTIONS.map((solution) => (
                  <option key={solution.id} value={solution.title}>
                    {solution.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="block font-semibold">
              Mensagem*
              <textarea
                name="mensagem"
                rows={5}
                className={inputClass}
                aria-invalid={!!errors.mensagem}
                aria-describedby="mensagem-err"
              />
              <FieldError k="mensagem" />
            </label>

            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                name="aceite"
                className="mt-1 size-4 accent-primary"
                aria-invalid={!!errors.aceite}
              />
              <span>
                Concordo com a{' '}
                <Link
                  to="/privacidade"
                  className="font-semibold text-primary underline"
                >
                  Política de Privacidade
                </Link>{' '}
                e autorizo o contato.
              </span>
            </label>
            <FieldError k="aceite" />

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 font-bold text-primary-foreground transition hover:scale-[1.01] disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <LoaderCircle className="size-5 animate-spin" /> Enviando...
                </>
              ) : (
                'Quero meu diagnóstico gratuito'
              )}
            </button>
          </form>
        </Reveal>
      </section>
    </>
  )
}
