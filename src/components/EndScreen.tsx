import { useGameContext } from '../context/GameContext'
import { ScreenTopBar } from './ScreenTopBar'

export function EndScreen() {
  const { state, scenario, formatTime, resetGame, goBack, goToCover } = useGameContext()
  const isVictory = state.phase === 'victory'
  const culprit = scenario.suspects.find((s) => s.id === scenario.solution.suspectId)

  return (
    <div className={`screen end-screen ${isVictory ? 'victory' : 'defeat'}`}>
      <ScreenTopBar onBack={goBack} backLabel="Продолжить" />
      <div className="panel end-panel">
        <h2>{isVictory ? '🎉 Дело закрыто!' : '❌ Ошибка'}</h2>
        {isVictory ? (
          <>
            <p>
              Преступник — <strong>{culprit?.name}</strong>. Он поехал на такси в аэропорт
              и собирался бежать в Стамбул.
            </p>
            <p className="end-time">Итоговое время: {formatTime(state.elapsedSeconds)}</p>
            {state.hintCount > 0 && (
              <p className="end-hints">(Использовано подсказок: {state.hintCount})</p>
            )}
          </>
        ) : (
          <p>
            Пересмотрите улики и заметки в блокноте. Настоящий преступник — охранник музея.
          </p>
        )}
        <button type="button" className="btn btn-primary" onClick={resetGame}>
          Новое дело
        </button>
        <button type="button" className="btn btn-secondary end-back-btn" onClick={goToCover}>
          На главную
        </button>
        {!isVictory && (
          <button type="button" className="btn btn-secondary end-back-btn" onClick={goBack}>
            Вернуться к расследованию
          </button>
        )}
      </div>
    </div>
  )
}
