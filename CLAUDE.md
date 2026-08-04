# CLAUDE.md — Propuesta Técnica Alto Test

Contexto para retomar este proyecto sin releer todo. Lee también `README.md`
(uso y extensión). Aquí están las **decisiones y las trampas**.

## Qué es

Plantilla editable en el navegador con la que **Camilo Jara (CEO de Alto Test,
administrador de contratos)** genera propuestas técnicas y las exporta a PDF
carta. No es un sitio web: es un documento que se vende. Debe servir para
ganar licitaciones.

Alto Test SpA: ingeniería en protección contra caídas (Santiago). Su
diferenciador es gestionar el **ciclo de vida completo** — diagnóstico,
diseño, instalación, certificación, mantención — no sólo certificar.
Slogan: *"La altura, documentada."* Antecedentes del cliente en
`../antecedentes/*.docx` (resumen ejecutivo, manifiesto, método, marca).

Recursos hermanos en `/home/meraki/altotest/`: `carta_presentacion`,
`manual_marca`, `pie_firma`, `propuesta_economica` (repos git independientes;
esta carpeta no lo es). `CONTEXTO.md` de la raíz está **desactualizado**.

## Stack — y por qué no otro

HTML + CSS + JS clásico. IBM Plex y Lucide por CDN. Sin build.

**No migrar a React/Babel/Tailwind.** Ya se evaluó contra
`/home/meraki/wcs/propuestas/index.html`, que el usuario citó como referencia:
ahí React sólo pinta HTML fijo y cuesta ~1,3 MB compilados en cada apertura.
Lo que se veía "más moderno" era CSS (sombras, bordes finos), y ya está
aplicado. Este proyecto pesa ~124 KB y tiene lógica real.

**Nunca usar `type="module"` ni `fetch()` de JSON local:** el archivo se abre
con `file://` y ambos fallan por CORS. Por eso el contenido vive en un `.js`
con `const`, no en un `.json`.

## Arquitectura

```
index.html            estructura: <section data-sec="sN">, contenedores data-lista-cont
assets/contenido.js   SECCIONES, KPIS, plantilla()  ← el "JSON" del documento
assets/app.js         Fmt · Store · Texto · Listas · Capitulos · Vista · App
assets/estilos.css    sistema visual + @media print
```

- **Estado**: todo en `Store.datos`, autoguardado en `localStorage`
  (`altotest_propuesta_tecnica_v3`). `S()` es el atajo de lectura.
- **Motor de listas**: cada lista se declara **una vez** en `ESQUEMAS` (tipo,
  columnas, viñeta, fila nueva) y un dibujante genérico la renderiza. Tipos:
  `tabla`, `vinetas`, `tarjetas`, `etapas`, `acompanamiento`, `pilares`,
  `chips`. Agregar una lista = una entrada en `ESQUEMAS` + un contenedor.
- **Campos sueltos**: `.ed[data-k]`; `contenteditable` se asigna **por JS**
  (`Texto.pintarCampos`), nunca en el HTML. Los `.rich` guardan `innerHTML`
  saneado a `<b>/<i>/<br>`.
- **Capítulos**: `Capitulos` calcula la numeración desde `SECCIONES` menos
  `S().fuera`. Numera capítulos, subtítulos (`.nsub`), pies, índice y KPIs.

## Invariantes — romperlas rompe el documento

1. **Nunca escribir números de capítulo o subtítulo en el HTML.** Los calcula
   `Vista.secciones()`. Tampoco citar capítulos por número en los textos.
2. **Todo control de edición lleva `no-print`** — botones ×, *+ Agregar*,
   etiquetas "calculado", notas de ayuda. Se han filtrado al PDF dos veces.
3. **Cada capítulo cabe en una hoja carta.** El `.foot` es `position:absolute`
   al fondo de la *sección*: si desborda, el pie se va con el sobrante y queda
   una hoja casi vacía. No hay solución CSS; hay que recortar contenido.
