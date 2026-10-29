import { useEffect, useState } from 'react';
import { api, type Job } from '../api';
import Mascot from './Mascot';

// Polls a background job (capture / analysis) and shows mascot + live steps.
export default function JobPanel({ jobId, onDone }: { jobId: string; onDone: (entryId: string) => void }) {
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    let stop = false;
    const tick = async () => {
      try {
        const j = await api.job(jobId);
        if (stop) return;
        setJob(j);
        if (j.status === 'done' && j.entryId) { setTimeout(() => onDone(j.entryId!), 1200); return; }
        if (j.status === 'error') return;
      } catch {}
      setTimeout(tick, 1200);
    };
    tick();
    return () => { stop = true; };
  }, [jobId]);

  const status = job?.status ?? 'running';
  const steps = (job?.steps ?? []).filter((s, i, a) => !(s.msg.startsWith('Still analyzing') && i < a.length - 1));
  return (
    <div className={`card job ${status}`}>
      <Mascot size={96} mood={status === 'done' ? 'happy' : status === 'error' ? 'idle' : 'think'} />
      <div>
        <h3>{status === 'done' ? 'Added to your library' : status === 'error' ? 'That did not work' : 'Working on it'} {status === 'running' && <span className="dotload"><i /><i /><i /></span>}</h3>
        {status === 'running' && <div className="progress"><i /></div>}
        <ul>{steps.map((s, i) => <li key={i}>{s.msg}</li>)}</ul>
        {job?.error && <p className="err">{job.error}</p>}
      </div>
    </div>
  );
}
