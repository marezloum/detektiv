import { useEffect, useRef, useState } from 'react'
import { useGameContext } from '../context/GameContext'
import type { Clue, DialogueLine } from '../types/game'
import { GTG_SPECIALISTS_TABLE_ID, notebookEntryId } from '../utils/notebook'
import { SceneBackground } from './SceneBackground'
import { ScreenTopBar } from './ScreenTopBar'
import { BackButton } from './BackButton'
import { GameTimer } from './GameTimer'
import { LOCATIONS } from '../data/locations'
import { DialogueCollectActions } from './DialogueCollectActions'
import { DialogueSpeechControls } from './DialogueSpeechControls'
import { NarrationVoice } from './NarrationVoice'
import { SceneClueHotspots } from './SceneClueHotspots'
import { museumSceneForHall } from '../data/tretyakovHalls'
import { theaterSceneForRoom } from '../data/theaterRooms'
import { hotelSceneForRoom } from '../data/hotelRooms'
import { ShowCluePicker } from './ShowCluePicker'
import type { SceneId } from '../assets/scenes'
import { GameLogo } from './GameLogo'
import { asset } from '../utils/asset'

const MORGUE_PAGE_MS = 420

function morgueSpeakerLabel(entry: DialogueLine) {
  if (entry.speaker === 'npc') return entry.speakerName ?? 'NPC'
  if (entry.speaker === 'player') return 'Вы'
  return 'Рассказчик'
}

