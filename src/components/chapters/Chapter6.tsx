import type { TecnicaState } from '../../types'
import { chapterNumber, pad2 } from '../../lib/chapters'
import { ChapterSection } from '../ChapterSection'
import { EditableCell } from '../EditableCell'
import { RichText } from '../RichText'
import { EditableTable } from '../EditableTable'

interface Props {
  doc: TecnicaState
  setDoc: (updater: (d: TecnicaState) => TecnicaState) => void
}

// Único capítulo sin subtítulos: la tabla va directo bajo el título, y el
// cierre en el bloque oscuro es contenido fijo del capítulo (no hay bloque
// que excluir aparte del capítulo completo).
export function Chapter6({ doc, setDoc }: Props) {
  const number = chapterNumber('s6', doc.excluded)
  const f = doc.fields.s6

  function setField<K extends keyof typeof f>(key: K, value: string) {
    setDoc((d) => ({ ...d, fields: { ...d.fields, s6: { ...d.fields.s6, [key]: value } } }))
  }

  return (
    <ChapterSection id="s6" number={number} code={doc.code}>
      <EditableCell className="big" value={f.title} placeholder="Título" onChange={(v) => setField('title', v)} />
      <EditableCell className="dek" value={f.dek} placeholder="Subtítulo breve" onChange={(v) => setField('dek', v)} />

      <EditableTable
        rows={doc.criteria}
        onChange={(criteria) => setDoc((d) => ({ ...d, criteria }))}
        newRow={{ criterion: '', method: '', evidence: '' }}
        addLabel="Agregar criterio"
        autoColumn={{ header: 'N°', render: (i) => pad2(i + 1) }}
        columns={[
          { key: 'criterion', header: 'Criterio', width: '31%', bold: true, placeholder: 'Criterio' },
          { key: 'method', header: 'Cómo se verifica', width: '36%', placeholder: 'Cómo se verifica' },
          { key: 'evidence', header: 'Evidencia', width: '26%', placeholder: 'Evidencia' },
        ]}
      />

      <div className="darkbox chapter-closing">
        <p className="eyebrow">Nuestro compromiso</p>
        <RichText className="lead" value={f.closing} placeholder="Compromiso de cierre" onChange={(v) => setField('closing', v)} />
      </div>
    </ChapterSection>
  )
}
