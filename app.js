/* =====================================================================
   APP.JS · Lógica del calendario de adviento.
   Para cambiar el contenido edita contenido.js; para el aspecto, styles.css.
   Aquí solo conviene tocar los TEXTOS de la interfaz (justo debajo).
   ===================================================================== */
(() => {
  'use strict';

  /* ---------- Textos de la interfaz (edítalos o tradúcelos) ---------- */
  const TEXTOS = {
    todaviaNo: (dia) => `Todavía no 🎄 Vuelve el día ${dia} de diciembre.`,
    hoy: 'Hoy',
    sinContenido: 'Este día todavía no tiene contenido. Edita contenido.js para añadirlo.',
    estadoAntes: 'Los sobres se irán desbloqueando a partir del 1 de diciembre.',
    estadoDurante: (hoy, abiertos) => `Hoy es ${hoy} de diciembre · Has abierto ${abiertos} de 24`,
    estadoDespues: (abiertos) => `¡Feliz Navidad! 🎄 Has abierto ${abiertos} de 24`,
    reiniciarTitulo: '¿Reiniciar el progreso?',
    reiniciarTexto: 'Todos los sobres volverán a aparecer sin abrir. Esta acción no se puede deshacer.',
    reiniciarSi: 'Sí, reiniciar',
    reiniciado: 'Progreso reiniciado.',
  };

  /* ---------- Constantes y datos ---------- */
  const TOTAL = 24;
  const DICIEMBRE = 11; // en JavaScript los meses empiezan en 0 (enero = 0)
  const PREFIJO = 'adviento:';

  const AJ = (typeof AJUSTES !== 'undefined' && AJUSTES) || {};
  const LISTA = (typeof DIAS !== 'undefined' && Array.isArray(DIAS)) ? DIAS : [];
  const PRUEBA_PERMITIDA = AJ.modoPruebaDisponible !== false;
  const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');

  const $ = (id) => document.getElementById(id);

  /* ---------- Almacenamiento (localStorage con respaldo en memoria) ---------- */
  const respaldo = {};
  const almacen = {
    leer(k) { try { return localStorage.getItem(k); } catch (e) { return k in respaldo ? respaldo[k] : null; } },
    guardar(k, v) { try { localStorage.setItem(k, v); } catch (e) { respaldo[k] = v; } },
    borrar(k) { try { localStorage.removeItem(k); } catch (e) { delete respaldo[k]; } },
  };

  /* =====================================================================
     FECHAS  (todo con la hora LOCAL del dispositivo)
     ===================================================================== */

  // Año del calendario: el fijado en contenido.js o, si no, el del dispositivo.
  function anioCalendario(ahora) {
    return Number.isInteger(AJ.anio) ? AJ.anio : ahora.getFullYear();
  }

  /**
   * Calcula en qué fase está el calendario según la fecha local.
   *  - antes:   antes del 1 de diciembre -> nada disponible, cuenta atrás
   *  - durante: del 1 al 31 de diciembre -> disponible hasta min(día, 24)
   *  - despues: después de diciembre del año del calendario -> todo disponible
   * Se compara año/mes/día (no milisegundos), así los cambios de hora (horario de
   * verano) no pueden desplazar el día. Se llama de nuevo en cada acción y cada segundo,
   * por lo que el cambio de día a medianoche se detecta solo.
   */
  function calcularEstado(ahora) {
    const y = ahora.getFullYear();
    const m = ahora.getMonth();
    const d = ahora.getDate();
    const anio = anioCalendario(ahora);

    if (y < anio || (y === anio && m < DICIEMBRE)) {
      return { fase: 'antes', anio, maxDia: 0, hoy: null, inicio: new Date(anio, DICIEMBRE, 1, 0, 0, 0, 0) };
    }
    if (y === anio) {
      return { fase: 'durante', anio, maxDia: Math.min(d, TOTAL), hoy: d <= TOTAL ? d : null, inicio: null };
    }
    return { fase: 'despues', anio, maxDia: TOTAL, hoy: null, inicio: null };
  }

  /* =====================================================================
     ESTADO DEL USUARIO (guardado en este dispositivo)
     Todo vive dentro de esta función anónima: no hay variables globales
     que se puedan tocar desde la consola para abrir sobres.
     ===================================================================== */
  const claveAbiertos = () => `${PREFIJO}abiertos:${anioCalendario(new Date())}`;

  function leerAbiertos() {
    try {
      const datos = JSON.parse(almacen.leer(claveAbiertos()) || '[]');
      // Se descarta cualquier cosa que no sea un entero del 1 al 24
      return new Set((Array.isArray(datos) ? datos : []).filter((n) => Number.isInteger(n) && n >= 1 && n <= TOTAL));
    } catch (e) {
      return new Set();
    }
  }

  let abiertos = leerAbiertos();           // sobres abiertos de verdad (se guardan)
  const sesionPrueba = new Set();          // abiertos en modo prueba de días futuros (NO se guardan)
  let modoPrueba = PRUEBA_PERMITIDA && almacen.leer(`${PREFIJO}prueba`) === '1';

  const guardarAbiertos = () => almacen.guardar(claveAbiertos(), JSON.stringify([...abiertos].sort((a, b) => a - b)));

  // Un sobre cuenta como abierto solo si su día ya ha llegado (aunque alguien edite el localStorage)
  const esAbierto = (n, est) => (abiertos.has(n) && n <= est.maxDia) || (modoPrueba && sesionPrueba.has(n));

  /* =====================================================================
     CONTENIDO
     ===================================================================== */
  const contenidoDia = new Map();
  LISTA.forEach((obj) => {
    const n = Number(obj && obj.dia);
    if (Number.isInteger(n) && n >= 1 && n <= TOTAL) {
      if (contenidoDia.has(n)) console.warn(`[adviento] El día ${n} está repetido en contenido.js; se usa el último.`);
      contenidoDia.set(n, obj);
    } else {
      console.warn('[adviento] Entrada ignorada en contenido.js (campo "dia" no válido):', obj);
    }
  });
  for (let n = 1; n <= TOTAL; n++) {
    if (!contenidoDia.has(n)) console.warn(`[adviento] Falta el día ${n} en contenido.js.`);
  }

  // Solo se admiten enlaces http(s), mailto y tel (evita "javascript:" y similares)
  function urlSegura(valor, permitidos) {
    try {
      const u = new URL(String(valor), location.href);
      return permitidos.includes(u.protocol) ? u.href : null;
    } catch (e) {
      return null;
    }
  }

  /* =====================================================================
     DIBUJAR LA CUADRÍCULA
     ===================================================================== */
  const ICONO_CANDADO = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17 9V7a5 5 0 0 0-10 0v2H5v12h14V9h-2zM9 7a3 3 0 0 1 6 0v2H9V7z"/></svg>';
  const ICONO_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  // Orden de los sobres: 1..24 o mezclado con una semilla fija (siempre el mismo desorden)
  function ordenSobres() {
    const dias = Array.from({ length: TOTAL }, (_, i) => i + 1);
    if (!AJ.mezclarSobres) return dias;
    let s = (anioCalendario(new Date()) * 7919 + 13) >>> 0;
    const aleatorio = () => {           // mulberry32
      s = (s + 0x6D2B79F5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    for (let i = dias.length - 1; i > 0; i--) {
      const j = Math.floor(aleatorio() * (i + 1));
      [dias[i], dias[j]] = [dias[j], dias[i]];
    }
    return dias;
  }

  const botones = new Map(); // día -> <button>
  const rejilla = $('rejilla');

  function crearSobre(n) {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'sobre';
    b.innerHTML = `
      <span class="sobre-caja" aria-hidden="true">
        <span class="sobre-fondo"></span>
        <span class="sobre-carta"></span>
        <span class="sobre-frente"></span>
        <span class="sobre-solapa"></span>
        <span class="sobre-sello"><span class="sobre-num">${n}</span></span>
      </span>
      <span class="sobre-insignia sobre-candado" aria-hidden="true">${ICONO_CANDADO}</span>
      <span class="sobre-insignia sobre-check" aria-hidden="true">${ICONO_CHECK}</span>
      <span class="sobre-hoy" aria-hidden="true">${TEXTOS.hoy}</span>`;
    // El número del día queda "encerrado" aquí: cambiar atributos del DOM no altera qué día se abre
    b.addEventListener('click', () => intentarAbrir(n, b));
    li.appendChild(b);
    botones.set(n, b);
    return li;
  }

  ordenSobres().forEach((n) => rejilla.appendChild(crearSobre(n)));

  function etiquetaAria(n, estado, esHoy) {
    const hoy = esHoy ? ', es hoy' : '';
    if (estado === 'abierto') return `Día ${n}, abierto${hoy}. Pulsa para verlo otra vez.`;
    if (estado === 'disponible') return `Día ${n}, disponible${hoy}. Pulsa para abrir.`;
    return `Día ${n}, bloqueado. Disponible el ${n} de diciembre.`;
  }

  // Refresca el aspecto de los 24 sobres sin recrearlos (así no se pierde el foco)
  function actualizar() {
    const est = calcularEstado(new Date());
    const max = modoPrueba ? TOTAL : est.maxDia;
    let cuantos = 0;

    botones.forEach((b, n) => {
      const abierto = esAbierto(n, est);
      if (abierto) cuantos++;
      const estado = abierto ? 'abierto' : (n <= max ? 'disponible' : 'bloqueado');
      const esHoy = est.hoy === n;
      b.dataset.estado = estado;
      b.dataset.hoy = esHoy ? 'si' : 'no';
      b.setAttribute('aria-disabled', estado === 'bloqueado' ? 'true' : 'false');
      b.setAttribute('aria-label', etiquetaAria(n, estado, esHoy));
    });

    $('cuenta').hidden = est.fase !== 'antes';
    $('bannerPrueba').hidden = !modoPrueba;
    $('estado').textContent =
      est.fase === 'antes' ? TEXTOS.estadoAntes :
      est.fase === 'durante' && est.hoy ? TEXTOS.estadoDurante(est.hoy, cuantos) :
      TEXTOS.estadoDespues(cuantos);
  }

  /* =====================================================================
     ABRIR UN SOBRE
     ===================================================================== */
  let ocupado = false;
  let ultimoBoton = null;

  function intentarAbrir(n, boton) {
    if (ocupado) return;

    // Se vuelve a calcular la fecha AHORA, sin fiarse de lo que muestre la pantalla
    const est = calcularEstado(new Date());
    const max = modoPrueba ? TOTAL : est.maxDia;
    if (!Number.isInteger(n) || n < 1 || n > TOTAL || n > max) {
      avisar(TEXTOS.todaviaNo(n));
      sacudir(boton);
      return;
    }

    ocupado = true;
    const abrir = () => {
      // Los días que ya han llegado se guardan; los futuros (solo posibles en modo prueba) no
      if (n <= est.maxDia) { abiertos.add(n); guardarAbiertos(); } else { sesionPrueba.add(n); }
      mostrarDia(n, boton);
      ocupado = false;
    };

    if (esAbierto(n, est) || sinMovimiento.matches) { abrir(); return; }
    boton.classList.add('abriendo');
    setTimeout(abrir, 1050); // coincide con la animación de styles.css
  }

  function sacudir(boton) {
    boton.classList.remove('sacudir');
    void boton.offsetWidth; // reinicia la animación
    boton.classList.add('sacudir');
    setTimeout(() => boton.classList.remove('sacudir'), 500);
  }

  let temporizadorAviso;
  function avisar(mensaje) {
    const el = $('aviso');
    el.textContent = '';
    requestAnimationFrame(() => {
      el.textContent = mensaje;
      el.classList.add('visible');
    });
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => el.classList.remove('visible'), 3200);
  }

  /* ---------- Ventana modal con el contenido del día ---------- */
  const dlgDia = $('dlgDia');

  function mostrarDia(n, boton) {
    ultimoBoton = boton;
    boton.classList.remove('abriendo');
    actualizar();

    const datos = contenidoDia.get(n) || { titulo: `Día ${n}`, tipo: 'mensaje', texto: TEXTOS.sinContenido };

    // Todo se inserta con textContent (nunca como HTML), así que el texto no puede inyectar código
    $('dlgDiaNum').textContent = `Día ${n} de diciembre`;
    $('dlgDiaTitulo').textContent = datos.titulo || `Día ${n}`;
    $('dlgDiaTexto').textContent = datos.texto || '';

    const figura = $('dlgDiaFigura');
    const img = $('dlgDiaImg');
    const rutaImg = datos.imagen ? urlSegura(datos.imagen, ['http:', 'https:']) : null;
    if (rutaImg) {
      img.alt = datos.altImagen || '';
      img.onerror = () => { figura.hidden = true; };
      img.onload = () => { figura.hidden = false; };
      figura.hidden = false;
      img.src = rutaImg;
    } else {
      figura.hidden = true;
      img.removeAttribute('src');
    }

    const enlace = $('dlgDiaEnlace');
    const urlEnlace = datos.enlace ? urlSegura(datos.enlace, ['http:', 'https:', 'mailto:', 'tel:']) : null;
    if (urlEnlace) {
      enlace.href = urlEnlace;
      enlace.textContent = `${datos.textoEnlace || 'Abrir enlace'} ↗`;
      enlace.hidden = false;
    } else {
      enlace.hidden = true;
      enlace.removeAttribute('href');
    }

    dlgDia.querySelector('.carta').scrollTop = 0;
    dlgDia.showModal();
  }

  /* =====================================================================
     VENTANAS: cerrar, devolver el foco, confirmar
     ===================================================================== */
  document.querySelectorAll('dialog').forEach((dlg) => {
    // Clic en el fondo oscuro = cerrar (los clics dentro de la carta no llegan con target = dialog)
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  });
  document.addEventListener('click', (e) => {
    const cierre = e.target.closest('[data-cerrar]');
    if (cierre) cierre.closest('dialog').close();
  });
  // Al cerrar, el foco vuelve al sobre (Safari no enfoca los botones al pulsarlos)
  dlgDia.addEventListener('close', () => { if (ultimoBoton) ultimoBoton.focus({ preventScroll: true }); });

  const dlgConfirmar = $('dlgConfirmar');
  function confirmar(titulo, texto, textoOk) {
    return new Promise((resolve) => {
      $('confTitulo').textContent = titulo;
      $('confTexto').textContent = texto;
      $('confOk').textContent = textoOk;
      dlgConfirmar.returnValue = '';
      const fin = () => {
        dlgConfirmar.removeEventListener('close', fin);
        resolve(dlgConfirmar.returnValue === 'ok');
      };
      dlgConfirmar.addEventListener('close', fin);
      dlgConfirmar.showModal();
    });
  }

  /* =====================================================================
     AJUSTES (nieve, modo prueba, reiniciar, instalar)
     ===================================================================== */
  const dlgAjustes = $('dlgAjustes');
  const chkNieve = $('chkNieve');
  const chkPrueba = $('chkPrueba');
  $('filaPrueba').hidden = !PRUEBA_PERMITIDA;

  $('btnAjustes').addEventListener('click', () => {
    chkNieve.checked = nieveActiva;
    chkPrueba.checked = modoPrueba;
    dlgAjustes.showModal();
  });

  chkNieve.addEventListener('change', () => {
    almacen.guardar(`${PREFIJO}nieve`, chkNieve.checked ? '1' : '0');
    activarNieve(chkNieve.checked);
  });

  chkPrueba.addEventListener('change', () => {
    if (!PRUEBA_PERMITIDA) return;
    modoPrueba = chkPrueba.checked;
    almacen.guardar(`${PREFIJO}prueba`, modoPrueba ? '1' : '0');
    if (!modoPrueba) sesionPrueba.clear();
    actualizar();
  });

  $('btnReiniciar').addEventListener('click', async () => {
    const ok = await confirmar(TEXTOS.reiniciarTitulo, TEXTOS.reiniciarTexto, TEXTOS.reiniciarSi);
    if (!ok) return;
    abiertos = new Set();
    sesionPrueba.clear();
    almacen.borrar(claveAbiertos());
    dlgAjustes.close();
    actualizar();
    avisar(TEXTOS.reiniciado);
  });

  // Botón "Instalar la app" (Chrome/Edge/Android; en iPhone: Compartir > Añadir a pantalla de inicio)
  let eventoInstalar = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    eventoInstalar = e;
    $('filaInstalar').hidden = false;
  });
  $('btnInstalar').addEventListener('click', async () => {
    if (!eventoInstalar) return;
    eventoInstalar.prompt();
    try { await eventoInstalar.userChoice; } catch (e) { /* nada */ }
    eventoInstalar = null;
    $('filaInstalar').hidden = true;
  });
  window.addEventListener('appinstalled', () => { $('filaInstalar').hidden = true; });

  /* =====================================================================
     NIEVE (los copos son <span> animados con CSS; ver styles.css)
     ===================================================================== */
  const contenedorNieve = $('nieve');
  const preferenciaNieve = almacen.leer(`${PREFIJO}nieve`);
  let nieveActiva = preferenciaNieve !== null
    ? preferenciaNieve === '1'
    : (AJ.nieve !== false && !sinMovimiento.matches);

  function activarNieve(si) {
    nieveActiva = si;
    contenedorNieve.hidden = !si;
    if (!si) { contenedorNieve.textContent = ''; return; }
    if (contenedorNieve.childElementCount) return;
    const cantidad = window.matchMedia('(max-width: 600px)').matches ? 22 : 38;
    const alea = (min, max) => min + Math.random() * (max - min);
    const trozos = document.createDocumentFragment();
    for (let i = 0; i < cantidad; i++) {
      const copo = document.createElement('span');
      copo.className = 'copo';
      copo.style.setProperty('--x', `${alea(0, 100).toFixed(1)}vw`);
      copo.style.setProperty('--s', `${alea(3, 7).toFixed(1)}px`);
      copo.style.setProperty('--o', alea(0.35, 0.85).toFixed(2));
      copo.style.setProperty('--d', `${alea(11, 22).toFixed(1)}s`);
      copo.style.setProperty('--r', `${(-alea(0, 22)).toFixed(1)}s`);   // retraso negativo: ya están cayendo al cargar
      copo.style.setProperty('--w', `${alea(-40, 40).toFixed(0)}px`);
      trozos.appendChild(copo);
    }
    contenedorNieve.appendChild(trozos);
  }

  /* =====================================================================
     CABECERA, TEMA Y CUENTA ATRÁS
     ===================================================================== */
  const tema = AJ.tema === 'papel' ? 'papel' : 'oscuro';
  document.documentElement.dataset.tema = tema;
  const metaColor = document.querySelector('meta[name="theme-color"]');
  if (metaColor) metaColor.content = tema === 'papel' ? '#f7eed9' : '#0d1a14';

  const titulo = AJ.titulo || 'Calendario de Adviento';
  $('titulo').textContent = titulo;
  document.title = titulo;
  $('para').textContent = AJ.para || '';
  $('para').hidden = !AJ.para;
  $('bienvenida').textContent = AJ.bienvenida || '';
  $('bienvenida').hidden = !AJ.bienvenida;
  $('firma').textContent = AJ.firma || '';
  $('firma').hidden = !AJ.firma;

  const dos = (n) => String(n).padStart(2, '0');
  function actualizarCuenta(est, ahora) {
    const resto = Math.max(0, Math.floor((est.inicio - ahora) / 1000));
    $('cdDias').textContent = Math.floor(resto / 86400);
    $('cdHoras').textContent = dos(Math.floor((resto % 86400) / 3600));
    $('cdMin').textContent = dos(Math.floor((resto % 3600) / 60));
    $('cdSeg').textContent = dos(resto % 60);
  }

  /* =====================================================================
     RELOJ: detecta el cambio de día (medianoche) y actualiza la cuenta atrás
     ===================================================================== */
  let claveAnterior = '';
  function tic() {
    if (document.hidden) return;
    const ahora = new Date();
    const est = calcularEstado(ahora);
    const clave = `${est.fase}|${est.anio}|${est.maxDia}|${est.hoy}`;
    if (clave !== claveAnterior) {     // cambió el día, la fase o el año
      claveAnterior = clave;
      actualizar();
    }
    if (est.fase === 'antes') actualizarCuenta(est, ahora);
  }
  setInterval(tic, 1000);
  // Al volver a la pestaña o a la app, se comprueba al instante (el móvil pausa los temporizadores)
  document.addEventListener('visibilitychange', tic);
  window.addEventListener('focus', tic);
  window.addEventListener('pageshow', tic);

  /* ---------- Arranque ---------- */
  activarNieve(nieveActiva);
  tic();

  /* ---------- PWA: service worker (solo con http/https) ---------- */
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch((err) => console.warn('[adviento] No se pudo registrar el service worker:', err));
    });
  }
})();
