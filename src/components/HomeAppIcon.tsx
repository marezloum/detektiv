import { useId, useState } from 'react'
import type { CollectIconKind } from './ClueIcon'

interface HomeAppIconProps {
  kind: CollectIconKind
  postcardHint?: string
  imageSrc?: string
}

function postcardTone(hint?: string) {
  if (!hint) return 'default'
  if (hint.includes('Неизвестн')) return 'unknown'
  if (hint.includes('Иван')) return 'ivan'
  if (hint.includes('Апофеоз') || hint.includes('войн')) return 'apotheosis'
  return 'default'
}

export function HomeAppIcon({ kind, postcardHint, imageSrc }: HomeAppIconProps) {
  const uid = useId().replace(/:/g, '')
  const canTryImage = Boolean(
    imageSrc && (kind === 'photo' || kind === 'object' || kind === 'postcard'),
  )
  const [shot, setShot] = useState(false)
  const [failed, setFailed] = useState(false)
  const showShot = canTryImage && shot && !failed

  return (
    <span
      className={[
        'home-face',
        `home-face--${kind}`,
        showShot ? 'home-face--shot' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {!showShot && <PaintedFace kind={kind} hint={postcardHint} uid={uid} />}
      {canTryImage && !failed && (
        <img
          className={shot ? 'home-face__img' : 'home-face__img home-face__img--pending'}
          src={imageSrc}
          alt=""
          draggable={false}
          onLoad={() => setShot(true)}
          onError={() => setFailed(true)}
        />
      )}
    </span>
  )
}

function PaintedFace({
  kind,
  hint,
  uid,
}: {
  kind: CollectIconKind
  hint?: string
  uid: string
}) {
  if (kind === 'phone') return <PhoneFace uid={uid} />
  if (kind === 'note') return <NoteFace uid={uid} />
  if (kind === 'business-card') return <CardFace uid={uid} />
  if (kind === 'ticket') return <TicketFace uid={uid} />
  if (kind === 'postcard') return <PostcardFace uid={uid} tone={postcardTone(hint)} />
  if (kind === 'photo') return <PortraitFace uid={uid} />
  if (kind === 'voice') return <VoiceFace uid={uid} />
  if (kind === 'table') return <TableFace />
  if (kind === 'notebook') return <NotebookFace />
  if (kind === 'object') return <ObjectFace />
  return <PackFace />
}

function PhoneFace({ uid }: { uid: string }) {
  return (
    <svg className="home-face__svg" viewBox="0 0 120 120" aria-hidden>
      <defs>
        <linearGradient id={`${uid}-pg`} x1="18" y1="0" x2="100" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8CFF98" />
          <stop offset="42%" stopColor="#32D158" />
          <stop offset="100%" stopColor="#0E8A30" />
        </linearGradient>
        <radialGradient id={`${uid}-ps`} cx="32%" cy="12%" r="75%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}-ph`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.4" floodColor="#064016" floodOpacity="0.4" />
        </filter>
      </defs>
      <rect width="120" height="120" fill={`url(#${uid}-pg)`} />
      <rect width="120" height="120" fill={`url(#${uid}-ps)`} />
      <g filter={`url(#${uid}-ph)`} transform="translate(60 63) rotate(42) scale(3.35) translate(-12 -12)">
        <path
          fill="#fff"
          d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
        />
      </g>
    </svg>
  )
}

function NoteFace({ uid }: { uid: string }) {
  return (
    <svg className="home-face__svg" viewBox="0 0 120 120" aria-hidden>
      <defs>
        <linearGradient id={`${uid}-ng`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF6C9" />
          <stop offset="18%" stopColor="#FFE56A" />
          <stop offset="100%" stopColor="#F0B429" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" fill={`url(#${uid}-ng)`} />
      <rect width="120" height="26" fill="#fff" opacity="0.42" />
      <path d="M0 26h120" stroke="#e6c04a" strokeWidth="1" />
      <path d="M28 30v90" stroke="#e24b4b" strokeWidth="2.4" opacity="0.9" />
      <g stroke="#d7a322" strokeWidth="1.6" strokeLinecap="round" opacity="0.85">
        <path d="M36 44h70" />
        <path d="M36 58h70" />
        <path d="M36 72h70" />
        <path d="M36 86h70" />
        <path d="M36 100h52" />
      </g>
    </svg>
  )
}

function CardFace({ uid }: { uid: string }) {
  return (
    <svg className="home-face__svg" viewBox="0 0 120 120" aria-hidden>
      <defs>
        <linearGradient id={`${uid}-cg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3a4658" />
          <stop offset="100%" stopColor="#151b26" />
        </linearGradient>
        <linearGradient id={`${uid}-cp`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffdf8" />
          <stop offset="100%" stopColor="#efe6d4" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" fill={`url(#${uid}-cg)`} />
      <ellipse cx="60" cy="18" rx="50" ry="22" fill="#ffffff" opacity="0.06" />
      <g transform="rotate(-7 60 62)">
        <rect x="16" y="38" width="90" height="50" rx="5" fill="#000" opacity="0.28" />
        <rect x="14" y="34" width="92" height="52" rx="5" fill={`url(#${uid}-cp)`} />
        <circle cx="34" cy="52" r="11" fill="#1b2838" />
        <circle cx="34" cy="49" r="3.4" fill="#f6f1e6" />
        <path d="M25 61c2.2-6 15.8-6 18 0" fill="#f6f1e6" />
        <rect x="50" y="46" width="46" height="4.2" rx="2" fill="#1b2838" />
        <rect x="50" y="54.5" width="30" height="3" rx="1.5" fill="#b8903a" />
        <rect x="22" y="72" width="42" height="2.4" rx="1" fill="#d5cbb8" />
        <rect x="22" y="78" width="28" height="2.4" rx="1" fill="#d5cbb8" />
      </g>
    </svg>
  )
}

function TicketFace({ uid }: { uid: string }) {
  return (
    <svg className="home-face__svg" viewBox="0 0 120 120" aria-hidden>
      <defs>
        <linearGradient id={`${uid}-tg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a2340" />
          <stop offset="100%" stopColor="#3d0c1c" />
        </linearGradient>
        <linearGradient id={`${uid}-tp`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff6e4" />
          <stop offset="100%" stopColor="#e7d3a6" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" fill={`url(#${uid}-tg)`} />
      <ellipse cx="60" cy="8" rx="46" ry="18" fill="#fff" opacity="0.08" />
      <mask id={`${uid}-tm`}>
        <rect width="120" height="120" fill="#fff" />
        <circle cx="14" cy="57" r="7" fill="#000" />
        <circle cx="106" cy="57" r="7" fill="#000" />
      </mask>
      <g mask={`url(#${uid}-tm)`}>
        <rect x="16" y="36" width="88" height="52" rx="6" fill="#000" opacity="0.25" />
        <rect x="14" y="30" width="92" height="54" rx="6" fill={`url(#${uid}-tp)`} />
        <rect x="14" y="30" width="24" height="54" fill="#ecd9ae" />
        <path d="M38 32v50" stroke="#c4a46a" strokeWidth="1.4" strokeDasharray="2.2 2.2" />
        <circle cx="72" cy="48" r="9" fill="none" stroke="#8a1c32" strokeWidth="1.6" />
        <path d="M68 48h8M72 44v8" stroke="#8a1c32" strokeWidth="1.3" />
        <rect x="46" y="64" width="48" height="2.4" rx="1" fill="#8a1c32" opacity="0.8" />
        <rect x="46" y="70" width="34" height="2" rx="1" fill="#c4a46a" />
      </g>
    </svg>
  )
}

function PostcardFace({ uid, tone }: { uid: string; tone: string }) {
  if (tone === 'unknown') {
    return (
      <svg className="home-face__svg" viewBox="0 0 120 120" aria-hidden>
        <rect width="120" height="120" fill="#6d7c8a" />
        <rect y="0" width="120" height="64" fill="#8b9aaa" />
        <rect y="56" width="120" height="64" fill="#2a3138" />
        <rect x="70" y="82" width="46" height="18" rx="3" fill="#161a1e" />
        <circle cx="82" cy="102" r="7" fill="#111" stroke="#cbb892" strokeWidth="1.4" />
        <circle cx="104" cy="102" r="7" fill="#111" stroke="#cbb892" strokeWidth="1.4" />
        <path d="M16 86c12-10 58-12 70 8l8 26H20Z" fill="#14110f" />
        <path d="M32 80c12 14 40 14 52-2-8 12-40 14-52 2Z" fill="#efe6da" />
        <ellipse cx="58" cy="58" rx="15" ry="17" fill="#f0cbb0" />
        <ellipse cx="52" cy="62" rx="3.2" ry="1.6" fill="#e7a08a" opacity="0.5" />
        <ellipse cx="64" cy="62" rx="3.2" ry="1.6" fill="#e7a08a" opacity="0.5" />
        <ellipse cx="53" cy="56" rx="1.7" ry="1.1" fill="#2a2420" />
        <ellipse cx="63" cy="56" rx="1.7" ry="1.1" fill="#2a2420" />
        <path d="M54 66q4 3 8 0" stroke="#a85a58" strokeWidth="1.2" fill="none" />
        <path d="M30 48c8-22 48-24 58 2-8-6-48-6-58-2Z" fill="#1a1412" />
        <path d="M24 50c16-8 52-8 68 4-16-4-50-4-68-4Z" fill="#120e0c" />
        <path d="M80 28c16-12 26-2 16 10-8-4-14-6-16-10Z" fill="#3d2a22" />
      </svg>
    )
  }

  if (tone === 'ivan') {
    return (
      <svg className="home-face__svg" viewBox="0 0 120 120" aria-hidden>
        <rect width="120" height="120" fill="#14080a" />
        <rect y="78" width="120" height="42" fill="#3a0c10" />
        <ellipse cx="82" cy="98" rx="26" ry="9" fill="#7a1218" />
        <path d="M58 72c14-12 44-6 48 18l-8 12-36-4Z" fill="#6a2430" />
        <ellipse cx="96" cy="60" rx="11" ry="13" fill="#e4c2a6" transform="rotate(24 96 60)" />
        <path d="M14 108 28 60c12-12 34-8 42 16l8 32Z" fill="#2a1418" />
        <ellipse cx="48" cy="44" rx="14" ry="16" fill="#e0b898" />
        <path d="M34 38c2-18 28-20 30 2-6-8-24-8-30-2Z" fill="#2a1810" />
        <path d="M36 54c6 16 22 14 26-2-6 10-20 10-26 2Z" fill="#5c3828" />
      </svg>
    )
  }

  if (tone === 'apotheosis') {
    const skulls = [
      [60, 34],
      [48, 50],
      [72, 50],
      [36, 66],
      [60, 66],
      [84, 66],
      [28, 84],
      [48, 84],
      [72, 84],
      [92, 84],
    ]
    return (
      <svg className="home-face__svg" viewBox="0 0 120 120" aria-hidden>
        <defs>
          <linearGradient id={`${uid}-ag`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f3dd96" />
            <stop offset="55%" stopColor="#e2b44a" />
            <stop offset="100%" stopColor="#b88832" />
          </linearGradient>
        </defs>
        <rect width="120" height="120" fill={`url(#${uid}-ag)`} />
        <ellipse cx="78" cy="22" rx="28" ry="10" fill="#fff6d2" opacity="0.45" />
        {skulls.map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="9" fill="#efe4cc" />
            <circle cx={x - 3} cy={y - 1} r="1.5" fill="#3a2a18" />
            <circle cx={x + 3} cy={y - 1} r="1.5" fill="#3a2a18" />
            <path d={`M${x - 2} ${y + 3}h4`} stroke="#3a2a18" strokeWidth="1" />
          </g>
        ))}
        <path d="M18 28l6 4-6 2M24 22l7 5-7 2" stroke="#2a2010" strokeWidth="1.2" fill="none" />
        <path d="M96 36l5 3-5 2" stroke="#2a2010" strokeWidth="1.2" fill="none" />
      </svg>
    )
  }

  return (
    <svg className="home-face__svg" viewBox="0 0 120 120" aria-hidden>
      <rect width="120" height="120" fill="#d7c4a4" />
      <rect x="16" y="18" width="88" height="72" rx="2" fill="#8a5a3a" />
      <rect x="22" y="96" width="76" height="6" rx="2" fill="#5c4030" />
    </svg>
  )
}

function PortraitFace({ uid }: { uid: string }) {
  return (
    <svg className="home-face__svg" viewBox="0 0 120 120" aria-hidden>
      <defs>
        <linearGradient id={`${uid}-fg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8ea0b4" />
          <stop offset="100%" stopColor="#3e4c5c" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" fill={`url(#${uid}-fg)`} />
      <circle cx="60" cy="46" r="18" fill="#e7d3c0" />
      <path d="M28 108c4-28 22-40 32-40s28 12 32 40" fill="#243140" />
    </svg>
  )
}

function VoiceFace({ uid }: { uid: string }) {
  return (
    <svg className="home-face__svg" viewBox="0 0 120 120" aria-hidden>
      <defs>
        <linearGradient id={`${uid}-vg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2e36" />
          <stop offset="100%" stopColor="#101216" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" fill={`url(#${uid}-vg)`} />
      <g fill="#ff3b30">
        <rect x="22" y="58" width="8" height="16" rx="3" />
        <rect x="36" y="46" width="8" height="40" rx="3" />
        <rect x="50" y="36" width="8" height="60" rx="3" />
        <rect x="64" y="48" width="8" height="36" rx="3" />
        <rect x="78" y="42" width="8" height="48" rx="3" />
        <rect x="92" y="56" width="8" height="20" rx="3" />
      </g>
    </svg>
  )
}

function TableFace() {
  return (
    <svg className="home-face__svg" viewBox="0 0 120 120" aria-hidden>
      <rect width="120" height="120" fill="#1f7a45" />
      <rect x="14" y="16" width="92" height="88" rx="6" fill="#f4f7f2" />
      <rect x="14" y="16" width="92" height="18" rx="6" fill="#176b3c" />
      <rect x="14" y="28" width="92" height="6" fill="#176b3c" />
      <g stroke="#d5ddd4" strokeWidth="1.2">
        <path d="M44 34v70M74 34v70M14 56h92M14 76h92" />
      </g>
    </svg>
  )
}

function NotebookFace() {
  return (
    <svg className="home-face__svg" viewBox="0 0 120 120" aria-hidden>
      <rect width="120" height="120" fill="#2c4a34" />
      <rect x="22" y="14" width="78" height="92" rx="3" fill="#f3efe4" />
      <rect x="22" y="14" width="10" height="92" fill="#c9a227" />
      <g stroke="#d9d0c0" strokeWidth="1.4">
        <path d="M42 32h48M42 44h48M42 56h48M42 68h40M42 80h32" />
      </g>
    </svg>
  )
}

function ObjectFace() {
  return (
    <svg className="home-face__svg" viewBox="0 0 120 120" aria-hidden>
      <rect width="120" height="120" fill="#5c4634" />
      <rect x="28" y="18" width="64" height="84" rx="6" fill="#c4a574" />
      <rect x="36" y="28" width="48" height="56" fill="#6a4a32" />
      <path d="M36 28h48v8H36z" fill="#e6d2ae" />
    </svg>
  )
}

function PackFace() {
  return (
    <svg className="home-face__svg" viewBox="0 0 120 120" aria-hidden>
      <rect width="120" height="120" fill="#6a3a28" />
      <path d="M38 36c0-12 44-12 44 0" fill="none" stroke="#e6d2ae" strokeWidth="4" />
      <rect x="30" y="40" width="60" height="62" rx="10" fill="#3a2018" />
      <rect x="46" y="58" width="28" height="22" rx="4" fill="#c9a227" opacity="0.85" />
    </svg>
  )
}
