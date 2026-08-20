import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import RefreshIcon from 'reicon-react/icons/Refresh'
import ImageIcon from 'reicon-react/icons/Image'
import X from 'reicon-react/icons/X'
import Edit2 from 'reicon-react/icons/Edit2'
import Layout from 'reicon-react/icons/Layout'
import HelpCircle from 'reicon-react/icons/HelpCircle'
import FilePlus from 'reicon-react/icons/FilePlus'
import Undo from 'reicon-react/icons/Undo'
import Printer from 'reicon-react/icons/Printer'
import type { TecnicaState } from '../types'
import type { SyncState } from '../lib/api'
import { generateCode } from '../lib/code'
import { resizePhoto } from '../lib/photo'
import { Logomark } from './Logomark'
import { HistoryMenu } from './HistoryMenu'
import { SyncStatus } from './SyncStatus'
import { ConfirmDialog } from './ConfirmDialog'

interface Props {
  doc: TecnicaState
  setDoc: (updater: (d: TecnicaState) => TecnicaState) => void
  onNew: () => void
  onUndo: () => void
  canUndo: boolean
  onLoadReport: (doc: TecnicaState) => void
  syncState: SyncState
  showChapters: boolean
  onToggleChapters: () => void
  showHelp: boolean
  onToggleHelp: () => void
  showGuides: boolean
  onToggleGuides: () => void
}

export function Toolbar({
  doc,
  setDoc,
  onNew,
  onUndo,
  canUndo,
  onLoadReport,
  syncState,
  showChapters,
  onToggleChapters,
  showHelp,
  onToggleHelp,
  showGuides,
  onToggleGuides,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [confirmingNew, setConfirmingNew] = useState(false)

  function confirmNew() {
    setConfirmingNew(false)
    onNew()
  }

  function setCode(code: string) {
    setDoc((d) => ({ ...d, code }))
  }

  async function handlePhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const dataUrl = await resizePhoto(file)
      setDoc((d) => ({ ...d, coverPhoto: dataUrl }))
    } catch {
      // se ignora: la portada simplemente se queda sin foto
    }
  }

  return (
    <div className="toolbar no-print">
      <span className="toolbar-brand">
        <Logomark tone="signal" width={26} height={11} />
        ALTO&nbsp;TEST
      </span>

      <div className="tb-group">
        <span className="eyebrow">N°</span>
        <input
          className="tb-input w-code"
          type="text"
          value={doc.code}
          onChange={(e) => setCode(e.target.value)}
          title="Se genera solo; puede editarlo para igualarlo al de la cotización"
        />
        <button
          type="button"
          className="tb-btn ghost mini"
          onClick={() => setCode(generateCode())}
          title="Generar un número nuevo con la fecha y hora actuales"
        >
          <RefreshIcon size={14} strokeWidth={2} className="ic" />
        </button>
      </div>
      <div className="div" />
      <div className="tb-group">
        <span className="eyebrow">Portada</span>
        <button type="button" className="tb-btn ghost" onClick={() => fileRef.current?.click()} title="Poner una fotografía de fondo en la portada">
          <ImageIcon size={14} strokeWidth={2} className="ic" />
          Foto
        </button>
        {doc.coverPhoto && (
          <button
            type="button"
            className="tb-btn ghost mini"
            onClick={() => setDoc((d) => ({ ...d, coverPhoto: '' }))}
            title="Quitar la fotografía"
          >
            <X size={14} strokeWidth={2} className="ic" />
          </button>
        )}
        <input
          type="range"
          min={25}
          max={95}
          value={doc.coverVeil}
          onChange={(e) => setDoc((d) => ({ ...d, coverVeil: Number(e.target.value) }))}
          title="Oscurecer la fotografía para que el texto se lea"
        />
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePhoto} />
      </div>

      <div className="toolbar-spacer" />

      <SyncStatus state={syncState} />

      <button
        type="button"
        className={`tb-btn ghost ${showGuides ? 'on' : ''}`}
        onClick={onToggleGuides}
        title="Mostrar u ocultar el subrayado de los campos editables"
      >
        <Edit2 size={14} strokeWidth={2} className="ic" />
        Guías
      </button>
      <button
        type="button"
        className={`tb-btn ghost ${showChapters ? 'on' : ''}`}
        onClick={onToggleChapters}
        title="Elegir qué capítulos y subtítulos incluye la propuesta"
      >
        <Layout size={14} strokeWidth={2} className="ic" />
        Capítulos
      </button>
      <button
        type="button"
        className={`tb-btn ghost ${showHelp ? 'on' : ''}`}
        onClick={onToggleHelp}
        title="Cómo se usa esta plantilla"
      >
        <HelpCircle size={14} strokeWidth={2} className="ic" />
        Ayuda
      </button>
      <HistoryMenu currentCode={doc.code} onOpen={onLoadReport} />
      <button
        type="button"
        className="tb-btn ghost"
        onClick={() => setConfirmingNew(true)}
        title="Volver al documento original y empezar una propuesta nueva"
      >
        <FilePlus size={14} strokeWidth={2} className="ic" />
        Nueva
      </button>
      {canUndo && (
        <button type="button" className="tb-btn ghost" onClick={onUndo} title="Recuperar la propuesta anterior">
          <Undo size={14} strokeWidth={2} className="ic" />
          Deshacer
        </button>
      )}
      <button type="button" className="tb-btn" onClick={() => window.print()}>
        <Printer size={14} strokeWidth={2} className="ic" />
        Imprimir / PDF
      </button>

      {confirmingNew && (
        <ConfirmDialog
          title="¿Empezar una propuesta nueva?"
          message="El documento vuelve a su contenido original y recibe un número y una fecha nuevos. Se pierde todo lo que escribió en esta propuesta. Si se arrepiente, el botón Deshacer la recupera mientras no escriba nada."
          confirmLabel="Empezar de nuevo"
          onConfirm={confirmNew}
          onCancel={() => setConfirmingNew(false)}
        />
      )}
    </div>
  )
}
