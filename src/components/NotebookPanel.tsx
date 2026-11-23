import { useGameContext } from '../context/GameContext'
import { asset } from '../utils/asset'
import {
  GTG_SPECIALISTS_COLUMNS,
  GTG_SPECIALISTS_TABLE_ID,
  specialistsTableHasAllPhones,
} from '../utils/notebook'
import { DialogueSpeechControls } from './DialogueSpeechControls'

function NotebookTableEditor({
  entryId,
  columns,
  rows,
}: {
  entryId: string
  columns: string[]
  rows: string[][]
}) {
  const { updateNotebookCell, addNotebookTableRow } = useGameContext()

  return (
    <div className="notebook-table-wrap">
      <table className="notebook-table notebook-table--editable">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="notebook-table-empty">
                Таблица пуста — добавьте строку или запишите данные из диалога.
              </td>
            </tr>
          ) : (
            rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {columns.map((_, cellIdx) => (
                  <td key={cellIdx}>
                    <input
                      className="notebook-cell-input"
                      value={row[cellIdx] ?? ''}
                      placeholder="…"
                      aria-label={`${columns[cellIdx]}, строка ${rowIdx + 1}`}
                      onChange={(e) =>
                        updateNotebookCell(entryId, rowIdx, cellIdx, e.target.value)
                      }
                    />
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <button
        type="button"
        className="notebook-add-row-btn"
        onClick={() => addNotebookTableRow(entryId)}
      >
        + Добавить строку
      </button>
    </div>
  )
}

export function NotebookPanel() {
  const {
    state,
    scenario,
    removeNotebookEntry,
    createSpecialistsTable,
    goBack,
    openPanel,
  } = useGameContext()

  const hasSpecialistsTable = state.notebook.some((n) => n.id === GTG_SPECIALISTS_TABLE_ID)
  const isEmpty = state.notebook.length === 0 && !hasSpecialistsTable
  const directorVoice = scenario.hubClues?.find((c) => c.id === 'clue-voice-director')?.detail?.voice
  const heardDirector =
    state.backpack.some((c) => c.id === 'clue-voice-director') ||
    state.completedDialogues.has('director-call-0')
  const phonesComplete = specialistsTableHasAllPhones(state.notebook)
  const showDirectorVoice =
    Boolean(directorVoice?.audioSrc) && heardDirector && hasSpecialistsTable && !phonesComplete

  return (
    <div className="overlay-panel notebook-panel">
      <div className="backpack-folder" role="dialog" aria-labelledby="notebook-title">
        <div className="backpack-folder-tabs">
          <button
            type="button"
            className="backpack-folder-tab backpack-folder-tab--back"
            onClick={goBack}
            aria-label="Назад"
          >
            ← Назад
          </button>
          <h2 id="notebook-title" className="backpack-folder-tab backpack-folder-tab--title">
            Блокнот — заметки
          </h2>
        </div>

        <div className="backpack-folder-frame">
          {!hasSpecialistsTable && (
            <div className="notebook-create-table">
              <p>Нужна таблица специалистов ГТГ?</p>
              <button type="button" className="notebook-create-btn" onClick={createSpecialistsTable}>
                + Создать таблицу ({GTG_SPECIALISTS_COLUMNS.join(' / ')})
              </button>
            </div>
          )}

          {isEmpty ? (
            <p className="empty-msg">
              Во время расследования добавляйте важные записи и таблицы из разговоров.
            </p>
          ) : (
            <div className="notebook-stage">
              <p className="backpack-folder-kicker">
                Заметки по делу · {state.notebook.length}
              </p>
              <div className="notebook-list" aria-label="Заметки в блокноте">
                {[...state.notebook]
                  .sort((a, b) => {
                    if (a.id === GTG_SPECIALISTS_TABLE_ID) return -1
                    if (b.id === GTG_SPECIALISTS_TABLE_ID) return 1
                    return 0
                  })
                  .map((entry, index) => {
                  const isSpecialists = entry.id === GTG_SPECIALISTS_TABLE_ID
                  return (
                    <article
                      key={entry.id}
                      className={[
                        'note-card',
                        index % 3 === 0
                          ? 'is-tilt-a'
                          : index % 3 === 1
                            ? 'is-tilt-b'
                            : 'is-tilt-c',
                      ].join(' ')}
                    >
                      <img
                        src={asset('/images/ui/paperclip.svg')}
                        alt=""
                        className="locker-paperclip note-card-clip"
                        aria-hidden
                      />
                      <div className="note-card-header">
                        <div className="note-card-who">
                          <p className="note-card-eyebrow">Запись</p>
                          <h4 className="note-card-title">{entry.title}</h4>
                        </div>
                        <button
                          type="button"
                          className="note-card-remove"
                          onClick={() => removeNotebookEntry(entry.id)}
                          aria-label={`Удалить: ${entry.title}`}
                          title="Удалить"
                        >
                          Убрать
                        </button>
                      </div>
                      {entry.content && <p className="note-content">{entry.content}</p>}

                      {isSpecialists && showDirectorVoice && directorVoice && (
                        <div className="notebook-director-voice">
                          <p className="notebook-director-voice-label">
                            Голосовое директора — слушайте и вписывайте номера в таблицу
                          </p>
                          <DialogueSpeechControls
                            text={directorVoice.transcript ?? ''}
                            lineKey="notebook-director-voice"
                            audioSrc={directorVoice.audioSrc}
                            autoPlay
                          />
                        </div>
                      )}

                      {entry.table && (
                        <NotebookTableEditor
                          entryId={entry.id}
                          columns={entry.table.columns}
                          rows={entry.table.rows}
                        />
                      )}

                      {isSpecialists && phonesComplete && !state.phoneMatchSolved && (
                        <div className="notebook-next-step">
                          <p>
                            Номера записаны. Откройте рюкзак → «Телефон погибшего», сверьте журнал
                            звонков — затем ответьте на вопрос на столе.
                          </p>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => openPanel('backpack')}
                          >
                            Открыть рюкзак — телефон погибшего
                          </button>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
