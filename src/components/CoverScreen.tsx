import { useGameContext } from '../context/GameContext'
import { SceneBackground } from './SceneBackground'
import { asset } from '../utils/asset'
import type { ScenarioListItem } from '../types/game'

const CASE_THUMBS: Record<string, string> = {
  'stolen-painting': '/images/clues/painting-cover.jpg',
  'jewelry-heist': '/images/clues/cast-painting.jpg',
  'midnight-train': '/images/scenes/airport-search.jpg',
  'vanishing-witness': '/images/clues/victim-photo.jpg',
}

const DIFFICULTY_LABELS: Record<NonNullable<ScenarioListItem['difficulty']>, string> = {
  easy: 'Лёгкое',
  medium: 'Среднее',
  hard: 'Сложное',
}

export function CoverScreen() {
  const { scenario, scenarioList, selectScenario, startGame } = useGameContext()
  const canStart = scenarioList.some((item) => item.id === scenario.id && item.available)
  const selected = scenarioList.find((item) => item.id === scenario.id)

  return (
    <div className="screen cover-screen cover-screen--locker">
      <SceneBackground sceneId="title" className="locker-bg" />
      <div className="locker-overlay" aria-hidden />
      <div className="locker-grain" aria-hidden />

      <div className="locker-shell">
        <aside className="locker-rail">
          <div className="locker-rail-brand">
            <p className="locker-eyebrow">Москва · закрытый фонд</p>
            <h1 className="locker-title">
              Архив
              <br />
              дел
            </h1>
            <p className="locker-access">
              Уровень доступа: <strong>посетитель</strong>
            </p>
            <p className="locker-rail-desc">Материалы дел, находящиеся на хранении.</p>
          </div>

          <figure className="locker-polaroid">
            <img
              src={asset('/images/clues/victim-photo.jpg')}
              alt=""
              className="locker-polaroid-img"
            />
            <figcaption>Кабинет · дело №001</figcaption>
          </figure>

          <div className="locker-note">
            <p className="locker-note-label">Заметка архивариуса</p>
            <p>
              Здесь собраны открытые и закрытые дела. Выберите папку, изучите краткую
              сводку и начните расследование. Ничего не выдумано — только то, что
              удалось сохранить.
            </p>
          </div>
        </aside>

        <div className="locker-main">
          <header className="locker-main-head">
            <span className="locker-tape">
              <img
                src={asset('/images/ui/paperclip.svg')}
                alt=""
                className="locker-paperclip locker-paperclip--tape"
                aria-hidden
              />
              Обзор каталога
            </span>
            <div className="locker-stamp" aria-hidden>
              <span>Собственность</span>
              <strong>ДЕТЕКТИВ</strong>
              <em>EST. 06.26.26 · 002726</em>
            </div>
          </header>

          <section className="locker-catalog" aria-label="Выбор сценария">
            <div className="locker-grid">
              {scenarioList.map((item, index) => {
                const locked = !item.available
                const isSelected = item.id === scenario.id
                const caseNum = String(index + 1).padStart(3, '0')
                const thumb = CASE_THUMBS[item.id]

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={[
                      'locker-folder',
                      isSelected ? 'locker-folder--selected' : '',
                      locked ? 'locker-folder--locked' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => !locked && selectScenario(item.id)}
                    disabled={locked}
                    aria-pressed={isSelected}
                    aria-label={locked ? `${item.title} — скоро` : item.title}
                  >
                    <span className="locker-folder-tab">{caseNum}</span>
                    <span className="locker-folder-body">
                      <span
                        className="locker-folder-thumb"
                        style={
                          thumb
                            ? { backgroundImage: `url(${asset(thumb)})` }
                            : undefined
                        }
                        aria-hidden
                      >
                        {!thumb && <span className="locker-folder-emoji">{item.icon}</span>}
                      </span>
                      <span className="locker-folder-copy">
                        <span className="locker-folder-title">{item.title}</span>
                        <span className="locker-folder-desc">{item.mystery}</span>
                        <span className="locker-folder-meta">
                          {item.difficulty && (
                            <span>{DIFFICULTY_LABELS[item.difficulty]}</span>
                          )}
                          {item.durationMinutes && <span>~{item.durationMinutes} мин</span>}
                        </span>
                        <span className="locker-folder-cta">
                          {locked ? 'Скоро ›' : isSelected ? 'Выбрано ›' : 'Открыть дело ›'}
                        </span>
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          <div className="locker-actions">
            <p className="locker-selected-label">
              {selected
                ? selected.available
                  ? `Текущее дело: ${selected.title}`
                  : `В хранении: ${selected.title}`
                : 'Выберите дело'}
            </p>
            <button
              type="button"
              className="locker-enter-btn"
              onClick={startGame}
              disabled={!canStart}
            >
              <img
                src={asset('/images/ui/paperclip.svg')}
                alt=""
                className="locker-paperclip"
                aria-hidden
              />
              <span>Начать расследование</span>
            </button>
          </div>
        </div>
      </div>

      <footer className="locker-footer">
        <span>Все материалы восстановлены. Ничего не выдумано.</span>
        <span>Обращаться с любопытством. А.Д.</span>
      </footer>
    </div>
  )
}
