import { useEffect, useState } from 'react';
import Mascot, { type Mood } from './Mascot';

const STAGES = [
  { id: 'intro', ms: 2200, mood: 'wave' as Mood, caption: 'Hi! Give me any website or app.' },
  { id: 'type', ms: 2600, mood: 'idle' as Mood, caption: 'Paste a URL…' },
  { id: 'scan', ms: 2600, mood: 'think' as Mood, caption: 'I capture the screens and read the live styles.' },
  { id: 'extract', ms: 2600, mood: 'think' as Mood, caption: 'Colors, fonts and tech, measured.' },
  { id: 'prompt', ms: 3800, mood: 'happy' as Mood, caption: 'Then I write the prompt that rebuilds it.' },
];
const URL_TEXT = 'https://linear.app';
const SWATCHES = ['#0f1011', '#5e6ad2', '#f7f8f8', '#8a8f98', '#26282d'];
const SPARKS = Array.from({ length: 9 }, (_, i) => ({ dx: Math.cos(i * 0.7) * 70, dy: -30 - Math.sin(i * 1.3) * 60 }));

// A looping, code-only animation: the mascot explains the product (URL -> capture -> tokens -> prompt).
export default function HeroScene() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [i, setI] = useState(reduce ? STAGES.length - 1 : 0);
  const [typed, setTyped] = useState(reduce ? URL_TEXT.length : 0);
  const stage = STAGES[i];

  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setI((n) => (n + 1) % STAGES.length), stage.ms);
    return () => clearTimeout(t);
  }, [i, reduce, stage.ms]);

  useEffect(() => {
    if (reduce) return;
    if (stage.id === 'intro') setTyped(0);
    if (stage.id !== 'type') return;
    const t = setInterval(() => setTyped((n) => Math.min(URL_TEXT.length, n + 1)), 110);
    return () => clearInterval(t);
  }, [stage.id, reduce]);

  return (
    <div className={`scene stage-${stage.id}`} aria-hidden="true">
      <div className="floor" />
      <div className="s-mascot"><Mascot size={150} mood={stage.mood} /></div>

      <div className="s-window">
        <div className="s-bar"><i /><i /><i />
          <div className="s-url">{URL_TEXT.slice(0, typed)}{(stage.id === 'type' || stage.id === 'intro') && <span className="caret" />}</div>
        </div>
        <div className="s-page">
          <div className="wf a" /><div className="wf b" /><div className="wf c" /><div className="wf d" />
          <div className="wf-row"><div className="wf" /><div className="wf" /><div className="wf" /></div>
        </div>
        <div className="beam" />
      </div>

      <div className="s-swatches">{SWATCHES.map((c) => <div key={c} className="sw" style={{ background: c }} />)}</div>
      <div className="s-tech"><span className="chip tech">Next.js</span><span className="chip tech">Tailwind</span><span className="chip tech">Inter</span></div>
      <div className="s-prompt"><b>PROMPT</b><div className="ln" /><div className="ln" /><div className="ln" /><div className="ln" /></div>
      {SPARKS.map((s, k) => <span key={k} className="spark" style={{ right: '14%', bottom: 150, ['--dx' as any]: `${s.dx}px`, ['--dy' as any]: `${s.dy}px`, animationDelay: `${0.8 + k * 0.04}s` }} />)}
      <div className="s-caption">{stage.caption}</div>
    </div>
  );
}
