/* =====================================================================
   Pollos El Brasero — lógica de la web
   ---------------------------------------------------------------------
   ⚙️  EDITA SOLO ESTE BLOQUE PARA PERSONALIZAR EL NEGOCIO.
   Todo lo demás se actualiza solo (teléfono, WhatsApp, mapa, nombre…).
   ===================================================================== */
const NEGOCIO = {
  nombre:     "Pollos El Brasero",
  telefono:   "+00000000000",          // en formato internacional, sin espacios
  whatsapp:   "00000000000",           // solo dígitos: país + número, sin + ni espacios
  direccion:  "Calle Principal 123, Tu Ciudad",
  maps:       "https://maps.app.goo.gl/Ke66gbJ1sh1VKZMR8",   // enlace a la ficha de Google
  mapaEmbed:  "",                      // pega aquí el src del iframe de Google Maps ("Compartir → Insertar un mapa")
  moneda:     "$",
  // Horario: 0 = domingo … 6 = sábado. [apertura, cierre] en horas decimales (22.5 = 22:30)
  horario: {
    0: [11, 21],
    1: [11, 22],
    2: [11, 22],
    3: [11, 22],
    4: [11, 22],
    5: [11, 23.5],
    6: [11, 23.5]
  }
};

/* ===================================================================== */

