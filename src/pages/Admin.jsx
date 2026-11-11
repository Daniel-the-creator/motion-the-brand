import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, KeyRound, Lock, LogOut, RotateCcw, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCatalog } from '../context/CatalogContext';
import { useUI } from '../context/UIContext';
import { resetDemoData } from '../services/api';
import { LOGO_SRC } from '../config/images';
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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-x flex min-h-screen items-center justify-center pt-24 pb-16">
      <form onSubmit={submit} className="w-full max-w-md space-y-6 border border-line bg-surface p-8 md:p-10">
        <div className="flex items-center justify-between border-b border-line pb-5">
          <div>
            <p className="eyebrow flex items-center gap-1.5 text-white">
              <Lock className="h-3.5 w-3.5" /> Restricted Access
            </p>
            <h1 className="display mt-1 text-4xl">Admin Portal</h1>
          </div>
          <img src={LOGO_SRC} alt="MOTION" className="h-10 w-auto" />
        </div>

        <p className="text-xs leading-relaxed text-muted">
          Sign in with your authorized MOTION administrator credentials to manage products, drops, collections, and site content.
        </p>

        {user && (
          <p className="flex gap-2 border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            <ShieldAlert className="h-4 w-4 shrink-0" /> {user.email} is not authorized as an administrator.
          </p>
        )}

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[0.65rem] uppercase tracking-[0.22em] text-muted">
              Admin Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              className="field"
              placeholder="danielilesanmi@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[0.65rem] uppercase tracking-[0.22em] text-muted">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                className="field pr-11"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <p className="border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="min-h-12 w-full bg-white text-[0.72rem] font-medium uppercase tracking-[0.22em] text-ink transition-colors hover:bg-accent disabled:opacity-50"
        >
          {busy ? 'Authenticating…' : 'Sign In to Admin'}
        </button>

        {user && (
          <button
            type="button"
            onClick={signOut}
            className="w-full text-xs uppercase tracking-widest text-muted underline hover:text-white"
          >
            Sign out
          </button>
        )}

        <div className="border-t border-line pt-4 text-center">
          <Link to="/" className="text-[0.68rem] uppercase tracking-[0.22em] text-muted hover:text-white">
            ← Return to Storefront
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function Admin() {
  const { user, isAdmin, loading, signOut, updatePassword } = useAuth();
  const { loading: catalogLoading, content } = useCatalog();
  const { notify } = useUI();
  const [tab, setTab] = useState('products');
  const [showPwdForm, setShowPwdForm] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [pwdBusy, setPwdBusy] = useState(false);

  if (loading || (catalogLoading && !content)) {
    return (
      <div className="pt-32">
        <Spinner />
      </div>
    );
  }

  // Always require admin authentication when visiting /admin
  if (!isAdmin) return <Login />;

  const Active = TABS.find((t) => t.id === tab).C;

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdBusy(true);
    try {
      await updatePassword(currentPwd, newPwd);
      setCurrentPwd('');
      setNewPwd('');
      setShowPwdForm(false);
      notify('Admin password updated');
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setPwdBusy(false);
    }
  };

  return (
    <div className="container-x pb-10 pt-28 md:pt-36">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.24em] text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" /> Active Admin Session
            </span>
            {user?.email && (
              <span className="text-xs text-muted">{user.email}</span>
            )}
          </div>
          <h1 className="display text-5xl md:text-7xl">Admin</h1>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-widest">
          <Link to="/" className="text-muted hover:text-white">
            View site
          </Link>
          <button
            type="button"
            onClick={() => setShowPwdForm((v) => !v)}
            className="flex items-center gap-1.5 text-muted hover:text-white"
          >
            <KeyRound className="h-3.5 w-3.5" /> Change password
          </button>
          <button
            type="button"
            onClick={async () => {
              if (window.confirm('Reset catalog back to the default DROP 001 products?')) {
                await resetDemoData();
                window.location.reload();
              }
            }}
            className="flex items-center gap-1.5 text-muted hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset default catalog
          </button>
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-2 border border-line bg-surface px-3.5 py-2 text-white hover:border-white"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </div>

      {showPwdForm && (
        <form
          onSubmit={handlePasswordChange}
          className="mb-8 flex flex-wrap items-end gap-4 border border-line bg-surface p-5"
        >
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 block text-[0.65rem] uppercase tracking-[0.2em] text-muted">
              Current Password
            </label>
            <input
              type="password"
              required
              className="field"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
            />
          </div>
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 block text-[0.65rem] uppercase tracking-[0.2em] text-muted">
              New Password (min 6 chars)
            </label>
            <input
              type="password"
              required
              minLength={6}
              className="field"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pwdBusy}
              className="min-h-11 bg-white px-5 text-xs uppercase tracking-[0.2em] text-ink hover:bg-accent disabled:opacity-50"
            >
              {pwdBusy ? 'Saving…' : 'Update Password'}
            </button>
            <button
              type="button"
              onClick={() => setShowPwdForm(false)}
              className="min-h-11 border border-line px-4 text-xs uppercase tracking-[0.2em] text-muted hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="no-scrollbar mb-8 flex gap-1 overflow-x-auto border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id}
            className={`-mb-px shrink-0 border-b-2 px-4 py-3 text-xs uppercase tracking-[0.2em] transition-colors ${
              tab === t.id ? 'border-white text-white' : 'border-transparent text-muted hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Active />
    </div>
  );
}
