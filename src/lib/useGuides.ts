import { useEffect, useState } from 'react'

const KEY = 'altotest_propuesta_tecnica_guias'

// Preferencia puramente local (como en el vanilla: sólo afecta cómo SE VE el
// editor en este navegador, no es contenido del documento). A diferencia del
// resto del estado, nunca pasa por el Worker — guardarla ahí obligaba a un
// PUT completo a la nube cada vez que se prendía o apagaba, algo que el
// vanilla nunca hacía (ahí vivía en el mismo Store.datos, pero como éste sólo
// se guardaba en localStorage, nunca se sintió como una acción de red).
export function useGuidesPreference(): [boolean, (value: boolean) => void] {
  const [guides, setGuides] = useState(() => {
    const saved = localStorage.getItem(KEY)
    return saved === null ? true : saved === '1'
  })

  useEffect(() => {
    localStorage.setItem(KEY, guides ? '1' : '0')
  }, [guides])

  return [guides, setGuides]
}
