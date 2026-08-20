import type { TecnicaState } from '../../types'
import { chapterNumber, subsectionNumbers } from '../../lib/chapters'
import { criticidadClass } from '../../lib/colors'
import { ChapterSection } from '../ChapterSection'
import { Subtitle } from '../Subtitle'
import { EditableCell } from '../EditableCell'
import { RichText } from '../RichText'
import { EditableTable } from '../EditableTable'
import { Icon } from '../Icon'

interface Props {
  doc: TecnicaState
  setDoc: (updater: (d: TecnicaState) => TecnicaState) => void
}

export function Chapter1({ doc, setDoc }: Props) {
  const number = chapterNumber('s1', doc.excluded)
  const subs = subsectionNumbers('s1', doc.excluded)
  const f = doc.fields.s1

  function setField<K extends keyof typeof f>(key: K, value: string) {
    setDoc((d) => ({ ...d, fields: { ...d.fields, s1: { ...d.fields.s1, [key]: value } } }))
  }

  return (
    <ChapterSection id="s1" number={number} code={doc.code}>
      <EditableCell className="big" value={f.title} placeholder="Título" onChange={(v) => setField('title', v)} />
      <EditableCell className="dek" value={f.dek} placeholder="Subtítulo breve" onChange={(v) => setField('dek', v)} />

      <div className="darkbox chapter-objective">
        <p className="eyebrow">Objetivo</p>
        <RichText
          className="lead"
          value={f.objective}
          placeholder="Objetivo en una frase"
          onChange={(v) => setField('objective', v)}
        />
      </div>

      <RichText
        className="lead"
        value={f.background}
        placeholder="Párrafo de antecedentes (breve)"
        onChange={(v) => setField('background', v)}
      />

      <Subtitle chapterId="s1" slug="hallazgos" number={subs.hallazgos}>
        <EditableTable
          rows={doc.findings}
          onChange={(findings) => setDoc((d) => ({ ...d, findings }))}
          newRow={{ heading: '', situation: '', severity: 'Importante' }}
          addLabel="Agregar hallazgo"
          columns={[
            { key: 'heading', header: 'Hallazgo', width: '26%', bold: true, placeholder: 'Hallazgo' },
            { key: 'situation', header: 'Situación observada', width: '52%', placeholder: 'Situación observada' },
            {
              key: 'severity',
              header: 'Criticidad',
              width: '22%',
              align: 'center',
              mono: true,
              placeholder: 'Criticidad',
              colorClass: criticidadClass,
            },
          ]}
        />
        <div className="fine">
          <EditableCell
            value={f.criticalNote}
            placeholder="Nota de la matriz"
            onChange={(v) => setField('criticalNote', v)}
          />
        </div>
      </Subtitle>

      <Subtitle chapterId="s1" slug="justif" number={subs.justif}>
        {doc.justifications.map((j, i) => (
          <div className="justif" key={i}>
            <div className="jic">
              <Icon name={j.icon} size={16} strokeWidth={1.8} />
            </div>
            <div className="body">
              <EditableCell
                className="jt"
                value={j.title}
                placeholder="Título del argumento"
                onChange={(v) => {
                  const justifications = doc.justifications.slice()
                  justifications[i] = { ...justifications[i], title: v }
                  setDoc((d) => ({ ...d, justifications }))
                }}
              />
              <RichText
                className="jp"
                value={j.paragraph}
                placeholder="Una frase, no un párrafo"
                blockEnter
                onChange={(v) => {
                  const justifications = doc.justifications.slice()
                  justifications[i] = { ...justifications[i], paragraph: v }
                  setDoc((d) => ({ ...d, justifications }))
                }}
              />
            </div>
          </div>
        ))}
      </Subtitle>
    </ChapterSection>
  )
}
