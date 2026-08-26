import { useGameContext } from '../context/GameContext'

export function GameTimer() {
  const { state, formatTime } = useGameContext()

  return (
    <div className="timer" aria-live="polite">
      <span className="timer-label">Время</span>
      <span className="timer-value">{formatTime(state.elapsedSeconds)}</span>
      {state.hintCount > 0 && (
        <span className="timer-hints">Подсказки: {state.hintCount}</span>
      )}
    </div>
  )
}
