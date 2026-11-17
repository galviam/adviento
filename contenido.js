/* =====================================================================
   CONTENIDO.JS  ·  Aquí personalizas TODO el contenido del calendario.
   No necesitas tocar ningún otro archivo para cambiar textos ni fotos.
   ===================================================================== */

/* ---------- 1. AJUSTES GENERALES ---------- */
const AJUSTES = {
  // Título grande de la página
  titulo: "Calendario de Adviento",

  // Línea pequeña encima del título. Pon "" para ocultarla.
  para: "Para Alejandro",

  // Mensaje de bienvenida (el \n crea un salto de línea)
  bienvenida:
    "Veinticuatro sobres, veinticuatro formas de decirte te amo.\nUno cada día, hasta Nochebuena.",

  // Firma que aparece en el pie de página. Pon "" para ocultarla.
  firma: "Con todo mi amor, Amparo",

  // Tema de color: "oscuro" (noche navideña) o "papel" (fondo claro tipo papel).
  // Para cambiar colores a tu gusto, edita las variables al principio de styles.css
  tema: "oscuro",

  // ¿Nieve de fondo activada por defecto? (cada persona puede cambiarlo en Ajustes)
  nieve: true,

  // true = los 24 sobres aparecen desordenados (siempre en el mismo orden). false = del 1 al 24.
  mezclarSobres: false,

  // Año del calendario. null = el año actual del dispositivo.
  anio: null,

  // Si pones false, el "Modo prueba" desaparece del menú de Ajustes.
  // Recomendado: ponlo en false antes de enviárselo.
  modoPruebaDisponible: false,
};

