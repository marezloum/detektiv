import { type ReactNode } from 'react'
import type { Clue, DialogueLine } from '../types/game'
import { lineHasCollectibleNote } from '../utils/notebook'
import { ClueIcon, iconKindFromClue } from './ClueIcon'

interface DialogueCollectActionsProps {
  line: DialogueLine
  locationClues: Clue[]
  hasNote: boolean
  hasRow: boolean
  hasClue: (id: string) => boolean
  /** Улики уже на фото — не дублировать список */
  hideClueList?: boolean
  onAddNote: () => void
  onRemoveNote: () => void
  onAddRow: () => void
  onRemoveRow: () => void
  onAddClue: (clueId: string) => void
  onRemoveClue: (clueId: string) => void
}

function CollectToggle({
  label,
  icon,
  added,
  onAdd,
  onRemove,
}: {
  label: string
  icon: ReactNode
  added: boolean
  onAdd: () => void
  onRemove: () => void
}) {
  return (
    <div className="dialogue-collect-row">
      <span className="dialogue-collect-label">
        <span className="dialogue-collect-icon">{icon}</span>
        {label}
      </span>
      <div className="dialogue-collect-btns">
        <button
          type="button"
          className={`btn btn-collect ${added ? 'active' : ''}`}
          onClick={onAdd}
          disabled={added}
          aria-label={`Добавить: ${label}`}
          title="Добавить"
        >
          +
        </button>
        <button
          type="button"
          className="btn btn-collect btn-collect-remove"
          onClick={onRemove}
          disabled={!added}
          aria-label={`Убрать: ${label}`}
          title="Убрать"
        >
          −
        </button>
      </div>
    </div>
  )
}

export function DialogueCollectActions({
  line,
  locationClues,
  hasNote,
  hasRow,
  hasClue,
  hideClueList = false,
  onAddNote,
  onRemoveNote,
  onAddRow,
  onRemoveRow,
  onAddClue,
  onRemoveClue,
}: DialogueCollectActionsProps) {
  const showTableCreate = !!(line.notebookTable || (line.notebookNote && !line.notebookAddRow))
  const showAddRow = !!line.notebookAddRow

  const noteLabel = line.notebookTable
    ? (line.notebookNote?.title ?? 'Создать таблицу в блокноте')
    : (line.notebookNote?.title ?? 'Записать в блокнот')

  const rowLabel =
    line.notebookAddRow?.label ??
    (line.notebookAddRow?.row[0]
      ? `Добавить строку: ${line.notebookAddRow.row[0]}`
      : 'Добавить строку в таблицу')

  const clues = hideClueList
    ? []
    : (line.clueIds
        ?.map((id) => locationClues.find((c) => c.id === id))
        .filter((c): c is Clue => !!c) ?? [])

  if (!showTableCreate && !showAddRow && clues.length === 0 && !lineHasCollectibleNote(line)) {
    return null
  }

  if (hideClueList && !showTableCreate && !showAddRow) {
    return null
  }

  return (
    <div className="dialogue-collect-actions">
      {showTableCreate && lineHasCollectibleNote(line) && !showAddRow && (
        <CollectToggle
          icon={<ClueIcon kind={line.notebookTable ? 'table' : 'notebook'} />}
          label={noteLabel}
          added={hasNote}
          onAdd={onAddNote}
          onRemove={onRemoveNote}
        />
      )}
      {showAddRow && (
        <CollectToggle
          icon={<ClueIcon kind="table" />}
          label={rowLabel}
          added={hasRow}
          onAdd={onAddRow}
          onRemove={onRemoveRow}
        />
      )}
      {clues.map((clue) => (
        <CollectToggle
          key={clue.id}
          icon={
            <ClueIcon
              kind={iconKindFromClue(clue)}
              postcardHint={clue.detail?.postcard?.paintingTitle ?? clue.title}
            />
          }
          label={clue.title}
          added={hasClue(clue.id)}
          onAdd={() => onAddClue(clue.id)}
          onRemove={() => onRemoveClue(clue.id)}
        />
      ))}
    </div>
  )
}
