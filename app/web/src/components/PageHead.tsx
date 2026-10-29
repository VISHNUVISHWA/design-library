import type { ReactNode } from 'react';

// Words rise out of a soft blur, one after another (styles: .split .w).
export function Split({ text, from = 0 }: { text: string; from?: number }) {
  return <>{text.split(' ').map((w, i) => <span key={i}><span className="w" style={{ ['--i' as any]: from + i }}>{w}</span>{' '}</span>)}</>;
}

// Shared animated header for every inner page: eyebrow, split-word title, lede.
export default function PageHead({ eyebrow, title, lede, children }: { eyebrow: string; title: string; lede?: ReactNode; children?: ReactNode }) {
  const words = title.split(' ').length;
  return (
    <div className="page-head">
      <span className="eyebrow hero-in" style={{ ['--i' as any]: 0 }}>{eyebrow}</span>
      <h1 className="page-title split"><Split text={title} from={1} /></h1>
      {lede && <p className="lede hero-in" style={{ ['--i' as any]: words + 2 }}>{lede}</p>}
      {children}
    </div>
  );
}