export function DialogueView() {
  const {
    currentLocation,
    state,
    retreatDialogue,
    advanceDialogue,
    presentClue,
    addNotebookFromLine,
    removeNotebookEntry,
    addNotebookRowFromLine,
    removeNotebookRowFromLine,
    addClueToBackpack,
    removeClueFromBackpack,
    goBack,
    openPanel,
  } = useGameContext()

  const [waitingForClues, setWaitingForClues] = useState(false)
  const [showClueError, setShowClueError] = useState<string | null>(null)
  const [morguePageOpen, setMorguePageOpen] = useState(false)
  const [morguePageLeaving, setMorguePageLeaving] = useState(false)
  const morgueExitTimer = useRef<number | null>(null)
  const morgueClueAutoKey = useRef<string | null>(null)
  const morgueLogEndRef = useRef<HTMLDivElement | null>(null)
  const advanceDialogueRef = useRef(advanceDialogue)
  advanceDialogueRef.current = advanceDialogue

  const dialogue = currentLocation?.dialogues[state.activeDialogueIndex]
  const line = dialogue?.[state.dialogueStep]
  const lineKey = currentLocation
    ? `${currentLocation.locationId}-${state.activeDialogueIndex}-${state.dialogueStep}`
    : ''

  const rowClues: Clue[] =
    line?.clueIds
      ?.map((id) => currentLocation?.clues.find((c) => c.id === id))
      .filter((c): c is Clue => !!c) ?? []

  const useClueRow = rowClues.length > 0
  const cluesAllCollected =
    useClueRow && rowClues.every((c) => state.backpack.some((b) => b.id === c.id))

  const isMorgue = state.currentLocationId === 'forensic'
  const isGallery = state.currentLocationId === 'museum'
  const isTheaterEarly = state.currentLocationId === 'theater'
  const isDossier = isMorgue || isGallery || isTheaterEarly
  const dossierTalkPage = isDossier && !!line && !useClueRow

  useEffect(() => {
    setWaitingForClues(false)
    setShowClueError(null)
  }, [lineKey])

  useEffect(() => {
    if (!waitingForClues || !cluesAllCollected) return
    setWaitingForClues(false)
    advanceDialogueRef.current()
  }, [waitingForClues, cluesAllCollected])

  useEffect(() => {
    if (!dossierTalkPage) return
    morgueLogEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [dossierTalkPage, lineKey])

  useEffect(() => {
    if (!isMorgue || !useClueRow || !cluesAllCollected) return
    if (morgueClueAutoKey.current === lineKey) return
    const id = window.setTimeout(() => {
      morgueClueAutoKey.current = lineKey
      advanceDialogueRef.current()
    }, 680)
    return () => window.clearTimeout(id)
  }, [isMorgue, useClueRow, cluesAllCollected, lineKey])

  useEffect(() => {
    if (!dossierTalkPage) return
    setMorguePageLeaving(false)
    const id = window.requestAnimationFrame(() => {
      setMorguePageOpen(true)
    })
    return () => window.cancelAnimationFrame(id)
  }, [dossierTalkPage])

  useEffect(() => {
    return () => {
      if (morgueExitTimer.current !== null) {
        window.clearTimeout(morgueExitTimer.current)
      }
    }
  }, [])

  const shownRequiredEarly =
    !line?.requireShowClueId || state.presentedLineKeys.has(lineKey)

  const morguePostClueThanks =
    isMorgue &&
    !!dialogue &&
    !!line &&
    !useClueRow &&
    state.dialogueStep >= dialogue.length - 1 &&
    Boolean(dialogue[state.dialogueStep - 1]?.clueIds?.length)

  if (!currentLocation || !dialogue || !line) return null

  const isFirst = state.dialogueStep <= 0
  const isLast = state.dialogueStep >= dialogue.length - 1
  const isNarrator = line.speaker === 'narrator'
  const noteId =
    line.notebookTableId ??
    notebookEntryId(
      currentLocation.locationId,
      state.activeDialogueIndex,
      state.dialogueStep,
    )
  const tableId = line.notebookAddRow?.tableId ?? GTG_SPECIALISTS_TABLE_ID
  const rowName = line.notebookAddRow?.row[0] ?? ''
  const hasRow = state.notebook.some(
    (n) =>
      n.id === tableId &&
      n.table?.rows.some((r) => r[0] === rowName && rowName !== ''),
  )
  const hasNote = state.notebook.some((n) => n.id === noteId)
  const noteRequired = !!(line.notebookTable || (line.notebookNote && !line.notebookAddRow))
  const rowRequired = !!line.notebookAddRow
  const collectDone = (!noteRequired || hasNote) && (!rowRequired || hasRow)

  const handleNarrationEnded = () => {
    if (useClueRow && !cluesAllCollected) {
      setWaitingForClues(true)
      return
    }
    if (line.requireShowClueId && !state.presentedLineKeys.has(lineKey)) {
      return
    }
    if (!collectDone) return
    advanceDialogue()
  }

  const isTheater = isTheaterEarly
  const isHotel = state.currentLocationId === 'hotel'
  const inspectHotspots = Boolean(line.inspectHotspots)
  const shownRequired = shownRequiredEarly
  const canAdvance =
    shownRequired && (!useClueRow || cluesAllCollected) && collectDone
  const morgueClueStage = isMorgue && useClueRow
  const dossierLog = dialogue.slice(0, state.dialogueStep + 1)
  const dossierPlaceName =
    LOCATIONS[currentLocation.locationId]?.name ??
    (isGallery ? 'Третьяковская галерея' : isTheater ? 'Большой театр' : 'Морг')
  const dossierNpcName = isGallery
    ? galleryNpcName(state.activeDialogueIndex)
    : isTheater
      ? theaterNpcName(state.activeDialogueIndex)
      : currentLocation.npc.name
  const dossierNpcRole = isGallery
    ? galleryNpcRole(state.activeDialogueIndex)
    : isTheater
      ? theaterNpcRole(state.activeDialogueIndex)
      : currentLocation.npc.role

  const runAfterDossierLeave = (fn: () => void) => {
    if (morguePageLeaving) return
    if (!dossierTalkPage || !morguePageOpen) {
      fn()
      return
    }
    setMorguePageLeaving(true)
    if (morgueExitTimer.current !== null) {
      window.clearTimeout(morgueExitTimer.current)
    }
    morgueExitTimer.current = window.setTimeout(() => {
      morgueExitTimer.current = null
      setMorguePageLeaving(false)
      setMorguePageOpen(false)
      fn()
    }, MORGUE_PAGE_MS)
  }

  const nextDossierLine = dialogue[state.dialogueStep + 1]
  const nextDossierNeedsScene =
    isLast || Boolean(nextDossierLine?.clueIds && nextDossierLine.clueIds.length > 0)
  const dossierAdvanceLabel = morguePostClueThanks
    ? 'Закрыть'
    : isLast
      ? 'Прочитал — завершить'
      : nextDossierLine?.clueIds && nextDossierLine.clueIds.length > 0
        ? 'Осмотреть улики →'
        : 'Далее →'

  const handleDossierAdvance = () => {
    if (!canAdvance || morguePageLeaving) return
    if (nextDossierNeedsScene) {
      runAfterDossierLeave(() => advanceDialogue())
      return
    }
    advanceDialogue()
  }

  const handleDossierLeavePlace = () => {
    if (morguePageLeaving) return
    if (dossierTalkPage && morguePageOpen) {
      runAfterDossierLeave(() => goBack())
      return
    }
    goBack()
  }

  const lineScene = line.sceneId as SceneId | undefined
  const dialogueSceneId: SceneId | undefined =
    lineScene ??
    (isGallery
      ? museumSceneForHall(state.currentMuseumHallId)
      : isTheater
        ? theaterSceneForRoom(state.currentTheaterRoomId)
        : isHotel
          ? hotelSceneForRoom(state.currentHotelRoomId)
          : state.currentLocationId ?? undefined)

  const isInspectScene =
    inspectHotspots ||
    lineScene === 'hotel-room' ||
    lineScene === 'airport-search'

  return (
    <div
      className={[
        'screen',
        'dialogue-screen',
        isNarrator ? 'dialogue-screen--narration' : '',
        isDossier ? 'dialogue-screen--forensic' : '',
        dossierTalkPage ? 'dialogue-screen--page' : '',
        isGallery ? 'dialogue-screen--gallery' : '',
        isTheater ? 'dialogue-screen--theater' : '',
        isHotel ? 'dialogue-screen--hotel' : '',
        isInspectScene ? 'dialogue-screen--inspect' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {dialogueSceneId && (
        <SceneBackground sceneId={dialogueSceneId} className="dialogue-bg" />
      )}
      <div className="dialogue-vignette" aria-hidden />
      {isDossier ? (
        <header className="location-bar" aria-label={dossierPlaceName}>
          <BackButton onClick={handleDossierLeavePlace} label="К месту" />
          <div className="location-bar-copy">
            <p className="location-hud-kicker">Место</p>
            <h2 className="location-hud-title">{dossierPlaceName}</h2>
          </div>
          <GameTimer />
          <button
            type="button"
            className="map-nav-btn"
            onClick={() => openPanel('map')}
            aria-label="На карту"
          >
            На карту →
          </button>
        </header>
      ) : (
        <ScreenTopBar
          onBack={goBack}
          backLabel="К месту"
          onMap={() => openPanel('map')}
          mapLabel="На карту"
        />
      )}

      {useClueRow && inspectHotspots && (
        <SceneClueHotspots
          clues={rowClues}
          layout="scene"
          hasClue={(id) => state.backpack.some((c) => c.id === id)}
          onAddClue={addClueToBackpack}
          onRemoveClue={removeClueFromBackpack}
          hint={
            currentLocation.locationId === 'airport'
              ? 'Что здесь лишнее?'
              : 'Найдите улику в номере'
          }
        />
      )}

      {morgueClueStage && (
        <div className="morgue-clue-stage">
          <SceneClueHotspots
            clues={rowClues}
            hasClue={(id) => state.backpack.some((c) => c.id === id)}
            onAddClue={addClueToBackpack}
            onRemoveClue={removeClueFromBackpack}
            hint="Вещественные доказательства"
          />
          <div className="morgue-clue-dock">
            <p className="morgue-clue-line">{line.text}</p>
            <p className="morgue-clue-hint">Соберите вещи — разговор продолжится сам</p>
          </div>
        </div>
      )}

      {dossierTalkPage && (
        <div
          className={[
            'dialogue-page',
            morguePageOpen ? 'is-open' : '',
            morguePageLeaving ? 'is-leaving' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          role="dialog"
          aria-label="Разговор"
        >
          <div className="dialogue-page-sheet">
            <GameLogo size="sm" className="dialogue-page-logo" />
            <div className="dialogue-page-mark">
              <div className="dialogue-page-who">
                <p className="dialogue-page-kicker">Протокол разговора</p>
                <h3 className="dialogue-page-speaker">{dossierNpcName}</h3>
                <p className="dialogue-page-role">{dossierNpcRole}</p>
              </div>
            </div>

            <div className="dialogue-page-log" aria-live="polite">
              {dossierLog.map((entry, index) => {
                const entryKey = `${currentLocation.locationId}-${state.activeDialogueIndex}-${index}`
                const isCurrent = index === state.dialogueStep
                return (
                  <article
                    key={entryKey}
                    className={[
                      'dialogue-log-line',
                      entry.speaker === 'player' ? 'is-player' : '',
                      entry.speaker === 'narrator' ? 'is-narrator' : '',
                      isCurrent ? 'is-current' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {isCurrent && (
                      <img
                        src={asset('/images/ui/paperclip.svg')}
                        alt=""
                        className="locker-paperclip dialogue-log-clip"
                        aria-hidden
                      />
                    )}
                    <div className="dialogue-log-head">
                      <span className="dialogue-log-speaker">
                        {morgueSpeakerLabel(entry)}
                      </span>
                      <DialogueSpeechControls
                        text={entry.text}
                        lineKey={entryKey}
                        audioSrc={entry.audioCue}
                        variant="inline"
                      />
                    </div>
                    <p className="dialogue-log-text">{entry.text}</p>
                    {isCurrent && line.requireShowClueId && (
                      <ShowCluePicker
                        clues={state.backpack}
                        prompt={line.showCluePrompt ?? 'Покажите улику из рюкзака.'}
                        wrongText={line.showClueWrongText ?? 'Это не та улика.'}
                        shown={shownRequired}
                        error={showClueError}
                        onPresent={presentClue}
                        onError={setShowClueError}
                      />
                    )}
                    {isCurrent && (
                      <DialogueCollectActions
                        line={line}
                        locationClues={currentLocation.clues}
                        hideClueList
                        hasNote={hasNote}
                        hasRow={hasRow}
                        hasClue={(id) => state.backpack.some((c) => c.id === id)}
                        onAddNote={() => addNotebookFromLine(line)}
                        onRemoveNote={() => removeNotebookEntry(noteId)}
                        onAddRow={() => addNotebookRowFromLine(line)}
                        onRemoveRow={() => removeNotebookRowFromLine(line)}
                        onAddClue={addClueToBackpack}
                        onRemoveClue={removeClueFromBackpack}
                      />
                    )}
                  </article>
                )
              })}
              <div ref={morgueLogEndRef} />
            </div>

            <div className="dialogue-page-foot">
              <button
                type="button"
                className="dialogue-page-next"
                onClick={handleDossierAdvance}
                disabled={!canAdvance || morguePageLeaving}
                title={
                  !collectDone
                    ? 'Сначала добавьте запись в блокнот'
                    : undefined
                }
              >
                <img
                  src={asset('/images/ui/paperclip.svg')}
                  alt=""
                  className="locker-paperclip"
                  aria-hidden
                />
                <span>{dossierAdvanceLabel}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {!dossierTalkPage && !morgueClueStage && (
        <div
          className={[
            'dialogue-stack',
            isNarrator ? 'dialogue-stack--narration' : '',
            useClueRow && !inspectHotspots ? 'dialogue-stack--with-clues' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {useClueRow && !inspectHotspots && (
            <SceneClueHotspots
              clues={rowClues}
              hasClue={(id) => state.backpack.some((c) => c.id === id)}
              onAddClue={addClueToBackpack}
              onRemoveClue={removeClueFromBackpack}
              hint={isNarrator ? 'Вещи на столе' : undefined}
            />
          )}

          {isNarrator ? (
            <>
              <NarrationVoice
                text={line.text}
                lineKey={lineKey}
                audioSrc={line.audioCue}
                canBack={!isFirst}
                isLast={isLast}
                onBack={retreatDialogue}
                onSkip={() => {
                  if (!canAdvance) {
                    if (useClueRow && !cluesAllCollected) setWaitingForClues(true)
                    return
                  }
                  advanceDialogue()
                }}
                onEnded={handleNarrationEnded}
              />
              <div className="dialogue-progress narration-voice-progress">
                {dialogue.map((_: DialogueLine, i: number) => (
                  <span
                    key={i}
                    className={[
                      'dot',
                      i <= state.dialoguePeakStep ? 'active' : '',
                      i === state.dialogueStep ? 'current' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="dialogue-box">
              <div className="dialogue-speaker">
                {line.speaker === 'npc' && line.speakerName && (
                  <span className="speaker-name">{line.speakerName}</span>
                )}
                {line.speaker === 'player' && <span className="speaker-name">Вы</span>}
              </div>

              <p className="dialogue-text">{line.text}</p>

              {line.requireShowClueId && (
                <ShowCluePicker
                  clues={state.backpack}
                  prompt={line.showCluePrompt ?? 'Покажите улику из рюкзака.'}
                  wrongText={line.showClueWrongText ?? 'Это не та улика.'}
                  shown={shownRequired}
                  error={showClueError}
                  onPresent={presentClue}
                  onError={setShowClueError}
                />
              )}

              <DialogueCollectActions
                line={line}
                locationClues={currentLocation.clues}
                hideClueList={useClueRow}
                hasNote={hasNote}
                hasRow={hasRow}
                hasClue={(id) => state.backpack.some((c) => c.id === id)}
                onAddNote={() => addNotebookFromLine(line)}
                onRemoveNote={() => removeNotebookEntry(noteId)}
                onAddRow={() => addNotebookRowFromLine(line)}
                onRemoveRow={() => removeNotebookRowFromLine(line)}
                onAddClue={addClueToBackpack}
                onRemoveClue={removeClueFromBackpack}
              />

              <DialogueSpeechControls
                text={line.text}
                lineKey={lineKey}
                audioSrc={line.audioCue}
              />

              <div className="dialogue-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={retreatDialogue}
                  disabled={isFirst}
                >
                  ← Назад
                </button>
                <span className="dialogue-actions-spacer" aria-hidden />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={advanceDialogue}
                  disabled={!canAdvance}
                  title={
                    !collectDone
                      ? 'Сначала добавьте запись в блокнот'
                      : undefined
                  }
                >
                  {isLast ? 'Завершить' : 'Далее →'}
                </button>
              </div>

              <div className="dialogue-progress">
                {dialogue.map((_: DialogueLine, i: number) => (
                  <span
                    key={i}
                    className={[
                      'dot',
                      i <= state.dialoguePeakStep ? 'active' : '',
                      i === state.dialogueStep ? 'current' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function galleryNpcName(dialogueIndex: number): string {
  switch (dialogueIndex) {
    case 0:
    case 4:
      return 'Анна Сергеевна Захарова'
    case 1:
      return 'Марина Козлова'
    case 2:
      return 'Пётр Сергеев'
    case 3:
      return 'Дмитрий Андреевич'
    default:
      return 'Сотрудник ГТГ'
  }
}

function galleryNpcRole(dialogueIndex: number): string {
  switch (dialogueIndex) {
    case 0:
    case 4:
      return 'Директор галереи'
    case 1:
      return 'Реставратор'
    case 2:
      return 'Искусствовед'
    case 3:
      return 'Сотрудник галереи'
    default:
      return 'Сотрудник галереи'
  }
}

function theaterNpcName(dialogueIndex: number): string {
  switch (dialogueIndex) {
    case 0:
      return 'Ирина Белова'
    case 1:
      return 'Нина Петровна'
    case 2:
      return 'Сергей Ковалёв'
    default:
      return 'Сотрудник театра'
  }
}

function theaterNpcRole(dialogueIndex: number): string {
  switch (dialogueIndex) {
    case 0:
      return 'Буфетчица'
    case 1:
      return 'Гардеробщица'
    case 2:
      return 'Охранник'
    default:
      return 'Сотрудник театра'
  }
}

