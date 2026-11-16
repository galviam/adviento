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
├── img/             Tus imágenes de los días (hay una de ejemplo)
└── icons/           Iconos de la app
```

---

## 1. Subirlo a GitHub y publicarlo con GitHub Pages

### Opción A: desde la web (sin instalar nada)

1. Entra en <https://github.com> e inicia sesión.
2. Pulsa **New** (nuevo repositorio). Ponle un nombre, por ejemplo `adviento`. Déjalo en **Public** (GitHub Pages gratis lo necesita) y pulsa **Create repository**.
3. En la página del repo pulsa **uploading an existing file**.
4. Arrastra **todo el contenido de la carpeta** (los archivos y las carpetas `img` e `icons`). Importante: `index.html` debe quedar en la raíz del repositorio, no dentro de otra carpeta.
5. Pulsa **Commit changes**.

### Opción B: con Git

```bash
cd carpeta-del-calendario
git init
git add .
git commit -m "Calendario de adviento"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/adviento.git
git push -u origin main
```

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
  tipo: "enlace",                           // mensaje | frase | reto | foto | enlace
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

---

## 6. Probarla en tu ordenador

Con Python instalado, desde la carpeta del proyecto:

```bash
python3 -m http.server 8000
```

Y abre <http://localhost:8000>. (Abrir `index.html` con doble clic también funciona, pero sin el modo sin conexión.)

---

## Sobre las fechas y la «seguridad» de los sobres

- La fecha sale de `new Date()`, es decir, del **reloj del dispositivo** y su zona horaria. Si el móvil cambia de zona o de hora, el calendario sigue ese cambio.
- La comprobación se repite **en cada clic y cada segundo**: al pasar la medianoche el sobre del nuevo día se desbloquea solo, sin recargar. Se comparan año, mes y día (no milisegundos), así los cambios de hora de verano no desplazan el día.
- No se puede abrir un sobre editando el HTML o las clases desde el navegador: al pulsar se vuelve a calcular la fecha, el contenido de un día solo se escribe en la página cuando se abre, y los datos guardados se validan al cargar (un día futuro marcado como «abierto» se ignora).
- **Límite honesto**: al ser una web estática y sin servidor, quien sepa de programación podría cambiar el reloj de su dispositivo, o leer `contenido.js` directamente desde el navegador o el propio repositorio, que es público. Es una protección contra curiosear sin querer, no contra un ataque. Si el contenido es muy secreto, no escribas en `contenido.js` nada que no quieras que se pueda leer.
- Cada dispositivo guarda su propio progreso: no se comparte entre móvil y ordenador.
- Las tipografías se cargan desde Google Fonts. Si prefieres no depender de Google, descarga las fuentes, guárdalas en el proyecto y enlázalas desde `styles.css`.
