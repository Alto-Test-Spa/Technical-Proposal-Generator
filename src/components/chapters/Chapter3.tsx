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

export function Chapter3({ doc, setDoc }: Props) {
  const number = chapterNumber('s3', doc.excluded)
  const subs = subsectionNumbers('s3', doc.excluded)
  const f = doc.fields.s3

  function setField<K extends keyof typeof f>(key: K, value: string) {
    setDoc((d) => ({ ...d, fields: { ...d.fields, s3: { ...d.fields.s3, [key]: value } } }))
  }

  return (
    <ChapterSection id="s3" number={number} code={doc.code}>
      <EditableCell className="big" value={f.title} placeholder="Título" onChange={(v) => setField('title', v)} />
      <EditableCell className="dek" value={f.dek} placeholder="Subtítulo breve" onChange={(v) => setField('dek', v)} />

      <Subtitle chapterId="s3" slug="partidas" number={subs.partidas}>
        <EditableTable
          rows={doc.scopes}
          onChange={(scopes) => setDoc((d) => ({ ...d, scopes }))}
          newRow={{ description: '', unit: 'Global', quantity: '1', reference: '' }}
          addLabel="Agregar partida"
          autoColumn={{ header: 'Ítem', render: (i) => pad2(i + 1) }}
          columns={[
            { key: 'description', header: 'Descripción de la partida', width: '53%', placeholder: 'Descripción de la partida' },
            { key: 'unit', header: 'Unidad', width: '12%', align: 'center', placeholder: 'Unidad' },
            { key: 'quantity', header: 'Cantidad', width: '12%', align: 'center', placeholder: 'Cantidad' },
            { key: 'reference', header: 'Referencia', width: '16%', mono: true, placeholder: 'Referencia' },
          ]}
        />
        <div className="fine">
          <EditableCell value={f.note} placeholder="Nota sobre las cantidades" onChange={(v) => setField('note', v)} />
        </div>
      </Subtitle>

      <Subtitle chapterId="s3" slug="especificaciones" number={subs.especificaciones}>
        <EditableTable
          rows={doc.specs}
          onChange={(specs) => setDoc((d) => ({ ...d, specs }))}
          newRow={{ parameter: '', value: '' }}
          addLabel="Agregar parámetro"
          columns={[
            { key: 'parameter', header: 'Parámetro', width: '36%', bold: true, placeholder: 'Parámetro' },
            { key: 'value', header: 'Especificación', width: '64%', placeholder: 'Especificación' },
          ]}
        />
      </Subtitle>
    </ChapterSection>
  )
}
