# 🎄 Calendario de Adviento

Una web de calendario de adviento con 24 sobres (del 1 al 24 de diciembre). Es HTML, CSS y JavaScript puros: **sin backend, sin build y sin librerías**. Se publica gratis con GitHub Pages y se puede instalar en el móvil como una app (PWA).

## Qué hace

- Cada sobre solo se abre **el día que le toca o días anteriores**; los futuros salen bloqueados con un aviso («Todavía no, vuelve el día X»).
- Animación de apertura (se levanta la solapa y sale la carta) y ventana con el contenido del día.
- El progreso se guarda en el dispositivo (`localStorage`).
- El día de hoy aparece destacado. Fuera de diciembre hay una **cuenta atrás** hasta el 1 de diciembre.
- La fecha se calcula con la **hora local del dispositivo**; el cambio de día a medianoche se detecta solo.
- Funciona sin conexión y se puede instalar en el móvil.

## Estructura

```
/
├── index.html       Estructura de la página
├── styles.css       Aspecto (colores y tipografías en las primeras líneas)
├── app.js           Lógica (fechas, sobres, modal, ajustes)
├── contenido.js     ← AQUÍ editas título, bienvenida y los 24 días
├── manifest.json    Datos de la PWA (nombre, colores, iconos)
├── sw.js            Service worker (modo sin conexión)
├── img/             Tus fotos de los días (dia-01.svg … dia-24.svg son de prueba)
└── icons/           Iconos de la app
```

---

## 1. Subirlo a GitHub y publicarlo con GitHub Pages

1. Entra en <https://github.com> e inicia sesión.
2. Pulsa **New** (nuevo repositorio). Ponle un nombre, por ejemplo `adviento`. Déjalo en **Public** (GitHub Pages gratis lo necesita) y pulsa **Create repository**.
3. En la página del repo pulsa **uploading an existing file**.
4. Arrastra **todo el contenido de la carpeta** (los archivos y las carpetas `img` e `icons`). Importante: `index.html` debe quedar en la raíz del repositorio, no dentro de otra carpeta.
5. Pulsa **Commit changes**.

### Activar GitHub Pages

1. En el repositorio: **Settings** → **Pages**.
2. En **Build and deployment** → **Source**, elige **Deploy from a branch**.
3. En **Branch**, elige **main** y la carpeta **/ (root)**. Pulsa **Save**.
4. Espera 1-2 minutos y recarga la página de Pages: arriba aparecerá la dirección, del tipo:

   `https://TU-USUARIO.github.io/adviento/`

Ya puedes compartir ese enlace. Cada vez que cambies un archivo en GitHub (por ejemplo `contenido.js`), la web se actualiza sola en uno o dos minutos.

---

## 2. Editar el contenido de cada día

Todo está en **`contenido.js`**.

### Título y bienvenida (al principio del archivo)

```js
const AJUSTES = {
  titulo: "Calendario de Adviento",
  para: "Para Laura",                 // línea pequeña sobre el título ("" para ocultarla)
  bienvenida: "Un sobre al día hasta Nochebuena.",
  firma: "Con cariño, Pablo",         // pie de página ("" para ocultarla)
  tema: "oscuro",                     // "oscuro" o "papel"
  nieve: true,
  mezclarSobres: false,               // true = sobres desordenados
  anio: null,                         // null = año actual
  modoPruebaDisponible: true,         // false = oculta el modo prueba
};
```

### Los 24 días

Cada día es un objeto de la lista `DIAS`:

```js
{
  dia: 7,                                   // 1 a 24 (obligatorio)
  titulo: "Pon banda sonora",               // obligatorio
  tipo: "enlace",                           // solo organizativo (no se muestra en pantalla)
  texto: "Hoy toca música…",                // obligatorio (\n = salto de línea)
  enlace: "https://…",                      // opcional
  textoEnlace: "Buscar villancicos",        // opcional (texto del botón)
}
```

Con foto:

```js
{
  dia: 12,
  titulo: "Un recuerdo",
  tipo: "foto",
  texto: "El día que…",
  imagen: "img/dia-12.jpg",                 // el archivo debe estar en la carpeta img/
  altImagen: "Los dos en la playa",         // descripción para lectores de pantalla
}
```

Consejos:

