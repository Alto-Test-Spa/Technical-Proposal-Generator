# Propuesta Técnica de Servicio — Alto Test

Plantilla para generar propuestas técnicas: se edita en el navegador y se
exporta a PDF tamaño carta. Un capítulo por hoja, once hojas.

## Uso

Abrir `index.html` con doble clic. Se escribe directamente sobre el
documento; el contenido se guarda solo en el navegador y se conserva al
cerrarlo. El botón **Ayuda** de la barra explica lo básico.

Para la propuesta siguiente hay dos caminos. **Nueva** devuelve el documento a
su contenido original con folio y fecha del día — es lo recomendable, porque
así no queda ningún dato del cliente anterior en el PDF. O se parte de la
anterior y se editan sólo los datos que cambian, revisando bien antes de
enviar.

## La barra

| Control | Para qué |
|---|---|
| **N°** | Folio `PT-aaaammdd-hhmmss`, mismo formato que las cotizaciones (`COT-…`). Se genera solo; el botón ↻ crea uno nuevo. Es editable, por si se quiere igualar al de su cotización. |
| **Fecha · Vigencia** | La vigencia se calcula sobre la fecha y aparece en la portada. |
| **Foto** | Fotografía de fondo de la portada. El deslizador regula cuánto se oscurece para que el texto se lea. |
| **Capítulos** | Elegir qué capítulos y qué subtítulos incluye esta propuesta. |
| **Guías** | Muestra u oculta el subrayado punteado de todo lo editable. |
| **Nueva** | Vuelve al documento original, con folio y fecha nuevos. Pide confirmación y borra lo escrito. |
| **Deshacer** | Aparece sólo después de **Nueva** y recupera la propuesta anterior. Desaparece en cuanto se escribe algo. |
| **Imprimir / PDF** | Genera el documento. Usar **Guardar como PDF de Chrome/Edge**: "Microsoft Print to PDF" rasteriza y pierde los enlaces del índice. |

## Cómo se escribe

- Clic sobre cualquier texto subrayado con puntos.
- **Ctrl + B** para negrita (sólo se permiten negrita y cursiva; lo pegado
  desde Word entra limpio).
- En las listas, **Enter** abre el punto siguiente.
- En los textos largos (Objetivo, antecedentes, cierres), **Enter** abre un
  **párrafo nuevo** —separado del anterior— y **Shift + Enter** corta la línea
  sin separar. Al pegar desde Word se respetan los párrafos del original.
- La prosa va **justificada**, con partición de palabras según el idioma.
- *+ Agregar* suma una fila; la **×** del costado la elimina. Ninguno de esos
  controles se imprime.
- En la carta Gantt, **clic** marca el período y **Alt + clic** convierte la
  actividad en hito. Los períodos seguidos se dibujan como un tramo continuo.
- Las cifras del índice marcadas *calculado* salen del contenido: no se
  escriben, y desaparecen si su capítulo se deja fuera.

## Capítulos y subtítulos

El botón **Capítulos** permite dejar fuera los que no apliquen. Al hacerlo se
renumeran solos el índice, los encabezados, los pies, los subtítulos
(`3.1`, `3.2`, …), los enlaces internos y las cifras del índice. El contenido
excluido no se borra: vuelve tal cual si se marca de nuevo.

Lo mismo vale **subtítulo por subtítulo**: cada uno aparece bajo su capítulo
en el panel, y desmarcarlo se lleva su tabla, su lista y su botón *+ Agregar*.
Los que quedan se renumeran (si sale el `3.1`, el `3.2` pasa a ser `3.1`) y las
cifras del índice atadas a ese bloque desaparecen con él.

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
- **Subtítulo nuevo:** `<h4 class="sub" data-sub="slug" data-ic="…">` con su
  `<span class="nsub"></span>` delante. Con eso ya se puede excluir y numerar;
  arrastra consigo todo lo que va detrás hasta el subtítulo siguiente. Si algo
  de ese tramo es cierre del capítulo (una firma, un remate), se marca con
  `data-fin-sub` para que el corte se detenga ahí.

## Dependencias

Sólo dos, por CDN: la tipografía **IBM Plex** (Google Fonts) y los íconos
**Lucide**. Sin build, sin framework, sin instalación. Sin internet el
documento sigue funcionando: cambia la tipografía y no se dibujan los íconos.
