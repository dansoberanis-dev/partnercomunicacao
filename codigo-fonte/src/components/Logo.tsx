import partnerLogoTransparent from '../assets/partner-logo.png'
import partnerLogoWhite from '../assets/partner-logo-white.png'

export function Logo({
  className = 'h-10 w-auto',
  variant = 'transparent',
}: {
  className?: string
  variant?: 'transparent' | 'white'
}) {
  const src = variant === 'white' ? partnerLogoWhite : partnerLogoTransparent
  return (
    <img
      src={src}
      alt="Logo Partner Comunicação Integrada"
      width={819}
      height={275}
      className={className}
    />
  )
}
