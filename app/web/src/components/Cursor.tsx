import { useEffect, useRef } from 'react';

// Small clay dot + lagging ring that swells over anything clickable. Fine pointers only.
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('has-cursor');
    const p = { x: innerWidth / 2, y: innerHeight / 2 }, r = { ...p };
    let raf = 0, hot = false, shown = false;
    const move = (e: MouseEvent) => {
      p.x = e.clientX; p.y = e.clientY;
      if (!shown) { shown = true; r.x = p.x; r.y = p.y; dot.current!.style.opacity = ring.current!.style.opacity = '1'; }
      const h = !!(e.target as Element)?.closest?.('a, button, input, textarea, select, label, [role=button]');
      if (h !== hot) { hot = h; ring.current!.classList.toggle('hot', h); }
    };
    const leave = () => { shown = false; dot.current!.style.opacity = ring.current!.style.opacity = '0'; };
    const loop = () => {
      r.x += (p.x - r.x) * 0.16; r.y += (p.y - r.y) * 0.16;
      dot.current!.style.transform = `translate(${p.x}px, ${p.y}px)`;
      ring.current!.style.transform = `translate(${r.x}px, ${r.y}px)`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener('mousemove', move);
    document.addEventListener('mouseleave', leave);
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); removeEventListener('mousemove', move); document.removeEventListener('mouseleave', leave); document.documentElement.classList.remove('has-cursor'); };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true"><i /></div>
      <div ref={dot} className="cursor-dot" aria-hidden="true"><i /></div>
    </>
  );
}
