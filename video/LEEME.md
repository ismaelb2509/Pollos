# Anuncio en vídeo

`anuncio.mp4` · `anuncio.webm` — 22 segundos, vertical 1080×1920, sin sonido.

Formato pensado para **Instagram Reels, TikTok y estado de WhatsApp**.

## Qué se ve

| Segundo | Plano |
|---|---|
| 0–3 | El rótulo encendido entre brasas |
| 3–6 | La fachada · «A dos calles de la playa» |
| 6–9 | La parrilla y los carteles · «Carbón de verdad» |
| 9–13 | La carta: pollo entero, entrecote, tira de asado, secreto ibérico, croquetas |
| 13–16 | El comedor · «Mesa o para llevar» |
| 16–18 | La terraza |
| 18–22 | Teléfono, dirección y horario |

Todo son **fotos reales del local**, con movimiento de cámara, brasas animadas y
rotulación. El logotipo es el propio rótulo de la fachada.

## Sin música, a propósito

Instagram y TikTok dejan poner música al subir el vídeo, y suele funcionar mejor
elegirla allí (la de tendencia del momento). Si prefieres una pista fija, se puede
montar encima.

## Un aviso sobre el formato

El `.mp4` va con códec **VP9**. Se ve perfecto en Android, en Chrome y en cualquier
ordenador, y las redes lo recodifican al subirlo. En un iPhone puede no
reproducirse directamente: en ese caso usa el `.webm`, súbelo a Instagram (que lo
convierte solo) o pásalo por cualquier conversor a H.264.

## Cómo cambiarlo

La animación está en [`fuente/anuncio.js`](fuente/anuncio.js): es un guion de
escenas dibujadas sobre un lienzo, con los tiempos al principio de cada bloque
(`ESCENAS`). Cambiar textos, orden o duración es editar ese archivo.

Cuando lleguen las **fotos y el vídeo de los platos**, lo suyo es meter dos o tres
planos de comida entre el segundo 6 y el 13: es lo que le falta para rematarlo.
