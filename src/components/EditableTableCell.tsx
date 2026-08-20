import { useEffect, useRef } from 'react'
import type { ClipboardEvent, KeyboardEvent } from 'react'

interface Props {
  value: string
  onChange: (text: string) => void
  placeholder?: string
  className?: string
}

// Como EditableCell, pero el `<td>` mismo es el elemento contenteditable — sin un
// `<div>` interno. Igual que el vanilla (`<td class="ed" contenteditable>`): con el
// div de por medio, cada fila de tabla queda ~1px más alta (el reset de Tailwind
// hereda por bloque anidado), suficiente para desbordar el capítulo 05 a una
// segunda hoja en un documento que ya vive muy justo en una página carta.
export function EditableTableCell({ value, onChange, placeholder, className }: Props) {
  const ref = useRef<HTMLTableCellElement>(null)

  useEffect(() => {
    const el = ref.current
    if (el && el.textContent !== value) el.textContent = value
  }, [value])

  function onPaste(e: ClipboardEvent<HTMLTableCellElement>) {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain').replace(/\s*\n\s*/g, ' ')
    document.execCommand('insertText', false, text)
  }

  function onKeyDown(e: KeyboardEvent<HTMLTableCellElement>) {
    if (e.key === 'Enter') e.preventDefault()
  }

  return (
    <td
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-ph={placeholder}
      className={`editable ${className ?? ''}`}
      onPaste={onPaste}
      onKeyDown={onKeyDown}
      onBlur={() => onChange(ref.current?.textContent ?? '')}
    />
  )
}
