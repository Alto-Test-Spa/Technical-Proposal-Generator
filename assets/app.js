/* ═══════════════════════════════════════════════════════════════════
   PROPUESTA TÉCNICA DE SERVICIO — ALTO TEST · lógica de la plantilla

   Organización del archivo (cada módulo tiene una sola responsabilidad):
     Fmt      · fechas y número de propuesta
     Store    · estado y guardado automático
     Texto    · edición de campos y limpieza del formato pegado
     Listas   · motor genérico de tablas, viñetas y tarjetas
     Vista    · encabezados, índice, Gantt, portada y barra superior
     App      · eventos y arranque

   El contenido vive en assets/contenido.js; el estilo en assets/estilos.css.
   Aquí no hay textos de la propuesta: sólo el comportamiento.
   ═══════════════════════════════════════════════════════════════════ */
"use strict";

const CLAVE_GUARDADO = "altotest_propuesta_tecnica_v3";
const CLAVE_RESPALDO = CLAVE_GUARDADO + "_anterior";

/* ───────────────────────── Utilidades base ───────────────────────── */
const $  = (sel, raiz) => (raiz || document).querySelector(sel);
const $$ = (sel, raiz) => Array.from((raiz || document).querySelectorAll(sel));
const esc = s => String(s == null ? "" : s)
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const ic  = (nombre, clase) => nombre ? '<i data-lucide="'+nombre+'" class="ic '+(clase||'')+'"></i>' : '';
const dosDigitos = n => String(n).padStart(2,'0');

/* ───────────────────────── Fmt · fechas y folio ──────────────────── */
const Fmt = {
  /* dd/mm/aaaa mientras se escribe */
  fecha(v){
    const dig = String(v).replace(/\D/g,'').slice(0,8);
    let out = dig.slice(0,2);
    if(dig.length >= 3) out += '/' + dig.slice(2,4);
    if(dig.length >= 5) out += '/' + dig.slice(4,8);
    return out;
  },
  /* Devuelve un Date sólo si la fecha existe de verdad (rechaza 31/02) */
  aFecha(str){
    const m = String(str||"").trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if(!m) return null;
    const d = +m[1], mo = +m[2], y = +m[3];
    const dt = new Date(y, mo-1, d);
    return (dt.getFullYear() === y && dt.getMonth() === mo-1 && dt.getDate() === d) ? dt : null;
  },
  hoy(){
    const d = new Date();
    return dosDigitos(d.getDate()) + "/" + dosDigitos(d.getMonth()+1) + "/" + d.getFullYear();
  },
  /* Mismo formato que las cotizaciones: PT-aaaammdd-hhmmss */
  folio(){
    const d = new Date();
    return "PT-" + d.getFullYear() + dosDigitos(d.getMonth()+1) + dosDigitos(d.getDate()) +
           "-" + dosDigitos(d.getHours()) + dosDigitos(d.getMinutes()) + dosDigitos(d.getSeconds());
  },
  hora(){
    const d = new Date();
    return dosDigitos(d.getHours()) + ":" + dosDigitos(d.getMinutes());
  }
};

/* ───────────────────────── Store · estado ────────────────────────── */
const Store = {
  datos: null,
  respaldo: false,   // ¿queda una propuesta anterior recuperable?
  _timer: null,

  iniciar(){
    this.datos = this._leer();
    this._completar();
    return this.datos;
  },
  _completar(){
    if(!this.datos.meta.fecha)  this.datos.meta.fecha  = Fmt.hoy();
    if(!this.datos.meta.codigo) this.datos.meta.codigo = Fmt.folio();
  },
  _leer(){
    try{
      const crudo = localStorage.getItem(CLAVE_GUARDADO);
      // Se mezcla con la plantilla: si mañana se agrega un capítulo,
      // las propuestas ya guardadas siguen abriendo sin romperse.
      if(crudo) return Object.assign(plantilla(), JSON.parse(crudo));
    }catch(e){ console.warn("No se pudo leer lo guardado:", e); }
    return plantilla();
  },

  guardar(){
    clearTimeout(this._timer);
    // En cuanto se escribe algo, la propuesta anterior deja de recuperarse.
    if(this.respaldo){ this.respaldo = false; Vista.deshacer(); }
    Vista.estado("· guardando…");
    this._timer = setTimeout(() => this._escribir(), 400);
  },
  _escribir(){
    try{
      localStorage.setItem(CLAVE_GUARDADO, JSON.stringify(this.datos));
      Vista.estado("· guardado " + Fmt.hora());
    }catch(e){
      // Casi siempre es la foto de portada: se guarda el resto sin ella.
      try{
        const sinFoto = Object.assign({}, this.datos,
          { portada: Object.assign({}, this.datos.portada, { img:"" }) });
        localStorage.setItem(CLAVE_GUARDADO, JSON.stringify(sinFoto));
        Vista.estado("· guardado, la foto pesa demasiado", true);
      }catch(e2){ Vista.estado("· no se pudo guardar", true); }
    }
  },

  /* Vuelve el documento a la plantilla original, con folio y fecha nuevos.
     Lo anterior queda en un respaldo aparte hasta el próximo reinicio. */
  reiniciar(){
    clearTimeout(this._timer);
    this.respaldo = false;
    try{
      localStorage.setItem(CLAVE_RESPALDO, JSON.stringify(this.datos));
      this.respaldo = true;
    }catch(e){ console.warn("No se pudo respaldar la propuesta anterior:", e); }
    this.datos = plantilla();
    this._completar();
    this._escribir();
  },
  /* Deshacer sólo vale entre un reinicio y la primera edición. */
  deshacer(){
    if(!this.respaldo) return false;
    try{
      const crudo = localStorage.getItem(CLAVE_RESPALDO);
      if(!crudo) return false;
      this.datos = Object.assign(plantilla(), JSON.parse(crudo));
    }catch(e){ console.warn("No se pudo recuperar el respaldo:", e); return false; }
    localStorage.removeItem(CLAVE_RESPALDO);
    this.respaldo = false;
    this._escribir();
    return true;
  }
};
const S = () => Store.datos;   // atajo de lectura

