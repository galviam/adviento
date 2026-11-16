/* =====================================================================
   SW.JS · Service worker sencillo para que la app funcione sin conexión.
   Estrategia: "red primero, caché de respaldo". Con conexión siempre ves la
   versión más reciente (así tus cambios en contenido.js se notan enseguida);
   sin conexión se usa la copia guardada.
   ===================================================================== */
const VERSION = 'adviento-v2';   // súbelo (v2, v3...) si quieres forzar a limpiar la caché antigua

const NUCLEO = [
  './', 'index.html', 'styles.css', 'app.js', 'contenido.js', 'manifest.json',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png',
];

// Lee contenido.js para guardar también las imágenes de los días (rutas locales)
let imagenes = [];
try {
  importScripts('contenido.js');
  if (typeof DIAS !== 'undefined') {
    imagenes = DIAS.map((d) => d && d.imagen).filter((r) => typeof r === 'string' && !/^[a-z]+:/i.test(r));
  }
} catch (err) { /* si falla, las imágenes se guardan al verlas por primera vez */ }

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(VERSION).then((cache) =>
      // allSettled: si falta algún archivo, el resto se guarda igualmente
      Promise.allSettled([...new Set([...NUCLEO, ...imagenes])].map((u) => cache.add(new Request(u, { cache: 'reload' }))))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((c) => c !== VERSION).map((c) => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (evento) => {
  const peticion = evento.request;
  if (peticion.method !== 'GET') return;
  const url = new URL(peticion.url);
  const esFuente = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';

  if (esFuente) { evento.respondWith(cachePrimero(peticion)); return; }
  if (url.origin !== self.location.origin) return;   // el resto de sitios externos, sin tocar
  evento.respondWith(redPrimero(peticion));
});

async function redPrimero(peticion) {
  const cache = await caches.open(VERSION);
  try {
    const respuesta = peticion.mode === 'navigate'
      ? await fetch(peticion)
      : await fetch(peticion, { cache: 'no-cache' });   // revalida siempre con el servidor
    if (respuesta && respuesta.ok) cache.put(peticion, respuesta.clone());
    return respuesta;
  } catch (err) {
    const guardada = await cache.match(peticion, { ignoreSearch: true });
    if (guardada) return guardada;
    if (peticion.mode === 'navigate') {
      const inicio = (await cache.match('index.html')) || (await cache.match('./'));
      if (inicio) return inicio;
    }
    throw err;
  }
}

async function cachePrimero(peticion) {
  const cache = await caches.open(VERSION);
  const guardada = await cache.match(peticion);
  if (guardada) return guardada;
  try {
    const respuesta = await fetch(peticion);
    if (respuesta && (respuesta.ok || respuesta.type === 'opaque')) cache.put(peticion, respuesta.clone());
    return respuesta;
  } catch (err) {
    return Response.error();
  }
}
