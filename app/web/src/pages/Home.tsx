import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, type EntrySummary } from '../api';
import HeroScene from '../components/HeroScene';
import EntryCard from '../components/EntryCard';
import HeroWorld from '../components/HeroWorld';
import { Split } from '../components/PageHead';

export default function Home() {
  const nav = useNavigate();
  const [url, setUrl] = useState('');
  const [all, setAll] = useState<EntrySummary[]>([]);
  useEffect(() => { api.list().then(setAll).catch(() => {}); }, []);
  const techs = new Set(all.flatMap((e) => e.tech)).size;

  return (
    <div className="page">
      <HeroWorld />
      <section className="hero">
        <span className="eyebrow hero-in" style={{ ['--i' as any]: 0 }}>Design Library · made for Claude</span>
        <h1 className="split"><Split text="Every design you admire, as a" /><em><Split text="prompt" from={6} /></em><Split text="Claude can build." from={7} /></h1>
        <p className="lede hero-in" style={{ ['--i' as any]: 9 }}>Paste a URL. Claude captures the screens, measures the real colors, fonts and tech, then writes a prompt that rebuilds that style of website or app.</p>
        <form className="urlbar hero-in" style={{ ['--i' as any]: 11 }} onSubmit={(e) => { e.preventDefault(); if (url.trim()) nav('/add', { state: { url: url.trim(), go: true } }); }}>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://linear.app" aria-label="Website URL" />
          <button className="btn primary" type="submit">Capture design</button>
        </form>
        <div className="stats hero-in" style={{ ['--i' as any]: 13 }}><span><b>{all.length}</b>designs</span><span><b>{techs}</b>technologies seen</span></div>
      </section>

      <div data-reveal><HeroScene /></div>

      <div className="section-head" data-reveal><h2>How it works</h2></div>
      <div className="steps">
        <div className="card step" data-reveal><div className="num">1</div><h3>Paste a URL</h3><p>Or upload screenshots of an app. A headless browser opens the site at desktop and mobile size.</p></div>
        <div className="card step" data-reveal style={{ ['--d' as any]: '110ms' }}><div className="num">2</div><h3>Claude studies it</h3><p>Live computed styles, tech detection and the screenshots are read through a taste and craft rubric.</p></div>
        <div className="card step" data-reveal style={{ ['--d' as any]: '220ms' }}><div className="num">3</div><h3>Copy the prompt</h3><p>Later, paste it into Claude and get the same style of site or app, with your own content.</p></div>
      </div>

      <div className="section-head" data-reveal><h2>Recently added</h2><Link to="/library" className="lnk">View all →</Link></div>
      <div className="grid">{all.slice(0, 6).map((e, i) => <EntryCard key={e.id} e={e} i={i} />)}</div>
    </div>
  );
}
