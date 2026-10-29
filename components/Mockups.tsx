import type { CSSProperties, ReactNode } from 'react';

// Real HTML/CSS "screens" of the product. Neutral text; colour only in small status dots and swatches.
const i = (n: number): CSSProperties => ({ ['--i' as string]: n });
const Dot = ({ c = 'var(--meta)' }: { c?: string }) => <span className="m-dot" style={{ background: c }} />;
const Icon = ({ d }: { d: string }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d={d} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

function Side({ active }: { active: string }) {
  const nav: [string, string][] = [
    ['Captures', 'M2.5 4.5h11v8h-11zM5 2.5v2M11 2.5v2'],
    ['Library', 'M3 3h4v10H3zM9 3h4v6H9z'],
    ['Boards', 'M3 3h10v3H3zM3 8h4.5v5H3zM9 8h4v5H9z'],
    ['Brief builder', 'M3 4h10M3 8h10M3 12h6'],
    ['Compare', 'M4 3v10M12 3v10M4 8h8'],
  ];
  const recent = ['Linear', 'Stripe', 'Anthropic', 'Squared', 'Ingrassia'];
  return (
    <aside className="m-side">
      <div className="m-ws"><span className="m-av">S</span>Studio</div>
      {nav.map(([n, d]) => <div key={n} className={`m-nav ${n === active ? 'on' : ''}`}><Icon d={d} />{n}</div>)}
      <div className="m-cap">Recent</div>
      {recent.map((n) => <div key={n} className="m-nav sub">{n}</div>)}
    </aside>
  );
}

export function HeroMock() {
  const act: [string, string][] = [
    ['Claude wrote the prompt (3,812 words)', '2m ago'],
    ['Measured 214 style tokens', '3m ago'],
    ['Captured 3 screens: desktop, full page, mobile', '4m ago'],
    ['Loader finished after 14.8s, page captured', '4m ago'],
  ];
  return (
    <div className="mock mock-hero seq">
      <div className="m-app">
        <Side active="Library" />
        <div className="m-main">
          <div className="m-top">
            <span className="mono">Library</span><span className="m-sl">/</span><span className="mono">DL-0142</span>
            <span className="m-sp" />
            <span className="m-chip"><Dot c="var(--clay)" />Analyzed</span>
            <span className="m-chip">landing</span><span className="m-chip">persuade</span>
          </div>
          <div className="m-body">
            <div className="m-col">
              <div className="m-title" style={i(0)}>Linear: product-led landing</div>
              <p className="m-p" style={i(1)}>The product UI is the hero image. Grayscale on #08090a, white headlines, one muted gray ramp. Color appears only inside mockups, so the page stays quiet and the product reads as credible.</p>
              <div className="m-h" style={i(2)}>What makes it work</div>
              <ul className="m-list">
                {['Real app window under a two-line headline, dense at 12-13px', 'Hairlines and tonal steps instead of boxes and shadows', 'Type contrast through tone: #f7f8f8 against #8a8f98', 'Mono FIG captions with thin-line wireframes'].map((t, k) => <li key={t} style={i(3 + k)}>{t}</li>)}
              </ul>
              <div className="m-h" style={i(7)}>Activity</div>
              {act.map(([t, ts], k) => <div key={t} className="m-act" style={i(8 + k)}><Dot /><span>{t}</span><span className="mono m-ts">{ts}</span></div>)}
            </div>
            <div className="m-props">
              <div className="m-pr"><span>Status</span><b><Dot c="var(--clay)" />Analyzed</b></div>
              <div className="m-pr"><span>Mode</span><b>Persuade</b></div>
              <div className="m-pr"><span>Source</span><b className="mono">linear.app</b></div>
              <div className="m-pr"><span>Added</span><b className="mono">28 Oct 2026</b></div>
              <div className="m-pr col"><span>Palette</span><div className="m-sw">{['#08090a', '#0f1011', '#161718', '#f7f8f8', '#d0d6e0', '#8a8f98'].map((c) => <i key={c} style={{ background: c }} />)}</div></div>
              <div className="m-pr col"><span>Fonts</span><div className="m-chips"><span className="m-chip">Inter Variable</span><span className="m-chip">Berkeley Mono</span></div></div>
              <div className="m-pr col"><span>Tech</span><div className="m-chips"><span className="m-chip">Next.js</span><span className="m-chip">React</span><span className="m-chip">Cloudflare</span></div></div>
            </div>
          </div>
        </div>
        <div className="m-float">
          <div className="m-fh"><Dot c="var(--green)" />Assistant<span className="m-sp" /><span className="mono m-ts">esc</span></div>
          <div className="m-bub u">Which design suits a dark developer dashboard?</div>
          <div className="m-bub">Linear. Near-black surfaces (#08090a, #0f1011, #161718) layer well for panels, and Inter with Berkeley Mono covers UI and data.</div>
          <div className="m-act-btn">→ Open DL-0142</div>
          <div className="m-input">Ask anything about your designs…</div>
        </div>
      </div>
    </div>
  );
}

export function CaptureMock() {
  const steps: [string, string][] = [
    ['Launching headless browser', '0.8s'], ['Opening squared-media.nl', '1.4s'], ['Loader detected (.sq-loader), waiting for the real page', '14.8s'],
    ['Capturing hero, full page and mobile', '3.1s'], ['Reading computed styles, tokens and tech', '0.6s'], ['Claude is writing the prompt', '…'],
  ];
  return (
    <div className="mock mock-feat seq">
      <div className="m-app">
        <Side active="Captures" />
        <div className="m-main">
          <div className="m-top"><span className="mono">Captures</span><span className="m-sl">/</span><span className="mono">JOB-7731</span><span className="m-sp" /><span className="m-chip"><Dot c="var(--clay)" />Running</span></div>
          <div className="m-body one">
            <div className="m-url" style={i(0)}><span className="mono">https://www.squared-media.nl/</span><span className="m-sp" /><span className="m-btn">Capture</span></div>
            <div className="m-bar" style={i(1)}><i /></div>
            <div className="m-steps">{steps.map(([t, d], k) => <div key={t} className="m-act" style={i(2 + k)}><Dot c={k === steps.length - 1 ? 'var(--clay)' : 'var(--green)'} /><span>{t}</span><span className="mono m-ts">{d}</span></div>)}</div>
            <div className="m-shots" style={i(9)}>
              {['01 hero', '02 full page', '03 mobile', '04 loader'].map((n) => <div key={n} className="m-shot"><div className="m-ph" /><span className="mono">{n}.png</span></div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TokensMock() {
  const type: [string, string, string][] = [['h1', 'Inter Variable', '64 / 510 / -1.4px'], ['h2', 'Inter Variable', '48 / 510 / -1px'], ['body', 'Inter Variable', '16 / 400 / 1.5'], ['mono', 'Berkeley Mono', '12 / 400 / 0.04em']];
  const colors: [string, string, string][] = [['#08090a', 'background', '61%'], ['#0f1011', 'surface', '18%'], ['#f7f8f8', 'text', '9%'], ['#8a8f98', 'muted', '6%'], ['#2e2e32', 'border', '4%']];
  return (
    <div className="mock mock-feat seq">
      <div className="m-app">
        <Side active="Library" />
        <div className="m-main">
          <div className="m-top"><span className="mono">DL-0142</span><span className="m-sl">/</span><span className="mono">Measured tokens</span><span className="m-sp" /><span className="m-chip">214 tokens</span></div>
          <div className="m-body two">
            <div>
              <div className="m-h">Color</div>
              {colors.map(([c, r, p], k) => <div key={c} className="m-tr" style={i(k)}><i className="m-sq" style={{ background: c }} /><span className="mono">{c}</span><span className="m-mut">{r}</span><span className="mono m-ts">{p}</span></div>)}
              <div className="m-h" style={{ marginTop: 22 }}>Radius and depth</div>
              {[['radius', '8px, 12px'], ['shadow', 'none (hairlines only)'], ['blur', 'header backdrop 20px']].map(([a, b], k) => <div key={a} className="m-tr" style={i(5 + k)}><span className="m-mut" style={{ width: 70 }}>{a}</span><span className="mono">{b}</span></div>)}
            </div>
            <div>
              <div className="m-h">Type scale</div>
              {type.map(([a, b, c], k) => <div key={a} className="m-tr" style={i(k)}><span className="m-mut" style={{ width: 46 }}>{a}</span><span>{b}</span><span className="mono m-ts">{c}</span></div>)}
              <div className="m-h" style={{ marginTop: 22 }}>Motion</div>
              {[['hover', '.15s ease'], ['reveal', 'opacity .6s ease-out'], ['libraries', 'Lenis']].map(([a, b], k) => <div key={a} className="m-tr" style={i(5 + k)}><span className="m-mut" style={{ width: 70 }}>{a}</span><span className="mono">{b}</span></div>)}
              <div className="m-h" style={{ marginTop: 22 }}>Detected tech</div>
              <div className="m-chips" style={i(9)}>{['Next.js', 'React', 'Cloudflare', 'CSS Modules', 'TypeScript'].map((t) => <span key={t} className="m-chip">{t}</span>)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PromptMock() {
  const secs = ['Role and mode', 'Tech stack', 'Design tokens (CSS variables)', 'Page structure', 'Component specs', 'Motion spec', 'Responsive rules', 'Copy tone', 'Anti-patterns', 'Final checklist'];
  return (
    <div className="mock mock-feat seq">
      <div className="m-app">
        <Side active="Library" />
        <div className="m-main">
          <div className="m-top"><span className="mono">DL-0142</span><span className="m-sl">/</span><span className="mono">PROMPT</span><span className="m-sp" /><span className="m-btn dark">Copy prompt</span></div>
          <div className="m-body two">
            <div className="m-toc">{secs.map((s, k) => <div key={s} className={`m-nav sub ${k === 2 ? 'on' : ''}`} style={i(k)}>{String(k + 1).padStart(2, '0')}  {s}</div>)}</div>
            <div className="m-doc">
              <div className="m-h">03  Design tokens</div>
              <pre className="m-code" style={i(0)}>{`:root {
  --bg: #08090a;
  --surface: #0f1011;
  --ink: #f7f8f8;
  --muted: #8a8f98;
  --line: #2e2e32;
  --sans: "Inter", system-ui, sans-serif;
  --mono: "Berkeley Mono", ui-monospace;
  --fs-h1: clamp(40px, 5vw, 64px);
  --r-8: 8px;  --r-12: 12px;
  --ease: cubic-bezier(.25,.46,.45,.94);
}`}</pre>
              <p className="m-p" style={i(2)}>Use these values exactly. Replace [PRODUCT] and [CONTENT] with the real subject. Inspired by, not a clone: do not copy logos, wording or imagery.</p>
              <div className="m-chips" style={i(3)}><span className="m-chip">3,812 words</span><span className="m-chip">10 sections</span><span className="m-chip">8-point checklist</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AssistantMock() {
  const turns: [string, string][] = [
    ['u', 'Compare the type in Linear and Anthropic.'],
    ['b', 'Linear sets everything in one family: Inter Variable at weights 510 and 590, with tight tracking (-1.4px at 64px). Anthropic pairs a sans lead-in with a regular serif, so the contrast comes from the family, not the weight.'],
    ['u', 'Write a prompt that mixes the two for a pricing page.'],
    ['b', 'Done. Linear is the primary system for structure and hairlines; I borrowed the serif voice from Anthropic. I added a button to open the Brief builder with both selected.'],
  ];
  return (
    <div className="mock mock-feat seq">
      <div className="m-app">
        <Side active="Compare" />
        <div className="m-main">
          <div className="m-top"><span className="mono">Assistant</span><span className="m-sp" /><span className="m-chip"><Dot c="var(--green)" />Reads your library</span></div>
          <div className="m-body one chat">
            {turns.map(([r, t], k) => <div key={k} className={`m-bub ${r === 'u' ? 'u' : ''}`} style={i(k)}>{t}</div>)}
            <div className="m-act-btn" style={i(4)}>→ Open Brief builder (2 references)</div>
            <div className="m-act-btn" style={i(5)}>→ Copy prompt of DL-0142</div>
            <div className="m-input" style={i(6)}>Ask anything about your designs…</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Card = ({ children }: { children: ReactNode }) => <div className="card">{children}</div>;
