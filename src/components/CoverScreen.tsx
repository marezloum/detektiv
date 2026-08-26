import { useGameContext } from '../context/GameContext'
import { GameLogo } from './GameLogo'
import { SceneBackground } from './SceneBackground'

export function CoverScreen() {
  const { scenario, scenarioList, enterHall, selectScenarioAndEnterHall } = useGameContext()

  return (
    <div className="screen cover-screen">
      <SceneBackground sceneId="title" className="cover-bg" />
      <div className="cover-vignette" aria-hidden />
      <div className="cover-letterbox cover-letterbox--top" aria-hidden />
      <div className="cover-letterbox cover-letterbox--bottom" aria-hidden />

      <div className="cover-content">
        <GameLogo size="lg" className="cover-logo" />
        <h1 className="visually-hidden">Детектив</h1>
        <p className="cover-tagline">Детективная игра по Москве</p>
        <p className="cover-desc">Выберите дело и расследуйте преступления по столице.</p>

        <section className="cover-scenarios" aria-label="Выбор сценария">
          <div className="cover-scenario-grid">
            {scenarioList.map((item) => {
              const locked = !item.available
              const selected = item.id === scenario.id

              return (
                <button
                  key={item.id}
                  type="button"
                  className={[
                    'cover-scenario-btn',
                    selected ? 'cover-scenario-btn--selected' : '',
                    locked ? 'cover-scenario-btn--locked' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => !locked && selectScenarioAndEnterHall(item.id)}
                  disabled={locked}
                  aria-pressed={selected}
                  aria-label={locked ? `${item.title} — скоро` : item.title}
                  title={item.title}
                >
                  <span className="cover-scenario-icon" aria-hidden>
                    {item.icon}
                  </span>
                  <span className="cover-scenario-name">{item.title}</span>
                  {locked && <span className="cover-scenario-soon">Скоро</span>}
                </button>
              )
            })}
          </div>
        </section>

        <button type="button" className="btn btn-primary btn-lg cover-enter-btn" onClick={enterHall}>
          В зал дел
        </button>
      </div>

      <div className="cover-noise" aria-hidden />
    </div>
  )
}
