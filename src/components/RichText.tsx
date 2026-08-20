import { useEffect, useRef } from 'react'
import type { ClipboardEvent, KeyboardEvent } from 'react'
import { sanitizeRichHtml } from '../lib/richtext'

interface Props {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
  // Prosa suelta (los 5 campos .lead): Enter abre un párrafo nuevo (comportamiento
  // nativo del contentEditable). Campos rich DENTRO de una lista (viñeta, tarjeta,
  // acompañamiento) no llevan párrafos — Enter no hace nada salvo que se pase
  // `onEnter` (viñetas: inserta el punto siguiente). Shift+Enter nunca se
  // intercepta, en ningún caso — dobla el mismo criterio del vanilla.
  blockEnter?: boolean
  onEnter?: () => void
}

export function RichText({ value, onChange, placeholder, className, onEnter, blockEnter }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (el && el.innerHTML !== value) el.innerHTML = value
  }, [value])

  function onPaste(e: ClipboardEvent<HTMLDivElement>) {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    if (blockEnter || onEnter) {
      document.execCommand('insertText', false, text.replace(/\s*\n\s*/g, ' '))
      return
    }
    const parts = text
      .split(/\n+/)
      .map((t) => t.trim())
      .filter(Boolean)
    if (!parts.length) return
    const [first, ...rest] = parts
    document.execCommand(
      'insertHTML',
      false,
      escapeHtml(first) + rest.map((p) => `<div>${escapeHtml(p)}</div>`).join(''),
    )
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Enter' || e.shiftKey) return
    if (onEnter) {
      e.preventDefault()
      onEnter()
    } else if (blockEnter) {
      e.preventDefault()
    }
  }

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-ph={placeholder}
      className={`editable rich ${className ?? ''}`}
      onPaste={onPaste}
      onKeyDown={onKeyDown}
      onBlur={() => onChange(sanitizeRichHtml(ref.current?.innerHTML ?? ''))}
    />
  )
}


function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
