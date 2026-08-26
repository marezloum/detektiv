import { useGameContext } from '../context/GameContext'
import { GameLogo } from './GameLogo'
import { ScreenTopBar } from './ScreenTopBar'
import { SceneBackground } from './SceneBackground'
import type { ScenarioListItem } from '../types/game'

const DIFFICULTY_LABELS: Record<NonNullable<ScenarioListItem['difficulty']>, string> = {
  easy: 'Лёгкий',
  medium: 'Средний',
  hard: 'Сложный',
}

function HallCaseCard({
  item,
  selected,
  index,
  onSelect,
}: {
  item: ScenarioListItem
  selected: boolean
  index: number
  onSelect: (id: string) => void
}) {
  const locked = !item.available
  const caseNum = String(index + 1).padStart(2, '0')

  return (
    <button
      type="button"
      className={[
        'hall-case-card',
        selected ? 'hall-case-card--selected' : '',
        locked ? 'hall-case-card--locked' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={() => !locked && onSelect(item.id)}
      disabled={locked}
      aria-pressed={selected}
    >
      <div className="hall-case-card-head">
        <div className="hall-case-card-title-row">
          <span className="hall-case-num">Дело №{caseNum}</span>
          <h3>{item.title}</h3>
        </div>
        {locked ? (
          <span className="hall-case-badge hall-case-badge--soon">Скоро</span>
        ) : selected ? (
          <span className="hall-case-badge hall-case-badge--active">Выбрано</span>
        ) : null}
      </div>
      <p className="hall-case-card-desc">{item.mystery}</p>
      <div className="hall-case-card-meta">
        {item.difficulty && (
          <span className="hall-meta-tag">{DIFFICULTY_LABELS[item.difficulty]}</span>
        )}
        {item.durationMinutes && (
          <span className="hall-meta-tag">~{item.durationMinutes} мин</span>
        )}
      </div>
    </button>
  )
}

export function GameHall() {
  const { scenario, scenarioList, selectScenario, startGame, goToCover } = useGameContext()
  const selectedIndex = Math.max(
    0,
    scenarioList.findIndex((item) => item.id === scenario.id),
  )
  const caseCode = String(selectedIndex + 1).padStart(2, '0')

  return (
    <div className="screen hall-screen">
      <SceneBackground sceneId="title" className="hall-bg" />
      <div className="hall-vignette" aria-hidden />
      <div className="hall-grain" aria-hidden />
      <div className="hall-letterbox hall-letterbox--top" aria-hidden />
      <div className="hall-letterbox hall-letterbox--bottom" aria-hidden />

      <ScreenTopBar onBack={goToCover} backLabel="На главную" />

      <div className="hall-panel">
        <header className="hall-header">
          <GameLogo size="sm" className="hall-logo" />
          <p className="hall-eyebrow">Зал открытых дел</p>
          <p className="hall-case-kicker">Дело №{caseCode}</p>
          <h1 className="hall-title">{scenario.title}</h1>
          <p className="hall-intro">
            Выберите дело и начните расследование по Москве — собирайте улики и записывайте
            подсказки в блокнот.
          </p>
        </header>

        <section className="hall-cases" aria-labelledby="hall-cases-heading">
          <h2 id="hall-cases-heading" className="hall-section-title">
            Открытые дела
          </h2>
          <div className="hall-case-list">
            {scenarioList.map((item, index) => (
              <HallCaseCard
                key={item.id}
                item={item}
                index={index}
                selected={item.id === scenario.id}
                onSelect={selectScenario}
              />
            ))}
          </div>
        </section>

        <footer className="hall-footer">
          <div className="hall-selected">
            <span className="hall-selected-label">Текущее дело</span>
            <strong className="hall-selected-title">{scenario.title}</strong>
            <p className="hall-selected-desc">{scenario.mystery}</p>
          </div>
          <button type="button" className="btn btn-primary btn-lg hall-start-btn" onClick={startGame}>
            Начать расследование
          </button>
        </footer>
      </div>
    </div>
  )
}
