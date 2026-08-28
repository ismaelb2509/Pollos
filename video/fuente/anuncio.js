/* =====================================================================
   Anuncio de Pollo Express Fontana — animación sobre lienzo 1080×1920
   Todo se dibuja en función de t (segundos), así el vídeo es reproducible.
   ===================================================================== */
const W = 1080, H = 1920, DUR = 22.4;

const c = document.getElementById('lienzo');
c.width = W; c.height = H;
const g = c.getContext('2d', { alpha: false });

const IMG = {};
let borrosa = null;      // versión desenfocada de la parrilla, para el fondo de la carta
let ruido = null;        // textura de grano

/* ---------------- utilidades ---------------- */
const lim = x => x < 0 ? 0 : x > 1 ? 1 : x;
const suave = x => { x = lim(x); return x * x * (3 - 2 * x); };
const salida = x => 1 - Math.pow(1 - lim(x), 3);
const mezcla = (a, b, x) => a + (b - a) * x;

function encaja(img, zoom, cx, cy) {
  const s = Math.max(W / img.width, H / img.height) * zoom;
  const w = img.width * s, h = img.height * s;
  g.drawImage(img, (W - w) * cx, (H - h) * cy, w, h);
}

function degradado(y0, y1, paradas) {
  const gr = g.createLinearGradient(0, y0, 0, y1);
  paradas.forEach(([p, col]) => gr.addColorStop(p, col));
  return gr;
}

/* Texto de titular: condensado, en crema con filo oscuro, como el rótulo */
function titular(txt, y, tam, op = {}) {
  const {
    color = null, condensa = 0.84, espaciado = 4,
    alfa = 1, peso = 'bold', filo = true, mayus = true
  } = op;
  if (alfa <= 0.01) return;
  g.save();
  g.globalAlpha = alfa;
  g.translate(W / 2, y);
  g.scale(condensa, 1);
  g.textAlign = 'center';
  g.textBaseline = 'alphabetic';
  g.font = `${peso} ${tam}px "Liberation Sans", "DejaVu Sans", Arial, sans-serif`;
  g.letterSpacing = espaciado + 'px';
  const t = mayus ? txt.toUpperCase() : txt;
  if (filo) {
    g.lineJoin = 'round';
    g.strokeStyle = 'rgba(12,7,4,.85)';
    g.lineWidth = tam * 0.13;
    g.strokeText(t, 0, 0);
  }
  g.fillStyle = color || degradado(-tam * 0.82, tam * 0.12, [
    [0, '#FFF6DC'], [.5, '#FFD98A'], [1, '#FFA83A']
  ]);
  g.fillText(t, 0, 0);
  g.restore();
}

/* Línea de apoyo: pequeña, muy espaciada */
function apoyo(txt, y, tam, alfa = 1, color = '#F2DCC4') {
  if (alfa <= 0.01) return;
  g.save();
  g.globalAlpha = alfa;
  g.textAlign = 'center';
  g.font = `bold ${tam}px "Liberation Sans", Arial, sans-serif`;
  g.letterSpacing = Math.round(tam * 0.34) + 'px';
  g.fillStyle = color;
  g.shadowColor = 'rgba(0,0,0,.8)'; g.shadowBlur = 18;
  g.fillText(txt.toUpperCase(), W / 2, y);
  g.restore();
}

function regla(y, ancho, alfa) {
  if (alfa <= 0.01) return;
  g.save();
  g.globalAlpha = alfa;
  const gr = g.createLinearGradient(W / 2 - ancho / 2, 0, W / 2 + ancho / 2, 0);
  gr.addColorStop(0, 'rgba(255,166,60,0)');
  gr.addColorStop(.5, 'rgba(255,197,61,.95)');
  gr.addColorStop(1, 'rgba(255,166,60,0)');
  g.fillStyle = gr;
  g.fillRect(W / 2 - ancho / 2, y, ancho, 3);
  g.restore();
}

/* ---------------- brasas ---------------- */
const CHISPAS = Array.from({ length: 52 }, (_, i) => {
  const r = (n) => { const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453; return x - Math.floor(x); };
  return { x: r(1), vel: 0.06 + r(2) * 0.09, fase: r(3), tam: 1.1 + r(4) * 2.6, vaiven: 20 + r(5) * 70, ritmo: 0.4 + r(6) * 1.1 };
});

