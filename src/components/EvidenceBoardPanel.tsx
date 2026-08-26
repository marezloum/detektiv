import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { useGameContext } from '../context/GameContext'
import { OverlayPanelHeader } from './ScreenTopBar'
import { ClueIcon, iconKindFromClue } from './ClueIcon'
import { isSolutionLink } from '../utils/evidenceBoard'
import type { Clue } from '../types/game'

type BoardMode = 'move' | 'link'
type DragKind = 'tray' | 'pin'

interface DragState {
  kind: DragKind
  clueId: string
  pointerId: number
  grabOffsetX: number
  grabOffsetY: number
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export function EvidenceBoardPanel() {
  const {
    state,
    scenario,
    boardMatchedLinks,
    boardSolutionTotal,
    pinClueOnBoard,
    moveBoardPin,
    unpinClueFromBoard,
    linkBoardPins,
    unlinkBoardPins,
    goBack,
  } = useGameContext()

  const boardRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<BoardMode>('move')
  const [linkFromId, setLinkFromId] = useState<string | null>(null)
  const [drag, setDrag] = useState<DragState | null>(null)
  const [ghost, setGhost] = useState<{ x: number; y: number; clueId: string } | null>(null)

  const pinnedIds = new Set(state.evidenceBoard.pins.map((p) => p.clueId))
  const trayClues = state.backpack.filter((c) => !pinnedIds.has(c.id))
  const clueById = new Map(state.backpack.map((c) => [c.id, c]))

  const toBoardPercent = (clientX: number, clientY: number) => {
    const el = boardRef.current
    if (!el) return { x: 50, y: 50 }
    const rect = el.getBoundingClientRect()
    return {
      x: clamp(((clientX - rect.left) / rect.width) * 100, 0, 100),
      y: clamp(((clientY - rect.top) / rect.height) * 100, 0, 100),
    }
  }

  const endDrag = (e: ReactPointerEvent) => {
    if (!drag || drag.pointerId !== e.pointerId) return
    const boardEl = boardRef.current
    const overBoard =
      boardEl &&
      (() => {
        const r = boardEl.getBoundingClientRect()
        return (
          e.clientX >= r.left &&
          e.clientX <= r.right &&
          e.clientY >= r.top &&
          e.clientY <= r.bottom
        )
      })()

    if (overBoard) {
      const { x, y } = toBoardPercent(e.clientX, e.clientY)
      if (drag.kind === 'tray') {
        pinClueOnBoard(drag.clueId, x, y)
      } else {
        moveBoardPin(drag.clueId, x, y)
      }
    }

    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      /* already released */
    }
    setDrag(null)
    setGhost(null)
  }

  const startTrayDrag = (clue: Clue, e: ReactPointerEvent<HTMLButtonElement>) => {
    if (mode !== 'move') return
    e.currentTarget.setPointerCapture(e.pointerId)
    setDrag({
      kind: 'tray',
      clueId: clue.id,
      pointerId: e.pointerId,
      grabOffsetX: 0,
      grabOffsetY: 0,
    })
    setGhost({ x: e.clientX, y: e.clientY, clueId: clue.id })
  }

