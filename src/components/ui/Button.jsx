import { Link } from 'react-router-dom';

const base =
  'inline-flex items-center justify-center gap-2 px-7 py-4 text-[0.72rem] font-medium uppercase tracking-[0.22em] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-40 min-h-12';

const variants = {
  primary: 'bg-white text-ink hover:bg-accent',
  outline: 'border border-white/70 text-white hover:bg-white hover:text-ink',
  ghost: 'border border-line text-white hover:border-accent',
  whatsapp: 'bg-white text-ink hover:bg-accent w-full',
  danger: 'border border-red-900 text-red-400 hover:bg-red-950',
};

/** Renders a router Link (to), anchor (href) or button depending on props. */
export default function Button({ to, href, variant = 'primary', className = '', children, ...rest }) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>;
  if (href) return <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...rest}>{children}</a>;
  return <button type="button" className={cls} {...rest}>{children}</button>;
}

