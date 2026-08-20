# CLAUDE.md — Propuesta Técnica (reescritura en React)

Contexto para retomar este proyecto sin releer todo el chat. Aquí están las
**decisiones y las trampas**, no un tutorial de React.

## Qué es

**Reescritura completa en Vite+React+TS de `../propuesta_tecnica`** (que queda
como vanilla HTML/CSS/JS, ahora sólo de referencia histórica). Mismo patrón
que `propuesta_economica_react` e `informe_levantamiento`: nube (Worker + KV)
como fuente de verdad, mirror local de resiliencia, historial multi-dispositivo.

**Por qué esta reescritura revierte una decisión anterior:** el `CLAUDE.md`
original de `propuesta_tecnica` decía explícitamente "No migrar a
React/Babel/Tailwind" — evaluado en su momento contra una referencia que sólo
pintaba HTML fijo (React sin beneficio real, sólo costo de bundle). Esa
comparación ya no aplica: el motivo real acá es el mismo que ya justificó la
reescritura de `propuesta_economica` — el vanilla no tenía separación de
responsabilidades (todo en `assets/app.js`, ~900 líneas) ni historial más allá
de `localStorage` de un solo navegador. El usuario confirmó explícitamente
querer este tratamiento para este documento también.

**Fidelidad de comportamiento, no sólo de diseño:** cada capítulo, cada lista,
el motor de capítulos/subtítulos excluibles y el Gantt se leyeron completos
del vanilla (`index.html`, `assets/app.js`, `assets/contenido.js`,
`assets/estilos.css`) antes de escribir código nuevo — no se rehízo "a la
mejor forma que se me ocurra". Ver "Qué se simplificó a propósito" más abajo
para las dos excepciones deliberadas.

## Stack

Idéntico al de `informe_levantamiento`/`propuesta_economica_react`: Vite 8 +
React 19 + TypeScript + Tailwind v4, `reicon-react`, código en inglés/
comentarios en español/contenido del documento en español. Puerto de dev fijo
`5212` (informe_levantamiento 5210, economica 5211, no colisionan).

```bash
npm run dev      # localhost:5212
npm run build    # tsc -b && vite build
npm run lint     # oxlint
```

**Backend: el mismo Worker compartido** (`altotest-documentos`, código en
`../../informes/informe_levantamiento/worker/`) — `kind = "tecnica"` en la
ruta. Ya estaba provisionado y probado con un PUT/GET/DELETE manual antes de
construir esta app (ver `informe_levantamiento/CLAUDE.md`, "Pendientes"). No
se creó ni se tocó el Worker.

## Arquitectura

```
src/
  App.tsx                    portón de acceso (idéntico al de los hermanos)
  TecnicaEditor.tsx           orquesta Toolbar + paneles + portada + índice + 9 capítulos
  types.ts                     TecnicaState — modelo propio del documento (no el
                                flat de QuoteState de economica, ver abajo)
  lib/
    sections.ts                 SECTIONS, SUBSECTIONS, KPIS — config estática
                                 (antes vivía mitad en contenido.js, mitad en el DOM)
    chapters.ts                  numeración de capítulos y subtítulos (puras funciones)
    template.ts                  initialTemplate() — contenido de fábrica, portado
                                  verbatim de assets/contenido.js
    store.ts                     useTecnicaStore: mismo patrón que los hermanos
    api.ts                       fetchReport/saveReport/listReports/deleteReport, kind="tecnica"
    code.ts                      generateCode() (folio PT-), isValidCode()
    date.ts                      autoformato/validación de fecha + vigencia
    photo.ts                     downscale de la foto de portada a canvas + velo
    colors.ts                    clase de criticidad (hallazgos) por prefijo de texto
    icons.tsx                    registro IconName → componente reicon-react (ver abajo)
    richtext.ts                  sanitizeRichHtml — igual criterio que informe_levantamiento
  components/
    Toolbar.tsx, HistoryMenu.tsx, SyncStatus.tsx, AccessGate.tsx   no-print / infra
    ChaptersPanel.tsx + ChaptersPanelWrapper.tsx    panel "Capítulos" (incluir/excluir)
    HelpPanel.tsx                panel "Ayuda" (contenido estático)
    ChapterSection.tsx           envoltorio de capítulo: numera, arma sec-head/foot,
                                  o no renderiza nada si está excluido
    Subtitle.tsx                 subtítulo excluible — ver "Qué se simplificó"
    Gantt.tsx                    carta Gantt (no es parte del motor de listas genérico,
                                  tampoco lo era en el vanilla)
    EditableTable.tsx             motor genérico de tablas (tipo `tabla` de ESQUEMAS)
    EditableTableCell.tsx          celda de tabla — el `<td>` ES el contenteditable,
                                    sin div envolvente (ver "Bugs cazados")
    EditableCell.tsx               campo suelto de una línea, sin negrita
    EditableBulletList.tsx         motor de viñetas (tipo `vinetas`)
    RichText.tsx                   campo con negrita; `blockEnter`/`onEnter` deciden
                                    si admite párrafos, línea única, o Enter=nuevo ítem
    CoverPage.tsx, TableOfContents.tsx, chapters/Chapter1..9.tsx
    Logomark.tsx, Wordmark.tsx      variante SIN anclajes (igual que economica, no
                                     la de informe_levantamiento)
```

