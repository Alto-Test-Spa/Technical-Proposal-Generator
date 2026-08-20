interface Props {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

// Reemplaza `window.confirm()`: el diálogo nativo del navegador rompe todo el
// lenguaje visual de la app (aparece gris, sin estilo, y oscurece la pantalla
// de golpe) — con este documento tan cuidado en su diseño, se leía como si algo
// se hubiera roto. Mismo criterio de confirmación (dos botones, texto claro),
// pero con la misma piel del resto de la barra.
export function ConfirmDialog({ title, message, confirmLabel = 'Aceptar', cancelLabel = 'Cancelar', onConfirm, onCancel }: Props) {
  return (
    <div className="confirm-backdrop no-print" onClick={onCancel}>
      <div className="confirm-card" onClick={(e) => e.stopPropagation()}>
        <p className="confirm-title">{title}</p>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button type="button" className="tb-btn ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="tb-btn" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
