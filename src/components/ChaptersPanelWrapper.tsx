import { ChaptersPanel } from './ChaptersPanel'

interface Props {
  excluded: string[]
  onToggle: (id: string, include: boolean) => void
}

// Envoltorio con el título y la nota de ayuda — igual al #panelSecciones del
// vanilla, separado de ChaptersPanel para que ese quede reutilizable sin el
// copy fijo alrededor.
export function ChaptersPanelWrapper({ excluded, onToggle }: Props) {
  return (
    <div className="ayuda no-print">
      <h5>Capítulos y subtítulos de esta propuesta</h5>
      <ChaptersPanel excluded={excluded} onToggle={onToggle} />
      <p className="chapters-hint">
        Desmarque un <b>capítulo</b> para dejarlo fuera, o un <b>subtítulo</b> para sacar ese bloque con su tabla o
        su lista. Todo lo demás <b>se renumera y se reordena solo</b>, en el documento y en el índice. Nada se
        borra: vuelve a aparecer si lo marca de nuevo.
      </p>
    </div>
  )
}
