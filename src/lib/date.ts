export function todayDate(): string {
  const d = new Date()
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${d.getFullYear()}`
}

// Autoformato progresivo: agrega las barras mientras se escribe.
export function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean)
  return parts.join('/')
}

// Valida fecha real dd/mm/aaaa (rechaza 32/13, 31/02, etc.), no sólo el formato.
export function isValidDate(value: string): boolean {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(value).trim())
  if (!m) return false
  const day = Number(m[1])
  const month = Number(m[2])
  const year = Number(m[3])
  if (month < 1 || month > 12 || day < 1 || year < 1900 || year > 2100) return false
  const d = new Date(year, month - 1, day)
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day
}

// dd/mm/aaaa -> Date real, o null si no es una fecha válida.
export function parseDate(value: string): Date | null {
  if (!isValidDate(value)) return null
  const [day, month, year] = String(value).trim().split('/').map(Number)
  return new Date(year, month - 1, day)
}

// Vigencia (portada): "N días · hasta dd/mm/aaaa", o "N días corridos" si la fecha
// de la propuesta no es válida todavía — mismo criterio que Vista._vigencia() del
// vanilla, incluyendo el "—" cuando la vigencia no es un número positivo.
export function validityLabel(dateStr: string, validityDays: number): string {
  const days = Number(validityDays)
  if (!(days > 0)) return '—'
  const base = parseDate(dateStr)
  if (!base) return `${days} días corridos`
  const until = new Date(base.getTime())
  until.setDate(until.getDate() + days)
  const dd = String(until.getDate()).padStart(2, '0')
  const mm = String(until.getMonth() + 1).padStart(2, '0')
  return `${days} días · hasta ${dd}/${mm}/${until.getFullYear()}`
}