4. **Nada de selectores universales de posicionamiento** (`.cover > *`):
   pisaron el `position:absolute` de la foto de portada. Usar clases
   explícitas (`.cover-photo` / `.cover-grid` / `.cover-layer`).
5. **Sin dependencias nuevas.** Y los íconos deben existir en Lucide: uno
   inventado no falla, simplemente no dibuja nada.

## Bugs ya resueltos (no reintroducir)

| Síntoma | Causa |
|---|---|
| Foto de portada empuja el contenido | `.cover > *{position:relative}` pisaba el `absolute` |
| "Enrejado" sobre la foto | `.grid-fine-l` encima de la imagen → se apaga con `.cover.con-foto` |
| Franja clara al borde de la ficha de datos | `gap` **y** `border` a la vez → sólo `gap` + `padding:1px` |
| Bandas horizontales en el velo | degradado largo se posteriza al imprimir → capa pareja + degradado corto |
| Columna vacía a la derecha del Gantt | la columna del botón seguía en `grid-template-columns` → variable `--n` y en print sin esa columna |
| × impresos | `delrow` sin `no-print` fuera de celdas |
| Texto invisible en bloques oscuros | `.lead b{color:var(--ink)}` heredado dentro de `.darkbox` |
| Texto duplicado al extraer del PDF | `text-shadow` de la portada; es cosmético, se acepta |

## Verificación (no hay navegador en el entorno)

```bash
node --check assets/app.js && node --check assets/contenido.js
# cruces: contenedores vs ESQUEMAS, ids que busca el JS, íconos, números escritos a mano
```

**Prueba real del DOM** (jsdom, en el scratchpad). Ojo: `w.eval()` aísla cada
llamada — cargar `contenido.js` y `app.js` **en un solo eval** y exponer lo
necesario con `;window.__C=Capitulos;`.

**Revisar un PDF que deje el usuario en `ejemplos/`**: `pypdf` para páginas,
texto y anotaciones `/Link`; `pypdfium2` + `pillow` para renderizar a PNG y
mirarlo (no hay poppler). Medir perfiles de luminosidad detecta bandas y
artefactos que no se ven a simple vista.

## Criterio editorial y visual

- **Tono socio técnico.** Explicar y acompañar, nunca imponer. "Lo que
  necesitamos de usted", no "obligaciones del cliente". Se rechazó
  "Las reglas del juego" por confrontacional. Mejora continua siempre.
- **Patrón F**: título potente → subtítulo breve → un párrafo que importa →
  listas y tablas. Nada de bloques largos de prosa.
- **Una cosa una vez.** Se eliminó el 9.4 porque duplicaba el Anexo N° 5, y la
  bajada del índice porque repetía el índice.
- **Paleta**: `--paper #F4F5F2`, `--ink #10151E`, `--steel #4C6B7A`,
  `--signal #C2491F`. IBM Plex Sans + Mono. Estética editorial: esquinas casi
  rectas (2 px), sombras bajas, grilla fina, catenaria como firma.

## Decisiones del usuario (Matías) — no revertir sin pedir

- Fuera Exportar, Importar y Restablecer: un solo botón de imprimir. Se dejó
  Guías y Ayuda. *Riesgo conocido y aceptado: sin restablecer, la propuesta
  siguiente parte de la anterior.*
- Folio con prefijo `PT-`, formato igual al `COT-` de la propuesta económica.
- Código prolijo, DRY, contenido separado de la lógica, `index.html` corto.
- Pide actuar como diseñador/UX/PM: proponer mejoras, no sólo ejecutar.

## Pendientes propuestos

- Un botón "Nueva propuesta" (limpiar + folio nuevo) si el arranque desde la
  propuesta anterior llega a molestar.
- Actualizar `../CONTEXTO.md`, que no menciona esta carpeta.
- Esta carpeta no es repo git; falta definir remoto en `Alto-Test-Spa`.