  const startPinDrag = (clueId: string, e: ReactPointerEvent<HTMLElement>) => {
    if (mode === 'link') {
      e.stopPropagation()
      if (!linkFromId) {
        setLinkFromId(clueId)
        return
      }
      if (linkFromId === clueId) {
        setLinkFromId(null)
        return
      }
      linkBoardPins(linkFromId, clueId)
      setLinkFromId(null)
      return
    }

    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    setDrag({
      kind: 'pin',
      clueId,
      pointerId: e.pointerId,
      grabOffsetX: 0,
      grabOffsetY: 0,
    })
    setGhost({ x: e.clientX, y: e.clientY, clueId })
  }

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!drag || drag.pointerId !== e.pointerId) return
    setGhost({ x: e.clientX, y: e.clientY, clueId: drag.clueId })
    if (drag.kind === 'pin') {
      const { x, y } = toBoardPercent(e.clientX, e.clientY)
      moveBoardPin(drag.clueId, x, y)
    }
  }

  const ghostClue = ghost ? clueById.get(ghost.clueId) : null

  return (
    <div className="overlay-panel evidence-board-panel">
      <OverlayPanelHeader title="Доска улик" onBack={goBack} />

      <div className="board-toolbar">
        <div className="board-mode-toggle" role="group" aria-label="Режим доски">
          <button
            type="button"
            className={`board-mode-btn ${mode === 'move' ? 'is-active' : ''}`}
            onClick={() => {
              setMode('move')
              setLinkFromId(null)
            }}
          >
            Переместить
          </button>
          <button
            type="button"
            className={`board-mode-btn ${mode === 'link' ? 'is-active' : ''}`}
            onClick={() => setMode('link')}
          >
            Связать
          </button>
        </div>
        <p className="board-progress" aria-live="polite">
          {boardSolutionTotal > 0
            ? `Верных связей: ${boardMatchedLinks} / ${boardSolutionTotal}`
            : `Связей на доске: ${state.evidenceBoard.links.length}`}
        </p>
      </div>

      <p className="board-hint">
        {mode === 'move'
          ? 'Перетащите улику из лотка на доску. Карточки можно двигать.'
          : linkFromId
            ? 'Выберите вторую карточку — между ними появится нить.'
            : 'Нажмите две карточки по очереди, чтобы связать их нитью.'}
      </p>

      <div
        ref={boardRef}
        className={`evidence-board ${mode === 'link' ? 'evidence-board--link' : ''}`}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="evidence-board__cork" aria-hidden />

        <svg className="evidence-board__threads" viewBox="0 0 100 100" preserveAspectRatio="none">
          {state.evidenceBoard.links.map((link) => {
            const from = state.evidenceBoard.pins.find((p) => p.clueId === link.fromClueId)
            const to = state.evidenceBoard.pins.find((p) => p.clueId === link.toClueId)
            if (!from || !to) return null
            const correct = isSolutionLink(
              link.fromClueId,
              link.toClueId,
              scenario.boardSolutionLinks,
            )
            return (
              <line
                key={link.id}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                className={
                  correct
                    ? 'evidence-board__thread evidence-board__thread--correct'
                    : 'evidence-board__thread'
                }
              />
            )
          })}
        </svg>

        {state.evidenceBoard.pins.map((pin) => {
          const clue = clueById.get(pin.clueId)
          if (!clue) return null
          const selected = linkFromId === pin.clueId
          return (
            <article
              key={pin.clueId}
              className={[
                'board-pin',
                selected ? 'board-pin--selected' : '',
                drag?.clueId === pin.clueId ? 'board-pin--dragging' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              onPointerDown={(e) => startPinDrag(pin.clueId, e)}
            >
              <span className="board-pin__tack" aria-hidden />
              <ClueIcon
                kind={iconKindFromClue(clue)}
                postcardHint={clue.detail?.postcard?.paintingTitle ?? clue.title}
                className="clue-icon--in-card"
              />
              <h4>{clue.title}</h4>
              {mode === 'move' && (
                <button
                  type="button"
                  className="board-pin__remove"
                  aria-label={`Снять с доски: ${clue.title}`}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation()
                    unpinClueFromBoard(pin.clueId)
                  }}
                >
                  ×
                </button>
              )}
            </article>
          )
        })}

        {state.evidenceBoard.pins.length === 0 && (
          <p className="evidence-board__empty">Перетащите сюда улики из лотка внизу</p>
        )}
      </div>

      {state.evidenceBoard.links.length > 0 && (
        <ul className="board-links-list" aria-label="Связи на доске">
          {state.evidenceBoard.links.map((link) => {
            const from = clueById.get(link.fromClueId)
            const to = clueById.get(link.toClueId)
            const correct = isSolutionLink(
              link.fromClueId,
              link.toClueId,
              scenario.boardSolutionLinks,
            )
            return (
              <li key={link.id} className={correct ? 'board-link-item is-correct' : 'board-link-item'}>
                <span>
                  {from?.title ?? link.fromClueId} — {to?.title ?? link.toClueId}
                  {correct ? ' · верно' : ''}
                </span>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => unlinkBoardPins(link.id)}
                >
                  Убрать
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <div className="board-tray" aria-label="Улики для доски">
        <p className="board-tray__label">Лоток улик</p>
        {trayClues.length === 0 ? (
          <p className="board-tray__empty">
            {state.backpack.length === 0
              ? 'Сначала соберите улики в рюкзак.'
              : 'Все улики уже на доске.'}
          </p>
        ) : (
          <div className="board-tray__items">
            {trayClues.map((clue) => (
              <button
                key={clue.id}
                type="button"
                className="board-tray__card"
                draggable={false}
                onPointerDown={(e) => startTrayDrag(clue, e)}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                disabled={mode === 'link'}
                title={mode === 'link' ? 'Переключитесь в режим «Переместить»' : clue.title}
              >
                <ClueIcon
                  kind={iconKindFromClue(clue)}
                  postcardHint={clue.detail?.postcard?.paintingTitle ?? clue.title}
                  className="clue-icon--in-card"
                />
                <span>{clue.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {ghost && ghostClue && drag?.kind === 'tray' && (
        <div
          className="board-drag-ghost"
          style={{ left: ghost.x, top: ghost.y }}
          aria-hidden
        >
          <ClueIcon
            kind={iconKindFromClue(ghostClue)}
            postcardHint={ghostClue.detail?.postcard?.paintingTitle ?? ghostClue.title}
            className="clue-icon--in-card"
          />
          <span>{ghostClue.title}</span>
        </div>
      )}
    </div>
  )
}
