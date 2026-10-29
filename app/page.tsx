import Header, { Logo } from '@/components/Header';
import Reveal from '@/components/Reveal';
import { AssistantMock, CaptureMock, HeroMock, PromptMock, TokensMock } from '@/components/Mockups';

const Arrow = () => <span className="arr" aria-hidden="true">→</span>;

// Hero words rise in with a 35ms stagger (CSS only).
const Words = ({ text, from, cls }: { text: string; from: number; cls?: string }) => (
  <>{text.split(' ').map((w, k) => <span key={k}><span className="hw"><span className={cls} style={{ ['--i' as string]: from + k }}>{w}</span></span>{' '}</span>)}</>
);

const LOGOS = ['Northwind', 'Fieldnote', 'Halcyon', 'Oakline', 'Parallel', 'Meridian', 'Tidewater'];

const FIGS = [
  { n: 'FIG 0.1', t: 'Capture the real page', d: 'A headless browser waits out the loader, then shoots desktop, full page and mobile.', svg: (
    <svg viewBox="0 0 240 150" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true"><rect x="30" y="20" width="180" height="110" rx="8" /><path d="M30 42h180" /><circle cx="44" cy="31" r="2.5" /><circle cx="54" cy="31" r="2.5" /><circle cx="64" cy="31" r="2.5" /><rect x="48" y="58" width="90" height="10" rx="2" /><rect x="48" y="76" width="64" height="10" rx="2" /><rect x="150" y="58" width="42" height="56" rx="4" /><path d="M20 96h200" strokeDasharray="3 4" /><path d="M20 96l-6-4v8zM220 96l6-4v8z" /></svg>) },
  { n: 'FIG 0.2', t: 'Measure, never guess', d: 'Colors, type scale, radii, motion and tech are read from the live page and stored as tokens.', svg: (
    <svg viewBox="0 0 240 150" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true"><circle cx="60" cy="60" r="26" /><circle cx="100" cy="60" r="26" /><circle cx="140" cy="60" r="26" /><path d="M32 112h176M32 112v8M70 112v8M108 112v8M146 112v8M184 112v8M208 112v8" /><path d="M36 132h18M70 132h34M120 132h50" strokeLinecap="round" /><path d="M186 40v44M178 48l8-8 8 8" /></svg>) },
  { n: 'FIG 0.3', t: 'Keep the prompt', d: 'Claude writes one self-contained prompt. Paste it later and get the same style, with new content.', svg: (
    <svg viewBox="0 0 240 150" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true"><path d="M62 18h70l26 26v88H62z" /><path d="M132 18v26h26" /><path d="M76 62h64M76 78h74M76 94h52M76 110h66" strokeLinecap="round" /><path d="M170 80h40" /><path d="M202 72l8 8-8 8" /><rect x="176" y="100" width="40" height="22" rx="4" /></svg>) },
];

const FEATURES = [
  { id: 'capture', h: ['Capture any site,', 'exactly as people see it'], p: 'Paste a URL. Slow loaders, intros and locked scrolling are waited out, so the screenshots show the real page and the loader is kept as its own picture.', mock: <CaptureMock />, links: ['Capture a URL', 'Upload screenshots', 'How loaders are handled'] },
  { id: 'tokens', h: ['Tokens measured,', 'never estimated'], p: 'Every color, font size, radius and transition comes from computed styles on the page. The breakdown can be wrong about mood, but it cannot be wrong about a hex value.', mock: <TokensMock />, links: ['Color and type tokens', 'Motion and tech detection', 'Edit any value by hand'] },
  { id: 'prompts', h: ['A prompt that rebuilds', 'the whole design'], p: 'One self-contained document: stack, CSS variables, page structure, components, motion, responsive rules and a final checklist. Placeholders for your own content.', mock: <PromptMock />, links: ['Read a sample prompt', 'Brief builder', 'Combine two references'] },
  { id: 'assistant', h: ['An assistant that knows', 'your whole library'], p: 'Ask which design fits a project, compare two systems, or write a prompt that mixes them. It answers from your files, and changes anything only after you press a button.', mock: <AssistantMock />, links: ['What it can do', 'Actions and confirmations', 'Runs on your own login'] },
];

const NEWS = [
  { tag: 'Changelog', date: '28 OCT 2026', t: 'Loader-aware capture', b: 'Sites that hide the page behind a loader or intro are now captured after it finishes, and the loader is saved too.' },
  { tag: 'Guide', date: '24 OCT 2026', t: 'Write a prompt you can reuse', b: 'What to keep in a design prompt so it works months later: tokens, structure, motion and a checklist, without copied copy.' },
  { tag: 'Update', date: '19 OCT 2026', t: 'The assistant is here', b: 'Ask about your library from any page, get prompts in a code block, and confirm actions before they run.' },
];

const FOOT: Record<string, string[]> = {
  Product: ['Capture', 'Library', 'Boards', 'Brief builder', 'Compare', 'Assistant'],
  Resources: ['Docs', 'Sample prompts', 'Changelog', 'Guides'],
  Method: ['How capture works', 'Token measurement', 'Prompt format', 'Motion detection'],
  Company: ['About', 'Contact', 'Privacy', 'Terms'],
};

export default function Page() {
  return (
    <>
      <Header />
      <main id="top">
        <section className="wrap hero">
          <h1 className="lead">
            <Words text="Design Library helps teams build" from={0} cls="b" />
            <Words text="from references they already trust, with the prompt, the tokens and the screens in one place." from={5} />
          </h1>
          <div className="hero-row">
            <p className="hero-sub hero-fade" style={{ ['--i' as string]: 20 }}>Capture any website, measure how it is built, and keep the prompt that rebuilds it.</p>
            <a href="#capture" className="new hero-fade" style={{ ['--i' as string]: 21 }}><b>New</b><span className="dotsep">·</span>Loader-aware capture <Arrow /></a>
          </div>
        </section>

        <div className="wrap"><HeroMock /></div>

        <section className="wrap logos">
          <Reveal>
            <p className="micro">Used by product and design teams at</p>
            <div className="logo-row">{LOGOS.map((l) => <span key={l} className="lg">{l}</span>)}</div>
          </Reveal>
        </section>

        <section className="wrap statement">
          <Reveal>
            <p><span className="muted-t">Most design references end up as a folder of screenshots no one opens again. </span>Design Library turns each one into measured tokens and a prompt, so the next project starts from what you already know works.</p>
          </Reveal>
        </section>

        <section className="wrap figs">
          <div className="fig-grid">
            {FIGS.map((f, k) => (
              <Reveal key={f.n} className="fig" delay={k * 80}>
                <span className="mono micro">{f.n}</span>
                <div className="fig-svg">{f.svg}</div>
                <h3>{f.t}</h3>
                <p>{f.d}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <div id="features" />
        {FEATURES.map((f) => (
          <section key={f.id} id={f.id} className="wrap feat">
            <Reveal className="feat-grid">
              <h2>{f.h[0]}<br />{f.h[1]}</h2>
              <div className="feat-r"><p>{f.p}</p><a href="#start" className="ghost">Learn more <Arrow /></a></div>
            </Reveal>
            <Reveal className="feat-mock">{f.mock}</Reveal>
            <Reveal className="links">{f.links.map((l) => <a key={l} href="#start" className="lk"><span>{l}</span><Arrow /></a>)}</Reveal>
          </section>
        ))}

        <section className="wrap news">
          <Reveal className="news-head"><h2>Latest from the library</h2><a href="#" className="ghost">All updates <Arrow /></a></Reveal>
          <div className="news-grid">
            {NEWS.map((n, k) => (
              <Reveal key={n.t} className="ncard" delay={k * 80}>
                <div className="ntop"><span className="chip">{n.tag}</span><span className="mono micro">{n.date}</span></div>
                <h3>{n.t}</h3>
                <p>{n.b}</p>
                <a href="#" className="nbtn">Read more <Arrow /></a>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="start" className="dark">
          <div className="wrap">
            <Reveal className="cta">
              <h2><b>Keep every design you admire</b> as a prompt you can use again.</h2>
              <a href="#top" className="btn light">Get started</a>
            </Reveal>
            <footer className="foot">
              <div className="foot-brand"><Logo /><p>Runs on your own machine. Your library stays in plain files.</p></div>
              {Object.entries(FOOT).map(([h, ls]) => (
                <nav key={h} aria-label={h}><h4>{h}</h4>{ls.map((l) => <a key={l} href="#">{l}</a>)}</nav>
              ))}
              <div className="foot-base"><span>© 2026 Design Library</span><span>Inspired by, never cloned.</span></div>
            </footer>
          </div>
        </section>
      </main>
    </>
  );
}
