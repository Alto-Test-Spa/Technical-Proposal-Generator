/* ═══════════════════════════════════════════════════════════════════
   CONTENIDO DE LA PROPUESTA — ALTO TEST
   Este archivo es el "JSON" de la plantilla: define los capítulos y el
   texto con el que abre una propuesta nueva. Es lo único que hay que
   tocar para cambiar el contenido por defecto; ni el estilo ni la
   lógica dependen de lo que se escriba aquí.

   Tono: somos un socio técnico. Explicamos, acompañamos y mejoramos;
   no imponemos condiciones ni discutimos con el cliente.
   ═══════════════════════════════════════════════════════════════════ */

/* Capítulos del documento. El índice y los encabezados se generan desde
   aquí, así que agregar un capítulo es agregar una línea a esta lista. */
const SECCIONES = [
  { id:"s1", titulo:"Antecedentes y objetivo",   icono:"search",
    desc:"Qué observamos en su instalación y qué buscamos resolver juntos." },
  { id:"s2", titulo:"Marco normativo",           icono:"book-open",
    desc:"Las referencias con las que diseñamos, instalamos y certificamos." },
  { id:"s3", titulo:"Alcances",                  icono:"list-checks",
    desc:"Qué contempla el servicio y con qué características técnicas." },
  { id:"s4", titulo:"Metodología",               icono:"git-branch",
    desc:"Las cinco etapas del Método Alto Test y sus actividades." },
  { id:"s5", titulo:"Programa de trabajo",       icono:"calendar-days",
    desc:"Cómo se ordena el trabajo en el tiempo y quién lo ejecuta." },
  { id:"s6", titulo:"Criterios de aceptación",   icono:"badge-check",
    desc:"Cómo verificamos, juntos, que todo quedó bien." },
  { id:"s7", titulo:"Entregables",               icono:"files",
    desc:"La documentación que queda en sus manos y los anexos." },
  { id:"s8", titulo:"Condiciones y alcance",     icono:"handshake",
    desc:"Cómo trabajamos, qué aporta cada parte y qué queda fuera." },
  { id:"s9", titulo:"Siguiente paso",            icono:"arrow-right-circle",
    desc:"Cómo se formaliza, cómo coordinamos y qué viene después." }
];

/* Cifras del índice: se calculan solas desde el contenido. */
/* `sec` ata cada cifra a su capítulo y `sub` a un subtítulo concreto: si
   eso se deja fuera de la propuesta, la cifra desaparece del índice en vez
   de quedar huérfana contando una tabla que ya no se muestra. */
const KPIS = [
  { icono:"list-checks",   lista:"alcances",    sec:"s3", sub:"s3.partidas",     label:"Partidas comprometidas" },
  { icono:"files",         lista:"entregables", sec:"s7", sub:"s7.entregables",  label:"Entregables documentales" },
  { icono:"badge-check",   lista:"criterios",   sec:"s6", label:"Criterios verificados con usted" },
  { icono:"calendar-days", plazo:true,          sec:"s5", label:"Plazo referencial de ejecución" }
];

