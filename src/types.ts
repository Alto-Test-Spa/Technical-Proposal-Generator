import type { IconName } from './lib/icons'

export type ChapterId = 's1' | 's2' | 's3' | 's4' | 's5' | 's6' | 's7' | 's8' | 's9'

// ── Campos sueltos de prosa/título, agrupados por capítulo (igual a los data-k
// del vanilla, pero tipados en vez de vivir en un diccionario string→string). ──
export interface Fields {
  cover: {
    eyebrow: string
    docType: string
    title: string // rich (negrita) — el único campo suelto de portada con formato
    client: string
    rut: string
    address: string
    contact: string
    modality: string
    revision: string
  }
  toc: {
    title: string
    dek: string
    desc: Record<ChapterId, string>
  }
  s1: { title: string; dek: string; objective: string; background: string; criticalNote: string }
  s2: { title: string; dek: string; note: string }
  s3: { title: string; dek: string; note: string }
  s4: { title: string; dek: string; cycle: string }
  s5: { title: string; dek: string; note: string }
  s6: { title: string; dek: string; closing: string }
  s7: { title: string; dek: string }
  s8: { title: string; dek: string; exclusionIntro: string }
  s9: {
    title: string
    dek: string
    closing: string
    signName: string
    signRole: string
    acceptName: string
    acceptRole: string
  }
}

export interface Pillar {
  icon: IconName
  title: string
  description: string
}

export interface Finding {
  heading: string
  situation: string
  severity: string // texto libre; el color se calcula por prefijo (crit/import/otro)
}

export interface JustifyCard {
  icon: IconName
  title: string
  paragraph: string // rich, una frase
}

export interface Standard {
  standard: string
  scope: string
  requirement: string
}

export interface Scope {
  description: string
  unit: string
  quantity: string
  reference: string
}

export interface Spec {
  parameter: string
  value: string
}

export interface MethodStage {
  icon: IconName
  title: string
  description: string
}

export interface Activity {
  stage: string
  activity: string
  description: string
  responsible: string
}

export interface GanttRow {
  label: string
  marks: number[]
  milestone: boolean
}

export interface GanttState {
  unit: string
  periods: number
  rows: GanttRow[]
}

export interface TeamRole {
  role: string
  responsibility: string
}

export interface Criterion {
  criterion: string
  method: string
  evidence: string
}

export interface Deliverable {
  deliverable: string
  content: string
  format: string
  deadline: string
}

export interface Annex {
  name: string
  description: string
  status: string
}

export interface Coordination {
  instance: string
  whatIsDefined: string
  when: string
}

export interface Accompaniment {
  icon: IconName
  title: string
  description: string // rich, una línea
}

export interface TecnicaState {
  code: string
  date: string
  validityDays: number

  coverPhoto: string
  coverVeil: number

  fields: Fields

  // ids de capítulos ("s3") o subtítulos ("s8.exclusiones") dejados fuera —
  // mismo esquema que `fuera` en el vanilla.
  excluded: string[]

  pillars: Pillar[]
  findings: Finding[]
  justifications: JustifyCard[]
  chips: string[]
  standards: Standard[]
  scopes: Scope[]
  specs: Spec[]
  methodStages: MethodStage[]
  activities: Activity[]
  gantt: GanttState
  team: TeamRole[]
  criteria: Criterion[]
  deliverables: Deliverable[]
  annexes: Annex[]
  conditions: string[]
  clientResponsibilities: string[]
  exclusions: string[]
  acceptance: string[]
  coordination: Coordination[]
  accompaniment: Accompaniment[]
}