/* ───────────────── Texto · campos y formato permitido ───────────── */
const Texto = {
  /* En los campos de prosa se permite negrita y cursiva; nada más. */
  PERMITIDAS: { B:1, STRONG:1, I:1, EM:1, BR:1 },

  esRico: el => el.classList.contains('rich'),
  valor(el){ return this.esRico(el) ? el.innerHTML : el.textContent; },

  limpiar(el){
    for(let pasada = 0; pasada < 3; pasada++){
      let quedaba = false;
      $$('*', el).forEach(nodo => {
        if(this.PERMITIDAS[nodo.tagName]){
          nodo.removeAttribute('style'); nodo.removeAttribute('class');
        }else{
          const padre = nodo.parentNode;
          while(nodo.firstChild) padre.insertBefore(nodo.firstChild, nodo);
          padre.removeChild(nodo);
          quedaba = true;
        }
      });
      if(!quedaba) break;
    }
  },
  /* Sanea un texto guardado antes de mostrarlo */
  sanear(html){
    const caja = document.createElement('div');
    caja.innerHTML = String(html == null ? "" : html);
    this.limpiar(caja);
    return caja.innerHTML;
  },

  /* Escribe el valor editado en el lugar del estado que corresponda */
  registrar(el){
    const lista = el.dataset.lista, k = el.dataset.k, valor = this.valor(el);
    if(lista && k){
      const i = +el.dataset.i;
      if(k === '__texto')        S()[lista][i] = valor;
      else if(lista === 'gantt') S().gantt.filas[i][k] = valor;
      else                       S()[lista][i][k] = valor;
    }else if(k){
      S().campos[k] = valor;
    }else return false;
    return true;
  },

  /* Vuelca el estado en los campos sueltos del documento (data-k) */
  /* Texto de fábrica de cada campo suelto. Se toma una sola vez, antes de
     pintar nada: es lo que se restituye al empezar una propuesta nueva.
     Sin esto, reiniciar adoptaría como "original" lo que quedó en pantalla. */
  ORIGINALES: null,
  guardarOriginales(){
    if(this.ORIGINALES) return;
    this.ORIGINALES = {};
    $$('.ed[data-k]').forEach(el => {
      if(el.dataset.lista) return;
      this.ORIGINALES[el.dataset.k] = this._enBruto(el);
    });
  },
  _enBruto(el){ return (this.esRico(el) ? el.innerHTML : el.textContent).trim(); },

  pintarCampos(){
    $$('.ed[data-k]').forEach(el => {
      if(el.dataset.lista) return;                 // los de listas se pintan solos
      if(el === document.activeElement) return;    // no le movemos el cursor a quien escribe
      el.setAttribute('contenteditable','true');   // todo campo .ed es editable
      el.setAttribute('title','Haz clic para editar');
      const k = el.dataset.k;
      if(k in S().campos){
        if(this.esRico(el)) el.innerHTML = this.sanear(S().campos[k]);
        else                el.textContent = S().campos[k];
      }else{
        // Sin valor guardado: vuelve el texto de fábrica. Los campos que nacen
        // dibujados (las descripciones del índice) ya llegan con el suyo.
        const orig = (this.ORIGINALES && k in this.ORIGINALES)
                     ? this.ORIGINALES[k] : this._enBruto(el);
        if(this._enBruto(el) !== orig){
          if(this.esRico(el)) el.innerHTML = orig;
          else                el.textContent = orig;
        }
        S().campos[k] = orig;
      }
    });
  }
};

/* ───────────────── Listas · motor genérico ──────────────────────────
   Cada lista se declara una vez (columnas, viñeta, fila nueva) y el
   motor se encarga de dibujarla, editarla, agregarla y eliminarla.
   Para sumar una lista nueva basta agregar una entrada a ESQUEMAS.
   ─────────────────────────────────────────────────────────────────── */
