import { useEffect, useState } from 'react'
import { useTecnicaStore } from './lib/store'
import { useGuidesPreference } from './lib/useGuides'
import { toggleExcluded } from './lib/chapters'
import { Toolbar } from './components/Toolbar'
import { ChaptersPanelWrapper } from './components/ChaptersPanelWrapper'
import { HelpPanel } from './components/HelpPanel'
import { CoverPage } from './components/CoverPage'
import { TableOfContents } from './components/TableOfContents'
import { Chapter1 } from './components/chapters/Chapter1'
import { Chapter2 } from './components/chapters/Chapter2'
import { Chapter3 } from './components/chapters/Chapter3'
import { Chapter4 } from './components/chapters/Chapter4'
import { Chapter5 } from './components/chapters/Chapter5'
import { Chapter6 } from './components/chapters/Chapter6'
import { Chapter7 } from './components/chapters/Chapter7'
import { Chapter8 } from './components/chapters/Chapter8'
import { Chapter9 } from './components/chapters/Chapter9'

interface Props {
  onAuthExpired: () => void
}

export default function TecnicaEditor({ onAuthExpired }: Props) {
  const { doc, setDoc, reset, undo, canUndo, loadReport, syncState, booting } = useTecnicaStore(onAuthExpired)
  const [showChapters, setShowChapters] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showGuides, setShowGuides] = useGuidesPreference()

  useEffect(() => {
    document.body.classList.toggle('guias', showGuides)
  }, [showGuides])

  useEffect(() => {
    document.title = doc.code ? `${doc.code} — Propuesta Técnica Alto Test` : 'ALTO TEST — Propuesta Técnica de Servicio'
  }, [doc.code])

  if (booting) return <div className="boot-screen">Cargando…</div>

  function toggleChapter(id: string, include: boolean) {
    setDoc((d) => ({ ...d, excluded: toggleExcluded(d.excluded, id, include) }))
  }

  return (
    <>
      <Toolbar
        doc={doc}
        setDoc={setDoc}
        onNew={reset}
        onUndo={undo}
        canUndo={canUndo}
        onLoadReport={loadReport}
        syncState={syncState}
        showChapters={showChapters}
        onToggleChapters={() => setShowChapters((v) => !v)}
        showHelp={showHelp}
        onToggleHelp={() => setShowHelp((v) => !v)}
        showGuides={showGuides}
        onToggleGuides={() => setShowGuides(!showGuides)}
      />

      {showChapters && <ChaptersPanelWrapper excluded={doc.excluded} onToggle={toggleChapter} />}
      {showHelp && <HelpPanel />}

      <div className="sheet">
        <CoverPage doc={doc} setDoc={setDoc} />
        <TableOfContents doc={doc} setDoc={setDoc} />
        <Chapter1 doc={doc} setDoc={setDoc} />
        <Chapter2 doc={doc} setDoc={setDoc} />
        <Chapter3 doc={doc} setDoc={setDoc} />
        <Chapter4 doc={doc} setDoc={setDoc} />
        <Chapter5 doc={doc} setDoc={setDoc} />
        <Chapter6 doc={doc} setDoc={setDoc} />
        <Chapter7 doc={doc} setDoc={setDoc} />
        <Chapter8 doc={doc} setDoc={setDoc} />
        <Chapter9 doc={doc} setDoc={setDoc} />
      </div>
    </>
  )
}