/* ---------- 2. CONTENIDO DE LOS 24 DÍAS ----------
   Cada día es un objeto con estos campos:

     dia          (obligatorio) número del 1 al 24
     titulo       (obligatorio) título corto
     tipo         (obligatorio) "mensaje" | "frase" | "reto" | "foto" | "enlace" (solo organizativo: no se muestra)
     texto        (obligatorio) el contenido; \n crea salto de línea
     imagen       (opcional)    ruta de la foto, dentro de la carpeta img/
     enlace       (opcional)    dirección web completa
     textoEnlace  (opcional)    texto del botón del enlace

   FOTOS: el día 1 usa img/2.png, el día 2 usa img/3.png ... el día 24 usa img/25.png
   (img/1.png es el logo). Si un día no lleva foto, borra su línea imagen.
*/
const DIAS = [
  {
    dia: 1,
    titulo: "Empieza nuestra cuenta atrás",
    tipo: "mensaje",
    texto:
      "Primer sobre, estas nervioso?? Yo sí. Espero que te guste.\n\nVeinticuatro días para recordarte lo MUCHO que te quiero, porque hay cosas que nunca se dicen demasiadas veces.",
    imagen: "img/2.png",
  },
  {
    dia: 2,
    titulo: "Mi lugar favorito",
    tipo: "frase",
    texto:
      "Mi sitio favorito es a tu lado",
    imagen: "img/3.png",
  },
  {
    dia: 3,
    titulo: "Contigo, despacio",
    tipo: "frase",
    texto:
      "La felicidad es una tarde tranquila, una mano que busca la mia y tu risa de malvado haciéndome reír aún más.",
    imagen: "img/4.png",
  },
  {
    dia: 4,
    titulo: "Lo que más quiero",
    tipo: "frase",
    texto:
      "Que es lo que más me gusta de ti?? no sabría elegir: tu forma de mirar, de reír, de cuidar, de estar. Te quiero con todo mi corazón.",
    imagen: "img/5.png",
  },
  {
    dia: 5,
    titulo: "Mi casa",
    tipo: "frase",
    texto:
      "Eres mi casa. Da igual el sitio, la hora o el día que haya sido: cuando estoy contigo estoy en casa.",
    imagen: "img/6.png",
  },
  {
    dia: 6,
    titulo: "Gracias por quedarte",
    tipo: "frase",
    texto:
      "Gracias por quedarte, por entenderme incluso cuando no sé explicarme y por hacer más suave todo lo que pesa. Contigo, hasta lo difícil se vuelve fácil.",
    imagen: "img/7.png",
  },
  {
    dia: 7,
    titulo: "Cada mañana",
    tipo: "frase",
    texto:
      "Todas las mañanas te elegiría otra vez. Y mañana también. Y todas las que me queden.",
    imagen: "img/8.png",
  },
  {
    dia: 8,
    titulo: "Pequeños besitos",
    tipo: "frase",
    texto:
      "Me enamoro de ti en lo pequeño: en cómo me miras desde el otro lado de la mesa, en cómo me cuentas tu día, en cómo conviertes lo cotidiano en algo bonito.",
    imagen: "img/9.png",
  },
  {
    dia: 9,
    titulo: "Mi persona favorita",
    tipo: "frase",
    texto:
      "De todas las personas en del mundo, eres a quien quiero contarle mi día, a quien quiero abrazar al llegar y a quien quiero tener cerca siempre.",
    imagen: "img/10.png",
  },
  {
    dia: 10,
    titulo: "Mi guapo",
    tipo: "frase",
    texto:
      "Los días duros se solucionan muuuuuuuuuuy rápdio cuando me llamas por teléfono o nos vemos 5 minutitos.",
    imagen: "img/11.png",
  },
  {
    dia: 11,
    titulo: "Mi mejor versión",
    tipo: "frase",
    texto:
      "Contigo soy mi mejor versión: más valiente, más tranquila, más yo. Me has enseñado que querer también es cuidar, tener paciencia y reír juntos.",
    imagen: "img/12.png",
  },
  {
    dia: 12,
    titulo: "Hoy lo celebramos",
    tipo: "mensaje",
    texto:
      "Hoy celebramos nuestro primer aniversario, QUE NERVIOS. El día exacto es el 17, pero no quería esperar para celebrar por ti, por nosotros y por todo lo bonito que hemos construido en este año.\n\nGracias por absolutamente todo, cada risa, cada abrazo y  cada beso. Te amo.",
    imagen: "img/13.png",
  },
  {
    dia: 13,
    titulo: "Tu risa",
    tipo: "frase",
    texto:
      "Mi sonido favorito es tu risa. Mi sitio favorito, a tu lado. Mi hora favorita, cualquiera en la que estés.",
    imagen: "img/14.png",
  },
  {
    dia: 14,
    titulo: "Cualquier plan contigo",
    tipo: "frase",
    texto:
      "Cualquier plan contigo, hasta el más sencillo, se convierte en lo mejor del día. No necesito nada más.",
    imagen: "img/15.png",
  },
  {
    dia: 15,
    titulo: "Mi mejor casualidad",
    tipo: "frase",
    texto:
      "Si pudiera volver atrás, volvería a encontrarte. Una y mil veces. Eres lo mejor que me ha pasado.",
    imagen: "img/16.png",
  },
  {
    dia: 16,
    titulo: "Lo que no se ve",
    tipo: "frase",
    texto:
      "Hay cosas que no se ven y valen más que cualquier regalo: la paz que me das, la seguridad con la que me quieres y cómo se me ordena el mundo cuando estás cerca.",
    imagen: "img/17.png",
  },
  {
    dia: 17,
    titulo: "Un año contigo",
    tipo: "mensaje",
    texto:
      "Hoy hace un año que empezó la mejor historia del mundo.\n\nGracias por cada día a tu lado, por tu paciencia, por tu ternura y por hacerme tan feliz. Si tuviera que volver a empezar, empezaría igual, contigo.\n\nFeliz primer aniversario, mi amor. Esto es solo el principio.",
    imagen: "img/18.png",
  },
  {
    dia: 18,
    titulo: "Tu mano",
    tipo: "frase",
    texto:
      "Mi sitio favorito para dar la mano es la tuya. Cuando la coges, siento que todo va a salir bien.",
    imagen: "img/19.png",
  },
  {
    dia: 19,
    titulo: "Lo que venga",
    tipo: "frase",
    texto:
      "No sé qué nos traerá el año que viene, pero sé con quién quiero descubrirlo.",
    imagen: "img/20.png",
  },
  {
    dia: 20,
    titulo: "Tus abrazos",
    tipo: "frase",
    texto:
      "Tus abrazos son un refugio: llegan, me recogen y todo lo demás se queda fuera un ratito. Podría vivir ahí.",
    imagen: "img/21.png",
  },
  {
    dia: 21,
    titulo: "Mi luz favorita",
    tipo: "frase",
    texto:
      "Por estas fechas llega la noche más larga del año, y a tu lado hasta la noche más larga es un regalo. Eres mi luz favorita en invierno y en todas las estaciones.",
    imagen: "img/22.png",
  },
  {
    dia: 22,
    titulo: "Te quiero así",
    tipo: "frase",
    texto:
      "Te quiero en lo grande y en lo pequeño, en lo fácil y en lo difícil, en los días de fiesta y en los martes cualquiera.",
    imagen: "img/23.png",
  },
  {
    dia: 23,
    titulo: "Mi mejor regalo",
    tipo: "frase",
    texto:
      "Mañana es Nochebuena y mi mejor regalo ya lo tengo: tenerte.",
    imagen: "img/24.png",
  },
  {
    dia: 24,
    titulo: "Feliz Nochebuena, mi vida",
    tipo: "mensaje",
    texto:
      "Has llegado al último sobre, pero no a lo último que tengo para decirte.\n\nGracias por este año, por tu amor y por cada momento a tu lado. Te quiero hoy, te querré mañana y todos los días que vengan.\n\nFeliz Navidad, mi amor.",
    imagen: "img/25.png",
  },
];