- Sube las fotos a la carpeta `img/` (en GitHub: **Add file → Upload files**). Mejor ligeras (menos de 500 KB): redúcelas antes con cualquier editor o web de compresión.
- Respeta mayúsculas y minúsculas en los nombres: `Foto.JPG` y `foto.jpg` son archivos distintos en GitHub Pages.
- El texto se muestra siempre como texto plano (no admite HTML), así que no hay que escapar nada especial.
- Si olvidas un día o el número está mal, la consola del navegador (F12) mostrará un aviso.

---

## 3. Cambiar colores y apariencia

**Colores, tipografías y tamaños**: en las primeras líneas de `styles.css` (bloque `PERSONALIZACIÓN`). Basta con cambiar los valores:

```css
:root {
  --fondo-1: #0d1a14;     /* fondo (degradado de --fondo-1 a --fondo-2) */
  --fondo-2: #1c0f13;
  --rojo: #b3202a;        /* paleta navideña */
  --verde: #1f6b45;
  --oro: #e3b85b;
  --sobre-1-a: var(--rojo);   --sobre-1-b: var(--rojo-oscuro);   /* sobres impares */
  --sobre-2-a: var(--verde);  --sobre-2-b: var(--verde-oscuro);  /* sobres pares */
  --papel: #fbf4e4;       /* color de la carta que se abre */
  --columnas: 3;          /* columnas en móvil */
}
```

- **Tema claro**: en `contenido.js` pon `tema: "papel"`. Sus colores están en el bloque `:root[data-tema="papel"]` de `styles.css`.
- **Tipografía**: el título usa «Mountains of Christmas» y el texto «Nunito» (Google Fonts). Para cambiarlas, elige otras en <https://fonts.google.com>, cambia el enlace de `index.html` y las variables `--fuente-titulo` y `--fuente-texto`.
- **Textos de la interfaz** («Todavía no…», «Hoy», etc.): al principio de `app.js`, en el objeto `TEXTOS`.
- **Etiquetas e iconos de los tipos** (Mensaje, Reto…): objeto `TIPOS` de `app.js`.
- **Nieve**: cada persona puede apagarla en **Ajustes**. Para dejarla apagada por defecto, `nieve: false` en `contenido.js`. Se desactiva sola si el dispositivo pide «reducir movimiento».
- **Iconos de la app**: sustituye los archivos de `icons/` manteniendo nombres y tamaños (192×192, 512×512, el «maskable» de 512×512 y el de iOS de 180×180).
- **Nombre de la app al instalarla**: `name` y `short_name` en `manifest.json`.

## Fotos y tipografías propias

**Fotos.** Cada día ya apunta a una imagen de prueba (`img/dia-01.svg` … `img/dia-24.svg`). Para poner la tuya: guarda la foto en `img/` (p. ej. `dia-05.jpg`, mejor de menos de 500 KB) y en `contenido.js` cambia `imagen: "img/dia-05.svg"` por `imagen: "img/dia-05.jpg"`. Si un día no lleva foto, borra sus líneas `imagen` y `altImagen`. Cualquier tipo de sobre puede llevar foto.

**Tipografías.** Los títulos y números usan **Alex Brush** (caligrafía) y el resto **Montserrat**, ambas de Google Fonts. Para cambiarlas: elige otra en <https://fonts.google.com>, sustituye el nombre en el enlace de `index.html` y en `--fuente-titulo` / `--fuente-texto` de `styles.css`. Alternativas de caligrafía: Great Vibes, Allura, Pinyon Script. Si la caligrafía se ve pequeña o grande, ajusta los `font-size` de `h1`, `.sobre-num`, `.carta h2` y `.cuenta-num`.

---

## 4. Modo prueba y reiniciar

Al pie de la página hay un botón **⚙ Ajustes** con:

- **Modo prueba**: desbloquea los 24 sobres para probar la app fuera de diciembre. Los sobres de días futuros que abras en este modo no se guardan. Mientras está activo se ve una franja dorada arriba.
- **Reiniciar progreso**: vuelve a cerrar todos los sobres (pide confirmación).
- **Nieve de fondo** y, si el navegador lo permite, **Instalar la app**.

Antes de enviárselo a alguien, pon `modoPruebaDisponible: false` en `contenido.js` para que desaparezca el modo prueba.

---

## 5. Instalarla en el móvil (PWA)

- **Android (Chrome)**: menú ⋮ → **Instalar aplicación** (o el botón del menú Ajustes).
- **iPhone (Safari)**: botón Compartir → **Añadir a pantalla de inicio**.

Una vez abierta con conexión, funciona sin internet. Con conexión siempre se muestra la versión más reciente; si cambias algo y no lo ves, cierra y abre la app (o recarga) una vez.

