import type { TecnicaState } from '../../types'
import { chapterNumber, subsectionNumbers, pad2 } from '../../lib/chapters'
import { ChapterSection } from '../ChapterSection'
import { Subtitle } from '../Subtitle'
import { EditableCell } from '../EditableCell'
import { EditableTable } from '../EditableTable'
import { Icon } from '../Icon'

interface Props {
  doc: TecnicaState
  setDoc: (updater: (d: TecnicaState) => TecnicaState) => void
}

export function Chapter4({ doc, setDoc }: Props) {
  const number = chapterNumber('s4', doc.excluded)
  const subs = subsectionNumbers('s4', doc.excluded)
  const f = doc.fields.s4

  function setField<K extends keyof typeof f>(key: K, value: string) {
    setDoc((d) => ({ ...d, fields: { ...d.fields, s4: { ...d.fields.s4, [key]: value } } }))
  }

  return (
    <ChapterSection id="s4" number={number} code={doc.code}>
      <EditableCell className="big" value={f.title} placeholder="Título" onChange={(v) => setField('title', v)} />
      <EditableCell className="dek" value={f.dek} placeholder="Subtítulo breve" onChange={(v) => setField('dek', v)} />

      <div className="method">
        {doc.methodStages.map((stage, i) => (
          <div className="st" key={i}>
            <div className="sh">
              <span className="n">{pad2(i + 1)}</span>
              <Icon name={stage.icon} size={15} strokeWidth={1.8} />
            </div>
            <EditableCell
              className="t"
              value={stage.title}
              placeholder="Etapa"
              onChange={(v) => {
                const methodStages = doc.methodStages.slice()
                methodStages[i] = { ...methodStages[i], title: v }
                setDoc((d) => ({ ...d, methodStages }))
              }}
            />
            <EditableCell
              className="d"
              value={stage.description}
              placeholder="Descripción"
              onChange={(v) => {
                const methodStages = doc.methodStages.slice()
                methodStages[i] = { ...methodStages[i], description: v }
                setDoc((d) => ({ ...d, methodStages }))
              }}
            />
          </div>
        ))}
      </div>
      <div className="ciclo">
        <Icon name="repeat" size={13} />
        <EditableCell value={f.cycle} placeholder="Nota del ciclo" onChange={(v) => setField('cycle', v)} />
      </div>

      <Subtitle chapterId="s4" slug="actividades" number={subs.actividades}>
        <EditableTable
          rows={doc.activities}
          onChange={(activities) => setDoc((d) => ({ ...d, activities }))}
          newRow={{ stage: '', activity: '', description: '', responsible: '' }}
          addLabel="Agregar actividad"
          columns={[
            { key: 'stage', header: 'Etapa', width: '8%', align: 'center', mono: true, placeholder: '00' },
            { key: 'activity', header: 'Actividad', width: '26%', bold: true, placeholder: 'Actividad' },
            { key: 'description', header: 'Descripción', width: '44%', placeholder: 'Descripción' },
            { key: 'responsible', header: 'Responsable', width: '22%', placeholder: 'Responsable' },
          ]}
        />
      </Subtitle>
    </ChapterSection>
  )
}
