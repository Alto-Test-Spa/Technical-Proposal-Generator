import { useRef } from 'react'
import Plus from 'reicon-react/icons/Plus'
import type { IconName } from '../lib/icons'
import { Icon } from './Icon'
import { RichText } from './RichText'

interface Props {
  items: string[]
  onChange: (items: string[]) => void
  icon: IconName
  variant?: 'pide' | 'neg'
  addLabel: string
}

// Motor de viñetas — cubre el tipo `vinetas` de ESQUEMAS (condiciones,
// responsabilidades, exclusiones, aceptación). Cada punto admite negrita pero
// no párrafos; Enter abre el punto siguiente y enfoca ahí, igual que
// Listas.insertarDespues() en el vanilla.
export function EditableBulletList({ items, onChange, icon, variant, addLabel }: Props) {
  const listRef = useRef<HTMLUListElement>(null)

  function update(index: number, value: string) {
    const next = items.slice()
    next[index] = value
    onChange(next)
  }

  function insertAfter(index: number) {
    const next = items.slice()
    next.splice(index + 1, 0, '')
    onChange(next)
    focusIndexSoon(index + 1)
  }

  function add() {
    onChange([...items, ''])
    focusIndexSoon(items.length)
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index))
  }

  function focusIndexSoon(index: number) {
    requestAnimationFrame(() => {
      const cell = listRef.current?.querySelectorAll<HTMLElement>('.rich')[index]
      if (!cell) return
      cell.focus()
      const range = document.createRange()
      const sel = window.getSelection()
      range.selectNodeContents(cell)
      range.collapse(false)
      sel?.removeAllRanges()
      sel?.addRange(range)
    })
  }

  return (
    <>
      <ul className={`blist ${variant ?? ''}`} ref={listRef}>
        {items.map((text, i) => (
          <li key={i}>
            <span className="bul">
              <Icon name={icon} size={13} strokeWidth={2.2} />
            </span>
            <RichText
              value={text}
              onChange={(v) => update(i, v)}
              placeholder="Escriba el punto"
              className="txt"
              onEnter={() => insertAfter(i)}
            />
            <button type="button" className="delrow no-print" title="Eliminar" onClick={() => remove(i)}>
              ×
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="addrow no-print" onClick={add}>
        <Plus size={13} strokeWidth={2} className="ic" />
        {addLabel}
      </button>
    </>
  )
}