## Modelo de datos — por qué no es el flat de `QuoteState`

`propuesta_economica_react` documenta su convención como "un objeto plano,
guardado entero en cada cambio". Acá se mantiene la forma que ya tenía el
vanilla (`Store.datos`): un objeto con ~20 arrays/objetos heterogéneos
(`pillars`, `findings`, `standards`, `scopes`, `gantt`, `criteria`,
`conditions`...) más `fields`, un diccionario tipado por capítulo en vez del
`campos: {}` string-keyed del vanilla. Es la forma correcta para el dominio de
este documento (capítulos con listas de tipos distintos), no una alternativa
inferior — no se fuerza al patrón de otro documento sólo por consistencia
superficial.

## Qué se simplificó a propósito (no es fidelidad ciega)

1. **Motor de listas**: en vez de portar el registro `ESQUEMAS` +
   `Listas._dibujantes` (genérico por string, `data-lista`/`data-k` como
   direccionamiento), hay dos componentes genéricos con props tipados
   (`EditableTable<T>`, `EditableBulletList`) y unos pocos bloques bespoke
   para las listas de cardinalidad fija sin UI de agregar/quitar (`pilares`,
   `metodo`, `acompanamiento` — misma asimetría que tenía el vanilla, a
   propósito: esas tres nunca tuvieron botón "+ Agregar" en el HTML original).

2. **Subtítulos excluibles sin barrido de DOM**: el vanilla necesita
   `Capitulos.bloque()` (recorre `nextElementSibling` hasta el próximo
   `h4.sub`/`.foot`/`[data-fin-sub]`) porque no tiene forma declarativa de
   agrupar "todo lo que pertenece a este subtítulo". En React no hace falta:
   `<Subtitle chapterId slug number>` envuelve su contenido en JSX y si el
   número es `null` (excluido) simplemente no renderiza nada — mismo
   resultado (nada se pierde del estado, sólo deja de mostrarse/imprimirse),
   mecanismo más simple. El equivalente a `data-fin-sub` (marcar que el cierre
   del capítulo 09 no pertenece al subtítulo "despues") deja de ser necesario
   por la misma razón: el `darkbox` de cierre está fuera del `<Subtitle>` en
   el JSX de `Chapter9.tsx`, punto.

## Íconos — por qué no es Lucide

El vanilla usa Lucide vía CDN; acá, como el resto de la familia, `reicon-react`
— pero **no tiene el mismo catálogo que Lucide**, así que no es un mapeo 1:1
por nombre. `lib/icons.tsx` documenta cada sustitución semántica (ejemplos:
`git-branch` → `Route`, `badge-check` → `Verified`, `table-2` → `Grid`,
`calendar-clock` → `CalendarCircle`, `wrench` → `Gear`, `folder-clock` →
`Folder`). A diferencia del vanilla — donde un nombre de ícono inventado
"simplemente no dibuja nada" en silencio (bug ya documentado ahí) — acá un
nombre inválido es un `import` roto, error de compilación, no un fallo mudo.

