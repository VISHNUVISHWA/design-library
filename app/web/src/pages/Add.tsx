import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api, DEMO } from '../api';
import JobPanel from '../components/JobPanel';
import PageHead from '../components/PageHead';
import Mascot from '../components/Mascot';

function AddForm() {
  const nav = useNavigate();
  const loc = useLocation();
  const init = (loc.state ?? {}) as { url?: string; go?: boolean; jobId?: string };
  const [tab, setTab] = useState<'url' | 'upload'>('url');
  const [url, setUrl] = useState(init.url ?? '');
  const [notes, setNotes] = useState('');
  const [name, setName] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [over, setOver] = useState(false);
  const [jobId, setJobId] = useState<string | null>(init.jobId ?? null);
  const [error, setError] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const started = useRef(false);

  const startUrl = async (u = url) => {
    setError('');
    try { setJobId((await api.capture(u, notes)).jobId); } catch (e: any) { setError(e.message); }
  };
  useEffect(() => { if (init.go && init.url && !started.current) { started.current = true; startUrl(init.url); } }, []);

  // Paste screenshots straight from the clipboard.
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const imgs = [...(e.clipboardData?.files ?? [])].filter((f) => f.type.startsWith('image/'));
      if (imgs.length) { setTab('upload'); setFiles((f) => [...f, ...imgs]); }
    };
    addEventListener('paste', onPaste);
    return () => removeEventListener('paste', onPaste);
  }, []);

  const startUpload = async () => {
    setError('');
    const fd = new FormData();
    files.forEach((f) => fd.append('files', f, f.name || 'pasted.png'));
    fd.append('name', name); fd.append('url', url); fd.append('notes', notes);
    try { setJobId((await api.upload(fd)).jobId); } catch (e: any) { setError(e.message); }
  };

  if (jobId) return <div className="page"><PageHead eyebrow="Working" title="Capturing the design" lede="You can leave this open. It takes one to three minutes." /><JobPanel jobId={jobId} onDone={(id) => nav(`/entry/${id}`)} /></div>;

  return (
    <div className="page">
      <PageHead eyebrow="New entry" title="Add a design" lede="Give Claude a live URL, or screenshots of an app. It writes the breakdown and the prompt." />
      <div className="add-grid">
      <div>
      <div className="tabs-pill hero-in" style={{ ['--i' as any]: 6 }}><button className={tab === 'url' ? 'on' : ''} onClick={() => setTab('url')}>From URL</button><button className={tab === 'upload' ? 'on' : ''} onClick={() => setTab('upload')}>Upload screenshots</button></div>

      <div className="form fade-key" key={tab}>
        {tab === 'url' ? (
          <div><label className="label" htmlFor="u">Website URL</label><input id="u" className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://stripe.com" autoFocus /></div>
        ) : (
          <>
            <div className={`drop ${over ? 'over' : ''}`} onClick={() => input.current?.click()} onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
              onDrop={(e) => { e.preventDefault(); setOver(false); setFiles((f) => [...f, ...[...e.dataTransfer.files].filter((x) => x.type.startsWith('image/'))]); }}>
              Drop screenshots here, click to browse, or paste from your clipboard
              <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => setFiles((f) => [...f, ...[...(e.target.files ?? [])]])} />
            </div>
            {files.length > 0 && <div className="previews">{files.map((f, i) => <img key={i} src={URL.createObjectURL(f)} alt="" title="Click to remove" onClick={() => setFiles(files.filter((_, j) => j !== i))} />)}</div>}
            <div><label className="label" htmlFor="n">Name of the app or site</label><input id="n" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Notion mobile app" /></div>
            <div><label className="label" htmlFor="u2">URL (optional)</label><input id="u2" className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" /></div>
          </>
        )}
        <div><label className="label" htmlFor="no">Notes for Claude (optional)</label><textarea id="no" className="input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What do you love about it? e.g. the calm pricing page, the sidebar density…" /></div>
        {error && <p className="err">{error}</p>}
        <div><button className="btn primary" disabled={tab === 'url' ? !url.trim() : !files.length} onClick={tab === 'url' ? () => startUrl() : startUpload}>{tab === 'url' ? 'Capture & analyze' : 'Analyze screenshots'}</button></div>
      </div>
      </div>
      <div className="orbit hero-in" style={{ ['--i' as any]: 8 }} aria-hidden="true">
        <div className="ring r1"><i /><i /></div>
        <div className="ring r2"><i /><i /><i /></div>
        <div className="ring r3"><i /></div>
        <Mascot size={120} mood={tab === 'url' ? 'idle' : 'think'} />
        <p>{tab === 'url' ? 'Any public website works.' : 'Hero, inner page and mobile shots work best.'}</p>
      </div>
      </div>
    </div>
  );
}

function LocalOnly() {
  return (
    <div className="page">
      <PageHead eyebrow="Read-only demo" title="Capture runs locally" lede="This public demo shows the library. Capturing a site needs a headless browser and your own Claude login, so it only works in the local app." />
      <div className="card job static hero-in" style={{ ['--i' as any]: 6, maxWidth: 680 }}>
        <Mascot size={96} mood="wave" />
        <div>
          <h3>Run it on your machine</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 0', lineHeight: 1.9 }}>
            <li>1. Open the local app (it serves on port 4317)</li>
            <li>2. Add design, then paste a URL or upload screenshots</li>
            <li>3. Claude measures the page and writes the prompt</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Add() {
  return DEMO ? <LocalOnly /> : <AddForm />;
}
