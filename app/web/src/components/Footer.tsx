import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, DEMO } from '../api';
import Mascot, { type Mood } from './Mascot';
import { scrollToTop } from './motion';

const WORDMARK = 'Design Library';

export default function Footer() {
  const [names, setNames] = useState<string[]>([]);
  const [mood, setMood] = useState<Mood>('idle');
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    api.list().then((l) => setNames(l.map((e) => e.name.split(/\s[—–-]\s/)[0]))).catch(() => {});
  }, []);

  // The mascot waves each time the footer scrolls into view.
  useEffect(() => {
    let t = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      setMood('wave');
      clearTimeout(t);
      t = window.setTimeout(() => setMood('idle'), 2600);
    }, { threshold: 0.35 });
    io.observe(ref.current!);
    return () => { io.disconnect(); clearTimeout(t); };
  }, []);

  const items = names.length ? names : ['Your next favourite design'];
  const track = [...items, ...items, ...items, ...items];

  return (
    <footer ref={ref} className="footer">
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <div key={k} className="marquee-set">
              {track.map((n, i) => <span key={i}>{n}<i>✳</i></span>)}
            </div>
          ))}
        </div>
      </div>

      <div className="wrap foot-grid">
        <div className="foot-lead" data-reveal>
          <Mascot size={86} mood={mood} />
          <h3>Design it once.<br /><em>Prompt it forever.</em></h3>
          <p>Every reference you save becomes a prompt Claude can build from.</p>
          <Link to="/add" className="btn primary">Add a design</Link>
        </div>
        <nav className="foot-col" data-reveal style={{ ['--d' as any]: '100ms' }}>
          <h4>Library</h4>
          <Link className="lnk" to="/library">All designs</Link>
          <Link className="lnk" to="/library?kind=landing">Landing pages</Link>
          <Link className="lnk" to="/library?kind=portfolio">Portfolios</Link>
          <Link className="lnk" to="/library?kind=app">Apps</Link>
        </nav>
        <nav className="foot-col" data-reveal style={{ ['--d' as any]: '180ms' }}>
          <h4>Make</h4>
          <Link className="lnk" to="/add">Capture a URL</Link>
          <Link className="lnk" to="/add">Upload screenshots</Link>
          <Link className="lnk" to="/brief">Brief builder</Link>
          <Link className="lnk" to="/compare">Compare</Link>
        </nav>
        <div className="foot-col" data-reveal style={{ ['--d' as any]: '260ms' }}>
          <h4>How to use</h4>
          <p>Open a design, copy its prompt, paste it into Claude with your own content.</p>
          <button className="btn sm top-btn" onClick={scrollToTop}><span>↑</span> Back to top</button>
        </div>
      </div>

      <div className="wordmark" data-reveal aria-hidden="true">
        {[...WORDMARK].map((ch, i) => <span key={i} style={{ ['--i' as any]: i }}>{ch === ' ' ? ' ' : ch}</span>)}
      </div>

      <div className="wrap foot-base">
        <span><i className="live-dot" /> {DEMO ? 'Read-only demo' : 'Running locally on your machine'}</span>
        <span>Built for Claude · {new Date().getFullYear()}{DEMO && <> · <a className="lnk" href={`${import.meta.env.BASE_URL}landing/`}>Landing page test</a></>}</span>
      </div>
    </footer>
  );
}
