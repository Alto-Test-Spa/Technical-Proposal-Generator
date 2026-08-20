import type { TecnicaState } from '../types'

// Contenido con el que abre una propuesta nueva — portado tal cual desde
// assets/contenido.js del vanilla (mismo tono socio-técnico, mismos textos).
// Es lo único que hay que tocar para cambiar el contenido por defecto.
export function initialTemplate(): TecnicaState {
  return {
    code: '',
    date: '',
    validityDays: 30,

    coverPhoto: '',
    coverVeil: 72,

    fields: {
      cover: {
        eyebrow: 'Diagnóstico · Ingeniería · Instalación · Certificación',
        docType: 'Propuesta técnica de servicio',
        title:
          '<b>Sistema de protección contra caídas:</b> línea de vida horizontal y puntos de anclaje certificados.',
        client: '',
        rut: '',
        address: '',
        contact: '',
        modality: 'Ingeniería, instalación y certificación',
        revision: 'Rev. 0',
      },
      toc: {
        title: 'Qué encontrará en esta propuesta.',
        dek: 'Cada compromiso de esta propuesta se puede verificar contra una norma, un ensayo o un documento. No le pedimos que confíe: se lo documentamos.',
        desc: {
          s1: 'Qué observamos en su instalación y qué buscamos resolver juntos.',
          s2: 'Las referencias con las que diseñamos, instalamos y certificamos.',
          s3: 'Qué contempla el servicio y con qué características técnicas.',
          s4: 'Las cinco etapas del Método Alto Test y sus actividades.',
          s5: 'Cómo se ordena el trabajo en el tiempo y quién lo ejecuta.',
          s6: 'Cómo verificamos, juntos, que todo quedó bien.',
          s7: 'La documentación que queda en sus manos y los anexos.',
          s8: 'Cómo trabajamos, qué aporta cada parte y qué queda fuera.',
          s9: 'Cómo se formaliza, cómo coordinamos y qué viene después.',
        },
      },
      s1: {
        title: 'De la incertidumbre a información técnica confiable.',
        dek: 'Qué observamos en su instalación y qué proponemos resolver juntos.',
        objective:
          'Dejar su sistema de protección contra caídas <b>certificado y trazable</b>, y acompañarlo con el plan de seguimiento que mantiene esa condición vigente en el tiempo.',
        background:
          'A solicitud suya visitamos la instalación para conocer las condiciones de trabajo en altura. El levantamiento muestra la conveniencia de contar con un <b>sistema permanente</b>: diseñado conforme a norma, instalado por personal especializado y respaldado con ensayos verificables.',
        criticalNote:
          'Criticidad según el criterio Alto Test: <b>Crítica</b> (acción inmediata) · <b>Importante</b> (corrección programada) · <b>Mejora futura</b> (optimización planificada).',
      },
      s2: {
        title: 'Trabajamos con la norma como criterio compartido.',
        dek: 'Así, cada compromiso de esta propuesta puede verificarse contra una referencia conocida por ambas partes.',
        note: 'Si dos referencias difieren, aplicamos la más exigente y se lo informamos.',
      },
      s3: {
        title: 'Qué contempla el servicio.',
        dek: 'Partidas comprometidas para la instalación individualizada en la portada. Lo que queda fuera está en el capítulo de condiciones.',
        note: 'Las cantidades finales se confirman en el levantamiento previo a la ejecución; cualquier variación se conversa antes de ejecutarse.',
      },
      s4: {
        title: 'Nuestro método: cinco etapas que se repiten en el tiempo.',
        dek: 'Cada etapa deja un entregable y prepara la siguiente. Al llegar a la quinta, el ciclo vuelve a empezar.',
        cycle: 'Cada auditoría genera un nuevo diagnóstico: así el sistema mejora en cada vuelta.',
      },
      s5: {
        title: 'Cómo se ordena el trabajo en el tiempo.',
        dek: 'El plazo se cuenta desde la orden de compra y la confirmación del acceso a la instalación.',
        note: '(*) Plazo referencial. Si el clima, el acceso o una autorización lo modifican, se lo informamos y reprogramamos de común acuerdo.',
      },
      s6: {
        title: 'Cómo verificamos, juntos, que todo quedó bien.',
        dek: 'Cada criterio tiene su método de verificación y el documento que lo respalda.',
        closing:
          'Ningún punto se entrega sin ensayo, sin registro y sin identificación individual. Si alguno no cumple, <b>se lo decimos a tiempo</b> y le proponemos cómo corregirlo.',
      },
      s7: {
        title: 'Lo que queda documentado para usted.',
        dek: 'Todo en digital (PDF) y, si lo necesita, en copia física firmada.',
      },
      s8: {
        title: 'Cómo trabajamos y qué aporta cada parte.',
        dek: 'Lo dejamos escrito desde el comienzo para que no haya sorpresas para nadie.',
        exclusionIntro:
          'Lo siguiente no está incluido en esta propuesta. Si lo necesita, <b>lo cotizamos aparte</b> o lo coordinamos con su proveedor habitual.',
      },
      s9: {
        title: 'Demos el primer paso.',
        dek: 'Cómo se formaliza, cómo coordinamos y qué sigue después de la entrega.',
        closing:
          'Esta propuesta técnica se acompaña de la <b>propuesta económica</b> asociada. Más que ejecutar un servicio, queremos ser el socio técnico que acompaña sus sistemas durante toda su vida útil.',
        signName: 'Camilo Jara Acevedo',
        signRole: 'Gerente General · Alto Test SpA',
        acceptName: 'Aceptación del cliente',
        acceptRole: 'Nombre, cargo, RUT y fecha',
      },
    },

    excluded: [],

    // ── Portada · lo que nos diferencia, dicho en la primera página ──
    pillars: [
      {
        icon: 'infinity',
        title: 'Ciclo de vida completo',
        description: 'Del diagnóstico a la recertificación, con un solo responsable técnico.',
      },
      {
        icon: 'shield-check',
        title: 'Certificación con ensayo',
        description: 'Cada punto probado, identificado y registrado individualmente.',
      },
      {
        icon: 'calendar-check',
        title: 'Seguimiento de vencimientos',
        description: 'Le avisamos antes de que la vigencia expire. No lo dejamos solo.',
      },
    ],

    // ── 01 · Antecedentes y objetivo ──
    findings: [
      {
        heading: 'Sin sistema permanente',
        situation: 'El personal se ancla a elementos que no fueron diseñados para retener una caída.',
        severity: 'Crítica',
      },
      {
        heading: 'Sin evidencia técnica',
        situation: 'No hay memoria de cálculo ni protocolo de ensayo de lo instalado.',
        severity: 'Crítica',
      },
      {
        heading: 'Sin trazabilidad',
        situation: 'Los puntos no están identificados individualmente ni tienen vencimiento conocido.',
        severity: 'Importante',
      },
      {
        heading: 'Sin plan de inspección',
        situation: 'La condición del sistema deja de conocerse entre una revisión y la siguiente.',
        severity: 'Importante',
      },
      {
        heading: 'Señalización de uso',
        situation: 'Conviene indicar carga admisible y usuarios simultáneos por tramo.',
        severity: 'Mejora futura',
      },
    ],
    justifications: [
      {
        icon: 'shield-check',
        title: 'La seguridad de su gente es lo que está en juego',
        paragraph:
          'Detrás de cada punto de anclaje hay personas que confían en que va a responder. Ese es el criterio con el que tomamos cada decisión técnica.',
      },
      {
        icon: 'file-check',
        title: 'Información confiable para decidir',
        paragraph:
          'Nuestro trabajo transforma la incertidumbre sobre sus activos en datos técnicos verificables: qué hay, en qué estado y hasta cuándo.',
      },
      {
        icon: 'repeat',
        title: 'Acompañamiento, no una visita',
        paragraph:
          'La certificación describe un día. Lo que sostiene la seguridad en el tiempo es la inspección periódica y la mejora continua del sistema.',
      },
    ],

    // ── 02 · Marco normativo ──
    chips: ['EN 795', 'EN 353-1 / 353-2', 'EN 361 · EN 362', 'ANSI/ASSE Z359', 'DS N° 594 MINSAL', 'DS N° 76 · Ley 16.744', 'NCh 1258 Of. 2004'],
    standards: [
      {
        standard: 'EN 795',
        scope: 'Dispositivos de anclaje para protección individual contra caídas de altura.',
        requirement:
          'Clasificación del dispositivo (tipos A a E), ensayo estático de resistencia e instalación sobre el sustrato real.',
      },
      {
        standard: 'EN 353-1 / 353-2',
        scope: 'Anticaídas deslizantes sobre línea de anclaje rígida y flexible.',
        requirement: 'Compatibilidad del dispositivo con la línea instalada y verificación de la distancia libre de caída.',
      },
      {
        standard: 'ANSI/ASSE Z359',
        scope: 'Estándar americano de protección contra caídas; referencia habitual en faena minera e industrial.',
        requirement: 'Resistencia del anclaje, factor de seguridad de diseño e inspección periódica documentada.',
      },
      {
        standard: 'DS N° 594 MINSAL',
        scope: 'Condiciones sanitarias y ambientales básicas en los lugares de trabajo.',
        requirement: 'Obligación del empleador de proveer medios de protección para labores con riesgo de caída.',
      },
      {
        standard: 'NCh 1258 Of. 2004',
        scope: 'Sistemas personales para detención de caídas — requisitos generales.',
        requirement: 'Requisitos aplicables a los componentes del sistema y a su uso en conjunto.',
      },
    ],

    // ── 03 · Alcances ──
    scopes: [
      {
        description: 'Levantamiento y diagnóstico técnico en terreno, con registro fotográfico y matriz de criticidad.',
        unit: 'Global',
        quantity: '1',
        reference: 'Etapa 01',
      },
      {
        description:
          'Ingeniería de la solución: cálculo de cargas, ubicación de puntos y trazado, con memoria y plano de disposición.',
        unit: 'Global',
        quantity: '1',
        reference: 'Etapa 02',
      },
      {
        description: 'Suministro e instalación de puntos de anclaje certificados sobre el sustrato definido en la ingeniería.',
        unit: 'Un',
        quantity: 'Por definir',
        reference: 'Etapa 03',
      },
      {
        description: 'Suministro e instalación de línea de vida horizontal permanente: postes, absorbedor, tensor y señalización.',
        unit: 'm',
        quantity: 'Por definir',
        reference: 'Etapa 03',
      },
      {
        description: 'Ensayos de carga (Pull-Out) por punto, con registro individual e identificación física de cada uno.',
        unit: 'Un',
        quantity: 'Por definir',
        reference: 'Etapa 04',
      },
      {
        description: 'Certificación del sistema y entrega del expediente técnico de respaldo.',
        unit: 'Global',
        quantity: '1',
        reference: 'Etapa 04',
      },
      {
        description: 'Plan de inspección y recertificación, con calendario de vencimientos y recordatorio de renovación.',
        unit: 'Global',
        quantity: '1',
        reference: 'Etapa 05',
      },
    ],
    specs: [
      { parameter: 'Tipo de sistema', value: 'Línea de vida horizontal permanente + puntos de anclaje individuales' },
      { parameter: 'Norma de diseño', value: 'EN 795, tipo según la configuración definida en ingeniería' },
      { parameter: 'Sustrato de fijación', value: 'A confirmar en levantamiento: hormigón, acero o madera estructural' },
      { parameter: 'Materialidad', value: 'Acero inoxidable o galvanizado, según exposición ambiental' },
      { parameter: 'Ensayo de verificación', value: 'Pull-Out por punto, con carga registrada individualmente' },
      { parameter: 'Identificación', value: 'Placa individual por punto, trazable al informe de certificación' },
      { parameter: 'Vigencia de la certificación', value: '12 meses, acompañada del plan de inspección' },
    ],

    // ── 04 · Metodología · las cinco etapas del Método Alto Test ──
    methodStages: [
      { icon: 'search', title: 'Diagnosticar', description: 'Levantamiento, inspección, registro y diagnóstico.' },
      { icon: 'pen-tool', title: 'Diseñar', description: 'Ingeniería, priorización y propuesta técnica.' },
      { icon: 'wrench', title: 'Implementar', description: 'Instalación, mejoras y adecuaciones.' },
      { icon: 'shield-check', title: 'Validar', description: 'Ensayos, certificación y documentación trazable.' },
      { icon: 'repeat', title: 'Gestionar', description: 'Auditorías, inspecciones, mantenimiento y re-certificación.' },
    ],
    activities: [
      {
        stage: '01',
        activity: 'Visita técnica y levantamiento',
        description: 'Inspección, medición de tramos, evaluación del sustrato y registro fotográfico.',
        responsible: 'Ingeniero de proyecto',
      },
      {
        stage: '01',
        activity: 'Informe de diagnóstico',
        description: 'Matriz de criticidad: observaciones críticas, importantes y mejoras futuras.',
        responsible: 'Ingeniero de proyecto',
      },
      {
        stage: '02',
        activity: 'Ingeniería y memoria de cálculo',
        description: 'Cargas, distancia libre de caída, trazado y plano de disposición de puntos.',
        responsible: 'Ingeniería Alto Test',
      },
      {
        stage: '02',
        activity: 'Revisión conjunta con usted',
        description: 'Presentamos la solución y confirmamos ubicaciones antes de intervenir.',
        responsible: 'Ingeniero · Cliente',
      },
      {
        stage: '03',
        activity: 'Instalación en terreno',
        description: 'Montaje por personal especializado, con procedimiento de trabajo seguro y ART diaria.',
        responsible: 'Jefe de terreno',
      },
      {
        stage: '04',
        activity: 'Ensayos de carga Pull-Out',
        description: 'Ensayo por punto con instrumento calibrado y registro individual del resultado.',
        responsible: 'Técnico certificador',
      },
      {
        stage: '04',
        activity: 'Entrega de la certificación',
        description: 'Informe técnico, protocolos, certificados de componentes y planos as-built.',
        responsible: 'Ingeniero de proyecto',
      },
      {
        stage: '05',
        activity: 'Plan de seguimiento',
        description: 'Calendario de inspecciones y aviso anticipado de cada vencimiento.',
        responsible: 'Gestión Alto Test',
      },
    ],

    // ── 05 · Programa de trabajo ──
    gantt: {
      unit: 'Semana',
      periods: 6,
      rows: [
        { label: 'Coordinación de acceso y programación', marks: [1], milestone: false },
        { label: 'Levantamiento y diagnóstico', marks: [1, 2], milestone: false },
        { label: 'Ingeniería, memoria de cálculo y planos', marks: [2, 3], milestone: false },
        { label: 'Revisión conjunta con el cliente', marks: [3], milestone: false },
        { label: 'Suministro de componentes', marks: [3, 4], milestone: false },
        { label: 'Instalación en terreno', marks: [4, 5], milestone: false },
        { label: 'Ensayos de carga y certificación', marks: [5, 6], milestone: false },
        { label: 'Entrega del expediente técnico', marks: [6], milestone: true },
      ],
    },
    team: [
      { role: 'Gerente General', responsibility: 'Relación con el cliente y responsabilidad contractual del servicio.' },
      {
        role: 'Ingeniero de proyecto',
        responsibility: 'Diseño, memoria de cálculo y responsabilidad técnica del expediente.',
      },
      { role: 'Jefe de terreno', responsibility: 'Ejecución de la instalación, calidad en obra y seguridad del equipo.' },
      {
        role: 'Técnico certificador',
        responsibility: 'Ensayos de carga y levantamiento de protocolos con instrumento calibrado.',
      },
      { role: 'Gestión documental', responsibility: 'Expediente, control de vigencias y aviso de recertificación.' },
    ],

    // ── 06 · Criterios de aceptación ──
    criteria: [
      {
        criterion: 'Instalación conforme a la ingeniería aprobada',
        method: 'Comparación en terreno del as-built contra el plano revisado con usted.',
        evidence: 'Plano as-built firmado',
      },
      {
        criterion: 'Resistencia de cada punto de anclaje',
        method: 'Ensayo Pull-Out por punto con instrumento calibrado.',
        evidence: 'Protocolo por punto',
      },
      {
        criterion: 'Trazabilidad individual',
        method: 'Verificación de identificación física legible y correlativa al informe.',
        evidence: 'Inventario y fotografías',
      },
      {
        criterion: 'Componentes certificados',
        method: 'Revisión documental de los certificados de fábrica.',
        evidence: 'Certificados del fabricante',
      },
      {
        criterion: 'Cumplimiento normativo',
        method: 'Declaración de conformidad frente a las normas de este capítulo.',
        evidence: 'Informe de certificación',
      },
      {
        criterion: 'Instalación sin daño a su infraestructura',
        method: 'Recorrido de cierre en conjunto al terminar la faena.',
        evidence: 'Acta de recepción',
      },
      {
        criterion: 'Su equipo sabe usar el sistema',
        method: 'Charla de uso al personal que trabajará con el sistema.',
        evidence: 'Lista de asistencia',
      },
    ],

    // ── 07 · Entregables ──
    deliverables: [
      {
        deliverable: 'Informe de diagnóstico',
        content: 'Estado de la infraestructura y matriz de criticidad.',
        format: 'PDF',
        deadline: 'Etapa 01',
      },
      {
        deliverable: 'Memoria de cálculo',
        content: 'Cargas, distancia libre de caída y criterios de diseño.',
        format: 'PDF',
        deadline: 'Etapa 02',
      },
      {
        deliverable: 'Planos y as-built',
        content: 'Ubicación de puntos, trazado y detalles de fijación.',
        format: 'PDF',
        deadline: 'Etapa 03',
      },
      {
        deliverable: 'Protocolos Pull-Out',
        content: 'Carga aplicada, resultado y fotografía por punto.',
        format: 'PDF',
        deadline: 'Etapa 04',
      },
      {
        deliverable: 'Certificado del sistema',
        content: 'Conformidad, vigencia e identificación de los puntos.',
        format: 'PDF',
        deadline: 'Etapa 04',
      },
      {
        deliverable: 'Certificados de componentes',
        content: 'Documentación de fábrica de lo instalado.',
        format: 'PDF',
        deadline: 'Etapa 04',
      },
      {
        deliverable: 'Plan de inspección',
        content: 'Calendario de vencimientos, frecuencias, responsables y recordatorio de renovación.',
        format: 'PDF',
        deadline: 'Etapa 05',
      },
      {
        deliverable: 'Registro fotográfico',
        content: 'Condición inicial, instalación y ensayos.',
        format: 'PDF',
        deadline: 'Cierre',
      },
    ],
    annexes: [
      { name: 'Anexo N° 1', description: 'Propuesta económica asociada a esta propuesta técnica', status: 'Documento separado' },
      { name: 'Anexo N° 2', description: 'Fichas técnicas de los componentes ofertados', status: 'Por adjuntar' },
      { name: 'Anexo N° 3', description: 'Registro fotográfico del levantamiento', status: 'Por adjuntar' },
      { name: 'Anexo N° 4', description: 'Certificados de calibración de instrumentos', status: 'A solicitud' },
      {
        name: 'Anexo N° 5',
        description:
          'Antecedentes de Alto Test SpA: constitución y vigencia, RUT y personería, F30 / F30-1, competencias del personal técnico, calibración de instrumentos y póliza de responsabilidad civil',
        status: 'A solicitud',
      },
    ],

    // ── 08 · Condiciones y alcance ──
    conditions: [
      '<b>Horario:</b> trabajamos de lunes a viernes en horario hábil; si su operación necesita otra ventana, la coordinamos.',
      '<b>Clima:</b> si el viento, la lluvia o la visibilidad comprometen la seguridad, suspendemos y reprogramamos sin costo.',
      '<b>Recursos:</b> aportamos personal calificado, EPP, herramientas e instrumentos con calibración vigente.',
      '<b>Cambios de alcance:</b> si en terreno aparece algo no previsto, se lo informamos y lo ejecutamos sólo con su visto bueno.',
      '<b>Vigencia:</b> la certificación se mantiene vigente con el plan de inspección al día y sin eventos de caída ni intervención de terceros.',
      '<b>Valores:</b> se detallan en la propuesta económica asociada.',
    ],
    clientResponsibilities: [
      '<b>Acceso</b> a la instalación en las fechas coordinadas: permisos, credenciales e inducciones.',
      '<b>Una contraparte técnica</b> con quien revisar la ingeniería y resolver dudas en terreno.',
      '<b>Antecedentes</b> de la estructura: planos, memorias e intervenciones previas conocidas.',
      '<b>Energía eléctrica</b> en el frente de trabajo y un área para acopiar materiales.',
      '<b>Coordinación</b> de otras faenas que puedan interferir con la intervención.',
      '<b>Protocolos internos</b> de seguridad, para incorporarlos a nuestro procedimiento.',
      '<b>Revisión de actas</b> y documentación de cierre dentro de un plazo razonable.',
    ],
    exclusions: [
      'Obras civiles o refuerzos estructurales que la instalación requiera para soportar el sistema.',
      'Equipos de protección personal de su equipo (arnés, retráctil, conectores).',
      'Andamios, plataformas elevadoras o accesos especiales no considerados en el levantamiento.',
      'Trabajos eléctricos, pintura, sellos o terminaciones no derivados de la instalación.',
      'Retiro y disposición final de sistemas existentes.',
      'Estadía y traslado fuera de la Región Metropolitana.',
    ],

    // ── 09 · Siguiente paso ──
    acceptance: [
      '<b>Con una Orden de Compra</b> a nombre de Alto Test SpA, citando el número y la fecha de esta propuesta.',
      '<b>O con su firma</b> en el apartado de aceptación de este documento, enviado por correo a su contacto comercial.',
      '<b>Programamos</b> apenas confirmemos la fecha de acceso a la instalación.',
      '<b>Vigencia:</b> pasada la fecha indicada en la portada, revisamos juntos si algo cambió antes de reactivarla.',
      '<b>Si algo cambia</b> después de aceptada, lo conversamos y lo formalizamos antes de ejecutarlo.',
      '<b>Uso de la documentación:</b> es suya, para la instalación individualizada en esta propuesta.',
    ],
    coordination: [
      {
        instance: 'Reunión de inicio',
        whatIsDefined: 'Contrapartes, canal de comunicación, accesos, horarios y restricciones.',
        when: '5 días hábiles tras la aceptación',
      },
      {
        instance: 'Revisión de ingeniería',
        whatIsDefined: 'Presentamos la solución, ubicaciones y trazado para su aprobación.',
        when: 'Cierre de la etapa 02',
      },
      {
        instance: 'Coordinación de faena',
        whatIsDefined: 'Fechas de instalación y faenas que convenga detener o desviar.',
        when: 'Previo a la etapa 03',
      },
      {
        instance: 'Recepción del servicio',
        whatIsDefined: 'Recorrido conjunto contra los criterios de aceptación y firma del acta.',
        when: 'Cierre de la etapa 04',
      },
    ],
    accompaniment: [
      {
        icon: 'calendar-check',
        title: 'Le avisamos nosotros',
        description: 'Cada vencimiento de certificación se informa con anticipación, según el plan de inspección.',
      },
      {
        icon: 'folder-clock',
        title: 'Historia técnica del activo',
        description: 'Qué se encontró, qué se hizo y cuándo: el expediente se mantiene en el tiempo.',
      },
      {
        icon: 'trending-up',
        title: 'Mejora continua',
        description: 'Cada inspección deja recomendaciones priorizadas; el sistema mejora en cada ciclo.',
      },
    ],
  }
}
