// Contenido estático — igual al panel #ayuda del vanilla, no depende del estado.
export function HelpPanel() {
  return (
    <div className="ayuda no-print">
      <div className="cols">
        <div>
          <h5>Escribir</h5>
          <ul>
            <li>
              Haga clic sobre cualquier texto <b>subrayado con puntos</b> y escriba encima.
            </li>
            <li>
              <b>Ctrl + B</b> pone una palabra en negrita.
            </li>
            <li>
              En las listas, <b>Enter</b> crea el punto siguiente.
            </li>
            <li>
              En los textos largos, <b>Enter</b> abre un párrafo nuevo y <b>Shift + Enter</b> corta la línea sin
              separar.
            </li>
            <li>Los textos pegados desde Word entran limpios, sin colores ni fuentes ajenas.</li>
          </ul>
        </div>
        <div>
          <h5>Filas y programa</h5>
          <ul>
            <li>
              <b>+ Agregar</b> suma una fila; la <b>×</b> del costado la elimina.
            </li>
            <li>
              En la carta Gantt, <b>clic</b> sobre una celda marca el período.
            </li>
            <li>
              <b>Alt + clic</b> convierte esa actividad en <b>hito</b> (barra naranja).
            </li>
            <li>
              Las cifras marcadas <b>calculado</b> se actualizan solas: no se escriben.
            </li>
            <li>
              <b>Capítulos</b> permite dejar fuera los capítulos o los subtítulos que no apliquen; todo se renumera
              solo.
            </li>
          </ul>
        </div>
        <div>
          <h5>Portada y entrega</h5>
          <ul>
            <li>
              <b>Foto</b> pone una imagen de fondo en la portada; el deslizador la oscurece para que el texto se lea.
            </li>
            <li>Se guarda en el servidor de Alto Test, no sólo en este navegador.</li>
            <li>
              <b>Nueva</b> devuelve el documento a su contenido original, con número y fecha nuevos: úselo al empezar
              cada propuesta. <b>Deshacer</b> recupera la anterior mientras no escriba nada.
            </li>
            <li>
              <b>Imprimir / PDF</b> genera el documento en tamaño carta.
            </li>
            <li>
              La <b>línea naranja punteada</b> marca dónde corta cada hoja.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