const ESQUEMAS = {
  /* ── Tablas ── */
  hallazgos: { tipo:'tabla', nueva:{ h:"", d:"", c:"Importante" }, recolorear:'c', cols:[
    { k:'h', cls:'k', ph:'Hallazgo' },
    { k:'d', ph:'Situación observada' },
    { k:'c', cls:'c n', ph:'Criticidad', color:'criticidad' }
  ]},
  normas: { tipo:'tabla', nueva:{ n:"", a:"", r:"" }, cols:[
    { k:'n', cls:'k', ph:'Norma' }, { k:'a', ph:'Alcance' }, { k:'r', ph:'Requisito clave' }
  ]},
  alcances: { tipo:'tabla', nueva:{ d:"", u:"Global", c:"1", r:"" }, cols:[
    { auto:'##' }, { k:'d', ph:'Descripción de la partida' },
    { k:'u', cls:'c', ph:'Unidad' }, { k:'c', cls:'c', ph:'Cantidad' }, { k:'r', cls:'n', ph:'Referencia' }
  ]},
  especificaciones: { tipo:'tabla', nueva:{ k:"", v:"" }, cols:[
    { k:'k', cls:'k', ph:'Parámetro' }, { k:'v', ph:'Especificación' }
  ]},
  actividades: { tipo:'tabla', nueva:{ e:"", a:"", d:"", r:"" }, cols:[
    { k:'e', cls:'c n', ph:'00' }, { k:'a', cls:'k', ph:'Actividad' },
    { k:'d', ph:'Descripción' }, { k:'r', ph:'Responsable' }
  ]},
  equipo: { tipo:'tabla', nueva:{ r:"", d:"" }, cols:[
    { k:'r', cls:'k', ph:'Rol' }, { k:'d', ph:'Responsabilidad' }
  ]},
  criterios: { tipo:'tabla', nueva:{ c:"", m:"", e:"" }, cols:[
    { auto:'##' }, { k:'c', cls:'k', ph:'Criterio' },
    { k:'m', ph:'Cómo se verifica' }, { k:'e', ph:'Evidencia' }
  ]},
  entregables: { tipo:'tabla', nueva:{ e:"", c:"", f:"PDF", p:"" }, cols:[
    { auto:'E-##' }, { k:'e', cls:'k', ph:'Entregable' }, { k:'c', ph:'Contenido' },
    { k:'f', cls:'c n', ph:'Formato' }, { k:'p', cls:'c n', ph:'Plazo' }
  ]},
  anexos: { tipo:'tabla', nueva:{ n:"", d:"", e:"Por adjuntar" }, cols:[
    { k:'n', cls:'n', ph:'Anexo N° 0' }, { k:'d', ph:'Descripción' }, { k:'e', ph:'Estado' }
  ]},
  coordinacion: { tipo:'tabla', nueva:{ i:"", q:"", c:"" }, cols:[
    { k:'i', cls:'k', ph:'Instancia' }, { k:'q', ph:'Qué se define' }, { k:'c', ph:'Cuándo' }
  ]},

  /* ── Viñetas (cada elemento es un texto con negritas opcionales) ── */
  condiciones:       { tipo:'vinetas', vineta:'check' },
  responsabilidades: { tipo:'vinetas', vineta:'arrow-right', clase:'pide' },
  exclusiones:       { tipo:'vinetas', vineta:'minus', clase:'neg' },
  aceptacion:        { tipo:'vinetas', vineta:'check' },

  /* ── Bloques con forma propia ── */
  justif:         { tipo:'tarjetas',       nueva:{ i:"circle-dot", t:"", p:"" } },
  metodo:         { tipo:'etapas',         nueva:{ i:"circle-dot", t:"", d:"" } },
  acompanamiento: { tipo:'acompanamiento', nueva:{ i:"circle-dot", t:"", d:"" } },
  pilares:        { tipo:'pilares' },                      /* portada: tres, fijos */
  chips:          { tipo:'chips' }
};