(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const money = n =>
    NEGOCIO.moneda + n.toFixed(2).replace('.', ',');

  /* ---------------- Datos del negocio en la página ---------------- */
  function aplicarDatosNegocio() {
    $$('[data-biz="name"]').forEach(el => { el.textContent = NEGOCIO.nombre; });
    $$('[data-biz="address"]').forEach(el => { el.textContent = NEGOCIO.direccion; });
    $$('[data-biz="phone"]').forEach(el => { el.textContent = NEGOCIO.telefono; });
    $$('[data-cur]').forEach(el => { el.textContent = NEGOCIO.moneda; });

    $$('[data-tel-link]').forEach(el => {
      el.href = 'tel:' + NEGOCIO.telefono.replace(/[^\d+]/g, '');
    });
    $$('[data-maps-link]').forEach(el => { el.href = NEGOCIO.maps; });
    $$('[data-wa-link]').forEach(el => {
      el.href = enlaceWhatsApp('¡Hola! Quiero hacer un pedido 🍗');
      el.target = '_blank';
      el.rel = 'noopener';
    });

    document.title = NEGOCIO.nombre + ' — Pollo asado a la leña | Pedidos a domicilio';

    const embed = $('[data-map-embed]');
    if (embed && NEGOCIO.mapaEmbed) {
      embed.src = NEGOCIO.mapaEmbed;
      embed.closest('.loc-map').classList.add('has-map');
    }

    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();
  }

  function enlaceWhatsApp(texto) {
    return 'https://wa.me/' + NEGOCIO.whatsapp.replace(/\D/g, '') +
           '?text=' + encodeURIComponent(texto);
  }

  /* ---------------- Header pegajoso + nav activa ---------------- */
  const header = $('.site-header');
  const secciones = $$('main section[id]');
  const navLinks = $$('.nav a');

  function onScroll() {
    header.classList.toggle('is-stuck', window.scrollY > 12);

    let actual = '';
    const y = window.scrollY + 140;
    secciones.forEach(s => { if (s.offsetTop <= y) actual = s.id; });
    navLinks.forEach(a =>
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + actual)
    );
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------- Menú móvil ---------------- */
  const burger = $('#burger');
  const mobileNav = $('#mobile-nav');

  function cerrarMenuMovil() {
    mobileNav.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menú');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    const abierto = burger.getAttribute('aria-expanded') === 'true';
    if (abierto) {
      cerrarMenuMovil();
    } else {
      mobileNav.hidden = false;
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Cerrar menú');
      document.body.style.overflow = 'hidden';
    }
  });
  mobileNav.addEventListener('click', e => {
    if (e.target.closest('a')) cerrarMenuMovil();
  });

  /* ---------------- Filtros del menú ---------------- */
  const tabs = $$('.tab');
  const platos = $$('.dish');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-pressed', t === tab ? 'true' : 'false');
      });
      const cat = tab.dataset.filter;
      platos.forEach(p => {
        const visible = p.dataset.cat === cat;
        p.hidden = !visible;
        if (visible) {
          p.classList.remove('is-in');
          requestAnimationFrame(() => p.classList.add('is-in'));
        }
      });
    });
  });

  function filtroInicial() {
    const activa = $('.tab.is-active');
    if (!activa) return;
    platos.forEach(p => { p.hidden = p.dataset.cat !== activa.dataset.filter; });
  }

  /* ---------------- Carrito ---------------- */
  const CLAVE = 'brasero-pedido-v1';
  let pedido = [];

  try {
    pedido = JSON.parse(localStorage.getItem(CLAVE) || '[]');
    if (!Array.isArray(pedido)) pedido = [];
  } catch (e) { pedido = []; }

  const fab       = $('#cart-fab');
  const contador  = $('#cart-count');
  const panel     = $('#cart');
  const backdrop  = $('#cart-backdrop');
  const lista     = $('#cart-items');
  const vacio     = $('#cart-empty');
  const pie       = $('#cart-foot');
  const totalEl   = $('#cart-total');

  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(pedido)); } catch (e) {}
  }

  const total = () => pedido.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const unidades = () => pedido.reduce((s, i) => s + i.cantidad, 0);

  function pintarCarrito() {
    const n = unidades();
    contador.textContent = n;
    fab.hidden = n === 0;

    lista.innerHTML = '';
    const hayItems = pedido.length > 0;
    vacio.hidden = hayItems;
    pie.hidden = !hayItems;
    lista.hidden = !hayItems;

    pedido.forEach((item, i) => {
      const row = document.createElement('div');
      row.className = 'cart-row';
      row.innerHTML =
        '<h4></h4>' +
        '<span class="row-price"></span>' +
        '<div class="qty">' +
          '<button type="button" data-menos aria-label="Quitar una unidad">−</button>' +
          '<span></span>' +
          '<button type="button" data-mas aria-label="Añadir una unidad">+</button>' +
          '<button type="button" class="remove" data-quitar>Quitar</button>' +
        '</div>';

      row.querySelector('h4').textContent = item.nombre;
      row.querySelector('.row-price').textContent = money(item.precio * item.cantidad);
      row.querySelector('.qty span').textContent = item.cantidad;

      row.querySelector('[data-menos]').addEventListener('click', () => cambiar(i, -1));
      row.querySelector('[data-mas]').addEventListener('click', () => cambiar(i, 1));
      row.querySelector('[data-quitar]').addEventListener('click', () => {
        pedido.splice(i, 1);
        guardar();
        pintarCarrito();
      });

      lista.appendChild(row);
    });

    totalEl.textContent = money(total());
  }

  function cambiar(i, delta) {
    pedido[i].cantidad += delta;
    if (pedido[i].cantidad <= 0) pedido.splice(i, 1);
    guardar();
    pintarCarrito();
  }

  function anadir(nombre, precio, boton) {
    const existente = pedido.find(i => i.nombre === nombre);
    if (existente) existente.cantidad += 1;
    else pedido.push({ nombre, precio, cantidad: 1 });

    guardar();
    pintarCarrito();

    fab.classList.remove('bump');
    void fab.offsetWidth;
    fab.classList.add('bump');

    if (boton && boton.classList.contains('add')) {
      const original = boton.textContent;
      boton.classList.add('is-added');
      boton.textContent = '✓ Añadido';
      setTimeout(() => {
        boton.classList.remove('is-added');
        boton.textContent = original;
      }, 1200);
    }

    toast(nombre + ' añadido a tu pedido');
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;

    const card = btn.closest('.dish');
    const nombre = btn.dataset.name || (card && card.dataset.name);
    const precio = parseFloat(btn.dataset.price || (card && card.dataset.price) || '0');
    if (!nombre || !precio) return;

    anadir(nombre, precio, btn);
  });

  function abrirCarrito() {
    panel.hidden = false;
    backdrop.hidden = false;
    fab.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const primero = panel.querySelector('input, button');
    if (primero) primero.focus();
  }
  function cerrarCarrito() {
    panel.hidden = true;
    backdrop.hidden = true;
    fab.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  fab.addEventListener('click', abrirCarrito);
  $('#cart-close').addEventListener('click', cerrarCarrito);
  backdrop.addEventListener('click', cerrarCarrito);
  $$('[data-close-cart]').forEach(el => el.addEventListener('click', cerrarCarrito));
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!panel.hidden) cerrarCarrito();
    if (!mobileNav.hidden) cerrarMenuMovil();
  });

  /* ---------------- Enviar pedido por WhatsApp ---------------- */
  $('#cart-send').addEventListener('click', () => {
    if (!pedido.length) return;

    const nombre = $('#cart-name').value.trim();
    const dir = $('#cart-addr').value.trim();

    const lineas = [
      '¡Hola ' + NEGOCIO.nombre + '! Quiero hacer este pedido:',
      ''
    ];
    pedido.forEach(i => {
      lineas.push('• ' + i.cantidad + '× ' + i.nombre + ' — ' + money(i.precio * i.cantidad));
    });
    lineas.push('');
    lineas.push('TOTAL: ' + money(total()));
    if (nombre) lineas.push('Nombre: ' + nombre);
    if (dir) lineas.push('Entrega: ' + dir);
    lineas.push('');
    lineas.push('¿Me confirmáis el tiempo, por favor? ¡Gracias!');

    window.open(enlaceWhatsApp(lineas.join('\n')), '_blank', 'noopener');
  });

  /* ---------------- Aviso flotante ---------------- */
  const toastEl = $('#toast');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 2200);
  }

  /* ---------------- ¿Abierto ahora? ---------------- */
  function estadoApertura() {
    const pill = $('#open-pill');
    if (!pill) return;

    const ahora = new Date();
    const tramo = NEGOCIO.horario[ahora.getDay()];
    const hora = ahora.getHours() + ahora.getMinutes() / 60;

    if (tramo && hora >= tramo[0] && hora < tramo[1]) {
      pill.textContent = 'Abierto ahora';
      pill.classList.remove('is-closed');
    } else {
      pill.textContent = 'Cerrado ahora';
      pill.classList.add('is-closed');
    }
  }

  /* ---------------- Animaciones al hacer scroll ---------------- */
  function reveals() {
    const items = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach(i => i.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry, idx) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => entry.target.classList.add('is-in'), Math.min(idx * 70, 350));
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .1 });
    items.forEach(i => io.observe(i));
  }

  /* ---------------- Contadores de la sección de datos ---------------- */
  function contadores() {
    const nums = $$('[data-count]');
    if (!nums.length || !('IntersectionObserver' in window)) {
      nums.forEach(n => { n.textContent = n.dataset.count.replace('.', ','); });
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const objetivo = parseFloat(el.dataset.count);
        const dec = parseInt(el.dataset.decimals || '0', 10);
        const inicio = performance.now();
        const dur = 1100;

        (function paso(t) {
          const p = Math.min((t - inicio) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (objetivo * eased).toFixed(dec).replace('.', ',');
          if (p < 1) requestAnimationFrame(paso);
        })(inicio);

        obs.unobserve(el);
      });
    }, { threshold: .5 });
    nums.forEach(n => io.observe(n));
  }

  /* ---------------- Arranque ---------------- */
  aplicarDatosNegocio();
  filtroInicial();
  pintarCarrito();
  estadoApertura();
  reveals();
  contadores();
  onScroll();
})();
