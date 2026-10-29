import { useEffect, useRef } from 'react';
import { createWorld } from './world';

// Fixed particle world behind the home page. Scroll is the timeline: sphere -> ring -> galaxy,
// drifting from the hero's right side toward the centre while it fades back behind the content.
export default function HeroWorld() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const world = createWorld(canvas.current!, { count: 640 });
    const narrow = () => innerWidth < 860;
    world.set({ gather: 0 });
    const show = () => world.set({ gather: 1 });
    if (document.documentElement.classList.contains('ready')) setTimeout(show, 150);
    const mo = new MutationObserver(() => document.documentElement.classList.contains('ready') && show());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const p = Math.min(1, scrollY / max);
      const hero = Math.min(1, scrollY / (innerHeight * 0.9));
      world.set({
        morph: p * 2.2,
        cx: narrow() ? 0.5 : 0.75 - hero * 0.25,
        cy: narrow() ? 0.42 : 0.5,
        scale: narrow() ? 0.9 : 1.05 + hero * 0.35,
        opacity: narrow() ? 0.45 : 1 - hero * 0.62,
      });
    };
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => { world.destroy(); mo.disconnect(); removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); };
  }, []);

  return <canvas ref={canvas} className="hero-world" aria-hidden="true" />;
}
