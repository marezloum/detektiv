import { useGameContext } from '../context/GameContext'
import type { SavePulseTarget } from '../hooks/useGame'
import { SaveBell } from './SaveBell'

export function ToolBar() {
  const {
    openPanel,
    activePanel,
    canSolve,
    openSolve,
    hasPendingOpeningSms,
    savePulse,
    openPhone,
    phoneOpen,
  } = useGameContext()

  const pulsed = (target: SavePulseTarget) =>
    savePulse?.target === target ? 'is-saved' : ''

  return (
    <div className="toolbar">
      <button
        type="button"
        className={`tool-btn ${activePanel === 'map' ? 'active' : ''}`}
        onClick={() => openPanel('map')}
        title={
          hasPendingOpeningSms
            ? 'Сначала закройте сообщение на телефоне'
            : 'Карта'
        }
      >
        <span className="tool-icon">🗺</span>
        <span>Карта</span>
      </button>
      <button
        type="button"
        className={`tool-btn ${activePanel === 'backpack' ? 'active' : ''} ${pulsed('backpack')}`}
        onClick={() => openPanel('backpack')}
        title="Рюкзак — улики"
      >
        {savePulse?.target === 'backpack' && (
          <SaveBell key={savePulse.key} />
        )}
        <span className="tool-icon">🎒</span>
        <span>Рюкзак</span>
      </button>
      <button
        type="button"
        className={`tool-btn ${activePanel === 'notebook' ? 'active' : ''} ${pulsed('notebook')}`}
        onClick={() => openPanel('notebook')}
        title="Блокнот — заметки по делу"
      >
        {savePulse?.target === 'notebook' && (
          <SaveBell key={savePulse.key} />
        )}
        <span className="tool-icon">📓</span>
        <span>Блокнот</span>
      </button>
      <button
        type="button"
        className={`tool-btn ${phoneOpen ? 'active' : ''}`}
        onClick={() => openPhone()}
        title={hasPendingOpeningSms ? 'Новое сообщение' : 'Телефон'}
      >
        <span className="tool-icon">📱</span>
        <span>Телефон</span>
        {hasPendingOpeningSms && <span className="tool-badge">1</span>}
      </button>
      {canSolve && (
        <button type="button" className="tool-btn tool-solve" onClick={openSolve}>
          <span className="tool-icon">⚖</span>
          <span>Решить дело</span>
        </button>
      )}
    </div>
  )
}
