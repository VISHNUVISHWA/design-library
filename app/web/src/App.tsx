import { useEffect, useState } from 'react';
import { NavLink, Route, Routes, Link, useLocation } from 'react-router-dom';
import Dots from './components/Dots';
import Mascot from './components/Mascot';
import Preloader from './components/Preloader';
import Cursor from './components/Cursor';
import Footer from './components/Footer';
import Assistant from './components/Assistant';
import { DEMO } from './api';
import { scrollTop, startReveals, startSmoothScroll } from './components/motion';
import Home from './pages/Home';
import Library from './pages/Library';
import EntryPage from './pages/EntryPage';
import Add from './pages/Add';
import Brief from './pages/Brief';
import Compare from './pages/Compare';

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  const loc = useLocation();
  useEffect(() => { document.documentElement.dataset.theme = theme; try { localStorage.setItem('theme', theme); } catch {} }, [theme]);
  useEffect(() => { startSmoothScroll(); return startReveals(); }, []);
  useEffect(() => { scrollTop(); }, [loc.pathname]);

  return (
    <>
      <Dots />
      <Preloader />
      <Cursor />
      <div className="grain" aria-hidden="true" />
      {DEMO && <div className="demo-bar">Read-only demo. Browse, search, compare and copy prompts here. Capturing, editing and the assistant run in the local app.</div>}
      <header className="header">
        <div className="wrap">
          <Link to="/" className="brand"><Mascot size={34} look={false} mood="idle" />Design Library</Link>
          <nav className="nav">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/library">Library</NavLink>
            <NavLink to="/add">Add design</NavLink>
            <NavLink to="/brief">Brief builder</NavLink>
            <NavLink to="/compare">Compare</NavLink>
          </nav>
          <div className="spacer" />
          <button className="icon-btn" aria-label="Toggle theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? '☀' : '☾'}</button>
        </div>
      </header>
      <main className="wrap" key={loc.pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/entry/:id" element={<EntryPage />} />
          <Route path="/add" element={<Add />} />
          <Route path="/brief" element={<Brief />} />
          <Route path="/compare" element={<Compare />} />
        </Routes>
      </main>
      <Footer />
      <Assistant />
    </>
  );
}
