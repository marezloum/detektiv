import type { Clue, ClueDetailType } from '../types/game'

export type CollectIconKind = ClueDetailType | 'notebook' | 'table' | 'backpack'

export function iconKindFromClue(clue: Clue): CollectIconKind {
  return clue.detail?.type ?? 'backpack'
}

interface ClueIconProps {
  kind: CollectIconKind
  className?: string
  /** postcard variant by painting hint */
  postcardHint?: string
}

export function ClueIcon({ kind, className = '', postcardHint }: ClueIconProps) {
  const root = ['clue-icon', `clue-icon--${kind}`, className].filter(Boolean).join(' ')

  if (kind === 'phone') {
    return (
      <span className={root} aria-hidden>
        <span className="clue-icon-phone">
          <span className="clue-icon-phone-antenna" />
          <span className="clue-icon-phone-body">
            <span className="clue-icon-phone-screen" />
            <span className="clue-icon-phone-keys" />
          </span>
        </span>
      </span>
    )
  }

  if (kind === 'business-card') {
    return (
      <span className={root} aria-hidden>
        <span className="clue-icon-card">
          <span className="clue-icon-card-line clue-icon-card-line--name" />
          <span className="clue-icon-card-line clue-icon-card-line--role" />
          <span className="clue-icon-card-line" />
        </span>
      </span>
    )
  }

  if (kind === 'note') {
    return (
      <span className={root} aria-hidden>
        <span className="clue-icon-note">
          <span className="clue-icon-note-fold" />
          <span className="clue-icon-note-line" />
          <span className="clue-icon-note-line" />
          <span className="clue-icon-note-line clue-icon-note-line--short" />
        </span>
      </span>
    )
  }

  if (kind === 'postcard') {
    const tone =
      postcardHint?.includes('Неизвестн')
        ? 'unknown'
        : postcardHint?.includes('Иван')
          ? 'ivan'
          : postcardHint?.includes('Апофеоз') || postcardHint?.includes('войн')
          ? 'apotheosis'
          : 'default'
    return (
      <span className={`${root} clue-icon--postcard-${tone}`} aria-hidden>
        <span className="clue-icon-postcard">
          <span className="clue-icon-postcard-art" />
          <span className="clue-icon-postcard-caption" />
        </span>
      </span>
    )
  }

  if (kind === 'ticket') {
    return (
      <span className={root} aria-hidden>
        <span className="clue-icon-ticket">
          <span className="clue-icon-ticket-stub" />
          <span className="clue-icon-ticket-body">
            <span className="clue-icon-ticket-line" />
            <span className="clue-icon-ticket-line clue-icon-ticket-line--thin" />
          </span>
        </span>
      </span>
    )
  }

  if (kind === 'voice') {
    return (
      <span className={root} aria-hidden>
        <span className="clue-icon-voice">
          <span className="clue-icon-voice-bar" />
          <span className="clue-icon-voice-bar" />
          <span className="clue-icon-voice-bar" />
          <span className="clue-icon-voice-bar" />
        </span>
      </span>
    )
  }

  if (kind === 'table') {
    return (
      <span className={root} aria-hidden>
        <span className="clue-icon-table">
          <span />
          <span />
          <span />
          <span />
        </span>
      </span>
    )
  }

  if (kind === 'notebook') {
    return (
      <span className={root} aria-hidden>
        <span className="clue-icon-notebook">
          <span className="clue-icon-notebook-spine" />
          <span className="clue-icon-notebook-pages" />
        </span>
      </span>
    )
  }

  return (
    <span className={root} aria-hidden>
      <span className="clue-icon-backpack" />
    </span>
  )
}
