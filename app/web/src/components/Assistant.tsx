import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import { api, chat, copy, patchEntry, type ChatMsg } from '../api';
import Mascot, { type Mood } from './Mascot';

type Action = { type: string; [k: string]: any };
type Msg = ChatMsg & { error?: boolean };

const KEY = 'dl-assistant';
const ACTION_RE = /<action>([\s\S]*?)<\/action>/g;

// Pulls <action> tags out of a reply. Anything after an unfinished "<action" is hidden while streaming.
function split(raw: string) {
  const actions: Action[] = [];
  for (const m of raw.matchAll(ACTION_RE)) { try { actions.push(JSON.parse(m[1])); } catch {} }
  let text = raw.replace(ACTION_RE, '');
  const open = text.indexOf('<action');
  if (open >= 0) text = text.slice(0, open);
  return { text: text.trim(), actions };
}

const label = (a: Action) => {
  switch (a.type) {
    case 'capture_url': return `Capture ${String(a.url).replace(/^https?:\/\//, '')}`;
    case 'open_entry': return `Open ${a.id}`;
    case 'open_brief': return `Open Brief builder (${(a.ids ?? []).length} references)`;
    case 'open_compare': return `Compare ${(a.ids ?? []).length} designs`;
    case 'copy_prompt': return `Copy prompt of ${a.id}`;
    case 'update_entry': return `Update ${a.id}: ${Object.keys(a.fields ?? {}).join(', ')}`;
    default: return a.type;
  }
};

const html = (md: string) =>
  (marked.parse(md, { async: false }) as string).replace(/<pre>/g, '<pre><button class="copy-code" type="button">Copy</button>');

