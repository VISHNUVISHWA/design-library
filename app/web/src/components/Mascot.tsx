import { useEffect, useRef } from 'react';

export type Mood = 'idle' | 'wave' | 'think' | 'happy' | 'walk';

// Original blocky mascot drawn entirely in SVG; every animation is CSS or a tiny cursor-tracking effect.
export default function Mascot({ mood = 'idle', size = 120, look = true, className = '' }: { mood?: Mood; size?: number; look?: boolean; className?: string }) {
  const svg = useRef<SVGSVGElement>(null);
  const eyes = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!look || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const move = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = svg.current?.getBoundingClientRect();
        if (!r || !eyes.current) return;
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 260) * 4;
        eyes.current.style.transform = `translate(${(dx / d) * k}px, ${(dy / d) * k}px)`;
      });
    };
    window.addEventListener('mousemove', move);
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, [look]);

  return (
    <svg ref={svg} className={`mascot ${mood} ${className}`} width={size} height={size} viewBox="0 0 120 120" role="img" aria-label="Design Library mascot">
      <ellipse className="shadow" cx="60" cy="112" rx="30" ry="4.5" fill="#141413" opacity="0.18" />
      <g className="body-g">
        <g className="spark-ant">
          <path d="M60 36 V22" stroke="#c6613f" strokeWidth="3" strokeLinecap="round" />
          <path d="M60 6 L62.4 12.6 L69 15 L62.4 17.4 L60 24 L57.6 17.4 L51 15 L57.6 12.6 Z" fill="#d97757" />
        </g>
        <rect className="leg leg-l" x="36" y="88" width="13" height="19" rx="5" fill="#c6613f" />
        <rect className="leg leg-r" x="71" y="88" width="13" height="19" rx="5" fill="#c6613f" />
        <rect x="10" y="60" width="16" height="11" rx="5.5" fill="#c6613f" />
        <rect className="arm-r" x="94" y="60" width="17" height="11" rx="5.5" fill="#c6613f" />
        <rect x="22" y="34" width="76" height="58" rx="16" fill="#d97757" />
        <rect x="26" y="38" width="68" height="14" rx="7" fill="#fff" opacity="0.12" />
        <g ref={eyes} style={{ transition: 'transform 0.12s ease-out' }}>
          <rect className="eye" x="40" y="52" width="10" height="17" rx="4" fill="#141413" />
          <rect className="eye" x="70" y="52" width="10" height="17" rx="4" fill="#141413" />
        </g>
        <ellipse cx="35" cy="76" rx="6" ry="3.5" fill="#fff" opacity="0.22" />
        <ellipse cx="85" cy="76" rx="6" ry="3.5" fill="#fff" opacity="0.22" />
        <path d="M54 77 Q60 82 66 77" stroke="#141413" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}