function brasas(t, fuerza = 1) {
  if (fuerza <= 0.01) return;
  g.save();
  g.globalCompositeOperation = 'lighter';
  for (const p of CHISPAS) {
    const ciclo = (t * p.vel + p.fase) % 1;
    const y = H + 60 - ciclo * (H + 160);
    const x = p.x * W + Math.sin((t * p.ritmo + p.fase * 7)) * p.vaiven;
    const a = Math.sin(ciclo * Math.PI) * 0.6 * fuerza;
    if (a <= 0.02) continue;
    g.globalAlpha = a * 0.22;
    g.fillStyle = '#FF7A1E';
    g.beginPath(); g.arc(x, y, p.tam * 2.6, 0, 6.2832); g.fill();
    g.globalAlpha = a;
    g.fillStyle = '#FFD46B';
    g.beginPath(); g.arc(x, y, p.tam, 0, 6.2832); g.fill();
  }
  g.restore();
}

/* ---------------- capas de acabado ---------------- */
function viñeta() {
  const gr = g.createRadialGradient(W / 2, H * 0.46, H * 0.22, W / 2, H * 0.5, H * 0.78);
  gr.addColorStop(0, 'rgba(0,0,0,0)');
  gr.addColorStop(1, 'rgba(0,0,0,.62)');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}

function grano(t) {
  if (!ruido) return;
  g.save();
  g.globalAlpha = 0.05;
  const dx = (Math.sin(t * 51) * 0.5 + 0.5) * 200;
  const dy = (Math.cos(t * 43) * 0.5 + 0.5) * 200;
  const pat = g.createPattern(ruido, 'repeat');
  g.translate(-dx, -dy);
  g.fillStyle = pat;
  g.fillRect(0, 0, W + 400, H + 400);
  g.restore();
}

function velo(desde, hasta, a0, a1) {
  const gr = degradado(desde, hasta, [[0, `rgba(9,6,4,${a0})`], [1, `rgba(9,6,4,${a1})`]]);
  g.fillStyle = gr; g.fillRect(0, desde, W, hasta - desde);
}

/* ---------------- guion ---------------- */
/* Cada escena declara cuándo entra y cuándo sale; el solape hace el fundido. */
const ESCENAS = [
  { t0: 0,    t1: 2.9,  fin: 0.5, dibuja: ignicion },
  { t0: 2.5,  t1: 5.9,  ini: 0.5, fin: 0.5, dibuja: fachada },
  { t0: 5.5,  t1: 8.9,  ini: 0.5, fin: 0.5, dibuja: parrilla },
  { t0: 8.5,  t1: 13.5, ini: 0.5, fin: 0.5, dibuja: carta },
  { t0: 13.1, t1: 16.1, ini: 0.5, fin: 0.5, dibuja: comedor },
  { t0: 15.7, t1: 18.3, ini: 0.5, fin: 0.5, dibuja: terraza },
  { t0: 17.9, t1: DUR,  ini: 0.6, dibuja: cierre }
];

function ignicion(t, d) {
  g.fillStyle = '#080503'; g.fillRect(0, 0, W, H);
  const brillo = suave(t / 1.6);
  const gr = g.createRadialGradient(W / 2, H * 0.46, 30, W / 2, H * 0.46, H * 0.42);
  gr.addColorStop(0, `rgba(255,110,30,${0.34 * brillo})`);
  gr.addColorStop(.55, `rgba(180,60,12,${0.14 * brillo})`);
  gr.addColorStop(1, 'rgba(255,110,30,0)');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);

  brasas(t, 0.55 + brillo * 0.6);

  // el rótulo aparece creciendo un poco
  const ap = suave((t - 0.35) / 1.1);
  if (ap > 0 && IMG.rotulo) {
    const anchoBase = W * 0.82;
    const esc = mezcla(0.93, 1, salida((t - 0.35) / 1.6));
    const w = anchoBase * esc, h = w * IMG.rotulo.height / IMG.rotulo.width;
    g.save();
    g.globalAlpha = ap;
    g.shadowColor = 'rgba(255,120,30,.75)'; g.shadowBlur = 60;
    g.drawImage(IMG.rotulo, (W - w) / 2, H * 0.44 - h / 2, w, h);
    g.restore();
  }

  const ap2 = suave((t - 1.5) / 0.9);
  regla(H * 0.575, mezcla(120, 520, salida((t - 1.5) / 1.2)), ap2 * 0.9);
  apoyo('Playa de San Juan · Alicante', H * 0.625, 30, ap2, '#E9D2B6');
}

function fachada(t, d) {
  const p = t / d;
  encaja(IMG.fachada, mezcla(1.0, 1.13, suave(p)), 0.5, mezcla(0.38, 0.46, p));
  velo(H * 0.5, H, 0, 0.97);
  brasas(t + 3, 0.5);

  const a = suave((t - 0.35) / 0.8);
  const sube = mezcla(46, 0, salida((t - 0.35) / 1.1));
  g.save(); g.translate(0, sube);
  apoyo('Asador de carbón', H * 0.735, 30, a * 0.95, '#FFB25C');
  titular('A dos calles', H * 0.815, 104, { alfa: a });
  titular('de la playa', H * 0.895, 104, { alfa: a });
  g.restore();
  viñeta(); grano(t);
}