const Listas = {
  COLORES: {
    criticidad(v){
      const s = String(v||"").toLowerCase();
      if(s.indexOf("crit") === 0 || s.indexOf("crít") === 0) return "crit-alta";
      if(s.indexOf("import") === 0) return "crit-media";
      return "crit-baja";
    }
  },

  /* — Celdas y controles reutilizables — */
  celda(lista, i, col, fila){
    const extra = col.color ? " " + this.COLORES[col.color](fila[col.k]) : "";
    return '<td class="ed '+(col.cls||"")+extra+'" contenteditable="true" title="Haz clic para editar"'+
           ' data-lista="'+lista+'" data-i="'+i+'" data-k="'+col.k+'"'+
           ' data-ph="'+esc(col.ph||"")+'">'+esc(fila[col.k])+'</td>';
  },
  celdaAuto(col, i){
    return '<td class="c n">'+esc(col.auto.replace('##', dosDigitos(i+1)))+'</td>';
  },
  /* El botón lleva `no-print` él mismo: dentro de una celda lo hereda del
     <td>, pero en viñetas y tarjetas va suelto y saldría impreso. */
  eliminar(lista, i, comoCelda){
    const btn = '<button class="delrow no-print" data-eliminar="'+lista+'" data-i="'+i+
                '" title="Eliminar esta fila">&times;</button>';
    return comoCelda ? '<td class="act no-print">'+btn+'</td>' : btn;
  },

  /* — Dibujantes por tipo — */
  _dibujantes: {
    tabla(lista, esq){
      return S()[lista].map((fila,i) => '<tr>' +
        esq.cols.map(col => col.auto ? Listas.celdaAuto(col,i) : Listas.celda(lista,i,col,fila)).join("") +
        Listas.eliminar(lista,i,true) + '</tr>').join("");
    },
    vinetas(lista, esq){
      return S()[lista].map((txt,i) =>
        '<li><span class="bul">'+ic(esq.vineta)+'</span>'+
        '<span class="txt ed rich" contenteditable="true" title="Haz clic para editar"'+
        ' data-lista="'+lista+'" data-i="'+i+'" data-k="__texto" data-ph="Escriba el punto">'+
        Texto.sanear(txt)+'</span>'+ Listas.eliminar(lista,i,false) +'</li>').join("");
    },
    tarjetas(lista){
      return S()[lista].map((r,i) =>
        '<div class="justif"><div class="jic">'+ic(r.i || "circle-dot")+'</div><div class="body">'+
        '<div class="jt ed" contenteditable="true" data-lista="'+lista+'" data-i="'+i+'" data-k="t"'+
        ' data-ph="Título del argumento">'+esc(r.t)+'</div>'+
        '<div class="jp ed rich" contenteditable="true" data-lista="'+lista+'" data-i="'+i+'" data-k="p"'+
        ' data-ph="Una frase, no un párrafo">'+Texto.sanear(r.p)+'</div></div>'+
        Listas.eliminar(lista,i,false)+'</div>').join("");
    },
    etapas(lista){
      return S()[lista].map((r,i) =>
        '<div class="st"><div class="sh"><span class="n">'+dosDigitos(i+1)+'</span>'+ic(r.i)+'</div>'+
        '<div class="t ed" contenteditable="true" data-lista="'+lista+'" data-i="'+i+'" data-k="t"'+
        ' data-ph="Etapa">'+esc(r.t)+'</div>'+
        '<div class="d ed" contenteditable="true" data-lista="'+lista+'" data-i="'+i+'" data-k="d"'+
        ' data-ph="Descripción">'+esc(r.d)+'</div></div>').join("");
    },
    acompanamiento(lista){
      return S()[lista].map((r,i) =>
        '<div class="sc">'+ic(r.i)+
        '<div class="t ed" contenteditable="true" data-lista="'+lista+'" data-i="'+i+'" data-k="t"'+
        ' data-ph="Título">'+esc(r.t)+'</div>'+
        '<div class="d ed rich" contenteditable="true" data-lista="'+lista+'" data-i="'+i+'" data-k="d"'+
        ' data-ph="Una línea">'+Texto.sanear(r.d)+'</div></div>').join("");
    },
    pilares(lista){
      return S()[lista].map((r,i) =>
        '<div class="pilar">'+ic(r.i)+
        '<div class="pt ed" contenteditable="true" data-lista="'+lista+'" data-i="'+i+
        '" data-k="t" data-ph="Diferenciador">'+esc(r.t)+'</div>'+
        '<div class="pd ed" contenteditable="true" data-lista="'+lista+'" data-i="'+i+
        '" data-k="d" data-ph="Una línea">'+esc(r.d)+'</div></div>').join("");
    },
    chips(lista){
      return S()[lista].map((c,i) =>
        '<span class="chip"><span class="ed" contenteditable="true" data-lista="'+lista+'" data-i="'+i+
        '" data-k="__texto" data-ph="Norma">'+esc(c)+'</span>'+
        '<span class="x no-print" data-eliminar="'+lista+'" data-i="'+i+'" title="Quitar">&times;</span></span>'
      ).join("") + '<span class="chip add no-print" data-agregar="chips">'+ic('plus')+' norma</span>';
    }
  },

  dibujar(lista){
    const esq = ESQUEMAS[lista], caja = $('[data-lista-cont="'+lista+'"]');
    if(!esq || !caja) return;
    caja.innerHTML = this._dibujantes[esq.tipo](lista, esq);
    if(esq.clase) caja.classList.add(esq.clase);
    Vista.iconos(caja);
  },
  dibujarTodas(){ Object.keys(ESQUEMAS).forEach(l => this.dibujar(l)); },

  agregar(lista){
    const esq = ESQUEMAS[lista];
    S()[lista].push(esq.nueva ? Object.assign({}, esq.nueva) : "");
    this.dibujar(lista);
    Vista.indice();
    App.enfocar(lista, S()[lista].length - 1);
    Store.guardar();
  },
  quitar(lista, i){
    S()[lista].splice(i,1);
    this.dibujar(lista);
    Vista.indice();
    Store.guardar();
  },
  insertarDespues(lista, i){
    S()[lista].splice(i+1, 0, "");
    this.dibujar(lista);
    App.enfocar(lista, i+1);
    Store.guardar();
  }
};

