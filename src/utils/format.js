import { SITE } from '../config/site';

/** 25000 -> "₦25,000" */
export function formatPrice(amount) {
  const n = Number(amount) || 0;
  return `${SITE.currency.symbol}${n.toLocaleString('en-NG')}`;
}

export function slugify(str = '') {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function uid() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

