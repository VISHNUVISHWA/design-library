// Canvas2D particle "world": points arranged in 3D shapes, rotated and projected with perspective.
// Motion inspired by ingrassiadaniel.it, recoloured in the Claude palette.

const COLORS = [
  { hex: '#d97757', w: 0.5 }, // clay
  { hex: '#c6613f', w: 0.12 }, // clay deep
  { hex: '#6a9bcc', w: 0.14 }, // blue
  { hex: '#788c5d', w: 0.11 }, // green
  { hex: 'neutral', w: 0.13 }, // ink in light mode, cream in dark mode
];

const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
};

function sprite(hex: string) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, rgba(hex, 1));
  gr.addColorStop(0.32, rgba(hex, 0.9));
  gr.addColorStop(1, rgba(hex, 0));
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  return c;
}

type Shape = Float32Array;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

function sphere(n: number): Shape {
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), t = i * GOLDEN;
    p.set([Math.cos(t) * r, y, Math.sin(t) * r], i * 3);
  }
  return p;
}
function torus(n: number): Shape {
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const u = (i / n) * Math.PI * 2 * 13, v = i * GOLDEN * 7;
    const R = 1.05, r = 0.3 + 0.08 * Math.sin(u * 0.5);
    p.set([(R + r * Math.cos(v)) * Math.cos(u / 13), r * Math.sin(v), (R + r * Math.cos(v)) * Math.sin(u / 13)], i * 3);
  }
  return p;
}
function galaxy(n: number): Shape {
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const arm = i % 3, d = Math.pow(Math.random(), 0.7) * 1.45;
    const a = d * 3.4 + (arm * Math.PI * 2) / 3 + (Math.random() - 0.5) * 0.5;
    p.set([Math.cos(a) * d, (Math.random() - 0.5) * 0.12 * (1.6 - d), Math.sin(a) * d], i * 3);
  }
  return p;
}
function scatter(n: number, spread = 3.2): Shape {
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const t = Math.random() * Math.PI * 2, u = Math.random() * 2 - 1, r = spread * (0.6 + Math.random() * 0.4);
    const s = Math.sqrt(1 - u * u);
    p.set([Math.cos(t) * s * r, u * r, Math.sin(t) * s * r], i * 3);
  }
  return p;
}

const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));

export type World = {
  set: (s: Partial<{ morph: number; gather: number; cx: number; cy: number; scale: number; opacity: number; speed: number }>) => void;
  destroy: () => void;
};

export function createWorld(canvas: HTMLCanvasElement, { count = 700, size = 1 } = {}): World {
  const ctx = canvas.getContext('2d')!;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const shapes = [sphere(count), torus(count), galaxy(count)];
  const from = scatter(count);
  const color = new Uint8Array(count), base = new Float32Array(count), delay = new Float32Array(count), phase = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    let r = Math.random(), k = 0;
    while (k < COLORS.length - 1 && (r -= COLORS[k].w) > 0) k++;
    color[i] = k;
    base[i] = (Math.random() < 0.05 ? 2.6 + Math.random() * 2 : 0.8 + Math.random() * 1.4) * size; // a few bokeh-sized dots
    delay[i] = Math.random() * 0.45;
    phase[i] = Math.random() * Math.PI * 2;
  }
  const sprites = COLORS.map((c) => (c.hex === 'neutral' ? null : sprite(c.hex)));
  const inkSprite = sprite('#141413'), creamSprite = sprite('#f5f4ee');

  // Eased state: targets are set from outside, current values chase them each frame.
  const target = { morph: 0, gather: 1, cx: 0.5, cy: 0.5, scale: 1, opacity: 1, speed: 1 };
  const cur = { ...target };
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  let w = 0, h = 0, dpr = 1, raf = 0, rot = 0, t = 0, last = performance.now();

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = Math.max(1, w * dpr); canvas.height = Math.max(1, h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  const onMove = (e: MouseEvent) => { mouse.tx = (e.clientX / innerWidth - 0.5) * 2; mouse.ty = (e.clientY / innerHeight - 0.5) * 2; };
  addEventListener('mousemove', onMove);

  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now; t += dt;
    for (const k of Object.keys(target) as (keyof typeof target)[]) cur[k] += (target[k] - cur[k]) * Math.min(1, dt * (k === 'gather' ? 3 : 4));
    mouse.x += (mouse.tx - mouse.x) * dt * 2.5;
    mouse.y += (mouse.ty - mouse.y) * dt * 2.5;
    if (!reduce) rot += dt * 0.22 * cur.speed;

    ctx.clearRect(0, 0, w, h);
    if (cur.opacity < 0.01) { raf = requestAnimationFrame(frame); return; }
    const dark = document.documentElement.dataset.theme === 'dark';
    ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over';
    const neutral = dark ? creamSprite : inkSprite;

    const m = clamp(cur.morph, 0, shapes.length - 1);
    const a = Math.floor(m), b = Math.min(a + 1, shapes.length - 1), f = smooth(m - a);
    const A = shapes[a], B = shapes[b];
    const ry = rot + mouse.x * 0.35, rx = 0.32 + mouse.y * 0.22 + (m > 1 ? (m - 1) * 0.5 : 0);
    const cy1 = Math.cos(ry), sy1 = Math.sin(ry), cx1 = Math.cos(rx), sx1 = Math.sin(rx);
    const R = Math.min(w, h) * 0.26 * cur.scale, ox = w * cur.cx, oy = h * cur.cy, cam = 3.4;

    for (let i = 0; i < count; i++) {
      const j = i * 3;
      let x = A[j] + (B[j] - A[j]) * f, y = A[j + 1] + (B[j + 1] - A[j + 1]) * f, z = A[j + 2] + (B[j + 2] - A[j + 2]) * f;
      const g = smooth(clamp((cur.gather * 1.45 - delay[i]) / 1));
      if (g < 1) { x = from[j] + (x - from[j]) * g; y = from[j + 1] + (y - from[j + 1]) * g; z = from[j + 2] + (z - from[j + 2]) * g; }
      const br = reduce ? 0 : Math.sin(t * 0.9 + phase[i]) * 0.018;
      x += br; y += br * 0.6;
      const x1 = x * cy1 - z * sy1, z1 = x * sy1 + z * cy1;
      const y2 = y * cx1 - z1 * sx1, z2 = y * sx1 + z1 * cx1;
      const s = cam / (cam + z2);
      const px = ox + x1 * s * R, py = oy + y2 * s * R;
      const depth = clamp((1.4 - z2) / 2.8);
      const alpha = (0.18 + depth * 0.82) * cur.opacity * (dark ? 0.85 : 0.9);
      const sz = base[i] * s * (0.7 + depth * 0.6) * 2.2;
      ctx.globalAlpha = alpha;
      ctx.drawImage(sprites[color[i]] ?? neutral, px - sz, py - sz, sz * 2, sz * 2);
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  return {
    set: (s) => Object.assign(target, s),
    destroy: () => { cancelAnimationFrame(raf); ro.disconnect(); removeEventListener('mousemove', onMove); },
  };
}
