import { useEffect, useState } from 'react';
import { fetchSubscribers } from '../../services/api';
import { Spinner } from '../ui/States';

export default function SubscribersTab() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { fetchSubscribers().then(setRows).catch((e) => setError(e.message)); }, []);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!rows) return <Spinner />;

  const download = () => {
    const csv = ['email', ...rows.map((r) => r.email)].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'motion-subscribers.csv';
    a.click();
  };

  return (
    <div className="max-w-xl">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">{rows.length} subscribers</p>
        {rows.length > 0 && <button type="button" onClick={download} className="text-xs uppercase tracking-widest underline hover:text-accent">Export CSV</button>}
      </div>
      <ul className="divide-y divide-line border border-line bg-surface">
        {rows.map((r) => <li key={r.email} className="p-3 text-sm">{r.email}</li>)}
        {rows.length === 0 && <li className="p-6 text-center text-sm text-muted">No subscribers yet.</li>}
      </ul>
    </div>
  );
}

