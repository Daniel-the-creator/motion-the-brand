/**
 * IMAGE MANAGEMENT
 * ----------------
 * LOGO:      replace  public/brand/logo.svg  (or set LOGO_SRC to e.g. '/brand/logo.png').
 * HERO / BANNERS / COLLECTIONS / PRODUCTS: upload via the Admin dashboard (/admin).
 * Until you do, generated placeholders below are used. To use static files instead,
 * drop them in public/images/ and reference them like '/images/hero.jpg'.
 */
export const LOGO_SRC = '/brand/logo.png';

const PALETTE = ['#1b1b1b', '#222222', '#161616', '#262626', '#1d1d1d'];

/** Generates an on-brand dark placeholder image (data URI SVG). */
export function placeholder(label = 'MOTION', seed = 0, ratio = '4:5') {
  const [w, h] = ratio === '16:9' ? [1600, 900] : ratio === '1:1' ? [1000, 1000] : [1000, 1250];
  const bg = PALETTE[Math.abs(seed) % PALETTE.length];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>
<rect width='100%' height='100%' fill='${bg}'/>
<path d='M0 ${h} L${w} 0' stroke='#2c2c2c' stroke-width='2'/>
<text x='50%' y='50%' fill='#3a3a3a' font-family='Arial Black,Arial,sans-serif' font-weight='900' font-size='${w / 9}' letter-spacing='${w / 60}' text-anchor='middle' dominant-baseline='middle'>MOTION</text>
<text x='50%' y='${h / 2 + w / 9}' fill='#555' font-family='Arial,sans-serif' font-size='${w / 40}' letter-spacing='6' text-anchor='middle'>${String(label).toUpperCase().replace(/[<>&']/g, '')}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

