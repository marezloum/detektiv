import { useGameContext } from '../context/GameContext'
import { OverlayPanelHeader } from './ScreenTopBar'
import { GTG_SPECIALISTS_COLUMNS } from '../utils/notebook'

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
        className="btn btn-secondary btn-sm notebook-add-row-btn"
        onClick={() => addNotebookTableRow(entryId)}
      >
        + Добавить строку
      </button>
    </div>
  )
}

export function NotebookPanel() {
  const { state, removeNotebookEntry, createSpecialistsTable, goBack } = useGameContext()

  const hasSpecialistsTable = state.notebook.some((n) => n.id === 'note-gtg-specialists')

  return (
    <div className="overlay-panel notebook-panel">
      <OverlayPanelHeader title="Блокнот — заметки" onBack={goBack} />
      <div className="notebook-list">
        {!hasSpecialistsTable && (
          <div className="notebook-create-table">
            <p>Нужна таблица специалистов ГТГ?</p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={createSpecialistsTable}
            >
              + Создать таблицу ({GTG_SPECIALISTS_COLUMNS.join(' / ')})
            </button>
          </div>
        )}

        {state.notebook.length === 0 && hasSpecialistsTable === false ? (
          <p className="empty-msg">
            Во время расследования добавляйте важные записи и таблицы из разговоров.
          </p>
        ) : (
          state.notebook.map((entry) => (
            <article key={entry.id} className="note-card">
              <div className="inventory-card-header">
                <h4>{entry.title}</h4>
                <button
                  type="button"
                  className="btn btn-collect btn-collect-remove inventory-remove-btn"
                  onClick={() => removeNotebookEntry(entry.id)}
                  aria-label={`Удалить: ${entry.title}`}
                  title="Удалить"
                >
                  −
                </button>
              </div>
              {entry.content && <p className="note-content">{entry.content}</p>}
              {entry.table && (
                <NotebookTableEditor
                  entryId={entry.id}
                  columns={entry.table.columns}
                  rows={entry.table.rows}
                />
              )}
            </article>
          ))
        )}
      </div>
    </div>
  )
}