/* ───────────────── Capítulos · qué entra en la propuesta ────────────
   Un capítulo excluido no se borra: se guarda su contenido y sólo deja de
   mostrarse. La numeración del resto se recalcula siempre desde esta
   lista, así que nunca queda un "08" siendo el séptimo capítulo.
   ─────────────────────────────────────────────────────────────────── */
const Capitulos = {
  fuera(){ return S().fuera || (S().fuera = []); },
  activo(id){ return this.fuera().indexOf(id) === -1; },
  visibles(){ return SECCIONES.filter(sec => this.activo(sec.id)); },

  alternar(id, incluir){
    const lista = this.fuera(), i = lista.indexOf(id);
    if(incluir && i > -1) lista.splice(i,1);
    else if(!incluir && i === -1) lista.push(id);
    App.dibujar();
    Store.guardar();
  },

  /* Número del capítulo contando sólo los que están incluidos */
  numero(id){
    const i = this.visibles().findIndex(sec => sec.id === id);
    return i === -1 ? null : dosDigitos(i+1);
  }
};

/* ───────────────────────── Vista ─────────────────────────────────── */
const Vista = {
  /* Lucide reemplaza cada <i data-lucide> por su SVG. Una vez sustituido
     ya no lleva el atributo, así que volver a llamarlo es barato. */
  iconos(){ if(window.lucide) lucide.createIcons({ nameAttr:'data-lucide' }); },

  estado(txt, alerta){
    const el = $('#estado');
    if(!el) return;
    el.textContent = txt;
    el.style.color = alerta ? "var(--signal)" : "var(--lsteel)";
  },

  /* Encabezado y pie de cada capítulo: se generan desde SECCIONES,
     así el número, el título y el ícono nunca quedan desalineados. */
  secciones(){
    SECCIONES.forEach(sec => {
      const pagina = $('[data-sec="'+sec.id+'"]');
      if(!pagina) return;
      pagina.id = sec.id;              // destino de los enlaces del índice

      const n = Capitulos.numero(sec.id);
      pagina.classList.toggle('fuera', n === null);
      if(n === null) return;           // capítulo excluido: no se numera ni dibuja

      // Los subtítulos heredan el número del capítulo: 3.1, 3.2, …
      $$('h4.sub .nsub', pagina).forEach((el,j) => {
        el.textContent = (+n) + '.' + (j+1) + ' ';
      });

      const cab = $('.sec-head', pagina), pie = $('.foot', pagina);
      if(cab) cab.innerHTML =
        '<span class="lbl">'+ic(sec.icono)+n+' · '+esc(sec.titulo)+'</span>'+
        '<a class="idx volver" href="#contenido" title="Volver al contenido">'+
        'Alto Test · '+n+'</a>';
      if(pie) pie.innerHTML =
        '<span>ALTO TEST — PROPUESTA TÉCNICA DE SERVICIO <b class="foot-cod"></b></span>'+
        '<span>'+n+'</span>';
    });
    /* Íconos de los subtítulos declarados con data-ic */
    $$('h4.sub[data-ic]').forEach(h => {
      if(!$('.ic', h)) h.insertAdjacentHTML('afterbegin', ic(h.dataset.ic));
    });
  },

  /* Índice: se arma leyendo SECCIONES, con cifras calculadas del contenido */
  indice(){
    const toc = $('#toc'), kpis = $('#kpis');
    if(!toc) return;

    /* El número, el ícono y el título son enlace al capítulo; la
       descripción queda fuera del ancla para poder seguir editándola. */
    toc.innerHTML = Capitulos.visibles().map((sec,idx) => {
      const n = dosDigitos(idx+1), destino = '#'+sec.id;
      return '<li>'+
        '<a class="tlink tsalto" href="'+destino+'" title="Ir al capítulo">'+
          '<span class="tn">'+n+'</span><span class="ti">'+ic(sec.icono)+'</span></a>'+
        '<div class="tw">'+
          '<a class="tlink tt" href="'+destino+'" title="Ir al capítulo">'+esc(sec.titulo)+
            ic('arrow-right','chev')+'</a>'+
          '<div class="td ed" data-k="toc.'+sec.id+'" data-ph="Descripción del capítulo">'+
          esc(sec.desc)+'</div></div></li>';
    }).join("");

    if(kpis){
      kpis.innerHTML = KPIS.filter(k => !k.sec || Capitulos.activo(k.sec)).map(k => {
        const valor = k.plazo ? this._plazo() : (S()[k.lista] || []).length;
        return '<div class="kpi"><div class="kt">'+ic(k.icono)+
               '<span class="auto-tag no-print">'+ic('sparkles')+'calculado</span></div>'+
               '<div class="kv">'+esc(valor)+'</div>'+
               '<div class="kl">'+esc(k.label)+'</div></div>';
      }).join("");
    }
    // El índice contiene campos editables: se repintan con su valor guardado
    Texto.pintarCampos();
    this.iconos();
  },
  _plazo(){
    const g = S().gantt, n = parseInt(g.periodos,10) || 0;
    const u = String(g.unidad || "").toLowerCase();
    return n + " " + (n === 1 ? u : u + "s");
  },

  /* Carta Gantt */
  gantt(){
    const g = S().gantt, caja = $('#gantt');
    if(!caja) return;
    const n = Math.max(1, Math.min(16, parseInt(g.periodos,10) || 6));
    const est = 'style="--n:'+n+'"';
    const fil = [];

    let cab = '<div class="grow ghead" '+est+'><div class="glabel">Actividad</div>';
    for(let w = 1; w <= n; w++) cab += '<div class="gcell">'+esc(g.unidad)+' '+w+'</div>';
    fil.push(cab + '<div class="gcell gact no-print"></div></div>');

    g.filas.forEach((f,i) => {
      const marcadas = f.w || [];
      let fila = '<div class="grow" '+est+'>'+
        '<div class="glabel"><span class="ed" contenteditable="true" data-lista="gantt" data-i="'+i+
        '" data-k="l" data-ph="Actividad">'+esc(f.l)+'</span></div>';
      for(let w = 1; w <= n; w++){
        let barra = '';
        if(marcadas.indexOf(w) > -1){
          // Períodos seguidos se dibujan como un solo tramo continuo
          const tramo = (marcadas.indexOf(w-1) > -1 ? '' : ' ini') +
                        (marcadas.indexOf(w+1) > -1 ? '' : ' fin');
          barra = '<div class="bar'+(f.h ? ' hito' : '')+tramo+'"></div>';
        }
        fila += '<div class="gcell" data-celda="'+i+':'+w+
                '" title="Clic para marcar · Alt+clic: hito">'+barra+'</div>';
      }
      fil.push(fila + '<div class="gcell gact no-print">'+
               Listas.eliminar('gantt', i, false) + '</div></div>');
    });
    caja.innerHTML = fil.join("");

    const per = $('#ganttPeriodos'), uni = $('#ganttUnidad');
    if(per && document.activeElement !== per) per.value = n;
    if(uni && document.activeElement !== uni) uni.value = g.unidad;
  },

  /* Portada: fotografía de fondo y su velo */
  portada(){
    const caja = $('#coverPhoto'), img = $('#coverImg');
    const hay = !!S().portada.img;
    caja.classList.toggle('empty', !hay);
    $('.cover').classList.toggle('con-foto', hay);   // apaga la grilla, activa sombras
    if(hay) img.src = S().portada.img;
    $('#btnFotoQuitar').hidden = !hay;

    /* El oscurecimiento se reparte entre una capa pareja y un degradado de
       recorrido corto. Un degradado largo se imprime en bandas visibles;
       repartido así, la transición queda limpia en el PDF. */
    const v = Math.max(0, Math.min(100, parseInt(S().portada.velo,10) || 72)) / 100;
    const tono = a => 'rgba(16,21,30,'+Math.min(1, a).toFixed(3)+')';
    $('#coverVeil').style.background =
      'linear-gradient(180deg,'+tono(v*0.05)+' 0%,'+tono(v*0.16)+' 34%,'+
      tono(v*0.30)+' 68%,'+tono(v*0.42)+' 100%), '+tono(v*0.62);
    $('#rangeVelo').value = Math.round(v*100);
  },

  /* Número, fecha y vigencia en la barra, la portada y el pie */
  cabecera(){
    const m = S().meta;
    const campo = $('#tbCodigo');
    if(document.activeElement !== campo) campo.value = m.codigo;
    $('#tbFecha').value    = m.fecha;
    $('#tbVigencia').value = m.vigencia;
    $('#coverCodigo').textContent   = m.codigo || "—";
    $('#coverFecha').textContent    = m.fecha  || "—";
    $('#coverVigencia').textContent = this._vigencia();
    $$('.foot-cod').forEach(e => { e.textContent = m.codigo ? '· ' + m.codigo : ''; });
    // El navegador propone el título como nombre del PDF
    document.title = m.codigo ? (m.codigo + " — Propuesta Técnica Alto Test")
                              : "ALTO TEST — Propuesta Técnica de Servicio";
  },
  _vigencia(){
    const dias = parseInt(S().meta.vigencia,10);
    if(!(dias > 0)) return "—";
    const base = Fmt.aFecha(S().meta.fecha);
    if(!base) return dias + " días corridos";
    const v = new Date(base.getTime());
    v.setDate(v.getDate() + dias);
    return dias + " días · hasta " + dosDigitos(v.getDate()) + "/" +
           dosDigitos(v.getMonth()+1) + "/" + v.getFullYear();
  },

  /* Panel para incluir o excluir capítulos */
  panelSecciones(){
    const caja = $('#listaSecciones');
    if(!caja) return;
    caja.innerHTML = SECCIONES.map(sec => {
      const n = Capitulos.numero(sec.id);
      return '<label class="secitem'+(n === null ? ' off' : '')+'">'+
        '<input type="checkbox" data-capitulo="'+sec.id+'"'+(n === null ? '' : ' checked')+'>'+
        '<span class="sn">'+(n === null ? '—' : n)+'</span>'+esc(sec.titulo)+'</label>';
    }).join("");
  },

  /* Guías de edición: subrayado en todo lo que se puede escribir */
  guias(){
    const on = !!S().ui.guias;
    document.body.classList.toggle('guias', on);
    $('#btnGuias').classList.toggle('on', on);
  },

  /* Deshacer aparece sólo mientras la propuesta anterior siga recuperable */
  deshacer(){
    const b = $('#btnDeshacer');
    if(b) b.hidden = !Store.respaldo;
  }
};

