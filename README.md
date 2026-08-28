# 🔥 Pollo Express Playa San Juan — web

Web de una sola página para el asador de **Av. San Sebastián, 11 (Playa de San Juan,
Alicante)**. Rápida, responsive y centrada en lo único que importa aquí: que se vea
la brasa, se lea la carta y se pulse el teléfono.

Sin carrito, sin frameworks, sin base de datos. Tres archivos y unas cuantas fotos.

---

## 📸 Lo primero: las fotos

Las fotos y el vídeo del local van en **`assets/fotos/`** con los nombres que indica
[`assets/fotos/LEEME.md`](assets/fotos/LEEME.md). Mientras un archivo no exista, la
web muestra una ilustración de reserva hecha a medida, así que **nunca se ve rota**
ni sale un icono de imagen partida.

Cuando llegue el material real basta con arrastrarlo a esa carpeta. No hay que tocar
código.

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

> **Ojo:** los platos y precios actuales son una **carta de muestra** montada a partir
> de lo que mencionan las reseñas (pollo, costillas, secreto, patata asada, bravas,
> té moruno). Hay que sustituirla por la carta real antes de publicar.
>
> Lo mismo con las opiniones: la sección «Lo que más se repite en Google» resume los
> temas de las reseñas publicadas, no son citas literales. Conviene poner reseñas
> textuales de la ficha de Google.

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

- **Portada con foto del local a pantalla completa**, brasas animadas y el teléfono
  como botón principal.
- **Destacados** con los cinco platos que más salen.
- **Carta completa** por secciones, con pestañas y precios alineados.
- **Vídeo del asador** que se reproduce solo, en bucle y sin sonido —si no hay vídeo,
  se queda la foto de portada y no pasa nada.
- **Galería ampliable** al tocar cualquier foto.
- **Horario completo** con el martes marcado en rojo y el estado en vivo.
- **Barra fija en el móvil**: Llamar · Carta · Cómo llegar.
- **SEO local**: datos estructurados `Restaurant` de Schema.org con la dirección,
  el teléfono y los dos turnos de cada día; Open Graph para que el enlace se vea
  bien al pegarlo en WhatsApp.
- **Accesible**: navegación por teclado, foco visible, textos alternativos y respeto
  por `prefers-reduced-motion`.
- **Ligera**: HTML + CSS + JS suman unos 20 kB comprimidos.

## 🗂 Estructura

```
index.html                contenido y SEO
assets/css/styles.css     diseño (variables de color al principio)
assets/js/app.js          datos del negocio + interacciones
assets/img/*.svg          ilustraciones de reserva, logo y favicon
assets/fotos/             aquí van las fotos y el vídeo reales
```

## 🧩 Extras rápidos

- **WhatsApp**: rellena `whatsapp` en `NEGOCIO` y aparecen los botones solos.
- **Carta en PDF**: súbela como `assets/carta.pdf` y enlázala desde la sección.
- **Reservas o pedido online**: se puede enchufar un formulario o un enlace a Glovo
  o Uber Eats sin tocar el resto.
