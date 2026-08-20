import type { TecnicaState } from '../../types'
import { chapterNumber, subsectionNumbers } from '../../lib/chapters'
import { ChapterSection } from '../ChapterSection'
import { Subtitle } from '../Subtitle'
import { EditableCell } from '../EditableCell'
import { EditableTable } from '../EditableTable'
import { Gantt } from '../Gantt'

interface Props {
  doc: TecnicaState
  setDoc: (updater: (d: TecnicaState) => TecnicaState) => void
}

export function Chapter5({ doc, setDoc }: Props) {
  const number = chapterNumber('s5', doc.excluded)
  const subs = subsectionNumbers('s5', doc.excluded)
  const f = doc.fields.s5

  function setField<K extends keyof typeof f>(key: K, value: string) {
    setDoc((d) => ({ ...d, fields: { ...d.fields, s5: { ...d.fields.s5, [key]: value } } }))
  }

  return (
    <ChapterSection id="s5" number={number} code={doc.code}>
      <EditableCell className="big" value={f.title} placeholder="Título" onChange={(v) => setField('title', v)} />
      <EditableCell className="dek" value={f.dek} placeholder="Subtítulo breve" onChange={(v) => setField('dek', v)} />

      <Gantt gantt={doc.gantt} onChange={(gantt) => setDoc((d) => ({ ...d, gantt }))} />
      <div className="fine">
        <EditableCell value={f.note} placeholder="Nota sobre los plazos" onChange={(v) => setField('note', v)} />
      </div>

      <Subtitle chapterId="s5" slug="hitos" number={subs.hitos}>
        <EditableTable
          rows={doc.coordination}
          onChange={(coordination) => setDoc((d) => ({ ...d, coordination }))}
          newRow={{ instance: '', whatIsDefined: '', when: '' }}
          addLabel="Agregar instancia"
          columns={[
            { key: 'instance', header: 'Instancia', width: '28%', bold: true, placeholder: 'Instancia' },
            { key: 'whatIsDefined', header: 'Qué se define', width: '44%', placeholder: 'Qué se define' },
            { key: 'when', header: 'Cuándo', width: '28%', placeholder: 'Cuándo' },
          ]}
        />
      </Subtitle>

      <Subtitle chapterId="s5" slug="equipo" number={subs.equipo}>
        <EditableTable
          rows={doc.team}
          onChange={(team) => setDoc((d) => ({ ...d, team }))}
          newRow={{ role: '', responsibility: '' }}
          addLabel="Agregar rol"
          columns={[
            { key: 'role', header: 'Rol', width: '34%', bold: true, placeholder: 'Rol' },
            { key: 'responsibility', header: 'Responsabilidad en el servicio', width: '66%', placeholder: 'Responsabilidad' },
          ]}
        />
      </Subtitle>
    </ChapterSection>
  )
}
