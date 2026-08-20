import type { ReactNode } from 'react'
import type { ChapterId } from '../types'
import { SUBSECTIONS } from '../lib/sections'
import { Icon } from './Icon'

interface Props {
  chapterId: ChapterId
  slug: string
  number: string | null
  children: ReactNode
}

// Subtítulo excluible: a diferencia del vanilla (que oculta con CSS y necesita
// barrer el DOM hasta el próximo `h4.sub`/`.foot`/`[data-fin-sub]` para saber
// qué le pertenece), acá el subtítulo y su contenido son un solo bloque JSX —
// si está excluido, el bloque completo simplemente no se renderiza. Mismo
// resultado (nada se pierde, sólo deja de mostrarse/imprimirse), mecanismo
// más simple.
export function Subtitle({ chapterId, slug, number, children }: Props) {
  const meta = SUBSECTIONS[chapterId].find((s) => s.slug === slug)
  if (!meta) return null
  if (number === null) return null

  return (
    <>
      <h4 className="sub">
        <Icon name={meta.icon} />
        <span className="nsub">{number} </span>
        {meta.title}
        {meta.badge && <span className={`quien ${badgeClass(meta.badge.tone)}`}>{meta.badge.text}</span>}
      </h4>
      {children}
    </>
  )
}

function badgeClass(tone: 'signal' | 'steel' | 'muted'): string {
  if (tone === 'steel') return 'cliente'
  if (tone === 'muted') return 'fuera'
  return ''
}
