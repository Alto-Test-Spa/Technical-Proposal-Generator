import Plus from 'reicon-react/icons/Plus'
import type { TecnicaState } from '../../types'
import { chapterNumber, subsectionNumbers } from '../../lib/chapters'
import { ChapterSection } from '../ChapterSection'
import { Subtitle } from '../Subtitle'
import { EditableCell } from '../EditableCell'
import { EditableTable } from '../EditableTable'

interface Props {
  doc: TecnicaState
  setDoc: (updater: (d: TecnicaState) => TecnicaState) => void
}

export function Chapter2({ doc, setDoc }: Props) {
  const number = chapterNumber('s2', doc.excluded)
  const subs = subsectionNumbers('s2', doc.excluded)
  const f = doc.fields.s2

  function setField<K extends keyof typeof f>(key: K, value: string) {
    setDoc((d) => ({ ...d, fields: { ...d.fields, s2: { ...d.fields.s2, [key]: value } } }))
  }

  function updateChip(i: number, value: string) {
    const chips = doc.chips.slice()
    chips[i] = value
    setDoc((d) => ({ ...d, chips }))
  }

  function addChip() {
    setDoc((d) => ({ ...d, chips: [...d.chips, ''] }))
  }

  function removeChip(i: number) {
    setDoc((d) => ({ ...d, chips: d.chips.filter((_, idx) => idx !== i) }))
  }

  return (
    <ChapterSection id="s2" number={number} code={doc.code}>
      <EditableCell className="big" value={f.title} placeholder="Título" onChange={(v) => setField('title', v)} />
      <EditableCell className="dek" value={f.dek} placeholder="Subtítulo breve" onChange={(v) => setField('dek', v)} />

      <Subtitle chapterId="s2" slug="normativa" number={subs.normativa}>
        <div className="chips">
          {doc.chips.map((chip, i) => (
            <span className="chip" key={i}>
              <EditableCell value={chip} placeholder="Norma" onChange={(v) => updateChip(i, v)} />
              <span className="x no-print" title="Quitar" onClick={() => removeChip(i)}>
                ×
              </span>
            </span>
          ))}
          <span className="chip add no-print" onClick={addChip}>
            <Plus size={12} strokeWidth={2} className="ic" /> norma
          </span>
        </div>
      </Subtitle>

      <Subtitle chapterId="s2" slug="exigencias" number={subs.exigencias}>
        <EditableTable
          rows={doc.standards}
          onChange={(standards) => setDoc((d) => ({ ...d, standards }))}
          newRow={{ standard: '', scope: '', requirement: '' }}
          addLabel="Agregar norma"
          columns={[
            { key: 'standard', header: 'Norma', width: '20%', bold: true, placeholder: 'Norma' },
            { key: 'scope', header: 'Alcance', width: '38%', placeholder: 'Alcance' },
            { key: 'requirement', header: 'Requisito clave aplicable', width: '42%', placeholder: 'Requisito clave' },
          ]}
        />
        <div className="fine">
          <EditableCell value={f.note} placeholder="Nota al pie" onChange={(v) => setField('note', v)} />
        </div>
      </Subtitle>
    </ChapterSection>
  )
}
