// Igual a Listas.COLORES.criticidad del vanilla: clasifica por prefijo, no por
// coincidencia exacta, para que "Crítica"/"Critico"/etc. sigan cayendo en el
// mismo balde aunque el usuario reescriba el texto libre de la columna.
export function criticidadClass(value: string): string {
  const s = String(value || '').toLowerCase()
  if (s.startsWith('crit') || s.startsWith('crít')) return 'crit-alta'
  if (s.startsWith('import')) return 'crit-media'
  return 'crit-baja'
}
