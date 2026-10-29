import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { marked } from 'marked';
import { api, copy, DEMO, type Entry } from '../api';
import Toast from '../components/Toast';
import JobPanel from '../components/JobPanel';
import { Split } from '../components/PageHead';

export default function EntryPage() {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const [e, setE] = useState<Entry | null>(null);
  const [shot, setShot] = useState(0);
  const [tab, setTab] = useState<'breakdown' | 'tokens' | 'edit'>('breakdown');
  const [raw, setRaw] = useState('');
  const [toast, setToast] = useState('');
  const [job, setJob] = useState<string | null>(null);

  const load = () => api.get(id).then((x) => { setE(x); setShot(0); }).catch(() => setE(null));
  useEffect(() => { load(); }, [id]);
  useEffect(() => { const h = () => { api.get(id).then(setE).catch(() => {}); }; addEventListener('library-changed', h); return () => removeEventListener('library-changed', h); }, [id]);
  useEffect(() => { if (tab === 'edit') api.raw(id).then(setRaw); }, [tab, id]);

  if (job) return <div className="page"><h1 className="page-title split"><Split text="Re-analyzing" /></h1><JobPanel jobId={job} onDone={() => { setJob(null); load(); }} /></div>;
  if (!e) return <div className="page"><p className="lede">Loading… or this entry does not exist. <Link to="/library">Back to library</Link></p></div>;

  const t = e.tokens ?? {};
  const say = (m: string) => setToast(m);
  const doCopy = (text: string, m: string) => copy(text).then(() => say(m));

  return (
    <div className="page">
      <div className="entry-head">
        <div>
          <Link to="/library" className="chip back hero-in" style={{ ['--i' as any]: 0 }}>← Library</Link>
          <h1 className="page-title split" style={{ marginTop: 12 }}><Split text={e.name} from={1} /></h1>
          <div className="chips stagger">
            <span className="chip tech">{e.kind}</span>{e.mode && <span className="chip">{e.mode}</span>}
            {e.mood.map((m) => <span key={m} className="chip">{m}</span>)}
            {e.url && <a className="chip" href={e.url} target="_blank" rel="noreferrer">{e.url.replace(/^https?:\/\//, '')} ↗</a>}
          </div>
        </div>
        <div className="chips">
          <button className="btn primary" onClick={() => doCopy(e.prompt, 'Prompt copied')} disabled={!e.prompt}>Copy prompt</button>
          {!DEMO && <button className="btn" onClick={() => api.regenerate(id).then((r) => setJob(r.jobId))}>Re-analyze</button>}
          {!DEMO && <button className="btn danger" onClick={() => { if (confirm(`Delete "${e.name}" from the library?`)) api.remove(id).then(() => nav('/library')); }}>Delete</button>}
        </div>
      </div>

      <div className="entry-grid">
        <div className="shots" data-reveal>
          {e.shots.length > 0 && <div className="shot-main"><img key={shot} className="wipe" src={e.shots[shot]} alt={`${e.name} screenshot ${shot + 1}`} /></div>}
          <div className="thumbs">{e.shots.map((s, i) => <button key={s} className={i === shot ? 'on' : ''} onClick={() => setShot(i)} aria-label={`Screenshot ${i + 1}`}><img src={s} alt="" /></button>)}</div>
        </div>
        <aside className="side" data-reveal style={{ ['--d' as any]: '120ms' }}>
          <div className="card panel"><h4>Palette</h4><div className="sw-row stagger pop">{e.palette.map((c, i) => <button key={c} style={{ ['--i' as any]: i }} className="sw-chip" onClick={() => doCopy(c, `${c} copied`)}><i style={{ background: c }} />{c}</button>)}</div></div>
          <div className="card panel"><h4>Fonts</h4><div className="chips stagger">{e.fonts.map((f) => <span key={f} className="chip">{f}</span>)}</div></div>
          <div className="card panel"><h4>Tech</h4><div className="chips stagger">{e.tech.map((f) => <span key={f} className="chip tech">{f}</span>)}</div></div>
          <div className="card panel"><h4>Tags</h4><div className="chips stagger">{e.tags.map((f) => <Link key={f} className="chip" to={`/library?tag=${f}`}>#{f}</Link>)}</div></div>
        </aside>
      </div>

      <div className="prompt-box" data-reveal>
        <div className="prompt-head"><h3>Prompt for Claude</h3><button className="btn primary sm" onClick={() => doCopy(e.prompt, 'Prompt copied')}>Copy</button></div>
        <div className="prompt-body">{e.prompt || 'No prompt yet.'}</div>
      </div>

      <div className="tabs">{(DEMO ? ['breakdown', 'tokens'] as const : ['breakdown', 'tokens', 'edit'] as const).map((k) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{k === 'edit' ? 'Edit markdown' : k === 'tokens' ? 'Measured tokens' : 'Breakdown'}</button>)}</div>
      {tab === 'breakdown' && <div key="b" className="prose tab-in" dangerouslySetInnerHTML={{ __html: marked.parse(e.body.replace(/^##\s+Design read/im, '## Design read')) as string }} />}
      {tab === 'tokens' && (
        <div className="entry-grid tab-in" style={{ marginTop: 18 }}>
          <div className="card panel"><h4>Type scale</h4><div className="kv">{(t.typeScale ?? []).map((s: any) => [<span key={s.sel + 'a'}>{s.sel.split(',')[0]}</span>, <span key={s.sel + 'b'}>{s.font} · {s.size} / {s.weight} · lh {s.lineHeight}</span>])}</div></div>
          <div className="card panel"><h4>Radii · shadows</h4><div className="kv">{(t.radii ?? []).map((r: any) => [<span key={r[0]}>radius</span>, <span key={r[0] + 'v'}>{r[0]}</span>])}{(t.shadows ?? []).map((r: any, i: number) => [<span key={i}>shadow</span>, <span key={i + 'v'}>{String(r[0]).slice(0, 70)}</span>])}</div></div>
          <div className="card panel"><h4>Motion</h4><div className="kv"><span>animated els</span><span>{t.motion?.animatedElements ?? '–'}</span><span>keyframes</span><span>{(t.motion?.keyframes ?? []).slice(0, 6).join(', ') || '–'}</span>{(t.motion?.transitions ?? []).slice(0, 4).map((r: any) => [<span key={r[0]}>transition</span>, <span key={r[0] + 'v'}>{r[0]}</span>])}</div></div>
          <div className="card panel"><h4>Layout</h4><div className="kv"><span>container</span><span>{t.layout?.containerWidths?.[0]?.[0] ?? '–'}px</span><span>page height</span><span>{t.layout?.pageHeight ?? '–'}px</span><span>sections</span><span>{t.layout?.sections?.length ?? '–'}</span></div></div>
        </div>
      )}
      {tab === 'edit' && (
        <div className="tab-in" style={{ marginTop: 16 }}>
          <textarea className="input editor" value={raw} onChange={(ev) => setRaw(ev.target.value)} spellCheck={false} />
          <p><button className="btn primary" onClick={() => api.save(id, raw).then(() => { say('Saved'); load(); })}>Save changes</button></p>
        </div>
      )}
      {toast && <Toast msg={toast} onDone={() => setToast('')} />}
    </div>
  );
}
