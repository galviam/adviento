/* =====================================================================
   CONTENIDO.JS  ·  Aquí personalizas TODO el contenido del calendario.
   No necesitas tocar ningún otro archivo para cambiar textos.
   ===================================================================== */

/* ---------- 1. AJUSTES GENERALES ---------- */
const AJUSTES = {
  // Título grande de la página
  titulo: "Calendario de Adviento",

  // Línea pequeña encima del título. Pon "" para ocultarla.
  para: "Para [nombre]",

  // Mensaje de bienvenida (el \n crea un salto de línea)
  bienvenida:
    "Cada día, hasta Nochebuena, encontrarás un sobre con una sorpresa.\nÁbrelos con calma: uno al día. 🎄",

  // Firma que aparece en el pie de página. Pon "" para ocultarla.
  firma: "Con cariño, [tu nombre]",

  // Tema de color: "oscuro" (noche navideña) o "papel" (fondo claro tipo papel).
  // Para cambiar colores a tu gusto, edita las variables al principio de styles.css
  tema: "oscuro",

  // ¿Nieve de fondo activada por defecto? (cada persona puede cambiarlo en Ajustes)
  nieve: true,

  // true = los 24 sobres aparecen desordenados (siempre en el mismo orden). false = del 1 al 24.
  mezclarSobres: false,

  // Año del calendario. null = el año actual del dispositivo.
  // Ejemplo: 2026 -> antes de diciembre de 2026 hay cuenta atrás, y a partir de 2027 todo queda abierto.
  anio: null,

  // Si pones false, el "Modo prueba" desaparece del menú de Ajustes.
  // Recomendado: déjalo en true mientras pruebas y ponlo en false antes de enviárselo a alguien.
  modoPruebaDisponible: true,
};

