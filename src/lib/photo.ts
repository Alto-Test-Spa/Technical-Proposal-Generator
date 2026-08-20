// Reduce la foto de portada a un ancho máximo de 1800px antes de guardarla
// (nunca agranda) y la reexporta como JPEG calidad 0.82 — mismo criterio que
// App._foto() del vanilla, para no exceder la cuota de localStorage con fotos
// de cámara de varios MB.
export function resizePhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, 1800 / img.width)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      }
      img.onerror = () => reject(new Error('No se pudo leer esa imagen'))
      img.src = reader.result as string
    }
    reader.onerror = () => reject(new Error('No se pudo leer ese archivo'))
    reader.readAsDataURL(file)
  })
}

// Reparte el oscurecimiento entre una capa pareja y un degradado de recorrido
// corto: un degradado largo se imprime en bandas visibles, así queda limpio en
// el PDF. Igual a Vista.portada() del vanilla.
export function veilBackground(veilPercent: number): string {
  const v = Math.max(0, Math.min(100, veilPercent || 72)) / 100
  const tone = (a: number) => `rgba(16,21,30,${Math.min(1, a).toFixed(3)})`
  return `linear-gradient(180deg,${tone(v * 0.05)} 0%,${tone(v * 0.16)} 34%,${tone(v * 0.3)} 68%,${tone(v * 0.42)} 100%), ${tone(v * 0.62)}`
}
