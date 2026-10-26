import { useEffect, useState } from 'react'
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

  useEffect(() => {
    setWaitingForClues(false)
    setShowClueError(null)
  }, [lineKey])

  useEffect(() => {
    if (!waitingForClues || !cluesAllCollected) return
    setWaitingForClues(false)
    advanceDialogue()
  }, [waitingForClues, cluesAllCollected, advanceDialogue])

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

  const handleNarrationEnded = () => {
    if (useClueRow && !cluesAllCollected) {
      setWaitingForClues(true)
      return
    }
    if (line.requireShowClueId && !state.presentedLineKeys.has(lineKey)) {
      return
    }
    advanceDialogue()
  }

  const isMorgue = state.currentLocationId === 'forensic'
  const isGallery = state.currentLocationId === 'museum'
  const isTheater = state.currentLocationId === 'theater'
  const isHotel = state.currentLocationId === 'hotel'
  const inspectHotspots = Boolean(line.inspectHotspots)
  const shownRequired =
    !line.requireShowClueId || state.presentedLineKeys.has(lineKey)
  const canAdvance = shownRequired && (!useClueRow || cluesAllCollected)

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
        isMorgue ? 'dialogue-screen--forensic' : '',
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
      {isMorgue ? (
        <header className="location-bar" aria-label="Морг">
          <BackButton onClick={goBack} label="К месту" />
          <div className="location-bar-copy">
            <p className="location-hud-kicker">Место</p>
            <h2 className="location-hud-title">
              {LOCATIONS[currentLocation.locationId]?.name ?? 'Морг'}
            </h2>
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
          <div className={isMorgue ? 'dialogue-box dialogue-box--vn' : 'dialogue-box'}>
            {isMorgue && (
              <div className="vn-mark">
                <GameLogo size="sm" className="vn-logo" />
                <div className="dialogue-speaker">
                  {line.speaker === 'npc' && line.speakerName && (
                    <span className="speaker-name">{line.speakerName}</span>
                  )}
                  {line.speaker === 'player' && <span className="speaker-name">Вы</span>}
                </div>
              </div>
            )}

            <div className={isMorgue ? 'vn-copy' : undefined}>
              {!isMorgue && (
                <div className="dialogue-speaker">
                  {line.speaker === 'npc' && line.speakerName && (
                    <span className="speaker-name">{line.speakerName}</span>
                  )}
                  {line.speaker === 'player' && <span className="speaker-name">Вы</span>}
                </div>
              )}

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
                hasNote={state.notebook.some((n) => n.id === noteId)}
                hasRow={hasRow}
                hasClue={(id) => state.backpack.some((c) => c.id === id)}
                onAddNote={() => addNotebookFromLine(line)}
                onRemoveNote={() => removeNotebookEntry(noteId)}
                onAddRow={() => addNotebookRowFromLine(line)}
                onRemoveRow={() => removeNotebookRowFromLine(line)}
                onAddClue={addClueToBackpack}
                onRemoveClue={removeClueFromBackpack}
              />

              {!isMorgue && (
                <DialogueSpeechControls
                  text={line.text}
                  lineKey={lineKey}
                  audioSrc={line.audioCue}
                />
              )}

              {!isMorgue && (
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
                  >
                    {isLast ? 'Завершить' : 'Далее →'}
                  </button>
                </div>
              )}

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

            {isMorgue && (
              <div className="vn-voice">
                <DialogueSpeechControls
                  text={line.text}
                  lineKey={lineKey}
                  audioSrc={line.audioCue}
                />
              </div>
            )}

            {isMorgue && (
              <div className="vn-nav">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={retreatDialogue}
                  disabled={isFirst}
                >
                  ← Назад
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={advanceDialogue}
                  disabled={!canAdvance}
                >
                  {isLast ? 'Завершить' : 'Далее →'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

