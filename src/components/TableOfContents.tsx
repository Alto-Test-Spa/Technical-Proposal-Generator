import type { TecnicaState } from '../types'
import { KPIS } from '../lib/sections'
import { visibleSections, isIncluded, termLabel, pad2 } from '../lib/chapters'
import { Icon } from './Icon'
import { EditableCell } from './EditableCell'

interface Props {
  doc: TecnicaState
  setDoc: (updater: (d: TecnicaState) => TecnicaState) => void
}

// Índice: capítulos visibles + KPIs calculados del contenido. Igual a
// Vista.indice() del vanilla, sin el paso intermedio de volcar HTML — el
// filtro de KPIS y el conteo de listas son los mismos.
export function TableOfContents({ doc, setDoc }: Props) {
  const visible = visibleSections(doc.excluded)
  const kpis = KPIS.filter(
    (k) =>
      (!k.sectionId || isIncluded(k.sectionId, doc.excluded)) && (!k.subId || isIncluded(k.subId, doc.excluded)),
  )

  return (
    <section className="page flow" id="contenido">
      <div className="sec-head">
        <span className="lbl">
          <Icon name="list" size={16} />
          Contenido
        </span>
        <span className="idx">Alto Test</span>
      </div>

      <EditableCell
        className="big"
        value={doc.fields.toc.title}
        placeholder="Título del índice"
        onChange={(v) => setDoc((d) => ({ ...d, fields: { ...d.fields, toc: { ...d.fields.toc, title: v } } }))}
      />
      <EditableCell
        className="dek"
        value={doc.fields.toc.dek}
        placeholder="Bajada del índice"
        onChange={(v) => setDoc((d) => ({ ...d, fields: { ...d.fields, toc: { ...d.fields.toc, dek: v } } }))}
      />

      <div className="kpis">
        {kpis.map((k, i) => {
          const value = k.term ? termLabel(doc.gantt) : k.countOf ? doc[k.countOf].length : 0
          return (
            <div className="kpi" key={i}>
              <div className="kt">
                <Icon name={k.icon} />
                <span className="auto-tag no-print">
                  <Icon name="sparkles" size={10} strokeWidth={2.4} />
                  calculado
                </span>
              </div>
              <div className="kv">{value}</div>
              <div className="kl">{k.label}</div>
            </div>
          )
        })}
      </div>
      <p className="fine no-print" style={{ marginBottom: 22 }}>
        Estas cifras se actualizan solas a medida que edita el contenido de la propuesta.
      </p>

      <ol className="toc">
        {visible.map((sec, idx) => (
          <li key={sec.id}>
            <a className="tlink tsalto" href={`#${sec.id}`} title="Ir al capítulo">
              <span className="tn">{pad2(idx + 1)}</span>
              <span className="ti">
                <Icon name={sec.icon} size={16} strokeWidth={1.8} />
              </span>
            </a>
            <div className="tw">
              <a className="tlink tt" href={`#${sec.id}`} title="Ir al capítulo">
                {sec.title}
                <Icon name="arrow-right" className="chev" size={13} strokeWidth={2} />
              </a>
              <EditableCell
                className="td"
                value={doc.fields.toc.desc[sec.id]}
                placeholder="Descripción del capítulo"
                onChange={(v) =>
                  setDoc((d) => ({
                    ...d,
                    fields: { ...d.fields, toc: { ...d.fields.toc, desc: { ...d.fields.toc.desc, [sec.id]: v } } },
                  }))
                }
              />
            </div>
          </li>
        ))}
      </ol>

      <div className="foot">
        <span>ALTO TEST — PROPUESTA TÉCNICA DE SERVICIO</span>
        <span>Contenido</span>
      </div>
    </section>
  )
}
