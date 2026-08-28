# 🍗 Web para restaurante de pollos

Página web de una sola pantalla (*one-page*), rápida, responsive y pensada para
**convertir visitas en pedidos**. Sin frameworks, sin build, sin base de datos:
son tres archivos y se publica gratis en cualquier hosting estático.

---

## ⚡ Personalizar en 2 minutos

Abre `assets/js/app.js` y edita **solo el bloque `NEGOCIO`** de arriba del todo:

```js
const NEGOCIO = {
  nombre:    "Pollos El Brasero",                 // nombre del negocio
  telefono:  "+00000000000",                      // formato internacional
  whatsapp:  "00000000000",                       // solo dígitos: país + número
  direccion: "Calle Principal 123, Tu Ciudad",
  maps:      "https://maps.app.goo.gl/...",       // enlace a la ficha de Google
  mapaEmbed: "",                                  // src del iframe de Google Maps
  moneda:    "$",
  horario: { 0:[11,21], 1:[11,22], /* … */ }      // 0 = domingo
};
```

Eso actualiza automáticamente el nombre, los teléfonos, los enlaces de WhatsApp,
el botón «Cómo llegar», la moneda y el cartel de **Abierto / Cerrado ahora**.

### Lo que conviene tocar además

| Qué | Dónde |
|---|---|
| Platos, descripciones y precios | `index.html`, bloques `<article class="dish" …>` |
| Combos | `index.html`, sección `#combos` |
| Reseñas | `index.html`, sección `#resenas` — **cámbialas por reseñas reales de Google** |
| Fotos | `assets/img/` — sustituye los `.svg` por fotos reales con el mismo nombre |
| Datos SEO (dirección, horario) | `index.html`, bloque `application/ld+json` del `<head>` |
| Colores de marca | `assets/css/styles.css`, variables `:root` (`--ember`, `--gold`, …) |

Para añadir un plato basta con copiar un bloque `<article class="dish">` y cambiar
`data-name`, `data-price` y `data-cat` (`pollos`, `combos`, `extras`, `bebidas`).
El carrito lo detecta solo.

### Fotos reales

Las ilustraciones incluidas son SVG ligerísimos que funcionan como marcador de
posición y **nunca se ven rotos**. Cuando tengas fotos del local:

1. Recórtalas a 4:3 para el menú y 1:1 para la galería.
2. Guárdalas en `.webp` (calidad 80) y pesarán ~40 kB cada una.
3. Cambia la extensión en el `src` correspondiente de `index.html`.

---

## 🚀 Publicar

No hace falta compilar nada. Sube la carpeta tal cual:

- **GitHub Pages** — Settings → Pages → Deploy from a branch → `/ (root)`.
- **Netlify / Vercel / Cloudflare Pages** — arrastra la carpeta y listo.
- **Hosting clásico** — sube todo por FTP a `public_html`.

Para probar en local:

```bash
python3 -m http.server 8080
# abre http://localhost:8080
```

---

## ✅ Qué incluye

- **Pedido por WhatsApp**: el cliente arma su pedido con `+ Añadir`, pone nombre y
  dirección, y se abre WhatsApp con el mensaje ya escrito y el total calculado.
  El carrito se guarda en el navegador, así que no se pierde al recargar.
- **Menú con pestañas** por categorías, precios y etiquetas (*Más vendido*,
  *Picante*, *Fit*…).
- **Combos destacados** con precio tachado para empujar el ticket medio.
- **Cartel Abierto/Cerrado en vivo** calculado con el horario real.
- **Barra fija en móvil** con Llamar · Menú · Pedir, siempre a un pulgar.
- **SEO local listo**: datos estructurados `Restaurant` de Schema.org, Open Graph
  para WhatsApp y redes, metadatos y textos orientados a búsquedas del barrio.
- **Accesible**: navegación por teclado, foco visible, textos alternativos,
  contraste alto y respeto por `prefers-reduced-motion`.
- **Rápido de verdad**: sin librerías ni frameworks. HTML + CSS + JS suman ~20 kB
  comprimidos, las ilustraciones son SVG de ~1,5 kB, las imágenes cargan en diferido
  y las tipografías no bloquean el pintado (si Google Fonts tarda, entra la fuente
  del sistema y la página se ve igual de bien).

## 🗂 Estructura

```
index.html              todo el contenido y el SEO
assets/css/styles.css   diseño completo (variables de color arriba)
assets/js/app.js        configuración del negocio + carrito + interacciones
assets/img/*.svg        ilustraciones, logo, favicon e imagen para redes
```

## 🧩 Extras fáciles de añadir

- Cambiar WhatsApp por un pedido a **Glovo / Uber Eats**: sustituye los `href` de
  `[data-wa-link]`.
- **Pixel de Meta** o Google Analytics: pega el script antes de `</body>`.
- **Reservas**: se puede enchufar un formulario o un enlace a un calendario.