/* Contenido con el que abre una propuesta nueva. */
function plantilla(){ return {
  meta:    { codigo:"", fecha:"", vigencia:30 },
  portada: { img:"", velo:72 },
  ui:      { guias:true },
  campos:  {},   /* textos libres, indexados por data-k */

  /* ── Portada · lo que nos diferencia, dicho en la primera página ── */
  pilares: [
    { i:"infinity",       t:"Ciclo de vida completo",
      d:"Del diagnóstico a la recertificación, con un solo responsable técnico." },
    { i:"shield-check",   t:"Certificación con ensayo",
      d:"Cada punto probado, identificado y registrado individualmente." },
    { i:"calendar-check", t:"Seguimiento de vencimientos",
      d:"Le avisamos antes de que la vigencia expire. No lo dejamos solo." }
  ],

  /* ── 01 · Antecedentes y objetivo ───────────────────────────── */
  hallazgos: [
    { h:"Sin sistema permanente", d:"El personal se ancla a elementos que no fueron diseñados para retener una caída.", c:"Crítica" },
    { h:"Sin evidencia técnica",  d:"No hay memoria de cálculo ni protocolo de ensayo de lo instalado.", c:"Crítica" },
    { h:"Sin trazabilidad",       d:"Los puntos no están identificados individualmente ni tienen vencimiento conocido.", c:"Importante" },
    { h:"Sin plan de inspección", d:"La condición del sistema deja de conocerse entre una revisión y la siguiente.", c:"Importante" },
    { h:"Señalización de uso",    d:"Conviene indicar carga admisible y usuarios simultáneos por tramo.", c:"Mejora futura" }
  ],
  justif: [
    { i:"shield-check", t:"La seguridad de su gente es lo que está en juego",
      p:"Detrás de cada punto de anclaje hay personas que confían en que va a responder. Ese es el criterio con el que tomamos cada decisión técnica." },
    { i:"file-check",   t:"Información confiable para decidir",
      p:"Nuestro trabajo transforma la incertidumbre sobre sus activos en datos técnicos verificables: qué hay, en qué estado y hasta cuándo." },
    { i:"repeat",       t:"Acompañamiento, no una visita",
      p:"La certificación describe un día. Lo que sostiene la seguridad en el tiempo es la inspección periódica y la mejora continua del sistema." }
  ],

  /* ── 02 · Marco normativo ───────────────────────────────────── */
  chips: ["EN 795","EN 353-1 / 353-2","EN 361 · EN 362","ANSI/ASSE Z359","DS N° 594 MINSAL","DS N° 76 · Ley 16.744","NCh 1258 Of. 2004"],
  normas: [
    { n:"EN 795", a:"Dispositivos de anclaje para protección individual contra caídas de altura.",
      r:"Clasificación del dispositivo (tipos A a E), ensayo estático de resistencia e instalación sobre el sustrato real." },
    { n:"EN 353-1 / 353-2", a:"Anticaídas deslizantes sobre línea de anclaje rígida y flexible.",
      r:"Compatibilidad del dispositivo con la línea instalada y verificación de la distancia libre de caída." },
    { n:"ANSI/ASSE Z359", a:"Estándar americano de protección contra caídas; referencia habitual en faena minera e industrial.",
      r:"Resistencia del anclaje, factor de seguridad de diseño e inspección periódica documentada." },
    { n:"DS N° 594 MINSAL", a:"Condiciones sanitarias y ambientales básicas en los lugares de trabajo.",
      r:"Obligación del empleador de proveer medios de protección para labores con riesgo de caída." },
    { n:"NCh 1258 Of. 2004", a:"Sistemas personales para detención de caídas — requisitos generales.",
      r:"Requisitos aplicables a los componentes del sistema y a su uso en conjunto." }
  ],

  /* ── 03 · Alcances ──────────────────────────────────────────── */
  alcances: [
    { d:"Levantamiento y diagnóstico técnico en terreno, con registro fotográfico y matriz de criticidad.", u:"Global", c:"1", r:"Etapa 01" },
    { d:"Ingeniería de la solución: cálculo de cargas, ubicación de puntos y trazado, con memoria y plano de disposición.", u:"Global", c:"1", r:"Etapa 02" },
    { d:"Suministro e instalación de puntos de anclaje certificados sobre el sustrato definido en la ingeniería.", u:"Un", c:"Por definir", r:"Etapa 03" },
    { d:"Suministro e instalación de línea de vida horizontal permanente: postes, absorbedor, tensor y señalización.", u:"m", c:"Por definir", r:"Etapa 03" },
    { d:"Ensayos de carga (Pull-Out) por punto, con registro individual e identificación física de cada uno.", u:"Un", c:"Por definir", r:"Etapa 04" },
    { d:"Certificación del sistema y entrega del expediente técnico de respaldo.", u:"Global", c:"1", r:"Etapa 04" },
    { d:"Plan de inspección y recertificación, con calendario de vencimientos y recordatorio de renovación.", u:"Global", c:"1", r:"Etapa 05" }
  ],
  especificaciones: [
    { k:"Tipo de sistema", v:"Línea de vida horizontal permanente + puntos de anclaje individuales" },
    { k:"Norma de diseño", v:"EN 795, tipo según la configuración definida en ingeniería" },
    { k:"Sustrato de fijación", v:"A confirmar en levantamiento: hormigón, acero o madera estructural" },
    { k:"Materialidad", v:"Acero inoxidable o galvanizado, según exposición ambiental" },
    { k:"Ensayo de verificación", v:"Pull-Out por punto, con carga registrada individualmente" },
    { k:"Identificación", v:"Placa individual por punto, trazable al informe de certificación" },
    { k:"Vigencia de la certificación", v:"12 meses, acompañada del plan de inspección" }
  ],

  /* ── 04 · Metodología · las cinco etapas del Método Alto Test ── */
  metodo: [
    { i:"search",       t:"Diagnosticar", d:"Levantamiento, inspección, registro y diagnóstico." },
    { i:"pen-tool",     t:"Diseñar",      d:"Ingeniería, priorización y propuesta técnica." },
    { i:"wrench",       t:"Implementar",  d:"Instalación, mejoras y adecuaciones." },
    { i:"shield-check", t:"Validar",      d:"Ensayos, certificación y documentación trazable." },
    { i:"repeat",       t:"Gestionar",    d:"Auditorías, inspecciones, mantenimiento y re-certificación." }
  ],
  actividades: [
    { e:"01", a:"Visita técnica y levantamiento", d:"Inspección, medición de tramos, evaluación del sustrato y registro fotográfico.", r:"Ingeniero de proyecto" },
    { e:"01", a:"Informe de diagnóstico", d:"Matriz de criticidad: observaciones críticas, importantes y mejoras futuras.", r:"Ingeniero de proyecto" },
    { e:"02", a:"Ingeniería y memoria de cálculo", d:"Cargas, distancia libre de caída, trazado y plano de disposición de puntos.", r:"Ingeniería Alto Test" },
    { e:"02", a:"Revisión conjunta con usted", d:"Presentamos la solución y confirmamos ubicaciones antes de intervenir.", r:"Ingeniero · Cliente" },
    { e:"03", a:"Instalación en terreno", d:"Montaje por personal especializado, con procedimiento de trabajo seguro y ART diaria.", r:"Jefe de terreno" },
    { e:"04", a:"Ensayos de carga Pull-Out", d:"Ensayo por punto con instrumento calibrado y registro individual del resultado.", r:"Técnico certificador" },
    { e:"04", a:"Entrega de la certificación", d:"Informe técnico, protocolos, certificados de componentes y planos as-built.", r:"Ingeniero de proyecto" },
    { e:"05", a:"Plan de seguimiento", d:"Calendario de inspecciones y aviso anticipado de cada vencimiento.", r:"Gestión Alto Test" }
  ],

  /* ── 05 · Programa de trabajo ───────────────────────────────── */
  gantt: {
    unidad:"Semana",
    periodos:6,
    filas:[
      { l:"Coordinación de acceso y programación", w:[1], h:false },
      { l:"Levantamiento y diagnóstico", w:[1,2], h:false },
      { l:"Ingeniería, memoria de cálculo y planos", w:[2,3], h:false },
      { l:"Revisión conjunta con el cliente", w:[3], h:false },
      { l:"Suministro de componentes", w:[3,4], h:false },
      { l:"Instalación en terreno", w:[4,5], h:false },
      { l:"Ensayos de carga y certificación", w:[5,6], h:false },
      { l:"Entrega del expediente técnico", w:[6], h:true }
    ]
  },
  equipo: [
    { r:"Gerente General", d:"Relación con el cliente y responsabilidad contractual del servicio." },
    { r:"Ingeniero de proyecto", d:"Diseño, memoria de cálculo y responsabilidad técnica del expediente." },
    { r:"Jefe de terreno", d:"Ejecución de la instalación, calidad en obra y seguridad del equipo." },
    { r:"Técnico certificador", d:"Ensayos de carga y levantamiento de protocolos con instrumento calibrado." },
    { r:"Gestión documental", d:"Expediente, control de vigencias y aviso de recertificación." }
  ],

  /* ── 06 · Criterios de aceptación ───────────────────────────── */
  criterios: [
    { c:"Instalación conforme a la ingeniería aprobada", m:"Comparación en terreno del as-built contra el plano revisado con usted.", e:"Plano as-built firmado" },
    { c:"Resistencia de cada punto de anclaje", m:"Ensayo Pull-Out por punto con instrumento calibrado.", e:"Protocolo por punto" },
    { c:"Trazabilidad individual", m:"Verificación de identificación física legible y correlativa al informe.", e:"Inventario y fotografías" },
    { c:"Componentes certificados", m:"Revisión documental de los certificados de fábrica.", e:"Certificados del fabricante" },
    { c:"Cumplimiento normativo", m:"Declaración de conformidad frente a las normas de este capítulo.", e:"Informe de certificación" },
    { c:"Instalación sin daño a su infraestructura", m:"Recorrido de cierre en conjunto al terminar la faena.", e:"Acta de recepción" },
    { c:"Su equipo sabe usar el sistema", m:"Charla de uso al personal que trabajará con el sistema.", e:"Lista de asistencia" }
  ],

  /* ── 07 · Entregables ───────────────────────────────────────── */
  entregables: [
    { e:"Informe de diagnóstico", c:"Estado de la infraestructura y matriz de criticidad.", f:"PDF", p:"Etapa 01" },
    { e:"Memoria de cálculo", c:"Cargas, distancia libre de caída y criterios de diseño.", f:"PDF", p:"Etapa 02" },
    { e:"Planos y as-built", c:"Ubicación de puntos, trazado y detalles de fijación.", f:"PDF", p:"Etapa 03" },
    { e:"Protocolos Pull-Out", c:"Carga aplicada, resultado y fotografía por punto.", f:"PDF", p:"Etapa 04" },
    { e:"Certificado del sistema", c:"Conformidad, vigencia e identificación de los puntos.", f:"PDF", p:"Etapa 04" },
    { e:"Certificados de componentes", c:"Documentación de fábrica de lo instalado.", f:"PDF", p:"Etapa 04" },
    { e:"Plan de inspección", c:"Calendario de vencimientos, frecuencias, responsables y recordatorio de renovación.", f:"PDF", p:"Etapa 05" },
    { e:"Registro fotográfico", c:"Condición inicial, instalación y ensayos.", f:"PDF", p:"Cierre" }
  ],
  anexos: [
    { n:"Anexo N° 1", d:"Propuesta económica asociada a esta propuesta técnica", e:"Documento separado" },
    { n:"Anexo N° 2", d:"Fichas técnicas de los componentes ofertados", e:"Por adjuntar" },
    { n:"Anexo N° 3", d:"Registro fotográfico del levantamiento", e:"Por adjuntar" },
    { n:"Anexo N° 4", d:"Certificados de calibración de instrumentos", e:"A solicitud" },
    { n:"Anexo N° 5", d:"Antecedentes de Alto Test SpA: constitución y vigencia, RUT y personería, F30 / F30-1, competencias del personal técnico, calibración de instrumentos y póliza de responsabilidad civil", e:"A solicitud" }
  ],

  /* ── 08 · Condiciones y alcance ─────────────────────────────── */
  condiciones: [
    "<b>Horario:</b> trabajamos de lunes a viernes en horario hábil; si su operación necesita otra ventana, la coordinamos.",
    "<b>Clima:</b> si el viento, la lluvia o la visibilidad comprometen la seguridad, suspendemos y reprogramamos sin costo.",
    "<b>Recursos:</b> aportamos personal calificado, EPP, herramientas e instrumentos con calibración vigente.",
    "<b>Cambios de alcance:</b> si en terreno aparece algo no previsto, se lo informamos y lo ejecutamos sólo con su visto bueno.",
    "<b>Vigencia:</b> la certificación se mantiene vigente con el plan de inspección al día y sin eventos de caída ni intervención de terceros.",
    "<b>Valores:</b> se detallan en la propuesta económica asociada."
  ],
  responsabilidades: [
    "<b>Acceso</b> a la instalación en las fechas coordinadas: permisos, credenciales e inducciones.",
    "<b>Una contraparte técnica</b> con quien revisar la ingeniería y resolver dudas en terreno.",
    "<b>Antecedentes</b> de la estructura: planos, memorias e intervenciones previas conocidas.",
    "<b>Energía eléctrica</b> en el frente de trabajo y un área para acopiar materiales.",
    "<b>Coordinación</b> de otras faenas que puedan interferir con la intervención.",
    "<b>Protocolos internos</b> de seguridad, para incorporarlos a nuestro procedimiento.",
    "<b>Revisión de actas</b> y documentación de cierre dentro de un plazo razonable."
  ],
  exclusiones: [
    "Obras civiles o refuerzos estructurales que la instalación requiera para soportar el sistema.",
    "Equipos de protección personal de su equipo (arnés, retráctil, conectores).",
    "Andamios, plataformas elevadoras o accesos especiales no considerados en el levantamiento.",
    "Trabajos eléctricos, pintura, sellos o terminaciones no derivados de la instalación.",
    "Retiro y disposición final de sistemas existentes.",
    "Estadía y traslado fuera de la Región Metropolitana."
  ],

  /* ── 09 · Siguiente paso ────────────────────────────────────── */
  aceptacion: [
    "<b>Con una Orden de Compra</b> a nombre de Alto Test SpA, citando el número y la fecha de esta propuesta.",
    "<b>O con su firma</b> en el apartado de aceptación de este documento, enviado por correo a su contacto comercial.",
    "<b>Programamos</b> apenas confirmemos la fecha de acceso a la instalación.",
    "<b>Vigencia:</b> pasada la fecha indicada en la portada, revisamos juntos si algo cambió antes de reactivarla.",
    "<b>Si algo cambia</b> después de aceptada, lo conversamos y lo formalizamos antes de ejecutarlo.",
    "<b>Uso de la documentación:</b> es suya, para la instalación individualizada en esta propuesta."
  ],
  coordinacion: [
    { i:"Reunión de inicio", q:"Contrapartes, canal de comunicación, accesos, horarios y restricciones.", c:"5 días hábiles tras la aceptación" },
    { i:"Revisión de ingeniería", q:"Presentamos la solución, ubicaciones y trazado para su aprobación.", c:"Cierre de la etapa 02" },
    { i:"Coordinación de faena", q:"Fechas de instalación y faenas que convenga detener o desviar.", c:"Previo a la etapa 03" },
    { i:"Recepción del servicio", q:"Recorrido conjunto contra los criterios de aceptación y firma del acta.", c:"Cierre de la etapa 04" }
  ],
  acompanamiento: [
    { i:"calendar-check", t:"Le avisamos nosotros", d:"Cada vencimiento de certificación se informa con anticipación, según el plan de inspección." },
    { i:"folder-clock",   t:"Historia técnica del activo", d:"Qué se encontró, qué se hizo y cuándo: el expediente se mantiene en el tiempo." },
    { i:"trending-up",    t:"Mejora continua", d:"Cada inspección deja recomendaciones priorizadas; el sistema mejora en cada ciclo." }
  ],
};}
