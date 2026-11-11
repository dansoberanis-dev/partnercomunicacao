import { SITE } from '../data/site'

export function WhatsAppFloat() {
  return (
    <div className="fixed bottom-5 right-5 z-40 md:bottom-6 md:right-6">
      <span
        aria-hidden="true"
        className="anim-whatsapp-pulse pointer-events-none absolute inset-0 rounded-full bg-[#25D366]"
      />
      <a
        href={SITE.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com a Partner pelo WhatsApp"
        className="group relative flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_-6px_rgba(37,211,102,0.55)] transition-all duration-300 hover:scale-105 hover:bg-[#20bd5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-navy px-3.5 py-1.5 text-xs font-semibold text-navy-foreground opacity-0 shadow-soft transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 md:block md:translate-x-2"
        >
          Fale no WhatsApp
        </span>
        <svg
          viewBox="0 0 32 32"
          fill="currentColor"
          className="size-7"
          aria-hidden="true"
        >
          <path d="M16.003 3.2c-7.058 0-12.8 5.742-12.8 12.8 0 2.256.59 4.46 1.71 6.404L3.1 28.9l6.652-1.744a12.74 12.74 0 0 0 6.25 1.644h.005c7.057 0 12.796-5.743 12.796-12.8 0-3.42-1.331-6.635-3.749-9.054A12.72 12.72 0 0 0 16.003 3.2Zm7.458 18.21c-.315.887-1.832 1.693-2.548 1.8-.651.098-1.474.14-2.38-.149-.55-.175-1.257-.41-2.162-.801-3.803-1.642-6.287-5.472-6.477-5.726-.19-.254-1.547-2.058-1.547-3.927 0-1.87.98-2.789 1.328-3.168.348-.38.76-.474 1.013-.474.254 0 .507.002.729.013.234.012.547-.089.856.654.316.76 1.076 2.628 1.171 2.818.095.19.158.412.032.666-.127.254-.19.412-.38.634-.19.222-.4.496-.57.666-.19.19-.388.396-.167.776.222.38.986 1.627 2.118 2.636 1.454 1.296 2.68 1.698 3.06 1.888.38.19.602.159.824-.095.222-.254.95-1.109 1.204-1.49.254-.38.507-.316.855-.19.349.127 2.216 1.045 2.596 1.235.38.19.634.285.729.444.095.158.095.918-.22 1.805Z" />
        </svg>
      </a>
    </div>
  )
}
