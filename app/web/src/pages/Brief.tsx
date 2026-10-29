import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api, copy, type Entry, type EntrySummary } from '../api';
import Toast from '../components/Toast';
import PageHead from '../components/PageHead';

// Combines 1-3 library prompts plus your goal into one prompt to paste into Claude.
export default function Brief() {
  const [list, setList] = useState<EntrySummary[]>([]);
  const init = (useLocation().state ?? {}) as { ids?: string[]; goal?: string };
  const [picked, setPicked] = useState<string[]>((init.ids ?? []).slice(0, 3));
  const [full, setFull] = useState<Record<string, Entry>>({});
  const [goal, setGoal] = useState(init.goal ?? '');
  const [toast, setToast] = useState('');
  useEffect(() => { api.list().then(setList); }, []);
  useEffect(() => { picked.filter((id) => !full[id]).forEach((id) => api.get(id).then((e) => setFull((f) => ({ ...f, [id]: e })))); }, [picked]);

  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= 3 ? p : [...p, id]));
  const out = useMemo(() => {
    const es = picked.map((id) => full[id]).filter(Boolean);
    if (!es.length) return '';
    const head = `# Brief\n\nBuild: ${goal.trim() || '[describe what to build]'}\n\n` +
      (es.length > 1
        ? `Combine the design languages below. Use "${es[0].name}" as the primary system (tokens, type, layout). Borrow only the specific traits I list from the others, and resolve conflicts in favor of the primary.\n\n`
        : `Design in the style of "${es[0].name}" (inspired by, not a clone). Replace all placeholder content with the content for my project.\n\n`);
    return head + es.map((e, i) => `---\n\n## Reference ${i + 1}${i === 0 ? ' (primary)' : ''}: ${e.name}\n\n${e.prompt}`).join('\n\n');
  }, [picked, full, goal]);

  return (
    <div className="page">
      <PageHead eyebrow="Combine references" title="Brief builder" lede="Describe what you want to build, pick up to three references, and copy one combined prompt for Claude." />
      <div className="brief-grid">
        <div className="hero-in" style={{ ['--i' as any]: 5 }}>
          <label className="label" htmlFor="g">What are you building?</label>
          <textarea id="g" className="input" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="A pricing page for a budgeting app for freelancers…" />
          <p className="label" style={{ marginTop: 20 }}>References ({picked.length}/3) — first pick is primary</p>
          <div className="pick stagger" key={list.length}>
            {list.map((e, i) => (
              <label style={{ ['--i' as any]: i }} key={e.id} className={picked.includes(e.id) ? 'on' : ''}>
                <input type="checkbox" checked={picked.includes(e.id)} onChange={() => toggle(e.id)} />
                <span className="swatches">{e.palette.slice(0, 4).map((c) => <i key={c} style={{ background: c }} />)}</span>
                <span>{e.name}</span><span className="chip" style={{ marginLeft: 'auto' }}>{e.kind}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="hero-in" style={{ ['--i' as any]: 7 }}>
          <div className="prompt-box" style={{ marginTop: 0 }}>
            <div className="prompt-head"><h3>Combined prompt</h3><button className="btn primary sm" disabled={!out} onClick={() => copy(out).then(() => setToast('Prompt copied'))}>Copy</button></div>
            <div className="prompt-body fade-key" key={picked.join()}>{out || 'Pick at least one reference to build the prompt.'}</div>
          </div>
        </div>
      </div>
      {toast && <Toast msg={toast} onDone={() => setToast('')} />}
    </div>
  );
}
