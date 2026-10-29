import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api, type Entry, type EntrySummary } from '../api';
import PageHead from '../components/PageHead';
import Mascot from '../components/Mascot';

export default function Compare() {
  const [list, setList] = useState<EntrySummary[]>([]);
  const init = (useLocation().state ?? {}) as { ids?: string[] };
  const [ids, setIds] = useState<string[]>((init.ids ?? []).slice(0, 3));
  const [full, setFull] = useState<Entry[]>([]);
  useEffect(() => { api.list().then(setList); }, []);
  useEffect(() => { Promise.all(ids.map(api.get)).then(setFull); }, [ids]);
  const toggle = (id: string) => setIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= 3 ? p : [...p, id]));

  return (
    <div className="page">
      <PageHead eyebrow="Side by side" title="Compare" lede="Put two or three designs side by side: palette, type, tech and mood." />
      <div className="chips stagger" key={list.length}>{list.map((e, i) => <button style={{ ['--i' as any]: i }} key={e.id} className={`chip ${ids.includes(e.id) ? 'on' : ''}`} onClick={() => toggle(e.id)}>{e.name}</button>)}</div>
      {full.length === 0 && <div className="empty hero-in" style={{ ['--i' as any]: 6 }}><Mascot size={100} mood="think" /><p>Pick two or three designs above to compare them.</p></div>}
      {full.length > 0 && (
        <div className="cmp" style={{ gridTemplateColumns: `repeat(${full.length}, 1fr)`, marginTop: 24 }}>
          {full.map((e, i) => (
            <div key={e.id} className="card col col-in" style={{ ['--i' as any]: i }}>
              {e.cover && <img src={e.cover} alt={e.name} />}
              <h3>{e.name}</h3>
              <div className="sw-row stagger pop">{e.palette.map((c, k) => <span key={c} style={{ ['--i' as any]: k }} className="sw-chip"><i style={{ background: c }} />{c}</span>)}</div>
              <div className="kv"><span>mode</span><span>{e.mode ?? '–'}</span><span>fonts</span><span>{e.fonts.join(', ') || '–'}</span><span>mood</span><span>{e.mood.join(', ') || '–'}</span></div>
              <div className="chips">{e.tech.map((t) => <span key={t} className="chip tech">{t}</span>)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