/* ---------- 2. CONTENIDO DE LOS 24 DÍAS ----------
   Cada día es un objeto con estos campos:

     dia          (obligatorio) número del 1 al 24
     titulo       (obligatorio) título corto
     tipo         (obligatorio) "mensaje" | "frase" | "reto" | "foto" | "enlace"
     texto        (obligatorio) el contenido; \n crea salto de línea
     imagen       (opcional)    ruta a una imagen dentro de la carpeta img/, p. ej. "img/dia-12.jpg"
     altImagen    (opcional)    descripción de la imagen (accesibilidad)
     enlace       (opcional)    dirección web completa, p. ej. "https://..."
     textoEnlace  (opcional)    texto del botón del enlace

   El orden dentro de la lista no importa: cada sobre se asocia por el campo "dia".
*/
const DIAS = [
  {
    dia: 1,
    titulo: "Empieza la cuenta atrás",
    tipo: "mensaje",
    texto:
      "Hoy se abre el primer sobre y con él empieza un mes de pequeñas ilusiones. Cada día habrá algo para ti: una frase, un plan, un reto, un «gracias».\n\nDisfruta del camino hasta Nochebuena.",
  },
  {
    dia: 2,
    titulo: "Pequeñas luces",
    tipo: "frase",
    texto:
      "No hace falta una gran hoguera para dar calor: a veces basta con una vela encendida a tiempo.",
  },
  {
    dia: 3,
    titulo: "Llama a alguien",
    tipo: "reto",
    texto:
      "Hoy escribe o llama a una persona con la que hace tiempo que no hablas. No necesitas un motivo: «Me he acordado de ti» ya es suficiente.",
  },
  {
    dia: 4,
    titulo: "Gracias por tus risas",
    tipo: "mensaje",
    texto:
      "Hoy quiero darte las gracias por todas las veces que has convertido un día cualquiera en un buen recuerdo. Tu risa es una de mis cosas favoritas.",
  },
  {
    dia: 5,
    titulo: "Plan: chocolate y manta",
    tipo: "reto",
    texto:
      "Plan de hoy: chocolate caliente, manta y una peli navideña. Elige la peli antes de que acabe el día y deja el móvil lejos mientras dure.",
  },
  {
    dia: 6,
    titulo: "Lo que de verdad importa",
    tipo: "frase",
    texto:
      "Los mejores regalos casi nunca caben en una caja: tiempo, atención y una buena conversación.",
  },
  {
    dia: 7,
    titulo: "Pon banda sonora",
    tipo: "enlace",
    texto:
      "Hoy toca música. Pulsa el botón, elige una lista de villancicos y deja que suene mientras haces lo que más te apetezca.",
    enlace: "https://www.youtube.com/results?search_query=villancicos",
    textoEnlace: "Buscar villancicos",
  },
  {
    dia: 8,
    titulo: "Tres cosas buenas",
    tipo: "reto",
    texto:
      "Antes de dormir, escribe tres cosas buenas que te hayan pasado hoy. Pueden ser enormes o diminutas: un café bien caliente también cuenta.",
  },
  {
    dia: 9,
    titulo: "Gracias por estar",
    tipo: "mensaje",
    texto:
      "Gracias por estar, también en los días grises. Contigo hasta el invierno más largo se hace llevadero.",
  },
  {
    dia: 10,
    titulo: "Despacio",
    tipo: "frase",
    texto:
      "Diciembre no va de llegar a todo, sino de disfrutar de lo que sí llegas a hacer.",
  },
  {
    dia: 11,
    titulo: "Un detalle sin motivo",
    tipo: "reto",
    texto:
      "Haz hoy un pequeño detalle por alguien sin que se lo espere: una nota, un dulce, un mensaje bonito o una ayuda a tiempo.",
  },
  {
    dia: 12,
    titulo: "Un recuerdo",
    tipo: "foto",
    texto:
      "Cada foto guarda un momento que no volverá. Aquí iría una imagen vuestra.\n\n(Ejemplo: sustituye esta ilustración por una foto tuya dentro de la carpeta img/ y cambia la ruta en contenido.js.)",
    imagen: "img/ejemplo.svg",
    altImagen: "Ilustración de ejemplo de un paisaje nevado",
  },
  {
    dia: 13,
    titulo: "Plan: paseo de luces",
    tipo: "reto",
    texto:
      "Sal a pasear al anochecer y busca las luces más bonitas de tu zona. Reto extra: encuentra la casa o el escaparate más decorado.",
  },
  {
    dia: 14,
    titulo: "Receta para hoy",
    tipo: "enlace",
    texto:
      "Si te apetece, hoy puedes cocinar algo dulce. Aquí tienes un buscador de recetas navideñas para inspirarte.",
    enlace: "https://duckduckgo.com/?q=recetas+navide%C3%B1as",
    textoEnlace: "Buscar recetas",
  },
  {
    dia: 15,
    titulo: "Gracias por tu paciencia",
    tipo: "mensaje",
    texto:
      "Gracias por tu paciencia con mis prisas, mis despistes y mis cuentas atrás. Prometo bajar el ritmo en cuanto huela a turrón.",
  },
  {
    dia: 16,
    titulo: "Hogar",
    tipo: "frase",
    texto: "Casa es el sitio donde apetece quedarse a escuchar un rato más.",
  },
  {
    dia: 17,
    titulo: "Una hora sin pantallas",
    tipo: "reto",
    texto:
      "Hoy, una hora sin pantallas. Lee, dibuja, cocina, camina o simplemente mira por la ventana. Aburrirse un poco también es una forma de descansar.",
  },
  {
    dia: 18,
    titulo: "Una promesa pequeña",
    tipo: "mensaje",
    texto:
      "Para el año que viene me gustaría que nos prometiéramos algo sencillo: más tardes sin prisa y más cenas largas.",
  },
  {
    dia: 19,
    titulo: "Plan: noche de juegos",
    tipo: "reto",
    texto:
      "Plan para esta noche: juegos de mesa, cartas o un puzle. Quien pierda prepara la siguiente ronda de chocolate.",
  },
  {
    dia: 20,
    titulo: "Otro recuerdo",
    tipo: "foto",
    texto:
      "Otra imagen de ejemplo. Guarda tus fotos en la carpeta img/ (mejor ligeras, de menos de 500 KB) y escribe aquí su nombre.",
    imagen: "img/ejemplo.svg",
    altImagen: "Ilustración de ejemplo de un paisaje nevado",
  },
  {
    dia: 21,
    titulo: "La noche más larga",
    tipo: "frase",
    texto:
      "Por estas fechas llega la noche más larga del año y, justo después, la luz empieza a volver. Siempre hay un después.",
  },
  {
    dia: 22,
    titulo: "Escribe una carta",
    tipo: "reto",
    texto:
      "Escribe una carta corta a quien tú quieras (también vale a tu yo del año que viene). Cuéntale qué ha sido lo mejor de este año.",
  },
  {
    dia: 23,
    titulo: "Gracias por este año",
    tipo: "mensaje",
    texto:
      "Mañana es Nochebuena, así que hoy toca decir gracias: por los buenos ratos, por los malos que se llevaron mejor en compañía y por todo lo que aún está por venir.",
  },
  {
    dia: 24,
    titulo: "¡Feliz Nochebuena!",
    tipo: "mensaje",
    texto:
      "Has llegado al último sobre. Ojalá esta noche esté llena de buena mesa, gente querida y calma.\n\nQue tengas una Navidad preciosa. 🎄✨",
  },
];
