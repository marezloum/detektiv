import type { VoicePhoneEntry } from '../types/game'
import { useGameContext } from '../context/GameContext'
import { PHONE_REVEAL_PENALTY_SECONDS } from '../utils/notebook'

interface VoicePhoneRevealListProps {
  phones: VoicePhoneEntry[]
  intro?: string
  outro?: string
}

export function VoicePhoneRevealList({ phones, intro, outro }: VoicePhoneRevealListProps) {
  const { state, revealDirectorPhone, HINT_PENALTY_SECONDS } = useGameContext()
  const penalty = HINT_PENALTY_SECONDS || PHONE_REVEAL_PENALTY_SECONDS

  return (
    <div className="voice-phone-reveal">
      {intro && <p className="voice-phone-intro">{intro}</p>}

      <ul className="voice-phone-list">
        {phones.map((entry) => {
          const revealed = state.revealedDirectorPhones.has(entry.name)
          return (
            <li key={entry.name} className="voice-phone-item">
              <div className="voice-phone-meta">
                <strong>{entry.name}</strong>
                <span>{entry.role}</span>
              </div>
              {revealed ? (
                <p className="voice-phone-number">{entry.phone}</p>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => revealDirectorPhone(entry.name)}
                >
                  Показать номер письменно (+{penalty} сек)
                </button>
              )}
            </li>
          )
        })}
      </ul>

      {outro && <p className="voice-phone-outro">{outro}</p>}
      <p className="voice-phone-hint">
        Сначала только голос. Письменный номер — по желанию, +{penalty} сек за каждый.
      </p>
    </div>
  )
}
