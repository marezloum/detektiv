import { useEffect, useState } from 'react'
import { useGameContext } from '../context/GameContext'
import type { Clue, DialogueLine } from '../types/game'
import { GTG_SPECIALISTS_TABLE_ID, notebookEntryId } from '../utils/notebook'
import { SceneBackground } from './SceneBackground'
import { ScreenTopBar } from './ScreenTopBar'
import { DialogueCollectActions } from './DialogueCollectActions'
import { DialogueSpeechControls } from './DialogueSpeechControls'
import { NarrationVoice } from './NarrationVoice'
import { SceneClueHotspots } from './SceneClueHotspots'
import { museumSceneForHall } from '../data/tretyakovHalls'
import { theaterSceneForRoom } from '../data/theaterRooms'

export function DialogueView() {
  const {
    currentLocation,
    state,
    retreatDialogue,
    advanceDialogue,
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
    advanceDialogue()
  }

  const isGallery = state.currentLocationId === 'museum'
  const isTheater = state.currentLocationId === 'theater'

  const dialogueSceneId =
    isGallery
      ? museumSceneForHall(state.currentMuseumHallId)
      : isTheater
        ? theaterSceneForRoom(state.currentTheaterRoomId)
        : state.currentLocationId

  return (
    <div
      className={[
        'screen',
        'dialogue-screen',
        isNarrator ? 'dialogue-screen--narration' : '',
        isGallery ? 'dialogue-screen--gallery' : '',
        isTheater ? 'dialogue-screen--theater' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {dialogueSceneId && (
        <SceneBackground sceneId={dialogueSceneId} className="dialogue-bg" />
      )}
      <div className="dialogue-vignette" aria-hidden />
      <ScreenTopBar
        onBack={goBack}
        backLabel="К месту"
        onMap={() => openPanel('map')}
        mapLabel="На карту"
      />

      <div
        className={[
          'dialogue-stack',
          isNarrator ? 'dialogue-stack--narration' : '',
          useClueRow ? 'dialogue-stack--with-clues' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {useClueRow && (
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
              onSkip={advanceDialogue}
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
              <button type="button" className="btn btn-primary" onClick={advanceDialogue}>
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
    </div>
  )
}