function parrilla(t, d) {
  const p = t / d;
  encaja(IMG.parrilla, mezcla(1.16, 1.0, suave(p)), 0.42, 0.5);
  velo(H * 0.44, H, 0, 0.97);
  g.fillStyle = 'rgba(120,40,6,.16)'; g.fillRect(0, 0, W, H);
  brasas(t + 7, 1.15);

  const a = suave((t - 0.4) / 0.8);
  const sube = mezcla(52, 0, salida((t - 0.4) / 1.2));
  g.save(); g.translate(0, sube);
  titular('Carbón', H * 0.75, 150, { alfa: a });
  titular('de verdad', H * 0.855, 118, { alfa: a * suave((t - 0.75) / 0.7) });
  g.restore();
  apoyo('Nada de eléctrico', H * 0.915, 29, suave((t - 1.3) / 0.8), '#E9D2B6');
  viñeta(); grano(t);
}

const PLATOS = [
  'Pollo entero a la brasa',
  'Entrecote de ternera',
  'Tira de asado',
  'Secreto ibérico',
  'Croquetas caseras'
];

function carta(t, d) {
  const p = t / d;
  encaja(borrosa || IMG.parrilla, mezcla(1.08, 1.2, p), 0.5, 0.5);
  g.fillStyle = 'rgba(10,7,5,.62)'; g.fillRect(0, 0, W, H);
  brasas(t + 11, 0.8);

  apoyo('De la brasa a la mesa', H * 0.215, 30, suave(t / 0.7), '#FFB25C');
  regla(H * 0.245, 420, suave(t / 0.9) * 0.85);

  const y0 = H * 0.345, paso = H * 0.092;
  PLATOS.forEach((nombre, i) => {
    const ini = 0.55 + i * 0.62;
    const a = suave((t - ini) / 0.5);
    if (a <= 0.01) return;
    const desliz = mezcla(60, 0, salida((t - ini) / 0.75));
    // el último en aparecer manda; los anteriores se apagan un poco
    const encendido = lim(1 - (t - ini - 0.62) / 2.4) * 0.55 + 0.45;
    g.save(); g.translate(0, desliz);
    titular(nombre, y0 + i * paso, 58, { alfa: a * encendido, espaciado: 2 });
    g.restore();
  });

  const aFin = suave((t - 3.9) / 0.7);
  apoyo('Y el té moruno, invita la casa', H * 0.845, 31, aFin, '#E9D2B6');
  viñeta(); grano(t);
}

function comedor(t, d) {
  const p = t / d;
  encaja(IMG.comedor, mezcla(1.0, 1.12, suave(p)), 0.5, 0.5);
  velo(H * 0.5, H, 0, 0.97);
  brasas(t + 17, 0.45);
  const a = suave((t - 0.3) / 0.8);
  const sube = mezcla(44, 0, salida((t - 0.3) / 1.1));
  g.save(); g.translate(0, sube);
  titular('Mesa', H * 0.775, 128, { alfa: a });
  titular('o para llevar', H * 0.875, 96, { alfa: a * suave((t - 0.6) / 0.7) });
  g.restore();
  viñeta(); grano(t);
}

function terraza(t, d) {
  const p = t / d;
  encaja(IMG.terraza, mezcla(1.14, 1.0, suave(p)), 0.5, 0.5);
  velo(H * 0.5, H, 0, 0.97);
  brasas(t + 21, 0.45);
  const a = suave((t - 0.3) / 0.8);
  titular('Terraza', H * 0.79, 120, { alfa: a });
  apoyo('a la sombra, a un paso de la arena', H * 0.855, 30, suave((t - 0.7) / 0.8), '#E9D2B6');
  viñeta(); grano(t);
}

