import { useEffect } from 'react';

const ACCENTS = ['217,119,87', '106,155,204', '120,140,93']; // clay, blue, green

// Ambient starfield of dots at three depths: they twinkle, parallax with scroll and the pointer,
// and warm up to clay near the cursor. A few carry accent colours.
export default function Dots() {
  useEffect(() => {
    const canvas = document.getElementById('dots') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0, last = 0;
    const mouse = { x: -999, y: -999, px: 0, py: 0, tx: 0, ty: 0 };
    let stars: { x: number; y: number; z: number; r: number; tw: number; c: string | null }[] = [];

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth; h = innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((w * h) / 5200);
      stars = Array.from({ length: n }, () => {
        const z = Math.random();
        const roll = Math.random();
        return { x: Math.random() * w, y: Math.random() * h * 1.4, z, r: 0.5 + z * 1.3, tw: Math.random() * 6.28, c: roll < 0.07 ? ACCENTS[Math.floor(Math.random() * 3)] : null };
      });
    };
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const dark = document.documentElement.dataset.theme === 'dark';
      const base = dark ? '245,244,238' : '20,20,19';
      mouse.px += (mouse.tx - mouse.px) * 0.05;
      mouse.py += (mouse.ty - mouse.py) * 0.05;
      const sy = scrollY;
      const span = h * 1.4;
      for (const s of stars) {
        // Deeper stars move less: parallax by depth.
        const par = 0.08 + s.z * 0.35;
        const x = s.x - mouse.px * par * 14;
        const y = ((((s.y - sy * par - mouse.py * par * 14) % span) + span) % span) - h * 0.2;
        const tw = reduce ? 1 : 0.65 + Math.sin(t / 900 + s.tw) * 0.35;
        const d = Math.hypot(x - mouse.x, y - mouse.y);
        const near = Math.max(0, 1 - d / 140);
        const r = s.r + near * 2.2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 6.283);
        if (near > 0.02) ctx.fillStyle = `rgba(217,119,87,${0.3 + near * 0.6})`;
        else if (s.c) ctx.fillStyle = `rgba(${s.c},${(0.35 + s.z * 0.4) * tw})`;
        else ctx.fillStyle = `rgba(${base},${(dark ? 0.08 : 0.07) + s.z * (dark ? 0.16 : 0.12) * tw})`;
        ctx.fill();
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    const move = (e: MouseEvent) => {
      mouse.x = e.clientX; mouse.y = e.clientY;
      mouse.tx = e.clientX / w - 0.5; mouse.ty = e.clientY / h - 0.5;
      if (reduce && performance.now() - last > 30) { last = performance.now(); draw(0); }
    };
    resize(); draw(0);
    addEventListener('resize', resize); addEventListener('mousemove', move);
    if (reduce) addEventListener('scroll', () => draw(0), { passive: true });
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); removeEventListener('mousemove', move); };
  }, []);
  return null;
}