/* ───────────────────────── App · eventos y arranque ──────────────── */
const App = {
  dibujar(){
    Vista.secciones();
    Listas.dibujarTodas();
    Vista.gantt();
    Vista.indice();
    Texto.pintarCampos();   // después del índice: sus descripciones también son campos
    Vista.cabecera();
    Vista.portada();
    Vista.panelSecciones();
    Vista.guias();
    Vista.deshacer();
    Vista.iconos();
  },

  enfocar(lista, i){
    const el = $('[data-lista="'+lista+'"][data-i="'+i+'"]');
    if(!el) return;
    el.focus();
    const r = document.createRange(), s = window.getSelection();
    r.selectNodeContents(el); r.collapse(false);
    s.removeAllRanges(); s.addRange(r);
  },

  /* — Edición — */
  _edicion(){
    document.addEventListener('input', e => {
      if(!e.target.isContentEditable) return;
      if(Texto.registrar(e.target)) Store.guardar();
    });

    // Al salir del campo: se limpia el formato pegado y se recolorean
    // las columnas que dependen de lo escrito (por ejemplo, la criticidad).
    document.addEventListener('focusout', e => {
      const el = e.target;
      if(!el.isContentEditable) return;
      const lista = el.dataset.lista, esq = ESQUEMAS[lista];
      if(esq && esq.recolorear === el.dataset.k){ Listas.dibujar(lista); return; }
      if(!Texto.esRico(el)) return;
      Texto.limpiar(el);
      Texto.registrar(el);
      Store.guardar();
    });

    // Pegar siempre como texto plano: nada de estilos traídos de Word
    document.addEventListener('paste', e => {
      if(!e.target.isContentEditable) return;
      e.preventDefault();
      const txt = (e.clipboardData || window.clipboardData).getData('text/plain');
      document.execCommand('insertText', false, txt.replace(/\s*\n\s*/g,' '));
    });

    // Enter: en una viñeta abre el punto siguiente; en un título o celda, nada
    document.addEventListener('keydown', e => {
      if(e.key !== 'Enter' || e.shiftKey) return;
      const el = e.target;
      if(!el.isContentEditable) return;
      const lista = el.dataset.lista, esq = ESQUEMAS[lista];
      if(esq && esq.tipo === 'vinetas'){
        e.preventDefault();
        Listas.insertarDespues(lista, +el.dataset.i);
      }else if(el.closest('td, .glabel, .chip, h3.big, p.dek, .datagrid, .doctype')){
        e.preventDefault();
      }
    });
  },

  /* — Agregar, eliminar y marcar el Gantt — */
  _acciones(){
    document.addEventListener('click', e => {
      const agregar = e.target.closest('[data-agregar]');
      if(agregar){
        const lista = agregar.dataset.agregar;
        if(lista === 'gantt'){
          S().gantt.filas.push({ l:"", w:[], h:false });
          Vista.gantt(); App.enfocar('gantt', S().gantt.filas.length - 1); Store.guardar();
        }else Listas.agregar(lista);
        return;
      }

      const quitar = e.target.closest('[data-eliminar]');
      if(quitar){
        const lista = quitar.dataset.eliminar, i = +quitar.dataset.i;
        if(lista === 'gantt'){ S().gantt.filas.splice(i,1); Vista.gantt(); Store.guardar(); }
        else Listas.quitar(lista, i);
        return;
      }

      const celda = e.target.closest('[data-celda]');
      if(celda){
        const [i,w] = celda.dataset.celda.split(':').map(Number);
        const fila = S().gantt.filas[i];
        fila.w = fila.w || [];
        const pos = fila.w.indexOf(w);
        if(pos > -1) fila.w.splice(pos,1); else fila.w.push(w);
        if(e.altKey) fila.h = !fila.h;          // Alt+clic marca la fila como hito
        Vista.gantt(); Store.guardar();
      }
    });
  },

  /* — Barra de herramientas — */
  _barra(){
    $('#btnCodigo').addEventListener('click', () => {
      S().meta.codigo = Fmt.folio(); Vista.cabecera(); Store.guardar();
    });
    $('#tbCodigo').addEventListener('input', e => {
      S().meta.codigo = e.target.value; Vista.cabecera(); Store.guardar();
    });
    $('#tbFecha').addEventListener('input', e => {
      e.target.value = Fmt.fecha(e.target.value);
      S().meta.fecha = e.target.value;
      e.target.style.borderColor = (e.target.value.length === 10 && !Fmt.aFecha(e.target.value))
                                   ? "var(--signal)" : "";
      Vista.cabecera(); Store.guardar();
    });
    $('#tbVigencia').addEventListener('input', e => {
      S().meta.vigencia = e.target.value.replace(/\D/g,'');
      Vista.cabecera(); Store.guardar();
    });

    $('#ganttPeriodos').addEventListener('input', e => {
      e.target.value = e.target.value.replace(/\D/g,'');
      S().gantt.periodos = e.target.value;
      Vista.gantt(); Vista.indice(); Store.guardar();
    });
    $('#ganttUnidad').addEventListener('input', e => {
      S().gantt.unidad = e.target.value;
      Vista.gantt(); Vista.indice(); Store.guardar();
    });

    $('#btnGuias').addEventListener('click', () => {
      S().ui.guias = !S().ui.guias; Vista.guias(); Store.guardar();
    });
    $('#btnSecciones').addEventListener('click', () => {
      const p = $('#panelSecciones'); p.hidden = !p.hidden;
      $('#btnSecciones').classList.toggle('on', !p.hidden);
    });
    $('#listaSecciones').addEventListener('change', e => {
      const cb = e.target.closest('[data-capitulo]');
      if(cb) Capitulos.alternar(cb.dataset.capitulo, cb.checked);
    });
    $('#btnAyuda').addEventListener('click', () => {
      const p = $('#ayuda'); p.hidden = !p.hidden;
      $('#btnAyuda').classList.toggle('on', !p.hidden);
    });

    /* Empezar de nuevo: la plantilla original, con folio y fecha del día */
    $('#btnNuevo').addEventListener('click', () => {
      const ok = confirm(
        "¿Empezar una propuesta nueva?\n\n" +
        "El documento vuelve a su contenido original y recibe un número y una " +
        "fecha nuevos. Se pierde todo lo que escribió en esta propuesta.\n\n" +
        "Si se arrepiente, el botón Deshacer la recupera mientras no escriba nada."
      );
      if(!ok) return;
      Store.reiniciar();
      this.dibujar();
      Vista.estado("· propuesta nueva " + Fmt.hora());
    });
    $('#btnDeshacer').addEventListener('click', () => {
      if(Store.deshacer()){
        this.dibujar();
        Vista.estado("· se recuperó la propuesta anterior");
      }else{
        Vista.deshacer();
        Vista.estado("· ya no se puede recuperar", true);
      }
    });

    /* Foto de portada: se reduce a 1800 px antes de guardarla */
    $('#btnFoto').addEventListener('click', () => $('#fileFoto').click());
    $('#fileFoto').addEventListener('change', e => {
      const archivo = e.target.files[0];
      if(archivo) this._foto(archivo);
      e.target.value = "";
    });
    $('#btnFotoQuitar').addEventListener('click', () => {
      S().portada.img = ""; Vista.portada(); Store.guardar();
    });
    $('#rangeVelo').addEventListener('input', e => {
      S().portada.velo = +e.target.value; Vista.portada(); Store.guardar();
    });

  },

  _foto(archivo){
    const lector = new FileReader();
    lector.onload = () => {
      const im = new Image();
      im.onload = () => {
        const escala = Math.min(1, 1800 / im.width);
        const lienzo = document.createElement('canvas');
        lienzo.width  = Math.round(im.width  * escala);
        lienzo.height = Math.round(im.height * escala);
        lienzo.getContext('2d').drawImage(im, 0, 0, lienzo.width, lienzo.height);
        S().portada.img = lienzo.toDataURL('image/jpeg', 0.82);
        Vista.portada(); Store.guardar();
      };
      im.onerror = () => Vista.estado("· esa imagen no se pudo leer", true);
      im.src = lector.result;
    };
    lector.readAsDataURL(archivo);
  },

  iniciar(){
    try{ document.execCommand('styleWithCSS', false, false); }catch(e){ /* negritas como <b> */ }
    Texto.guardarOriginales();   // antes de pintar: el HTML todavía es el de fábrica
    Store.iniciar();
    this.dibujar();
    this._edicion();
    this._acciones();
    this._barra();
    Vista.estado("·");
  }
};

document.addEventListener('DOMContentLoaded', () => App.iniciar());
