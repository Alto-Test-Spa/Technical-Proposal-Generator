import type { TecnicaState } from '../../types'
import { chapterNumber, subsectionNumbers } from '../../lib/chapters'
import { ChapterSection } from '../ChapterSection'
import { Subtitle } from '../Subtitle'
import { EditableCell } from '../EditableCell'
import { RichText } from '../RichText'
import { EditableBulletList } from '../EditableBulletList'
import { Icon } from '../Icon'

interface Props {
  doc: TecnicaState
  setDoc: (updater: (d: TecnicaState) => TecnicaState) => void
}

export function Chapter9({ doc, setDoc }: Props) {
  const number = chapterNumber('s9', doc.excluded)
  const subs = subsectionNumbers('s9', doc.excluded)
  const f = doc.fields.s9

  function setField<K extends keyof typeof f>(key: K, value: string) {
    setDoc((d) => ({ ...d, fields: { ...d.fields, s9: { ...d.fields.s9, [key]: value } } }))
  }

  return (
    <ChapterSection id="s9" number={number} code={doc.code}>
      <EditableCell className="big" value={f.title} placeholder="Título" onChange={(v) => setField('title', v)} />
      <EditableCell className="dek" value={f.dek} placeholder="Subtítulo breve" onChange={(v) => setField('dek', v)} />

      <Subtitle chapterId="s9" slug="aceptacion" number={subs.aceptacion}>
        <EditableBulletList
          items={doc.acceptance}
          onChange={(acceptance) => setDoc((d) => ({ ...d, acceptance }))}
          icon="check"
          addLabel="Agregar punto"
        />
      </Subtitle>

      <Subtitle chapterId="s9" slug="despues" number={subs.despues}>
        <div className="socio">
          {doc.accompaniment.map((item, i) => (
            <div className="sc" key={i}>
              <Icon name={item.icon} size={16} strokeWidth={1.8} />
              <EditableCell
                className="t"
                value={item.title}
                placeholder="Título"
                onChange={(v) => {
                  const accompaniment = doc.accompaniment.slice()
                  accompaniment[i] = { ...accompaniment[i], title: v }
                  setDoc((d) => ({ ...d, accompaniment }))
                }}
              />
              <RichText
                className="d"
                value={item.description}
                placeholder="Una línea"
                blockEnter
                onChange={(v) => {
                  const accompaniment = doc.accompaniment.slice()
                  accompaniment[i] = { ...accompaniment[i], description: v }
                  setDoc((d) => ({ ...d, accompaniment }))
                }}
              />
            </div>
          ))}
        </div>
      </Subtitle>

      {/* Cierre del capítulo — no pertenece al subtítulo "despues", ver Subtitle.tsx:
          acá alcanza con ponerlo fuera del bloque anterior, sin el equivalente a
          data-fin-sub que necesitaba el vanilla para el mismo efecto. */}
      <div className="darkbox chapter-closing">
        <RichText className="lead" value={f.closing} placeholder="Cierre" onChange={(v) => setField('closing', v)} />
      </div>

      <div className="signrow">
        <div className="signbox">
          <EditableCell className="who" value={f.signName} placeholder="Nombre" onChange={(v) => setField('signName', v)} />
          <EditableCell className="role" value={f.signRole} placeholder="Cargo" onChange={(v) => setField('signRole', v)} />
          <div className="role mono sign-contact">camilo.jara@altotest.cl · +56 9 3075 4624</div>
          <div className="rubrica">Por Alto Test SpA</div>
        </div>
        <div className="signbox">
          <EditableCell
            className="who"
            value={f.acceptName}
            placeholder="Nombre del representante"
            onChange={(v) => setField('acceptName', v)}
          />
          <EditableCell
            className="role"
            value={f.acceptRole}
            placeholder="Cargo · RUT"
            onChange={(v) => setField('acceptRole', v)}
          />
          <div className="rubrica">Firma y timbre del cliente</div>
        </div>
      </div>
    </ChapterSection>
  )
}
