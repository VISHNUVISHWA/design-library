import { useEffect, useRef, useState } from 'react';
import { createWorld } from './world';
import { api } from '../api';

const markReady = () => document.documentElement.classList.add('ready');

// First visit per session: particles gather into a sphere while a counter runs to 100%, then the veil fades.
export default function Preloader() {
  const skip = (() => {
    try { return sessionStorage.getItem('dl-loaded') === '1' || matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
  })();
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState<'load' | 'out' | 'gone'>(skip ? 'gone' : 'load');
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (skip) { markReady(); return; }
    const world = createWorld(canvas.current!, { count: 520, size: 1.1 });
    world.set({ gather: 0, scale: 0.85, speed: 1.6 });
    let real = 0, shown = 0, raf = 0;
    const start = performance.now();
    // "Real" progress comes from fonts + library data; time keeps the count honest and smooth.
    Promise.all([document.fonts.ready, api.list().catch(() => null)]).then(() => (real = 1));
    const tick = () => {
      const time = Math.min(1, (performance.now() - start) / 1900);
      const goal = Math.min(time, real ? 1 : 0.9);
      shown += (goal - shown) * 0.08;
      if (goal === 1 && shown > 0.995) shown = 1;
      setPct(Math.round(shown * 100));
      world.set({ gather: shown });
      if (shown < 1) { raf = requestAnimationFrame(tick); return; }
      try { sessionStorage.setItem('dl-loaded', '1'); } catch {}
      setTimeout(() => { setPhase('out'); world.set({ scale: 2.4, opacity: 0, speed: 3 }); markReady(); }, 350);
      setTimeout(() => { setPhase('gone'); world.destroy(); }, 1650);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); world.destroy(); };
  }, []);

  if (phase === 'gone') return null;
  return (
    <div className={`preloader ${phase}`} aria-hidden="true">
      <canvas ref={canvas} />
      <div className="pre-count">{pct}<small>%</small></div>
      <div className="pre-label">Gathering your library</div>
    </div>
  );
}
