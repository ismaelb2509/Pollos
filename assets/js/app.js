/* =====================================================================
   Pollo Express Playa San Juan — lógica de la web
   ---------------------------------------------------------------------
   ⚙️  EDITA SOLO ESTE BLOQUE. Todo lo demás se actualiza solo.
   ===================================================================== */
const NEGOCIO = {
  nombre:     "Pollo Express",
  nombreLargo:"Pollo Express Fontana · Playa de San Juan",
  telefono:   "+34966765321",
  telefonoTxt:"966 76 53 21",
  whatsapp:   "",                       // pon aquí el móvil de pedidos (34XXXXXXXXX) y aparecerán los botones de WhatsApp
  email:      "polloexpressfontana@gmail.com",
  direccion:  "Av. San Sebastián, 11 · 03540 Playa de San Juan, Alicante",
  maps:       "https://maps.app.goo.gl/Ke66gbJ1sh1VKZMR8",
  mapaEmbed:  "",                       // Google Maps → Compartir → Insertar un mapa → copia el src del iframe
  instagram:  "https://www.instagram.com/polloexpressplayasanjuan/",
  video:      "assets/fotos/local.mp4", // si existe el archivo, se reproduce solo en la sección de vídeo

  /* Horario real. 0 = domingo … 6 = sábado. Cada turno es [apertura, cierre]
     en horas decimales (16.5 = 16:30). Un día sin turnos = cerrado.        */
  horario: {
    0: [[12, 16.5], [19.5, 23]],   // domingo
    1: [[12, 16.5], [19.5, 23]],   // lunes
    2: [],                         // martes: cerrado
    3: [[12, 16.5], [19.5, 23]],
    4: [[12, 16.5], [19.5, 23]],
    5: [[12, 16.5], [19.5, 23]],
    6: [[12, 16.5], [19.5, 23]]
  }
};

/* ===================================================================== */

