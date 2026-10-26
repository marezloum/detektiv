import { useState } from 'react'
import { useGameContext } from '../context/GameContext'
import { ScreenTopBar } from './ScreenTopBar'
import { SceneBackground } from './SceneBackground'
import { AudioPlayer } from './AudioPlayer'

export function RulesScreen() {
  const { scenario, confirmRules, revealRulesPenalty, HINT_PENALTY_SECONDS, goBack } =
    useGameContext()
  const [rulesRevealed, setRulesRevealed] = useState(false)

  const handleRevealRules = () => {
    revealRulesPenalty()
    setRulesRevealed(true)
  }

  return (
    <div className="screen rules-screen">
      <SceneBackground sceneId="detective-room" className="rules-bg" />
      <div className="rules-vignette" aria-hidden />
      <ScreenTopBar onBack={goBack} backLabel="К меню" />
      <div className="panel rules-panel">
        <h2 className="rules-title">Правила игры</h2>

        {scenario.introRulesAudio && (
          <div className="rules-audio">
            <AudioPlayer src={scenario.introRulesAudio} label="Прослушать правила" />
          </div>
        )}

        {rulesRevealed && <p className="rules-text">{scenario.introRules}</p>}

        <div className="rules-actions">
          <p>Вы поняли правила?</p>
          <div className="btn-row">
            <button type="button" className="btn btn-primary" onClick={() => confirmRules(true)}>
              Да, понял
            </button>
            {!rulesRevealed && (
              <button type="button" className="btn btn-hint" onClick={handleRevealRules}>
                Нет — подсказка (+{HINT_PENALTY_SECONDS} сек)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
