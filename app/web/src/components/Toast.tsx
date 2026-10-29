import { useEffect } from 'react';

export default function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 1600); return () => clearTimeout(t); }, [onDone]);
  return <div className="toast" role="status">{msg}</div>;
}
