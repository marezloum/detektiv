import { useGameContext } from '../context/GameContext'
import {
  GTG_SPECIALISTS_COLUMNS,
  GTG_SPECIALISTS_TABLE_ID,
} from '../utils/notebook'

/** Таблица блокнота прямо в звонке — печатаете номера, пока идёт озвучка */
export function CallLiveNotebook() {
  const { state, updateNotebookCell } = useGameContext()

  const entry = state.notebook.find((n) => n.id === GTG_SPECIALISTS_TABLE_ID)
  const table = entry?.table

  if (!table || table.rows.length === 0) {
    return <p className="call-notebook-loading">Готовим таблицу блокнота…</p>
  }

  const phoneColIdx = table.columns.findIndex((c) => /телефон/i.test(c))
  const editableCol = phoneColIdx >= 0 ? phoneColIdx : table.columns.length - 1

  return (
    <div className="call-live-notebook">
      <div className="call-live-notebook-header">
        <strong>📓 Блокнот</strong>
        <span>Впишите номера с клавиатуры</span>
      </div>
      <div className="notebook-table-wrap">
        <table className="notebook-table notebook-table--editable call-notebook-table">
          <thead>
            <tr>
              {GTG_SPECIALISTS_COLUMNS.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIdx) => (
              <tr key={row[0] ?? rowIdx}>
                {table.columns.map((col, cellIdx) => {
                  const isPhone = cellIdx === editableCol
                  return (
                    <td key={col}>
                      {isPhone ? (
                        <input
                          className="notebook-cell-input notebook-cell-input--phone"
                          value={row[cellIdx] ?? ''}
                          placeholder="+7 …"
                          inputMode="tel"
                          autoComplete="off"
                          aria-label={`Телефон: ${row[0] ?? `строка ${rowIdx + 1}`}`}
                          onChange={(e) =>
                            updateNotebookCell(
                              GTG_SPECIALISTS_TABLE_ID,
                              rowIdx,
                              cellIdx,
                              e.target.value,
                            )
                          }
                        />
                      ) : (
                        <span className="call-notebook-readonly">{row[cellIdx] || '—'}</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
