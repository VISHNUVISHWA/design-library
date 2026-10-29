import { Link } from 'react-router-dom';
import type { EntrySummary } from '../api';

export default function EntryCard({ e, i = 0 }: { e: EntrySummary; i?: number }) {
  return (
    <Link to={`/entry/${e.id}`} className="card ecard" data-reveal style={{ ['--d' as any]: `${(i % 3) * 90}ms` }}>
      <div className="cover">{e.cover && <img src={e.cover} alt={`${e.name} screenshot`} loading="lazy" />}</div>
      <div className="meta">
        <h3>{e.name}</h3>
        <div className="swatches">{e.palette.slice(0, 7).map((c) => <i key={c} style={{ background: c }} title={c} />)}</div>
        <div className="chips">
          <span className="chip tech">{e.kind}</span>
          {e.mode && <span className="chip">{e.mode}</span>}
          {e.tags.slice(0, 3).map((t) => <span key={t} className="chip">{t}</span>)}
        </div>
      </div>
    </Link>
  );
}
