import { useRef } from 'react'
import Plus from 'reicon-react/icons/Plus'
import X from 'reicon-react/icons/X'
import { EditableTableCell } from './EditableTableCell'

export interface TableColumn<T> {
  key: keyof T
  header: string
  width?: string
  align?: 'center'
  mono?: boolean
  bold?: boolean
  placeholder?: string
  colorClass?: (value: string) => string | undefined
}

interface Props<T> {
  rows: T[]
  onChange: (rows: T[]) => void
  columns: TableColumn<T>[]
  newRow: T
  addLabel: string
  // Columna calculada, no editable — igual a `auto:'##'`/`'E-##'` del vanilla.
  autoColumn?: { header: string; render: (index: number) => string }
}

// Motor genérico de tabla — cubre el tipo `tabla` de ESQUEMAS en el vanilla
// (hallazgos, normas, alcances, especificaciones, actividades, equipo,
// criterios, entregables, anexos, coordinacion). Cada tabla se declara una
// vez con sus columnas; agregar/quitar filas y el foco tras agregar son
// genéricos acá en vez de repetirse por capítulo.
export function EditableTable<T extends Record<string, unknown>>({
  rows,
  onChange,
  columns,
  newRow,
  addLabel,
  autoColumn,
}: Props<T>) {
  const tableRef = useRef<HTMLTableElement>(null)

  function updateCell(index: number, key: keyof T, value: string) {
    const next = rows.slice()
    next[index] = { ...next[index], [key]: value }
    onChange(next)
  }

  function addRow() {
    onChange([...rows, { ...newRow }])
    focusLastRowSoon()
  }

  function removeRow(index: number) {
    onChange(rows.filter((_, i) => i !== index))
  }

  function focusLastRowSoon() {
    requestAnimationFrame(() => {
      const cell = tableRef.current?.querySelector<HTMLElement>('tbody tr:last-child .editable')
      if (!cell) return
      cell.focus()
      const range = document.createRange()
      const sel = window.getSelection()
      range.selectNodeContents(cell)
      range.collapse(false)
      sel?.removeAllRanges()
      sel?.addRange(range)
    })
  }

  return (
    <>
      <table className="tbl" ref={tableRef}>
        <thead>
          <tr>
            {autoColumn && <th style={{ width: '8%' }}>{autoColumn.header}</th>}
            {columns.map((col) => (
              <th key={String(col.key)} className={col.align === 'center' ? 'c' : ''} style={{ width: col.width }}>
                {col.header}
              </th>
            ))}
            <th className="act no-print" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {autoColumn && <td className="c n">{autoColumn.render(i)}</td>}
              {columns.map((col) => {
                const value = String(row[col.key] ?? '')
                const extra = col.colorClass?.(value)
                const cls = [col.align === 'center' ? 'c' : '', col.mono ? 'n' : '', col.bold ? 'k' : '', extra ?? '']
                  .filter(Boolean)
                  .join(' ')
                return (
                  <EditableTableCell
                    key={String(col.key)}
                    className={cls}
                    value={value}
                    placeholder={col.placeholder}
                    onChange={(v) => updateCell(i, col.key, v)}
                  />
                )
              })}
              <td className="act no-print">
                <button type="button" className="delrow" title="Eliminar esta fila" onClick={() => removeRow(i)}>
                  <X size={11} strokeWidth={2.4} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className="addrow no-print" onClick={addRow}>
        <Plus size={13} strokeWidth={2} className="ic" />
        {addLabel}
      </button>
    </>
  )
}
