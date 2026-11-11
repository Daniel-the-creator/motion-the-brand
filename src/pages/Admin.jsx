import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCatalog } from '../context/CatalogContext';
import { resetDemoData } from '../services/api';
import { Spinner } from '../components/ui/States';
import ProductsTab from '../components/admin/ProductsTab';
import CategoriesTab from '../components/admin/CategoriesTab';
import CollectionsTab from '../components/admin/CollectionsTab';
import ContentTab from '../components/admin/ContentTab';
import SubscribersTab from '../components/admin/SubscribersTab';

const TABS = [
  { id: 'products', label: 'Products', C: ProductsTab },
  { id: 'categories', label: 'Categories', C: CategoriesTab },
  { id: 'collections', label: 'Collections', C: CollectionsTab },
  { id: 'content', label: 'Site content', C: ContentTab },
  { id: 'subscribers', label: 'Newsletter', C: SubscribersTab },
];

function Login() {
  const { signIn, user, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    try { await signIn(email.trim(), password); } catch (err) { setError(err.message); } finally { setBusy(false); }
  };

  return (
    <div className="container-x flex min-h-screen items-center justify-center pt-20">
      <form onSubmit={submit} className="w-full max-w-sm space-y-5 border border-line bg-surface p-8">
        <h1 className="display text-3xl">Admin</h1>
        {user && <p className="flex gap-2 text-sm text-red-300"><ShieldAlert className="h-5 w-5 shrink-0" /> {user.email} is not an admin. See supabase/schema.sql to grant access.</p>}
        <input type="email" required autoComplete="email" className="field" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" required autoComplete="current-password" className="field" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-xs text-red-400" role="alert">{error}</p>}
        <button type="submit" disabled={busy} className="min-h-12 w-full bg-white text-[0.72rem] uppercase tracking-[0.22em] text-ink disabled:opacity-50">{busy ? 'Signing in…' : 'Sign in'}</button>
        {user && <button type="button" onClick={signOut} className="w-full text-xs uppercase tracking-widest text-muted underline">Sign out</button>}
      </form>
    </div>
  );
}

export default function Admin() {
  const { isAdmin, loading, demoMode, signOut } = useAuth();
  const { loading: catalogLoading, content } = useCatalog();
  const [tab, setTab] = useState('products');

  if (loading || (catalogLoading && !content)) return <div className="pt-32"><Spinner /></div>;
  if (!demoMode && !isAdmin) return <Login />;

  const Active = TABS.find((t) => t.id === tab).C;

  return (
    <div className="container-x pb-10 pt-28 md:pt-36">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Dashboard</p>
          <h1 className="display text-5xl md:text-7xl">Admin</h1>
        </div>
        <div className="flex items-center gap-4 text-xs uppercase tracking-widest">
          <Link to="/" className="text-muted hover:text-white">View site</Link>
          {!demoMode && <button type="button" onClick={signOut} className="flex items-center gap-2 text-muted hover:text-white"><LogOut className="h-4 w-4" /> Sign out</button>}
        </div>
      </div>

      {demoMode && (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border border-line bg-surface p-4 text-sm text-accent">
          <span><strong className="text-white">Demo mode.</strong> Supabase isn't configured, so changes are saved in this browser only. Add your keys to <code>.env</code> to enable secure login and a shared database.</span>
          <button type="button" className="text-xs uppercase tracking-widest underline" onClick={async () => { await resetDemoData(); window.location.reload(); }}>Reset demo data</button>
        </div>
      )}

      <div className="no-scrollbar mb-8 flex gap-1 overflow-x-auto border-b border-line">
        {TABS.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} aria-current={tab === t.id}
            className={`-mb-px shrink-0 border-b-2 px-4 py-3 text-xs uppercase tracking-[0.2em] transition-colors ${tab === t.id ? 'border-white text-white' : 'border-transparent text-muted hover:text-white'}`}>{t.label}</button>
        ))}
      </div>

      <Active />
    </div>
  );
}

