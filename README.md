# Propuesta Técnica de Servicio — Alto Test

Plantilla para generar propuestas técnicas: se edita en el navegador y se
exporta a PDF tamaño carta. Un capítulo por hoja, once hojas.

## Uso

Abrir `index.html` con doble clic. Se escribe directamente sobre el
documento; el contenido se guarda solo en el navegador y se conserva al
cerrarlo. El botón **Ayuda** de la barra explica lo básico.

Para la propuesta siguiente se parte de la anterior: se editan los datos del
nuevo cliente y se imprime. *Conviene revisar que no quede ningún dato del
cliente anterior antes de enviar el PDF.*

## La barra

| Control | Para qué |
|---|---|
| **N°** | Folio `PT-aaaammdd-hhmmss`, mismo formato que las cotizaciones (`COT-…`). Se genera solo; el botón ↻ crea uno nuevo. Es editable, por si se quiere igualar al de su cotización. |
| **Fecha · Vigencia** | La vigencia se calcula sobre la fecha y aparece en la portada. |
| **Foto** | Fotografía de fondo de la portada. El deslizador regula cuánto se oscurece para que el texto se lea. |
| **Capítulos** | Elegir qué capítulos incluye esta propuesta. |
| **Guías** | Muestra u oculta el subrayado punteado de todo lo editable. |
| **Imprimir / PDF** | Genera el documento. Usar **Guardar como PDF de Chrome/Edge**: "Microsoft Print to PDF" rasteriza y pierde los enlaces del índice. |

## Cómo se escribe

- Clic sobre cualquier texto subrayado con puntos.
- **Ctrl + B** para negrita (sólo se permiten negrita y cursiva; lo pegado
  desde Word entra limpio).
- En las listas, **Enter** abre el punto siguiente.
- *+ Agregar* suma una fila; la **×** del costado la elimina. Ninguno de esos
  controles se imprime.
- En la carta Gantt, **clic** marca el período y **Alt + clic** convierte la
  actividad en hito. Los períodos seguidos se dibujan como un tramo continuo.
- Las cifras del índice marcadas *calculado* salen del contenido: no se
  escriben, y desaparecen si su capítulo se deja fuera.

## Capítulos

El botón **Capítulos** permite dejar fuera los que no apliquen. Al hacerlo se
renumeran solos el índice, los encabezados, los pies, los subtítulos
(`3.1`, `3.2`, …), los enlaces internos y las cifras del índice. El contenido
excluido no se borra: vuelve tal cual si se marca de nuevo.

Por eso los subtítulos **no llevan el número escrito en el HTML**, y los
textos evitan citar capítulos por número ("está en el capítulo de
condiciones", no "en el capítulo 08"): las dos cosas quedarían desfasadas.

## Paginación

Cada capítulo debe caber en **una hoja**. En pantalla, la línea naranja
punteada marca dónde corta la página. Si un capítulo se pasa, su pie de
página se va con el sobrante y queda una hoja casi vacía: hay que recortar
contenido, no ignorarlo.

## Archivos

| Archivo | Qué contiene |
|---|---|
| `index.html` | Estructura: capítulos y contenedores. Sin textos largos ni lógica. |
| `assets/contenido.js` | **El contenido.** Capítulos, cifras del índice y el texto con el que abre una propuesta nueva. Es lo único que hay que tocar para cambiar lo que dice por defecto. |
| `assets/app.js` | Comportamiento: guardado, edición, listas, Gantt, portada, capítulos. |
| `assets/estilos.css` | Sistema visual de la marca y reglas de impresión. |

Los cuatro van juntos: si se mueve `index.html`, hay que llevarse `assets/`.

> El contenido guardado en el navegador **prevalece** sobre `contenido.js`.
> Cambiar los textos por defecto no afecta a una propuesta ya empezada.

## Extender

- **Fila nueva en una tabla:** desde el documento, con *+ Agregar*.
- **Tabla o lista nueva:** se declara en `ESQUEMAS` (`app.js`) y se agrega su
  contenedor `data-lista-cont="…"` en `index.html`.
- **Capítulo nuevo:** se agrega a `SECCIONES` (`contenido.js`) y se crea su
  `<section data-sec="…">` en `index.html`. Índice, numeración, enlaces y
  encabezados se generan solos.

## Dependencias

Sólo dos, por CDN: la tipografía **IBM Plex** (Google Fonts) y los íconos
**Lucide**. Sin build, sin framework, sin instalación. Sin internet el
documento sigue funcionando: cambia la tipografía y no se dibujan los íconos.
