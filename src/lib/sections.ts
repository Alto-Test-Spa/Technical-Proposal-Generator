import type { ChapterId } from '../types'
import type { IconName } from './icons'

export interface ChapterMeta {
  id: ChapterId
  title: string
  icon: IconName
}

// Los capítulos del documento, en orden. El índice y los encabezados se
// generan desde acá — agregar un capítulo es agregar una línea a esta lista
// (y su componente en chapters/). Mismo listado que SECCIONES en el vanilla;
// la descripción de cada uno vive en `fields.toc.desc` porque es editable.
export const SECTIONS: ChapterMeta[] = [
  { id: 's1', title: 'Antecedentes y objetivo', icon: 'search' },
  { id: 's2', title: 'Marco normativo', icon: 'book-open' },
  { id: 's3', title: 'Alcances', icon: 'list-checks' },
  { id: 's4', title: 'Metodología', icon: 'git-branch' },
  { id: 's5', title: 'Programa de trabajo', icon: 'calendar-days' },
  { id: 's6', title: 'Criterios de aceptación', icon: 'badge-check' },
  { id: 's7', title: 'Entregables', icon: 'files' },
  { id: 's8', title: 'Condiciones y alcance', icon: 'handshake' },
  { id: 's9', title: 'Siguiente paso', icon: 'arrow-right-circle' },
]

export interface SubsectionMeta {
  slug: string
  title: string
  icon: IconName
  badge?: { text: string; tone: 'signal' | 'steel' | 'muted' }
}

// Subtítulos excluibles por capítulo — igual que los `h4.sub[data-sub]` del
// vanilla. El título y el ícono son fijos (no editables en el original
// tampoco: no llevaban `data-k`), sólo el número se calcula. s6 no tiene
// subtítulos — su tabla de criterios va directo bajo el capítulo.
export const SUBSECTIONS: Record<ChapterId, SubsectionMeta[]> = {
  s1: [
    { slug: 'hallazgos', title: 'Hallazgos del levantamiento · matriz de criticidad', icon: 'alert-triangle' },
    { slug: 'justif', title: 'Por qué le proponemos esto', icon: 'lightbulb' },
  ],
  s2: [
    { slug: 'normativa', title: 'Normativa aplicable', icon: 'book-open' },
    { slug: 'exigencias', title: 'Qué exige cada norma', icon: 'table-2' },
  ],
  s3: [
    { slug: 'partidas', title: 'Partidas del servicio', icon: 'list-checks' },
    { slug: 'especificaciones', title: 'Características técnicas del sistema', icon: 'settings-2' },
  ],
  s4: [{ slug: 'actividades', title: 'Actividades por etapa', icon: 'workflow' }],
  s5: [
    { slug: 'hitos', title: 'Hitos de coordinación con usted', icon: 'calendar-clock' },
    { slug: 'equipo', title: 'Quiénes lo atienden', icon: 'users' },
  ],
  s6: [],
  s7: [
    { slug: 'entregables', title: 'Documentación del servicio', icon: 'files' },
    { slug: 'anexos', title: 'Anexos de esta propuesta', icon: 'paperclip' },
  ],
  s8: [
    {
      slug: 'ejecucion',
      title: 'Cómo ejecutamos el servicio',
      icon: 'settings-2',
      badge: { text: 'Lo aporta Alto Test', tone: 'signal' },
    },
    {
      slug: 'cliente',
      title: 'Lo que necesitamos de usted',
      icon: 'user-check',
      badge: { text: 'Lo aporta el cliente', tone: 'steel' },
    },
    {
      slug: 'exclusiones',
      title: 'Fuera de este alcance',
      icon: 'circle-slash',
      badge: { text: 'No incluido', tone: 'muted' },
    },
  ],
  s9: [
    { slug: 'aceptacion', title: 'Cómo aceptar esta propuesta', icon: 'check-circle-2' },
    { slug: 'despues', title: 'Después de la entrega', icon: 'repeat' },
  ],
}

export interface KpiMeta {
  icon: IconName
  label: string
  sectionId?: ChapterId
  subId?: string
  // Cuenta los elementos de esta lista del estado — ver TecnicaState.
  countOf?:
    | 'scopes'
    | 'deliverables'
    | 'criteria'
  // Si es true, el valor es el plazo referencial (gantt.periods + gantt.unit).
  term?: true
}

// Cifras del índice — igual a KPIS en el vanilla. `sectionId`/`subId` atan
// la cifra a un capítulo/subtítulo: si se deja fuera, la cifra desaparece
// del índice en vez de contar algo que ya no se muestra.
export const KPIS: KpiMeta[] = [
  { icon: 'list-checks', countOf: 'scopes', sectionId: 's3', subId: 's3.partidas', label: 'Partidas comprometidas' },
  { icon: 'files', countOf: 'deliverables', sectionId: 's7', subId: 's7.entregables', label: 'Entregables documentales' },
  { icon: 'badge-check', countOf: 'criteria', sectionId: 's6', label: 'Criterios verificados con usted' },
  { icon: 'calendar-days', term: true, sectionId: 's5', label: 'Plazo referencial de ejecución' },
]
