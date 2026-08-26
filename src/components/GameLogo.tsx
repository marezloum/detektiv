import { asset } from '../utils/asset'

interface GameLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function GameLogo({ className, size = 'md' }: GameLogoProps) {
  return (
    <img
      src={asset('/images/logoTransparent.png')}
      alt="Детектив — Москва"
      className={['game-logo', `game-logo--${size}`, className].filter(Boolean).join(' ')}
      width={size === 'lg' ? 280 : size === 'md' ? 160 : 72}
      height={size === 'lg' ? 280 : size === 'md' ? 160 : 72}
      draggable={false}
    />
  )
}
