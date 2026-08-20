import { SECTIONS, SUBSECTIONS } from '../lib/sections'
import { chapterNumber, subsectionNumbers, pad2 } from '../lib/chapters'

interface Props {
  excluded: string[]
  onToggle: (id: string, include: boolean) => void
}

// Panel "Capítulos": desmarcar un capítulo lo deja fuera, desmarcar un
// subtítulo saca sólo ese bloque — todo se renumera solo. Igual a
// Vista.panelSecciones() del vanilla.
export function ChaptersPanel({ excluded, onToggle }: Props) {
  return (
    <div className="secs">
      {SECTIONS.map((sec) => {
        const n = chapterNumber(sec.id, excluded)
        const subs = SUBSECTIONS[sec.id]
        const subNumbers = subs.length ? subsectionNumbers(sec.id, excluded) : {}
        return (
          <div className={`secgrp ${n === null ? 'off' : ''}`} key={sec.id}>
            <label className={`secitem ${n === null ? 'off' : ''}`}>
              <input
                type="checkbox"
                checked={n !== null}
                onChange={(e) => onToggle(sec.id, e.target.checked)}
              />
              <span className="sn">{n === null ? '—' : pad2(n)}</span>
              {sec.title}
            </label>
            {subs.length > 0 && (
              <div className="subs">
                {subs.map((sub) => {
                  const id = `${sec.id}.${sub.slug}`
                  const num = subNumbers[sub.slug]
                  return (
                    <label className={`secitem hijo ${num === null ? 'off' : ''}`} key={id}>
                      <input type="checkbox" checked={num !== null} onChange={(e) => onToggle(id, e.target.checked)} />
                      <span className="sn">{num === null ? '—' : num}</span>
                      {sub.title}
                    </label>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
