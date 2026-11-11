import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { subscribeNewsletter } from '../../services/api';
import { buildNewsletterMessage, buildWhatsAppUrl } from '../../utils/whatsapp';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setStatus('error');
      setError('Enter a valid email address.');
      return;
    }
    setStatus('loading');
    try {
      await subscribeNewsletter(cleanEmail);
    } catch {
      // Even if local/DB storage fails, still send to WhatsApp
    }
    setStatus('done');
    setEmail('');
    window.location.href = buildWhatsAppUrl(buildNewsletterMessage(cleanEmail));
  };

  if (status === 'done') {
    return <p className="flex items-center gap-2 text-sm text-accent"><Check className="h-4 w-4" /> Opening WhatsApp to confirm your subscription…</p>;
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <label htmlFor="newsletter-email" className="sr-only">Email address</label>
      <div className="flex border-b border-line focus-within:border-white">
        <input id="newsletter-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
          placeholder="Your email" className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-muted" />
        <button type="submit" disabled={status === 'loading'} aria-label="Subscribe" className="flex h-12 w-12 shrink-0 items-center justify-center hover:text-accent disabled:opacity-40">
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
      {status === 'error' && <p className="mt-2 text-xs text-red-400" role="alert">{error}</p>}
    </form>
  );
}
