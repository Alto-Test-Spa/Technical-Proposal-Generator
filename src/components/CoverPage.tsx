import type { TecnicaState } from '../types'
import { formatDateInput, validityLabel } from '../lib/date'
import { veilBackground } from '../lib/photo'
import { Icon } from './Icon'
import { EditableCell } from './EditableCell'
import { RichText } from './RichText'
import { DatePicker } from './DatePicker'

interface Props {
  doc: TecnicaState
  setDoc: (updater: (d: TecnicaState) => TecnicaState) => void
}

// Portada — tres capas apiladas (foto → grilla → contenido), ver
// "Cover photo layering invariant" en el CLAUDE.md original: nada de
// selectores universales, cada capa se declara por su propia clase.
export function CoverPage({ doc, setDoc }: Props) {
  const cover = doc.fields.cover
  const hasPhoto = !!doc.coverPhoto

  function setCoverField<K extends keyof typeof cover>(key: K, value: string) {
    setDoc((d) => ({ ...d, fields: { ...d.fields, cover: { ...d.fields.cover, [key]: value } } }))
  }

  return (
    <section className={`page dark cover ${hasPhoto ? 'con-foto' : ''}`}>
      <div className={`cover-photo ${hasPhoto ? '' : 'empty'}`}>
        {hasPhoto && <img src={doc.coverPhoto} alt="" />}
        <div className="veil" style={{ background: veilBackground(doc.coverVeil) }} />
      </div>
      <div className="grid-fine-l cover-grid" />

      <div className="cover-layer cover-top-row">
        <span className="eyebrow cover-eyebrow-l">Alto Test · Protección contra caídas</span>
        <span className="eyebrow cover-eyebrow-l">Documento técnico</span>
      </div>

      <div className="cover-layer cover-main">
        <div className="eyebrow cover-specialty">
          <EditableCell value={cover.eyebrow} placeholder="Especialidad" onChange={(v) => setCoverField('eyebrow', v)} />
        </div>
        <EditableCell
          className="doctype ttt"
          value={cover.docType}
          placeholder="Tipo de documento"
          onChange={(v) => setCoverField('docType', v)}
        />
        <RichText
          className="projname"
          value={cover.title}
          placeholder="Nombre del proyecto o servicio"
          onChange={(v) => setCoverField('title', v)}
          blockEnter
        />

        <div className="datagrid cover-datagrid">
          <div className="dcell">
            <p className="eyebrow">Cliente</p>
            <EditableCell className="val" value={cover.client} placeholder="Nombre / razón social" onChange={(v) => setCoverField('client', v)} />
          </div>
          <div className="dcell">
            <p className="eyebrow">RUT</p>
            <EditableCell className="val" value={cover.rut} placeholder="00.000.000-0" onChange={(v) => setCoverField('rut', v)} />
          </div>
          <div className="dcell" style={{ gridColumn: 'span 2' }}>
            <p className="eyebrow">Instalación / dirección</p>
            <EditableCell
              className="val"
              value={cover.address}
              placeholder="Calle, número, comuna, ciudad"
              onChange={(v) => setCoverField('address', v)}
            />
          </div>
          <div className="dcell">
            <p className="eyebrow">Contacto del cliente</p>
            <EditableCell
              className="val"
              value={cover.contact}
              placeholder="Nombre · cargo · correo"
              onChange={(v) => setCoverField('contact', v)}
            />
          </div>
          <div className="dcell">
            <p className="eyebrow">Modalidad</p>
            <EditableCell
              className="val"
              value={cover.modality}
              placeholder="Servicio / suministro e instalación"
              onChange={(v) => setCoverField('modality', v)}
            />
          </div>
          <div className="dcell">
            <p className="eyebrow">N° de propuesta</p>
            <div className="val mono">{doc.code || '—'}</div>
          </div>
          <div className="dcell">
            <p className="eyebrow">Fecha de emisión</p>
            <DatePicker
              className="val mono"
              value={doc.date}
              placeholder="dd/mm/aaaa"
              onChange={(v) => setDoc((d) => ({ ...d, date: formatDateInput(v) }))}
            />
          </div>
          <div className="dcell">
            <p className="eyebrow">Vigencia</p>
            <div className="validity-input val mono">
              <input
                className="field"
                inputMode="numeric"
                value={doc.validityDays}
                onChange={(e) => setDoc((d) => ({ ...d, validityDays: Number(e.target.value.replace(/\D/g, '')) || 0 }))}
              />
              días
            </div>
            <p className="val-hint">{validityLabel(doc.date, doc.validityDays)}</p>
          </div>
          <div className="dcell">
            <p className="eyebrow">Revisión</p>
            <EditableCell className="val mono" value={cover.revision} placeholder="Rev. 0" onChange={(v) => setCoverField('revision', v)} />
          </div>
        </div>

        <div className="pilares">
          {doc.pillars.map((p, i) => (
            <div className="pilar" key={i}>
              <Icon name={p.icon} className="ic" size={17} strokeWidth={1.7} />
              <EditableCell
                className="pt"
                value={p.title}
                placeholder="Diferenciador"
                onChange={(v) => {
                  const pillars = doc.pillars.slice()
                  pillars[i] = { ...pillars[i], title: v }
                  setDoc((d) => ({ ...d, pillars }))
                }}
              />
              <EditableCell
                className="pd"
                value={p.description}
                placeholder="Una línea"
                onChange={(v) => {
                  const pillars = doc.pillars.slice()
                  pillars[i] = { ...pillars[i], description: v }
                  setDoc((d) => ({ ...d, pillars }))
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="cover-layer">
        <div className="rule-l cover-rule" />
        <div className="cover-brand-row">
          <div>
            <p className="mono ttt cover-brand-name">ALTO TEST</p>
            <svg width="170" height="13" viewBox="0 0 180 14" className="cover-brand-svg">
              <path d="M2,4 Q90,16 178,4" stroke="#C2491F" strokeWidth={2} fill="none" />
              <circle cx={2} cy={4} r={2.6} fill="#C2491F" />
              <circle cx={178} cy={4} r={2.6} fill="#C2491F" />
            </svg>
            <p className="mono cover-brand-tag">La altura, documentada.</p>
          </div>
          <div className="mono cover-brand-info">
            <p>Alto Test SpA · RUT 78.470.129-8</p>
            <p>Santiago · Chile · Cobertura nacional</p>
            <p>contacto@altotest.cl · +56 9 3075 4624</p>
          </div>
        </div>
      </div>
    </section>
  )
}
