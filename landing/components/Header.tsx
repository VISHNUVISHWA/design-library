'use client';
import { useState } from 'react';

const Chevron = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M2 3.75 5 6.75l3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const LINKS: { label: string; menu?: boolean }[] = [
  { label: 'Product', menu: true }, { label: 'Capture' }, { label: 'Prompts' }, { label: 'Docs', menu: true },
];

export function Logo() {
  return (
    <a href="#top" className="logo" aria-label="Design Library home">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="2.5" y="2.5" width="15" height="15" rx="4" stroke="currentColor" strokeWidth="1.4" /><path d="M7 13.5 9.2 6.5M10.8 13.5 13 6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
      <span>Design Library</span>
    </a>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="hdr">
      <div className="wrap hdr-in">
        <Logo />
        <nav className="pills" aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.label} href="#features" className="pill">{l.label}{l.menu && <Chevron />}</a>
          ))}
        </nav>
        <div className="spacer" />
        <a href="#" className="ghost hide-sm">Log in</a>
        <a href="#start" className="btn">Get started</a>
        <button className="menu-btn" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">{open ? <path d="m4 4 10 10M14 4 4 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /> : <path d="M3 6h12M3 12h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />}</svg>
        </button>
      </div>
      {open && (
        <div className="mobile-nav">
          {LINKS.map((l) => <a key={l.label} href="#features" onClick={() => setOpen(false)}>{l.label}</a>)}
          <a href="#">Log in</a>
        </div>
      )}
    </header>
  );
}
