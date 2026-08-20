import type { MouseEvent } from 'react'
import Plus from 'reicon-react/icons/Plus'
import X from 'reicon-react/icons/X'
import Cursor from 'reicon-react/icons/Cursor'
import type { GanttState } from '../types'
import { EditableCell } from './EditableCell'

interface Props {
  gantt: GanttState
  onChange: (gantt: GanttState) => void
}

// Carta Gantt — no es un tipo de ESQUEMAS, es su propio motor en el vanilla
// (Vista.gantt()) y se porta igual acá: períodos con tope 1-16, `--n` como CSS
// var para el ancho de columnas, clic marca/desmarca, Alt+clic marca hito,
// bordes redondeados sólo en el borde de un tramo continuo de columnas marcadas.
export function Gantt({ gantt, onChange }: Props) {
  const n = Math.max(1, Math.min(16, Number(gantt.periods) || 6))
  const style = { '--n': n } as React.CSSProperties

  function setPeriods(raw: string) {
    const digits = raw.replace(/\D/g, '')
    onChange({ ...gantt, periods: digits === '' ? 0 : Number(digits) })
  }

  function setUnit(unit: string) {
    onChange({ ...gantt, unit })
  }

  function setLabel(index: number, label: string) {
    const rows = gantt.rows.slice()
    rows[index] = { ...rows[index], label }
    onChange({ ...gantt, rows })
  }

  function toggleCell(index: number, week: number, e: MouseEvent) {
    const rows = gantt.rows.slice()
    const row = { ...rows[index] }
    const marks = row.marks.includes(week) ? row.marks.filter((w) => w !== week) : [...row.marks, week]
    row.marks = marks
    if (e.altKey) row.milestone = !row.milestone
    rows[index] = row
    onChange({ ...gantt, rows })
  }

  function addRow() {
    onChange({ ...gantt, rows: [...gantt.rows, { label: '', marks: [], milestone: false }] })
  }

  function removeRow(index: number) {
    onChange({ ...gantt, rows: gantt.rows.filter((_, i) => i !== index) })
  }

  return (
    <>
      <div className="tb-group no-print gantt-config">
        <span className="eyebrow">Períodos</span>
        <input
          className="tb-input w-num"
          type="text"
          inputMode="numeric"
          value={gantt.periods}
          onChange={(e) => setPeriods(e.target.value)}
          title="Cuántas columnas tiene la carta Gantt"
        />
        <span className="eyebrow">Unidad</span>
        <input
          className="tb-input w-unit"
          type="text"
          value={gantt.unit}
          onChange={(e) => setUnit(e.target.value)}
          title="Semana, día, mes…"
        />
      </div>

      <div className="gantt">
        <div className="grow ghead" style={style}>
          <div className="glabel">Actividad</div>
          {Array.from({ length: n }, (_, i) => i + 1).map((week) => (
            <div className="gcell" key={week}>
              {gantt.unit} {week}
            </div>
          ))}
          <div className="gcell gact no-print" />
        </div>

        {gantt.rows.map((row, i) => (
          <div className="grow" style={style} key={i}>
            <div className="glabel">
              <EditableCell value={row.label} placeholder="Actividad" onChange={(v) => setLabel(i, v)} />
            </div>
            {Array.from({ length: n }, (_, i2) => i2 + 1).map((week) => {
              const marked = row.marks.includes(week)
              const tramoIni = marked && !row.marks.includes(week - 1)
              const tramoFin = marked && !row.marks.includes(week + 1)
              return (
                <div
                  className="gcell"
                  key={week}
                  title="Clic para marcar · Alt+clic: hito"
                  onClick={(e) => toggleCell(i, week, e)}
                >
                  {marked && (
                    <div
                      className={`bar ${row.milestone ? 'hito' : ''} ${tramoIni ? 'ini' : ''} ${tramoFin ? 'fin' : ''}`}
                    />
                  )}
                </div>
              )
            })}
            <div className="gcell gact no-print">
              <button type="button" className="delrow" title="Eliminar esta fila" onClick={() => removeRow(i)}>
                <X size={11} strokeWidth={2.4} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="addrow no-print" onClick={addRow}>
        <Plus size={13} strokeWidth={2} className="ic" />
        Agregar actividad
      </button>
      <p className="hint no-print">
        <Cursor size={12} strokeWidth={2} className="ic" />
        Clic en una celda para marcar el período · Alt + clic para convertir la fila en hito
      </p>

      <div className="gantt-legend">
        <div className="lg">
          <span className="sw sw-activity" />
          Actividad programada
        </div>
        <div className="lg">
          <span className="sw sw-milestone" />
          Hito de entrega
        </div>
      </div>
    </>
  )
}
