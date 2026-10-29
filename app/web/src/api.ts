export type Entry = {
  id: string; name: string; kind: string; url?: string; tags: string[]; mood: string[]; mode?: string;
  palette: string[]; fonts: string[]; tech: string[]; rating?: number; added?: string; cover?: string; shots: string[];
  body: string; prompt: string; tokens: any;
};
export type EntrySummary = Omit<Entry, 'body' | 'prompt' | 'tokens'>;
export type Job = { id: string; status: 'running' | 'done' | 'error'; steps: { t: number; msg: string }[]; entryId?: string; error?: string };

// Demo build (GitHub Pages): no server. Entries come from a static snapshot and anything that
// needs the local server or Claude says so.
export const DEMO = import.meta.env.VITE_DEMO === 'true';
const DEMO_MSG = 'This is a read-only demo. Capturing, editing and the assistant run in the local app, with your own Claude login.';
const BASE = import.meta.env.BASE_URL;
let demoData: Promise<Entry[]> | null = null;
const demoEntries = () => (demoData ??= fetch(`${BASE}demo-data/entries.json`).then((r) => r.json()).then((es: Entry[]) => es.map((e) => ({ ...e, cover: e.cover && BASE + e.cover.slice(1), shots: e.shots.map((s) => BASE + s.slice(1)) }))));
const demoFail = <T,>(): Promise<T> => Promise.reject(new Error(DEMO_MSG));

const j = async (r: Response) => { if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error ?? r.statusText); return r.json(); };

export const api = {
  list: (p: { q?: string; kind?: string; tag?: string } = {}): Promise<EntrySummary[]> => {
    if (DEMO) {
      const terms = (p.q ?? '').toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
      return demoEntries().then((all) => all
        .filter((e) => (!p.kind || e.kind === p.kind) && (!p.tag || e.tags.includes(p.tag)))
        .filter((e) => { const hay = [e.name, e.kind, e.url, ...e.tags, ...e.mood, ...e.tech, ...e.fonts, e.body, e.prompt].join(' ').toLowerCase(); return terms.every((t) => hay.includes(t)); })
        .map(({ body, prompt, tokens, ...rest }) => rest));
    }
    return fetch('/api/entries?' + new URLSearchParams(Object.entries(p).filter(([, v]) => v) as [string, string][])).then(j);
  },
  get: (id: string): Promise<Entry> => DEMO
    ? demoEntries().then((all) => all.find((e) => e.id === id) ?? Promise.reject(new Error('not found')))
    : fetch(`/api/entries/${id}`).then(j),
  raw: (id: string): Promise<string> => (DEMO ? demoFail() : fetch(`/api/entries/${id}/raw`).then((r) => r.text())),
  save: (id: string, md: string) => (DEMO ? demoFail() : fetch(`/api/entries/${id}`, { method: 'PUT', body: md }).then(j)),
  remove: (id: string) => (DEMO ? demoFail() : fetch(`/api/entries/${id}`, { method: 'DELETE' }).then(j)),
  capture: (url: string, notes?: string): Promise<{ jobId: string }> => DEMO ? demoFail() :
    fetch('/api/capture', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ url, notes }) }).then(j),
  upload: (fd: FormData): Promise<{ jobId: string }> => (DEMO ? demoFail() : fetch('/api/upload', { method: 'POST', body: fd }).then(j)),
  regenerate: (id: string): Promise<{ jobId: string }> => (DEMO ? demoFail() : fetch(`/api/entries/${id}/regenerate`, { method: 'POST' }).then(j)),
  job: (id: string): Promise<Job> => (DEMO ? demoFail() : fetch(`/api/jobs/${id}`).then(j)),
};

export function copy(text: string) {
  return navigator.clipboard.writeText(text).catch(() => {
    const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove();
  });
}

export type ChatMsg = { role: 'user' | 'assistant'; content: string };

// Streams the assistant's reply; calls onDelta with each text chunk. Resolves when finished.
export async function chat(messages: ChatMsg[], context: { path: string; entryId?: string }, onDelta: (t: string) => void, signal: AbortSignal) {
  if (DEMO) throw new Error(DEMO_MSG);
  const r = await fetch('/api/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ messages, context }), signal });
  if (!r.ok || !r.body) throw new Error('Assistant unavailable');
  const reader = r.body.getReader(), dec = new TextDecoder();
  let buf = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let i: number;
    while ((i = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
      if (!line) continue;
      const m = JSON.parse(line);
      if (m.t === 'delta') onDelta(m.text);
      else if (m.t === 'error') throw new Error(m.message);
    }
  }
}

export const patchEntry = (id: string, fields: Record<string, unknown>) => DEMO ? demoFail() :
  fetch(`/api/entries/${id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(fields) }).then(j);
