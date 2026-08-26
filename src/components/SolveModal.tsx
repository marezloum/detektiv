import { useState } from 'react'
import { useGameContext } from '../context/GameContext'
import { ScreenTopBar } from './ScreenTopBar'

export function SolveModal() {
  const { scenario, submitSolution, goBack } = useGameContext()
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="screen solve-screen">
      <ScreenTopBar onBack={goBack} backLabel="В кабинет" />
      <div className="panel solve-panel">
        <h2>Решить дело</h2>
        <p>На основе улик и заметок выберите преступника:</p>

        <div className="suspect-list">
          {scenario.suspects.map((s) => (
            <label key={s.id} className={`suspect-card ${selected === s.id ? 'selected' : ''}`}>
              <input
                type="radio"
                name="suspect"
                value={s.id}
                checked={selected === s.id}
                onChange={() => setSelected(s.id)}
              />
              <div>
                <strong>{s.name}</strong>
                <p>{s.alibi}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="btn-row">
          <button type="button" className="btn btn-secondary" onClick={goBack}>
            Назад
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!selected}
            onClick={() => selected && submitSolution(selected)}
          >
            Назвать преступника
          </button>
        </div>
      </div>
    </div>
  )
}
