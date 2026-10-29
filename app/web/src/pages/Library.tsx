import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, type EntrySummary } from '../api';
import EntryCard from '../components/EntryCard';
import Mascot from '../components/Mascot';
import PageHead from '../components/PageHead';

export default function Library() {
  const [sp, setSp] = useSearchParams();
  const q = sp.get('q') ?? '', kind = sp.get('kind') ?? '', tag = sp.get('tag') ?? '';
  const [list, setList] = useState<EntrySummary[] | null>(null);
  const [all, setAll] = useState<EntrySummary[]>([]);
  const set = (k: string, v: string) => { const n = new URLSearchParams(sp); if (v) n.set(k, v); else n.delete(k); setSp(n, { replace: true }); };

  const [tick, setTick] = useState(0);
  useEffect(() => { const h = () => setTick((n) => n + 1); addEventListener('library-changed', h); return () => removeEventListener('library-changed', h); }, []);
  useEffect(() => { api.list().then(setAll); }, [tick]);
  useEffect(() => { const t = setTimeout(() => api.list({ q, kind, tag }).then(setList), 150); return () => clearTimeout(t); }, [q, kind, tag, tick]);

  const kinds = useMemo(() => [...new Set(all.map((e) => e.kind))], [all]);
  const tags = useMemo(() => {
    const c: Record<string, number> = {};
    all.forEach((e) => e.tags.forEach((t) => (c[t] = (c[t] ?? 0) + 1)));
    return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 16).map(([t]) => t);
  }, [all]);

  return (
    <div className="page">
      <PageHead eyebrow={`${all.length} designs saved`} title="Library" lede="Search by name, tag, mood, tech or anything inside a breakdown or prompt." />
      <div className="toolbar hero-in" style={{ ['--i' as any]: 4 }}>
        <input className="input" placeholder="Search designs…  e.g. dark minimal dashboard" value={q} onChange={(e) => set('q', e.target.value)} aria-label="Search" />
        <div className="chips">
          <button className={`chip ${!kind ? 'on' : ''}`} onClick={() => set('kind', '')}>All</button>
          {kinds.map((k) => <button key={k} className={`chip ${kind === k ? 'on' : ''}`} onClick={() => set('kind', kind === k ? '' : k)}>{k}</button>)}
        </div>
      </div>
      <div className="chips stagger" key={tags.join()}>{tags.map((t, i) => <button style={{ ['--i' as any]: i }} key={t} className={`chip ${tag === t ? 'on' : ''}`} onClick={() => set('tag', tag === t ? '' : t)}>#{t}</button>)}</div>

      {list && list.length === 0 ? (
        <div className="empty"><Mascot size={110} mood="think" /><h3>Nothing here yet</h3><p>{all.length ? 'No design matches those filters.' : 'Add your first design to start the library.'}</p><Link to="/add" className="btn primary">Add a design</Link></div>
      ) : (
        <div className="grid">{(list ?? []).map((e, i) => <EntryCard key={e.id} e={e} i={i} />)}</div>
      )}
    </div>
  );
}