export default function Assistant() {
  const loc = useLocation();
  const nav = useNavigate();
  const entryId = loc.pathname.startsWith('/entry/') ? loc.pathname.split('/')[2] : undefined;
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>(() => { try { return JSON.parse(sessionStorage.getItem(KEY) ?? '[]'); } catch { return []; } });
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [mood, setMood] = useState<Mood>('idle');
  const [done, setDone] = useState<Record<string, string>>({});
  const [tip, setTip] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { try { sessionStorage.setItem(KEY, JSON.stringify(msgs.filter((m) => !m.error))); } catch {} }, [msgs]);
  useEffect(() => { scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' }); }, [msgs, open]);
  useEffect(() => { if (open) setTimeout(() => field.current?.focus(), 250); }, [open]);
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem('dl-tip') === '1'; } catch {}
    if (seen) return;
    const t = setTimeout(() => { setTip(true); try { sessionStorage.setItem('dl-tip', '1'); } catch {} }, 9000);
    const h = setTimeout(() => setTip(false), 16000);
    return () => { clearTimeout(t); clearTimeout(h); };
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);

  const suggestions = useMemo(() => entryId
    ? ['Summarize what makes this design work', 'Rewrite its prompt for a mobile app', 'Which other design is closest to this?']
    : ['What is in my library?', 'Which design suits a dark dashboard?', 'Write a prompt mixing two designs'], [entryId]);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    const next: Msg[] = [...msgs.filter((m) => !m.error), { role: 'user', content: t }];
    setMsgs([...next, { role: 'assistant', content: '' }]);
    setInput(''); setBusy(true); setMood('think');
    if (field.current) field.current.style.height = 'auto';
    const ac = new AbortController();
    abort.current = ac;
    let acc = '';
    try {
      await chat(next, { path: loc.pathname, entryId }, (d) => {
        acc += d;
        setMsgs((m) => [...m.slice(0, -1), { role: 'assistant', content: acc }]);
      }, ac.signal);
      setMood('happy'); setTimeout(() => setMood('idle'), 1400);
    } catch (e: any) {
      if (ac.signal.aborted) { setMood('idle'); if (!acc) setMsgs((m) => m.slice(0, -1)); }
      else { setMood('idle'); setMsgs((m) => [...m.slice(0, -1), { role: 'assistant', content: e.message || 'Something went wrong.', error: true }]); }
    } finally { setBusy(false); abort.current = null; }
  };

  const run = async (key: string, a: Action) => {
    try {
      switch (a.type) {
        case 'capture_url': { const { jobId } = await api.capture(a.url); nav('/add', { state: { jobId } }); break; }
        case 'open_entry': nav(`/entry/${a.id}`); break;
        case 'open_brief': nav('/brief', { state: { ids: a.ids, goal: a.goal } }); break;
        case 'open_compare': nav('/compare', { state: { ids: a.ids } }); break;
        case 'copy_prompt': await copy((await api.get(a.id)).prompt); break;
        case 'update_entry': await patchEntry(a.id, a.fields ?? {}); dispatchEvent(new Event('library-changed')); break;
      }
      setDone((d) => ({ ...d, [key]: a.type === 'copy_prompt' ? 'Copied' : 'Done' }));
    } catch (e: any) { setDone((d) => ({ ...d, [key]: `Failed: ${e.message}` })); }
  };

  const onBody = (e: React.MouseEvent) => {
    const b = (e.target as HTMLElement).closest('.copy-code') as HTMLElement | null;
    if (!b) return;
    const code = b.parentElement?.querySelector('code')?.textContent ?? '';
    copy(code).then(() => { b.textContent = 'Copied'; setTimeout(() => (b.textContent = 'Copy'), 1400); });
  };

  return (
    <>
      <button className={`asst-fab ${open ? 'open' : ''} ${busy ? 'busy' : ''}`} onClick={() => { setOpen((o) => !o); setTip(false); }} aria-label={open ? 'Close assistant' : 'Open assistant'} aria-expanded={open}>
        <span className="asst-pulse" />
        <Mascot size={46} mood={busy ? 'think' : open ? 'wave' : 'idle'} />
        {tip && !open && <span className="asst-tip">Ask me about your library</span>}
      </button>

      <section className={`asst ${open ? 'open' : ''}`} aria-label="Assistant" aria-hidden={!open}>
        <header className="asst-head">
          <Mascot size={40} mood={mood} look={false} />
          <div><b>Assistant</b><span>{entryId ? 'Looking at this design with you' : 'Knows your whole library'}</span></div>
          <div className="spacer" />
          {msgs.length > 0 && <button className="icon-btn sm" title="New chat" onClick={() => { abort.current?.abort(); setMsgs([]); setDone({}); }}>↺</button>}
          <button className="icon-btn sm" title="Close" onClick={() => setOpen(false)}>✕</button>
        </header>

        <div className="asst-body" ref={scroller} onClick={onBody}>
          {msgs.length === 0 && (
            <div className="asst-empty">
              <h3>How can I help?</h3>
              <p>I can search and compare your designs, write prompts from them, and capture new sites.</p>
              <div className="asst-sugg">{suggestions.map((s) => <button key={s} className="chip" onClick={() => send(s)}>{s}</button>)}</div>
            </div>
          )}
          {msgs.map((m, i) => {
            if (m.role === 'user') return <div key={i} className="bubble user">{m.content}</div>;
            const { text, actions } = split(m.content);
            const last = i === msgs.length - 1;
            return (
              <div key={i} className={`bubble bot ${m.error ? 'err' : ''}`}>
                {text ? <div className="prose-sm" dangerouslySetInnerHTML={{ __html: html(text) }} /> : busy && last ? <span className="dotload"><i /><i /><i /></span> : null}
                {!(busy && last) && actions.slice(0, 3).map((a, k) => {
                  const key = `${i}-${k}`;
                  return (
                    <button key={k} className={`act ${done[key] ? 'done' : ''}`} disabled={!!done[key]} onClick={() => run(key, a)}>
                      <span>{done[key] ? (done[key].startsWith('Failed') ? '!' : '✓') : '→'}</span>{done[key] && done[key].startsWith('Failed') ? done[key] : label(a)}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        <form className="asst-input" onSubmit={(e) => { e.preventDefault(); send(input); }}>
          <textarea ref={field} rows={1} value={input} placeholder="Ask anything about your designs…" aria-label="Message"
            onChange={(e) => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }} />
          {busy
            ? <button type="button" className="btn sm" onClick={() => abort.current?.abort()}>Stop</button>
            : <button type="submit" className="btn primary sm" disabled={!input.trim()}>Send</button>}
        </form>
      </section>
    </>
  );
}
