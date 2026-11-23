import { useState } from 'react'
import { PHONE_MATCH_PUZZLE } from '../data/hubCalls'

interface PhoneMatchPuzzleProps {
  solved: boolean
  onAnswer: (optionId: string) => boolean
  compact?: boolean
}

export function PhoneMatchPuzzle({ solved, onAnswer, compact = false }: PhoneMatchPuzzleProps) {
  const [error, setError] = useState<string | null>(null)
  const [pickedId, setPickedId] = useState<string | null>(null)

  const handlePick = (optionId: string) => {
    if (solved) return
    setPickedId(optionId)
    const ok = onAnswer(optionId)
    if (ok) {
      setError(null)
      return
    }
    setError(PHONE_MATCH_PUZZLE.wrongText)
  }

  return (
    <section
      className={['phone-match', compact ? 'phone-match--compact' : ''].filter(Boolean).join(' ')}
      aria-label={PHONE_MATCH_PUZZLE.title}
    >
      <p className="phone-match-kicker">{PHONE_MATCH_PUZZLE.title}</p>
      <p className="phone-match-lead">{PHONE_MATCH_PUZZLE.lead}</p>
      {!solved && <p className="phone-match-tip">{PHONE_MATCH_PUZZLE.tip}</p>}

      {solved ? (
        <p className="phone-match-success" role="status">
          {PHONE_MATCH_PUZZLE.successText}
        </p>
      ) : (
        <div className="phone-match-options" role="group" aria-label="Варианты ответа">
          {PHONE_MATCH_PUZZLE.options.map((option) => (
            <button
              key={option.id}
              type="button"
              className={[
                'phone-match-option',
                pickedId === option.id && error ? 'is-wrong' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => handlePick(option.id)}
            >
              <strong>{option.label}</strong>
              <span>{option.phone}</span>
            </button>
          ))}
        </div>
      )}

      {error && !solved && (
        <p className="phone-match-error" role="alert">
          {error}
        </p>
      )}
    </section>
  )
}
