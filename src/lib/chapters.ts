import type { ChapterId, GanttState } from '../types'
import { SECTIONS, SUBSECTIONS } from './sections'

export function isIncluded(id: string, excluded: string[]): boolean {
  return !excluded.includes(id)
}

export function toggleExcluded(excluded: string[], id: string, include: boolean): string[] {
  const has = excluded.includes(id)
  if (include && has) return excluded.filter((x) => x !== id)
  if (!include && !has) return [...excluded, id]
  return excluded
}

export function visibleSections(excluded: string[]) {
  return SECTIONS.filter((s) => isIncluded(s.id, excluded))
}

// Número del capítulo contando sólo los incluidos — igual que Capitulos.numero()
// del vanilla, sin el padding a dos dígitos (eso es cosa de presentación).
export function chapterNumber(id: ChapterId, excluded: string[]): number | null {
  if (!isIncluded(id, excluded)) return null
  const idx = visibleSections(excluded).findIndex((s) => s.id === id)
  return idx === -1 ? null : idx + 1
}

// Numeración N.k de los subtítulos de un capítulo: k sólo avanza en los
// incluidos, así que excluir el 3.1 deja al que era 3.2 como 3.1 — mismo
// criterio gapless que Capitulos.subs() del vanilla, pero calculado desde la
// config estática (SUBSECTIONS) en vez de barrer el DOM.
export function subsectionNumbers(chapterId: ChapterId, excluded: string[]): Record<string, string | null> {
  const n = chapterNumber(chapterId, excluded)
  const result: Record<string, string | null> = {}
  let k = 0
  for (const sub of SUBSECTIONS[chapterId]) {
    const id = `${chapterId}.${sub.slug}`
    if (n !== null && isIncluded(id, excluded)) {
      k += 1
      result[sub.slug] = `${n}.${k}`
    } else {
      result[sub.slug] = null
    }
  }
  return result
}

export function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

// Plazo referencial del índice (KPI "calendar-days"): "6 semanas", "1 semana".
export function termLabel(gantt: GanttState): string {
  const n = Number(gantt.periods) || 0
  const unit = String(gantt.unit || '').toLowerCase()
  return `${n} ${n === 1 ? unit : unit + 's'}`
}
