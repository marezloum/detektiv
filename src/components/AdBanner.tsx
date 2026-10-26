import { useEffect, useState } from 'react'
import { GAME_ADS } from '../data/ads'

const ROTATE_MS = 7000

export function AdBanner() {
  const [index, setIndex] = useState(0)
  const ad = GAME_ADS[index] ?? GAME_ADS[0]

  useEffect(() => {
    if (GAME_ADS.length < 2) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % GAME_ADS.length)
    }, ROTATE_MS)
    return () => window.clearInterval(timer)
  }, [])

  if (!ad) return null

  return (
    <aside className="ad-banner" aria-label="Реклама">
      <a
        key={ad.id}
        className={`ad-banner-card ad-banner-card--${ad.tone}`}
        href={ad.href}
        target="_blank"
        rel="noopener noreferrer sponsored"
      >
        <span className="ad-banner-badge">Реклама</span>
        <span className="ad-banner-copy">
          <strong>{ad.title}</strong>
          <span>{ad.text}</span>
        </span>
        <span className="ad-banner-cta">{ad.cta}</span>
      </a>
      {GAME_ADS.length > 1 && (
        <div className="ad-banner-dots">
          {GAME_ADS.map((item, dotIndex) => (
            <button
              key={item.id}
              type="button"
              className={dotIndex === index ? 'is-active' : undefined}
              aria-label={item.title}
              aria-current={dotIndex === index ? 'true' : undefined}
              onClick={() => setIndex(dotIndex)}
            />
          ))}
        </div>
      )}
    </aside>
  )
}
