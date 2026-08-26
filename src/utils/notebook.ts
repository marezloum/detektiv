import type { DialogueLine, LocationId, NotebookEntry, NotebookTable } from '../types/game'

export const GTG_SPECIALISTS_TABLE_ID = 'note-gtg-specialists'

export const GTG_SPECIALISTS_COLUMNS = ['Имя и фамилия', 'Специальность', 'Телефон'] as const

export const GTG_SPECIALIST_PHONES: Record<string, string> = {
  'Марина Козлова': '+7 495 231-45-01',
  'Пётр Сергеев': '+7 495 231-45-67',
  'Дмитрий Орлов': '+7 495 231-45-89',
}

export const GTG_SPECIALIST_PHONE_ENTRIES = [
  { name: 'Марина Козлова', role: 'Реставратор', phone: '+7 495 231-45-01' },
  { name: 'Пётр Сергеев', role: 'Искусствовед', phone: '+7 495 231-45-67' },
  {
    name: 'Дмитрий Орлов',
    role: 'Специалист по безопасности залов',
    phone: '+7 495 231-45-89',
  },
] as const

export const PHONE_REVEAL_PENALTY_SECONDS = 10

export function notebookEntryId(locationId: LocationId, dialogueIndex: number, step: number) {
  return `note-${locationId}-${dialogueIndex}-${step}`
}

export function buildNotebookEntryFromLine(
  line: DialogueLine,
  locationId: LocationId,
  dialogueIndex: number,
  step: number,
): NotebookEntry {
  if (line.notebookTable) {
    return {
      id: line.notebookTableId ?? notebookEntryId(locationId, dialogueIndex, step),
      title: line.notebookNote?.title ?? 'Таблица',
      content: line.notebookNote?.content ?? '',
      motionVerbs: line.motionVerbs ?? [],
      autoAdded: false,
      table: {
        columns: [...line.notebookTable.columns],
        rows: line.notebookTable.rows.map((row) => [...row]),
      },
    }
  }

  if (line.notebookNote) {
    return {
      id: notebookEntryId(locationId, dialogueIndex, step),
      title: line.notebookNote.title,
      content: line.notebookNote.content,
      motionVerbs: line.motionVerbs ?? [],
      autoAdded: false,
    }
  }

  const title =
    line.speaker === 'npc' && line.speakerName
      ? line.speakerName
      : line.speaker === 'player'
        ? 'Вы'
        : 'Заметка'

  return {
    id: notebookEntryId(locationId, dialogueIndex, step),
    title,
    content: line.text,
    motionVerbs: line.motionVerbs ?? [],
    autoAdded: false,
  }
}

export function lineHasCollectibleNote(line: DialogueLine): boolean {
  return !!(line.notebookNote || line.notebookTable || line.notebookAddRow)
}

export function createEmptySpecialistsTable(): NotebookEntry {
  return {
    id: GTG_SPECIALISTS_TABLE_ID,
    title: 'Специалисты ГТГ (23 марта, 18:00)',
    content: 'Запишите имена и специальности. Телефоны директор надиктует по звонку.',
    motionVerbs: [],
    autoAdded: false,
    table: {
      columns: [...GTG_SPECIALISTS_COLUMNS],
      rows: [],
    },
  }
}

export function addRowToTable(
  table: NotebookTable,
  row: string[],
): NotebookTable {
  const normalized = table.columns.map((_, i) => row[i] ?? '')
  const duplicate = table.rows.some(
    (existing) => existing[0] === normalized[0] && normalized[0] !== '',
  )
  if (duplicate) return table
  return {
    columns: table.columns,
    rows: [...table.rows, normalized],
  }
}

export function fillPhonesInSpecialistsTable(
  table: NotebookTable,
  onlyNames?: Set<string> | string[],
): NotebookTable {
  const allowed =
    onlyNames == null
      ? null
      : onlyNames instanceof Set
        ? onlyNames
        : new Set(onlyNames)

  return {
    columns: table.columns,
    rows: table.rows.map((row) => {
      const name = row[0] ?? ''
      if (allowed && !allowed.has(name)) return row
      const phone = GTG_SPECIALIST_PHONES[name]
      if (!phone) return row
      const next = [...row]
      while (next.length < table.columns.length) next.push('')
      next[2] = phone
      return next
    }),
  }
}

export function specialistsTableHasAllPhones(notebook: NotebookEntry[]): boolean {
  const entry = notebook.find((n) => n.id === GTG_SPECIALISTS_TABLE_ID)
  if (!entry?.table) return false
  const names = Object.keys(GTG_SPECIALIST_PHONES)
  return names.every((name) => {
    const row = entry.table!.rows.find((r) => r[0] === name)
    return !!(row?.[2] && row[2].trim())
  })
}
