import { useEffect, useRef, useState } from 'react'
import type { TecnicaState } from '../types'
import { initialTemplate } from './template'
import { generateCode, isValidCode } from './code'
import { todayDate } from './date'
import { fetchReport, saveReport, ApiError } from './api'
import type { SyncState } from './api'

// La nube (Worker + KV) es la fuente de verdad — mismo modelo que
// informe_levantamiento y propuesta_economica_react. Este mirror local es sólo
// para no dejar la pantalla en blanco si el Worker no responde al abrir la app.
const MIRROR_KEY = 'altotest_propuesta_tecnica_mirror'
const PREVIOUS_KEY = `${MIRROR_KEY}_previous`

function withCodeAndDate(doc: TecnicaState): TecnicaState {
  return {
    ...doc,
    code: doc.code && isValidCode(doc.code) ? doc.code : generateCode(),
    date: doc.date || todayDate(),
  }
}

function readMirror(): TecnicaState | null {
  const saved = localStorage.getItem(MIRROR_KEY)
  if (!saved) return null
  try {
    return { ...initialTemplate(), ...(JSON.parse(saved) as Partial<TecnicaState>) }
  } catch {
    return null
  }
}

function writeMirror(doc: TecnicaState) {
  try {
    localStorage.setItem(MIRROR_KEY, JSON.stringify(doc))
  } catch (e) {
    console.warn('No se pudo escribir la copia local de la propuesta:', e)
  }
}

export function useTecnicaStore(onAuthExpired: () => void) {
  const [doc, setDoc] = useState<TecnicaState>(() => withCodeAndDate(readMirror() ?? initialTemplate()))
  const [canUndo, setCanUndo] = useState(() => !!localStorage.getItem(PREVIOUS_KEY))
  const [syncState, setSyncState] = useState<SyncState>('idle')
  const [booting, setBooting] = useState(() => !!readMirror())
  const firstChangeAfterReset = useRef(false)
  const saveSeq = useRef(0)
  const onAuthExpiredRef = useRef(onAuthExpired)
  useEffect(() => {
    onAuthExpiredRef.current = onAuthExpired
  })

  useEffect(() => {
    const mirror = readMirror()
    if (!mirror) return
    fetchReport(mirror.code)
      .then((fresh) => {
        setDoc(fresh)
        writeMirror(fresh)
      })
      .catch((e) => {
        if (e instanceof ApiError && e.status === 401) {
          onAuthExpiredRef.current()
          return
        }
        if (e instanceof ApiError && e.status === 404) return
        setSyncState('offline')
      })
      .finally(() => setBooting(false))
  }, [])

  useEffect(() => {
    const seq = ++saveSeq.current
    const t = setTimeout(async () => {
      writeMirror(doc)
      setSyncState('saving')
      try {
        await saveReport(doc)
        if (saveSeq.current === seq) setSyncState('saved')
      } catch (e) {
        if (saveSeq.current !== seq) return
        if (e instanceof ApiError) {
          if (e.status === 401) {
            onAuthExpiredRef.current()
            return
          }
          setSyncState('error')
        } else {
          setSyncState('offline')
        }
      }
      if (firstChangeAfterReset.current) {
        firstChangeAfterReset.current = false
        localStorage.removeItem(PREVIOUS_KEY)
        setCanUndo(false)
      }
    }, 400)
    return () => clearTimeout(t)
  }, [doc])

  function reset() {
    localStorage.setItem(PREVIOUS_KEY, JSON.stringify(doc))
    firstChangeAfterReset.current = true
    setCanUndo(true)
    setDoc(withCodeAndDate(initialTemplate()))
  }

  function undo() {
    const saved = localStorage.getItem(PREVIOUS_KEY)
    if (!saved) return
    setDoc(JSON.parse(saved))
    localStorage.removeItem(PREVIOUS_KEY)
    firstChangeAfterReset.current = false
    setCanUndo(false)
  }

  function loadReport(incoming: TecnicaState) {
    setDoc(incoming)
  }

  return { doc, setDoc, reset, undo, canUndo, loadReport, syncState, booting }
}
