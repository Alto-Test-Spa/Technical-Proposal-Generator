import type { ReactNode } from 'react'
import type { ChapterId } from '../types'
import { SECTIONS } from '../lib/sections'
import { Icon } from './Icon'
import { pad2 } from '../lib/chapters'

interface Props {
  id: ChapterId
  number: number | null
  code: string
  children: ReactNode
}

// Envoltorio de cada capítulo: si está excluido, no se renderiza — nada de
// clase `.fuera` con display:none, directamente no ocupa una hoja. Genera el
// encabezado (`.sec-head`) y el pie (`.foot`) desde SECTIONS + el número ya
// calculado, igual que Vista.secciones() en el vanilla pero sin tocar el DOM
// a mano.
export function ChapterSection({ id, number, code, children }: Props) {
  if (number === null) return null
  const meta = SECTIONS.find((s) => s.id === id)!
  const n = pad2(number)

  return (
    <section className="page flow" id={id}>
      <div className="sec-head">
        <span className="lbl">
          <Icon name={meta.icon} size={16} />
          {n} · {meta.title}
        </span>
        <a className="idx volver" href="#contenido" title="Volver al contenido">
          Alto Test · {n}
        </a>
      </div>

      {children}

      <div className="foot">
        <span>
          ALTO TEST — PROPUESTA TÉCNICA DE SERVICIO <b className="foot-cod">{code ? `· ${code}` : ''}</b>
        </span>
        <span>{n}</span>
      </div>
    </section>
  )
}
