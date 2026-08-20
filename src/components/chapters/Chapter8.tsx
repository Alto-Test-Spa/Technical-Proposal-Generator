import type { TecnicaState } from '../../types'
import { chapterNumber, subsectionNumbers } from '../../lib/chapters'
import { ChapterSection } from '../ChapterSection'
import { Subtitle } from '../Subtitle'
import { EditableCell } from '../EditableCell'
import { RichText } from '../RichText'
import { EditableBulletList } from '../EditableBulletList'

interface Props {
  doc: TecnicaState
  setDoc: (updater: (d: TecnicaState) => TecnicaState) => void
}

export function Chapter8({ doc, setDoc }: Props) {
  const number = chapterNumber('s8', doc.excluded)
  const subs = subsectionNumbers('s8', doc.excluded)
  const f = doc.fields.s8

  function setField<K extends keyof typeof f>(key: K, value: string) {
    setDoc((d) => ({ ...d, fields: { ...d.fields, s8: { ...d.fields.s8, [key]: value } } }))
  }

  return (
    <ChapterSection id="s8" number={number} code={doc.code}>
      <EditableCell className="big" value={f.title} placeholder="Título" onChange={(v) => setField('title', v)} />
      <EditableCell className="dek" value={f.dek} placeholder="Subtítulo breve" onChange={(v) => setField('dek', v)} />

      <Subtitle chapterId="s8" slug="ejecucion" number={subs.ejecucion}>
        <EditableBulletList
          items={doc.conditions}
          onChange={(conditions) => setDoc((d) => ({ ...d, conditions }))}
          icon="check"
          addLabel="Agregar condición"
        />
      </Subtitle>

      <Subtitle chapterId="s8" slug="cliente" number={subs.cliente}>
        <EditableBulletList
          items={doc.clientResponsibilities}
          onChange={(clientResponsibilities) => setDoc((d) => ({ ...d, clientResponsibilities }))}
          icon="arrow-right"
          variant="pide"
          addLabel="Agregar punto"
        />
      </Subtitle>

      <Subtitle chapterId="s8" slug="exclusiones" number={subs.exclusiones}>
        <RichText
          className="lead"
          value={f.exclusionIntro}
          placeholder="Encabezado de exclusiones"
          onChange={(v) => setField('exclusionIntro', v)}
        />
        <EditableBulletList
          items={doc.exclusions}
          onChange={(exclusions) => setDoc((d) => ({ ...d, exclusions }))}
          icon="minus"
          variant="neg"
          addLabel="Agregar exclusión"
        />
      </Subtitle>
    </ChapterSection>
  )
}
