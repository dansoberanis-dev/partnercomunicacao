import partnerLogo from '../assets/partner-logo.jpg'

export function Logo({ className = 'h-10 w-auto' }: { className?: string }) {
  return (
    <img
      src={partnerLogo}
      alt="Logo Partner Comunicação Integrada"
      width={819}
      height={275}
      className={className}
    />
  )
}
