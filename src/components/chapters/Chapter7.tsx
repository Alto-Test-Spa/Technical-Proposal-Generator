import type { TecnicaState } from '../../types'
import { chapterNumber, subsectionNumbers, pad2 } from '../../lib/chapters'
import { ChapterSection } from '../ChapterSection'
import { Subtitle } from '../Subtitle'
import { EditableCell } from '../EditableCell'
import { EditableTable } from '../EditableTable'

interface Props {
  doc: TecnicaState
  setDoc: (updater: (d: TecnicaState) => TecnicaState) => void
}

export function Chapter7({ doc, setDoc }: Props) {
  const number = chapterNumber('s7', doc.excluded)
  const subs = subsectionNumbers('s7', doc.excluded)
  const f = doc.fields.s7

  function setField<K extends keyof typeof f>(key: K, value: string) {
    setDoc((d) => ({ ...d, fields: { ...d.fields, s7: { ...d.fields.s7, [key]: value } } }))
  }

  return (
    <ChapterSection id="s7" number={number} code={doc.code}>
      <EditableCell className="big" value={f.title} placeholder="Título" onChange={(v) => setField('title', v)} />
      <EditableCell className="dek" value={f.dek} placeholder="Subtítulo breve" onChange={(v) => setField('dek', v)} />

      <Subtitle chapterId="s7" slug="entregables" number={subs.entregables}>
        <EditableTable
          rows={doc.deliverables}
          onChange={(deliverables) => setDoc((d) => ({ ...d, deliverables }))}
          newRow={{ deliverable: '', content: '', format: 'PDF', deadline: '' }}
          addLabel="Agregar entregable"
          autoColumn={{ header: 'N°', render: (i) => `E-${pad2(i + 1)}` }}
          columns={[
            { key: 'deliverable', header: 'Entregable', width: '33%', bold: true, placeholder: 'Entregable' },
            { key: 'content', header: 'Contenido', width: '32%', placeholder: 'Contenido' },
            { key: 'format', header: 'Formato', width: '13%', align: 'center', mono: true, placeholder: 'Formato' },
            { key: 'deadline', header: 'Plazo', width: '13%', align: 'center', mono: true, placeholder: 'Plazo' },
          ]}
        />
      </Subtitle>

      <Subtitle chapterId="s7" slug="anexos" number={subs.anexos}>
        <EditableTable
          rows={doc.annexes}
          onChange={(annexes) => setDoc((d) => ({ ...d, annexes }))}
          newRow={{ name: '', description: '', status: 'Por adjuntar' }}
          addLabel="Agregar anexo"
          columns={[
            { key: 'name', header: 'Anexo', width: '18%', mono: true, placeholder: 'Anexo N° 0' },
            { key: 'description', header: 'Descripción', width: '58%', placeholder: 'Descripción' },
            { key: 'status', header: 'Estado', width: '24%', placeholder: 'Estado' },
          ]}
        />
      </Subtitle>
    </ChapterSection>
  )
}
