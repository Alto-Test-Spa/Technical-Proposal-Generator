import { useEffect, useRef } from 'react'
import type { ClipboardEvent, KeyboardEvent } from 'react'

interface Props {
  value: string
  onChange: (text: string) => void
  placeholder?: string
  className?: string
}

// Campo de una sola línea, sin negrita ni párrafos — celdas de tabla, títulos de
// tarjeta/etapa/pilar, etiqueta del Gantt, título/dek de capítulo. Equivalente a
// los `.ed` sin `.rich` del vanilla (texto plano, Enter siempre bloqueado).
// Siempre renderiza un `div`: la tipografía de título/dek se aplica por clase
// (`.big`, `.dek`), no por selector de etiqueta, así este componente no
// necesita variar de tag según dónde se use. No controlado en cada tecla: el
// DOM manda mientras se escribe, React sólo sincroniza cuando el valor cambia
// por fuera (ej. "Nueva").
export function EditableCell({ value, onChange, placeholder, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (el && el.textContent !== value) el.textContent = value
  }, [value])

  function onPaste(e: ClipboardEvent<HTMLDivElement>) {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain').replace(/\s*\n\s*/g, ' ')
    document.execCommand('insertText', false, text)
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter') e.preventDefault()
  }

  return (
    <div
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
