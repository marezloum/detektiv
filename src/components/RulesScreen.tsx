import { useState } from 'react'
import { useGameContext } from '../context/GameContext'
import { SceneBackground } from './SceneBackground'
import { AudioPlayer } from './AudioPlayer'
import { asset } from '../utils/asset'

export function RulesScreen() {
  const { scenario, confirmRules, revealRulesPenalty, HINT_PENALTY_SECONDS, goBack } =
    useGameContext()
  const [rulesRevealed, setRulesRevealed] = useState(false)

  const handleRevealRules = () => {
    revealRulesPenalty()
    setRulesRevealed(true)
  }

  return (
    <div className="screen rules-screen rules-screen--log">
      <SceneBackground sceneId="detective-room" className="rules-bg" />
      <div className="rules-overlay" aria-hidden />
      <div className="rules-grain" aria-hidden />

      <div className="rules-panel">
        <div className="rules-log" role="dialog" aria-labelledby="rules-log-title">
          <div className="rules-log-tabs">
            <button
              type="button"
              className="rules-log-tab rules-log-tab--back"
              onClick={goBack}
              aria-label="К меню"
            >
              ← К меню
            </button>
            <h2 id="rules-log-title" className="rules-log-tab rules-log-tab--title">
              Правила
            </h2>
          </div>

          <div className="rules-log-frame">
            <div className="rules-log-body">
              {scenario.introRulesAudio && (
                <div className="rules-audio">
                  <AudioPlayer src={scenario.introRulesAudio} label="Прослушать правила" />
                </div>
              )}

              {rulesRevealed ? (
                <p className="rules-text">{scenario.introRules}</p>
              ) : (
                <p className="rules-log-empty">
                  Правила скрыты. Подтвердите понимание или откройте подсказку.
                </p>
              )}
            </div>

            <div className="rules-log-foot">
              <p className="rules-prompt">Вы поняли правила?</p>
              <div className="rules-btn-row">
                <button
                  type="button"
                  className="rules-tape-btn rules-tape-btn--primary"
                  onClick={() => confirmRules(true)}
                >
                  <img
                    src={asset('/images/ui/paperclip.svg')}
                    alt=""
                    className="locker-paperclip"
                    aria-hidden
                  />
                  <span>Да, понял</span>
                </button>
                {!rulesRevealed && (
                  <button
                    type="button"
                    className="rules-tape-btn rules-tape-btn--hint"
                    onClick={handleRevealRules}
                  >
                    <span>
                      Нет — подсказка <em>(+{HINT_PENALTY_SECONDS} сек)</em>
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