## Bugs cazados en esta reescritura

| Síntoma | Causa |
|---|---|
| Warning de React: `<p>` no puede contener `<div>` | Varios `<p className="eyebrow">`/`<p className="fine">` envolvían un `EditableCell` (que siempre renderiza `<div>`) — se cambiaron esos wrappers a `<div>` (el CSS es por clase, no por selector de etiqueta, así que no afecta el diseño) |
| Capítulo 05 (Gantt + 2 tablas) al borde de desbordar una hoja carta | El preflight de Tailwind fija `line-height:1.5` en `html`; el vanilla nunca tocaba `line-height` (quedaba en el `normal` del navegador). Se neutralizó con `body{line-height:normal}` en `index.css` — cualquier clase que ya declare su propio `line-height` (`.lead`, `.dek`, `.fine`, `td`…) lo sigue mandando igual |
| Filas de tabla ~1px más altas que el vanilla | `EditableTable` envolvía cada celda en `<td><div className="editable">` — el vanilla hace contenteditable al `<td>` mismo. Se separó en `EditableTableCell.tsx`, que hace contenteditable directo al `<td>`, sin div de por medio |

**Verificación hecha:** con el `.dev.vars` local del Worker compartido
(`ACCESS_KEY=7166` en `informes/informe_levantamiento/worker/`, KV simulado
por `wrangler dev`) + Playwright headless (no hay navegador con GUI en el
entorno): portón de acceso, guardado/carga y persistencia tras recargar
contra el Worker local, exclusión de capítulo completo y de subtítulo suelto
(renumeración gapless verificada en ambos), Gantt (clic marca celda, Alt+clic
marca hito), edición de texto simple y rico. PDF generado con
`page.pdf({width:'8.5in', height:'11in'})`: **importante** — comparar contra
`ejemplos/completo.pdf` del vanilla (generado con el diálogo de impresión de
un navegador real) da 11 páginas, pero el MISMO vanilla renderizado con
`page.pdf()` de Playwright (headless, `Page.printToPDF` de CDP) da 12 —
Playwright y "Guardar como PDF" del navegador paginan distinto en contenido al
límite de una hoja. Se confirmó que este documento (React) mide **exactamente
igual** (`getBoundingClientRect`, `@media print`) que el vanilla renderizado
por la misma herramienta — la comparación válida es contra el vanilla vía
Playwright, no contra el PDF de ejemplo, para no perseguir una diferencia que
es del método de comparación y no del contenido.

## Despliegue

**Pendiente.** `propuesta_tecnica` ya tiene un proyecto en Vercel sirviendo el
vanilla actual (cuenta personal de Matías) — no hay que crear hosting nuevo.
Falta: `git init` acá, push a una rama (`react-rewrite`) del repo existente
`Alto-Test-Spa/Technical-Proposal-Generator`, cambiar el Framework Preset del
proyecto Vercel a Vite, configurar `VITE_REPORTS_ENDPOINT`, verificar el
preview, promover a producción, y mergear sobre `main` con
`--allow-unrelated-histories -X theirs` (mismo procedimiento que
`propuesta_economica_react`, ver su CLAUDE.md sección "Despliegue") — con
confirmación explícita del usuario antes del push a `main`.

## Pendientes

- Desplegar (ver arriba).
- Actualizar `CONTEXTO.md` de la raíz y `CLAUDE.md` de `propuesta_tecnica`
  (vanilla) e `informe_levantamiento` una vez desplegado — los tres siguen
  hablando de esto como pendiente.
- Migrar cualquier propuesta que Camilo tuviera guardada sólo en el
  `localStorage` del vanilla (no hay forma automática, vivía fuera del Worker).