function cierre(t, d) {
  g.fillStyle = '#0A0705'; g.fillRect(0, 0, W, H);
  const gr = g.createRadialGradient(W / 2, H * 0.56, 40, W / 2, H * 0.56, H * 0.46);
  gr.addColorStop(0, 'rgba(255,110,30,.30)');
  gr.addColorStop(.5, 'rgba(170,55,10,.12)');
  gr.addColorStop(1, 'rgba(255,110,30,0)');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  brasas(t + 27, 1.25);

  const a1 = suave(t / 0.8);
  if (IMG.rotulo) {
    const w = W * 0.78, h = w * IMG.rotulo.height / IMG.rotulo.width;
    g.save(); g.globalAlpha = a1;
    g.shadowColor = 'rgba(255,120,30,.7)'; g.shadowBlur = 55;
    g.drawImage(IMG.rotulo, (W - w) / 2, H * 0.28 - h / 2, w, h);
    g.restore();
  }

  const a2 = suave((t - 0.6) / 0.6);
  apoyo('Pide y recoge en 15 minutos', H * 0.44, 31, a2, '#FFB25C');

  const a3 = suave((t - 0.95) / 0.5);
  const late = 1 + Math.sin(Math.max(0, t - 1.6) * 2.6) * 0.012 * lim((t - 1.6) / 0.6);
  g.save();
  g.translate(W / 2, H * 0.565); g.scale(late, late); g.translate(-W / 2, -H * 0.565);
  titular('966 76 53 21', H * 0.565, 118, { alfa: a3, espaciado: 6 });
  g.restore();
  regla(H * 0.605, 560, a3 * 0.9);

  const a4 = suave((t - 1.35) / 0.6);
  apoyo('Av. San Sebastián, 11', H * 0.665, 33, a4, '#F2DCC4');
  apoyo('Playa de San Juan · Alicante', H * 0.712, 27, a4, '#C9B49C');

  const a5 = suave((t - 1.8) / 0.7);
  apoyo('Martes cerrado', H * 0.80, 25, a5 * 0.85, '#A99483');

  // fundido final a negro
  const cae = lim((t - (d - 0.7)) / 0.7);
  if (cae > 0) { g.fillStyle = `rgba(0,0,0,${cae})`; g.fillRect(0, 0, W, H); }
  grano(t);
}

/* ---------------- montaje ---------------- */
function render(t) {
  g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
  for (const e of ESCENAS) {
    if (t < e.t0 || t > e.t1) continue;
    const local = t - e.t0, dur = e.t1 - e.t0;
    let a = 1;
    if (e.ini) a *= suave(local / e.ini);
    if (e.fin) a *= suave((e.t1 - t) / e.fin);
    if (a <= 0.005) continue;
    g.save();
    g.globalAlpha = a;
    e.dibuja(local, dur);
    g.restore();
  }
}
window.render = render;
window.DUR = DUR;

/* ---------------- carga ---------------- */
async function cargar() {
  await Promise.all(Object.entries(FUENTES).map(([k, src]) => new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => { IMG[k] = im; res(); };
    im.onerror = rej;
    im.src = src;
  })));

  // parrilla desenfocada, calculada una sola vez
  const b = document.createElement('canvas');
  b.width = IMG.parrilla.width; b.height = IMG.parrilla.height;
  const bg = b.getContext('2d');
  bg.filter = 'blur(14px) brightness(.7)';
  bg.drawImage(IMG.parrilla, 0, 0);
  borrosa = b;

  // textura de grano
  const n = document.createElement('canvas');
  n.width = n.height = 220;
  const ng = n.getContext('2d');
  const d = ng.createImageData(220, 220);
  for (let i = 0; i < d.data.length; i += 4) {
    const v = 120 + Math.random() * 135;
    d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255;
  }
  ng.putImageData(d, 0, 0);
  ruido = n;

  document.body.dataset.listo = '1';
  render(0);
}

/* ---------------- grabación ---------------- */
window.grabar = (mime, bits) => new Promise(async (resolve) => {
  const flujo = c.captureStream(30);
  const mr = new MediaRecorder(flujo, { mimeType: mime, videoBitsPerSecond: bits });
  const trozos = [];
  mr.ondataavailable = e => { if (e.data && e.data.size) trozos.push(e.data); };
  const parado = new Promise(r => { mr.onstop = r; });
  const t0 = performance.now();
  mr.start(250);
  await new Promise(fin => {
    (function bucle() {
      const t = (performance.now() - t0) / 1000;
      render(Math.min(t, DUR));
      if (t >= DUR) return fin();
      requestAnimationFrame(bucle);
    })();
  });
  await new Promise(r => setTimeout(r, 300));
  mr.stop();
  await parado;
  const blob = new Blob(trozos, { type: mime });
  const buf = new Uint8Array(await blob.arrayBuffer());
  // se devuelve troceado para no ahogar el puente con el navegador
  const trozo = 700000, partes = [];
  for (let i = 0; i < buf.length; i += trozo) {
    let s = '';
    const sub = buf.subarray(i, i + trozo);
    for (let j = 0; j < sub.length; j++) s += String.fromCharCode(sub[j]);
    partes.push(btoa(s));
  }
  resolve(partes);
});

cargar();
