# 🔥 Pollo Express Playa San Juan — web

Web de una sola página para el asador de **Av. San Sebastián, 11 (Playa de San Juan,
Alicante)**. Rápida, responsive y centrada en lo único que importa aquí: que se vea
la brasa, se lea la carta y se pulse el teléfono.

Sin carrito, sin frameworks, sin base de datos. Tres archivos y unas cuantas fotos.

---

## 📸 Fotos y logotipo

Todo lo que se ve es material real del local, sacado de las dos fotos originales:
fuera la interfaz del móvil, encuadre nuevo, enderezado y retoque de contraste,
color y brillo.

- **El logotipo es el rótulo de la fachada**, recortado y puesto derecho. Va en la
  cabecera y en el pie. El gallo del rótulo hace de icono en la pestaña.
- La **fachada** manda en la portada, y la galería lleva cuatro encuadres: fachada,
  terraza, parrilla y comedor.
- La sección **«Directo de la brasa»** va sobre la foto de la parrilla.

**Faltan las fotos de los platos y el vídeo del asador**: la lista está en
[`assets/fotos/LEEME.md`](assets/fotos/LEEME.md) con el nombre exacto de cada
archivo. Se arrastran a esa carpeta y listo, sin tocar código.

## ⚙️ Datos del negocio

Todo está en un único bloque, al principio de `assets/js/app.js`:

```js
const NEGOCIO = {
  nombre:     "Pollo Express",
  telefono:   "+34966765321",
  telefonoTxt:"966 76 53 21",
  whatsapp:   "",          // pon el móvil (34XXXXXXXXX) y aparecen los botones de WhatsApp
  direccion:  "Av. San Sebastián, 11 · 03540 Playa de San Juan, Alicante",
  maps:       "https://maps.app.goo.gl/...",
  mapaEmbed:  "",          // Google Maps → Compartir → Insertar un mapa → copia el src
  instagram:  "https://www.instagram.com/polloexpressplayasanjuan/",
  horario: { 1:[[12,16.5],[19.5,23]], 2:[] /* martes cerrado */, ... }
};
```

De ahí salen solos: los botones de llamar, el enlace de Google Maps, el Instagram,
el pie de página y el cartel **«Abierto ahora · hasta las 23:00»**, que se calcula
con el horario real —incluido el martes cerrado— y se refresca cada minuto.

## 🍗 La carta

Está en `index.html`, dentro de `<section id="carta">`. Cada plato es una línea:

```html
<li><div><b>Pollo entero</b><small>Con su jugo y alioli de la casa</small></div><span>12,50 €</span></li>
```

Para añadir una sección nueva, copia un `<section class="carta-grupo" data-cat="...">`
y añade su botón en las pestañas de arriba. Nada más.

> **Los platos son los reales**, leídos de los carteles que hay sobre la parrilla:
> entrecote de ternera, lomo alto, vacío, tira de asado, butifarrón, morcilla,
> chorizo criollo/ibérico, patata asada, patatas fritas, croquetas de jamón y de
> boletus, mix de croquetas y ensaladilla rusa. **Los precios no**: en la foto no se
> leen, así que están puestos a ojo y hay que corregirlos antes de publicar.
>
> Los menús para llevar van marcados como «propuesta» porque son idea nuestra.
>
> Las opiniones resumen los temas que más aparecen en las reseñas publicadas; no son
> citas literales. Conviene sustituirlas por reseñas textuales de la ficha de Google.

## 🚀 Publicar

No hay que compilar nada:

- **GitHub Pages** — Settings → Pages → Deploy from a branch → `/ (root)`.
- **Netlify / Vercel / Cloudflare Pages** — arrastra la carpeta.
- **Hosting clásico** — sube todo por FTP a `public_html`.

En local:

```bash
python3 -m http.server 8080   # abre http://localhost:8080
```

## ✅ Qué lleva

- **Portada con la fachada a pantalla completa**: el rótulo se ve entero y el texto
  cae debajo, sobre la zona oscura. En el móvil la foto va entera arriba y el texto
  debajo, y carga una versión de 800 px.
- **«Directo de la brasa»**: los cinco platos que más salen, en tarjetas sobre la
  foto de la parrilla.
- **Destacados** con los cinco platos que más salen.
- **Carta completa** por secciones, con pestañas y precios alineados.
- **Vídeo del asador**: en cuanto exista `assets/fotos/local.mp4` se reproduce solo,
  en bucle y sin sonido. Mientras tanto se queda la foto del comedor.
- **Galería ampliable** al tocar cualquier foto.
- **Horario completo** con el martes marcado en rojo y el estado en vivo.
- **Barra fija en el móvil**: Llamar · Carta · Cómo llegar.
- **SEO local**: datos estructurados `Restaurant` de Schema.org con la dirección,
  el teléfono y los dos turnos de cada día; Open Graph para que el enlace se vea
  bien al pegarlo en WhatsApp.
- **Accesible**: navegación por teclado, foco visible, textos alternativos y respeto
  por `prefers-reduced-motion`.
- **Ligera**: HTML + CSS + JS suman unos 20 kB comprimidos; las fotos van en JPEG
  optimizado y cargan en diferido salvo la de portada.

## 🗂 Estructura

```
index.html                contenido y SEO
assets/css/styles.css     diseño (variables de color al principio)
assets/js/app.js          datos del negocio + interacciones
assets/img/*.svg          ilustraciones de reserva (solo saltan si falta una foto)
assets/fotos/             fotos, logotipo y vídeo del local
```

## 🧩 Extras rápidos

- **WhatsApp**: rellena `whatsapp` en `NEGOCIO` y aparecen los botones solos.
- **Carta en PDF**: súbela como `assets/carta.pdf` y enlázala desde la sección.
- **Reservas o pedido online**: se puede enchufar un formulario o un enlace a Glovo
  o Uber Eats sin tocar el resto.
- **Logotipo**: el actual está recortado de la foto del rótulo. Con el archivo
  original (`.png` o `.svg`) quedaría más fino, sobre todo el gallo del icono.