(function () {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------------- Datos del negocio ---------------- */
  function aplicarDatos() {
    $$('[data-biz="name"]').forEach(el => { el.textContent = NEGOCIO.nombre; });
    $$('[data-biz="fullname"]').forEach(el => { el.textContent = NEGOCIO.nombreLargo; });
    $$('[data-biz="address"]').forEach(el => { el.textContent = NEGOCIO.direccion; });
    $$('[data-biz="phone"]').forEach(el => { el.textContent = NEGOCIO.telefonoTxt; });
    $$('[data-biz="email"]').forEach(el => { el.textContent = NEGOCIO.email; });

    $$('[data-tel-link]').forEach(el => { el.href = 'tel:' + NEGOCIO.telefono; });
    $$('[data-mail-link]').forEach(el => { el.href = 'mailto:' + NEGOCIO.email; });
    $$('[data-maps-link]').forEach(el => { el.href = NEGOCIO.maps; el.target = '_blank'; el.rel = 'noopener'; });
    $$('[data-ig-link]').forEach(el => { el.href = NEGOCIO.instagram; el.target = '_blank'; el.rel = 'noopener'; });

    // Los botones de WhatsApp solo aparecen si hay número configurado
    const wa = NEGOCIO.whatsapp.replace(/\D/g, '');
    $$('[data-wa-link]').forEach(el => {
      if (!wa) { el.hidden = true; return; }
      el.hidden = false;
      el.href = 'https://wa.me/' + wa + '?text=' +
        encodeURIComponent('¡Hola ' + NEGOCIO.nombre + '! Quería hacer un pedido para recoger 🍗');
      el.target = '_blank';
      el.rel = 'noopener';
    });

    const embed = $('[data-map-embed]');
    if (embed && NEGOCIO.mapaEmbed) {
      embed.src = NEGOCIO.mapaEmbed;
      embed.closest('.loc-map').classList.add('has-map');
    }

    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();
  }

  /* ---------------- Header y navegación ---------------- */
  const header = $('.site-header');
  const secciones = $$('main section[id]');
  const navLinks = $$('.nav a');

  function onScroll() {
    header.classList.toggle('is-stuck', window.scrollY > 12);
    let actual = '';
    const y = window.scrollY + 150;
    secciones.forEach(s => { if (s.offsetTop <= y) actual = s.id; });
    navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + actual));
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  const burger = $('#burger');
  const mobileNav = $('#mobile-nav');

  function cerrarMenu() {
    mobileNav.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menú');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    if (burger.getAttribute('aria-expanded') === 'true') return cerrarMenu();
    mobileNav.hidden = false;
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Cerrar menú');
    document.body.style.overflow = 'hidden';
  });
  mobileNav.addEventListener('click', e => { if (e.target.closest('a')) cerrarMenu(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !mobileNav.hidden) cerrarMenu();
    if (e.key === 'Escape') cerrarLightbox();
  });

  /* ---------------- Filtros de la carta ---------------- */
  const tabs = $$('.tab');
  const grupos = $$('.carta-grupo');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.dataset.filter;
      tabs.forEach(t => {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      grupos.forEach(g => {
        const visible = cat === 'todo' || g.dataset.cat === cat;
        g.hidden = !visible;
        if (visible) {
          g.classList.remove('is-in');
          requestAnimationFrame(() => g.classList.add('is-in'));
        }
      });
    });
  });

  /* ---------------- ¿Abierto ahora? ---------------- */
  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  function hhmm(dec) {
    const h = Math.floor(dec);
    const m = Math.round((dec - h) * 60);
    return h + ':' + String(m).padStart(2, '0');
  }

  function estadoApertura() {
    const pills = $$('[data-open-pill]');
    if (!pills.length) return;

    const ahora = new Date();
    const dia = ahora.getDay();
    const hora = ahora.getHours() + ahora.getMinutes() / 60;
    const turnos = NEGOCIO.horario[dia] || [];

    const abierto = turnos.find(t => hora >= t[0] && hora < t[1]);
    let texto, cerrado = true;

    if (abierto) {
      texto = 'Abierto ahora · hasta las ' + hhmm(abierto[1]);
      cerrado = false;
    } else {
      const siguiente = turnos.find(t => hora < t[0]);
      if (siguiente) {
        texto = 'Abrimos hoy a las ' + hhmm(siguiente[0]);
      } else {
        let d = dia, i = 0;
        do { d = (d + 1) % 7; i++; } while (!(NEGOCIO.horario[d] || []).length && i < 7);
        const prox = NEGOCIO.horario[d][0];
        texto = (i === 1 ? 'Abrimos mañana' : 'Abrimos el ' + DIAS[d]) + ' a las ' + hhmm(prox[0]);
      }
    }

    pills.forEach(p => {
      p.textContent = texto;
      p.classList.toggle('is-closed', cerrado);
    });
  }

  /* ---------------- Fotos del local con reserva ----------------
     Si todavía no está la foto real, entra la ilustración y la web
     nunca se ve rota.                                              */
  function fotosDeReserva() {
    $$('img[data-fallback]').forEach(img => {
      img.addEventListener('error', function onError() {
        img.removeEventListener('error', onError);
        img.src = img.dataset.fallback;
        img.classList.add('es-ilustracion');
      });
      if (img.complete && img.naturalWidth === 0) img.dispatchEvent(new Event('error'));
    });
  }

  /* ---------------- Vídeo del local ---------------- */
  function video() {
    const hueco = $('#video-slot');
    if (!hueco || !NEGOCIO.video) return;

    fetch(NEGOCIO.video, { method: 'HEAD' })
      .then(r => {
        if (!r.ok) return;
        const v = document.createElement('video');
        v.src = NEGOCIO.video;
        v.muted = true;
        v.loop = true;
        v.playsInline = true;
        v.autoplay = true;
        v.setAttribute('aria-label', 'Vídeo del asador');
        v.addEventListener('loadeddata', () => {
          hueco.classList.add('tiene-video');
          hueco.prepend(v);
          v.play().catch(() => { v.controls = true; });   // si el navegador no deja autoplay, mandos a la vista
        });
      })
      .catch(() => { /* sin vídeo todavía: se queda la foto de portada */ });
  }

  /* ---------------- Galería ampliable ---------------- */
  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightbox-img');
  let ultimoFoco = null;

  function abrirLightbox(src, alt) {
    if (!lightbox) return;
    ultimoFoco = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    $('#lightbox-close').focus();
  }
  function cerrarLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (ultimoFoco) ultimoFoco.focus();
  }
  $$('.gallery button').forEach(btn => {
    btn.addEventListener('click', () => {
      const img = btn.querySelector('img');
      abrirLightbox(img.currentSrc || img.src, img.alt);
    });
  });
  if (lightbox) {
    $('#lightbox-close').addEventListener('click', cerrarLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) cerrarLightbox(); });
  }

  /* ---------------- Animaciones al hacer scroll ---------------- */
  function reveals() {
    const items = $$('.reveal');
    if (!('IntersectionObserver' in window)) return items.forEach(i => i.classList.add('is-in'));
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry, idx) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => entry.target.classList.add('is-in'), Math.min(idx * 70, 320));
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .1 });
    items.forEach(i => io.observe(i));
  }

  /* ---------------- Contadores ---------------- */
  function contadores() {
    const nums = $$('[data-count]');
    if (!nums.length || !('IntersectionObserver' in window)) {
      return nums.forEach(n => { n.textContent = n.dataset.count.replace('.', ','); });
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const objetivo = parseFloat(el.dataset.count);
        const dec = parseInt(el.dataset.decimals || '0', 10);
        const t0 = performance.now();
        (function paso(t) {
          const p = Math.min((t - t0) / 1100, 1);
          el.textContent = (objetivo * (1 - Math.pow(1 - p, 3))).toFixed(dec).replace('.', ',');
          if (p < 1) requestAnimationFrame(paso);
        })(t0);
        obs.unobserve(el);
      });
    }, { threshold: .5 });
    nums.forEach(n => io.observe(n));
  }

  /* ---------------- Arranque ---------------- */
  aplicarDatos();
  fotosDeReserva();
  estadoApertura();
  video();
  reveals();
  contadores();
  onScroll();
  setInterval(estadoApertura, 60000);
})();
