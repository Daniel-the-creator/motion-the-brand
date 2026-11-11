import { useState } from 'react';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { SITE } from '../config/site';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import Button from '../components/ui/Button';

export default function Contact() {
  const [form, setForm] = useState({ name: '', message: '' });
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) { setError('Please fill in your name and message.'); return; }
    setError('');
    const text = `Hello MOTION,\n\n${form.message.trim()}\n\n— ${form.name.trim()}`;
    window.location.href = buildWhatsAppUrl(text);
  };

  return (
    <div className="container-x pb-10 pt-32 md:pt-40">
      <p className="eyebrow mb-3">Get in touch</p>
      <h1 className="display text-6xl md:text-9xl">Contact</h1>
      <div className="mt-14 grid gap-14 md:grid-cols-2">
        <ul className="space-y-6 text-sm">
          <li className="flex items-center gap-4"><Mail className="h-5 w-5 text-muted" /><a href={`mailto:${SITE.contact.email}`} className="hover:text-accent">{SITE.contact.email}</a></li>
          <li className="flex items-center gap-4"><Phone className="h-5 w-5 text-muted" /><a href={`tel:${SITE.contact.phone.replace(/\s/g, '')}`} className="hover:text-accent">{SITE.contact.phone}</a></li>
          <li className="flex items-center gap-4"><MapPin className="h-5 w-5 text-muted" />{SITE.contact.address}</li>
        </ul>
        <form onSubmit={submit} className="space-y-4" noValidate>
          <label className="block"><span className="eyebrow mb-2 block">Name</span><input className="field" value={form.name} onChange={set('name')} /></label>
          <label className="block"><span className="eyebrow mb-2 block">Message</span><textarea rows={5} className="field" value={form.message} onChange={set('message')} /></label>
          {error && <p className="text-xs text-red-400" role="alert">{error}</p>}
          <Button type="submit"><MessageCircle className="h-4 w-4" /> Send via WhatsApp</Button>
        </form>
      </div>
    </div>
  );
}
