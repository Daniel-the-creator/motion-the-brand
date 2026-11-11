import { placeholder } from '../config/images';

const SIZES_APPAREL = ['S', 'M', 'L', 'XL', 'XXL'];
const BLACK = { name: 'Black', hex: '#0d0d0d' };
const WHITE = { name: 'White', hex: '#eeeeee' };
const RED = { name: 'Red', hex: '#c81e1e' };
const BURGUNDY = { name: 'Burgundy', hex: '#5e111a' };
const PURPLE = { name: 'Purple', hex: '#2a1170' };

// Product photos live in public/images/products/. Swap files there (same name) or edit products in /admin.
const P = (file, ext = 'jpg') => `/images/products/${file}.${ext}`;
// A color can carry its own photo: picking that color on the product page jumps to it.
const withImage = (color, file, ext = 'jpg') => ({ ...color, image: P(file, ext) });

export const seedCategories = [
  { id: 'cat-tshirts', name: 'T-Shirts', slug: 't-shirts', sortOrder: 1 },
  { id: 'cat-hoodies', name: 'Hoodies', slug: 'hoodies', sortOrder: 2 },
  { id: 'cat-sweatshirts', name: 'Sweatshirts', slug: 'sweatshirts', sortOrder: 3 },
  { id: 'cat-pants', name: 'Pants', slug: 'pants', sortOrder: 4 },
  { id: 'cat-accessories', name: 'Accessories', slug: 'accessories', sortOrder: 5 },
];

export const seedCollections = [
  { id: 'col-drop001', name: 'DROP 001', slug: 'drop-001', description: 'The first official MOTION drop. Signature emblem pieces & statement back prints in heavyweight cotton.', coverImage: P('motion-inclined-black', 'png'), sortOrder: 1 },
  { id: 'col-essentials', name: 'MOTION ESSENTIALS', slug: 'motion-essentials', description: 'The foundation. Heavyweight staples featuring the iconic MOTION emblem, cut for everyday movement.', coverImage: P('motion-emblem-oversized'), sortOrder: 2 },
  { id: 'col-street', name: 'MOTION STREET', slug: 'motion-street', description: 'Built for the city after dark. Oversized silhouettes, bold graphics.', coverImage: P('swaguu-black'), sortOrder: 3 },
  { id: 'col-archive', name: 'MOTION ARCHIVE', slug: 'motion-archive', description: 'Selected graphic pieces from the vault, returned for a limited time.', coverImage: P('beyond-time-white'), sortOrder: 4 },
];

const now = Date.now();
const day = 86400000;
const ago = (d) => new Date(now - d * day).toISOString();

const tee = (o) => ({ categoryId: 'cat-tshirts', sizes: SIZES_APPAREL, isNew: false, ...o });

export const seedProducts = [
  // --- DROP 001 COLLECTION (Official MOTION logo & graphic releases) ---
  tee({
    id: 'p-d1',
    name: 'MOTION Inclined Tee',
    slug: 'motion-inclined-tee',
    description: 'DROP 001 flagship piece. Features the circular MOTION emblem on the front chest and a bold red-shadowed "MOTION INCLINED" graphic across the back. 280gsm heavyweight black cotton.',
    price: 18000,
    images: [P('motion-inclined-back'), P('motion-inclined-front'), P('motion-inclined-black', 'png')],
    colors: [BLACK, WHITE],
    stock: 35,
    isNew: true,
    collectionIds: ['col-drop001', 'col-essentials'],
    createdAt: ago(0.2),
  }),
  tee({
    id: 'p-d2',
    name: 'Built Like An Alien Tee',
    slug: 'built-like-an-alien-tee',
    description: 'DROP 001 graphic release. "Built Like An Alien. Hustle Like A Human." Front artwork with red-cap alien portrait and the MOTION emblem stamp at the lower hem. Available in Black and White.',
    price: 18000,
    images: [P('alien-hustle-black'), P('alien-hustle-white'), P('alien-hustle-tee')],
    colors: [withImage(BLACK, 'alien-hustle-black'), withImage(WHITE, 'alien-hustle-white')],
    stock: 30,
    isNew: true,
    collectionIds: ['col-drop001', 'col-street'],
    createdAt: ago(0.4),
  }),
  tee({
    id: 'p-d3',
    name: 'Risk Takers Tee',
    slug: 'risk-takers-tee',
    description: 'DROP 001 front-and-back edition. Clean MOTION chest emblem on the front; full back character illustration with "RISK TAKERS — if you did it before you do it again."',
    price: 18000,
    images: [P('risk-takers-back'), P('risk-takers-front'), P('risk-takers-white')],
    colors: [WHITE],
    stock: 28,
    isNew: true,
    collectionIds: ['col-drop001', 'col-street'],
    createdAt: ago(0.6),
  }),
  tee({
    id: 'p-d4',
    name: 'Stay Humble And Hustle Hard Tee',
    slug: 'stay-humble-hustle-hard-tee',
    description: 'DROP 001 statement tee. Minimalist MOTION emblem at the collar front paired with an architectural "STAY HUMBLE / HUSTLE HARD" back print on heavyweight white cotton.',
    price: 17000,
    images: [P('stay-humble-back'), P('stay-humble-front'), P('stay-humble-white')],
    colors: [WHITE],
    stock: 32,
    isNew: true,
    collectionIds: ['col-drop001', 'col-essentials'],
    createdAt: ago(0.8),
  }),
  tee({
    id: 'p-d5',
    name: 'MOTION Core Emblem Oversized Tee',
    slug: 'motion-core-emblem-oversized-tee',
    description: 'DROP 001 core heavyweight boxy tee with drop shoulders and the signature MOTION circular emblem centered on the chest. Available in Jet Black, Crimson Red, and White.',
    price: 15000,
    images: [P('motion-emblem-oversized-black'), P('motion-emblem-oversized-red'), P('motion-emblem-oversized-white'), P('motion-emblem-oversized')],
    colors: [
      withImage(BLACK, 'motion-emblem-oversized-black'),
      withImage(RED, 'motion-emblem-oversized-red'),
      withImage(WHITE, 'motion-emblem-oversized-white'),
    ],
    stock: 50,
    isNew: true,
    collectionIds: ['col-drop001', 'col-essentials'],
    createdAt: ago(1.0),
  }),
  tee({
    id: 'p-d6',
    name: 'MOTION x Burtizzy Oversized Tee',
    slug: 'motion-burtizzy-oversized-tee',
    description: 'DROP 001 special edition. Signature MOTION chest emblem in white on the front and bold red-block "BURTIZZY" lettering across the back.',
    price: 18000,
    images: [P('motion-burtizzy-back'), P('motion-burtizzy-front'), P('motion-burtizzy-black', 'png')],
    colors: [BLACK, WHITE],
    stock: 25,
    isNew: true,
    collectionIds: ['col-drop001'],
    createdAt: ago(1.2),
  }),
  tee({
    id: 'p-d7',
    name: 'MOTION Split Wordmark Tee',
    slug: 'motion-split-wordmark-tee',
    description: 'DROP 001 essential tee featuring the tilted "M | OTION" split wordmark across the chest on jet-black combed cotton.',
    price: 15000,
    images: [P('motion-split-black')],
    colors: [BLACK, WHITE, PURPLE, RED, BURGUNDY],
    stock: 40,
    isNew: true,
    collectionIds: ['col-drop001', 'col-essentials'],
    createdAt: ago(1.4),
  }),
  tee({
    id: 'p-d8',
    name: 'MOTION Core Emblem Fitted Tee',
    slug: 'motion-core-emblem-fitted-tee',
    description: 'DROP 001 sculpted fitted silhouette with the signature MOTION circular emblem at the chest. Soft stretch-cotton blend in Black, Burgundy, and White.',
    price: 12000,
    images: [P('motion-emblem-fitted-black'), P('motion-emblem-fitted-burgundy'), P('motion-emblem-fitted-white'), P('motion-emblem-fitted')],
    colors: [
      withImage(BLACK, 'motion-emblem-fitted-black'),
      withImage(BURGUNDY, 'motion-emblem-fitted-burgundy'),
      withImage(WHITE, 'motion-emblem-fitted-white'),
    ],
    stock: 45,
    isNew: true,
    collectionIds: ['col-drop001', 'col-essentials'],
    createdAt: ago(1.6),
  }),

  // --- EXISTING GRAPHIC LINEUP ---
  tee({ id: 'p-1', name: 'MOTION Tee', slug: 'motion-tee', description: 'Our signature heavyweight tee. Bubble-letter MOTION wordmark over a night-drive silhouette. Boxy fit, 240gsm cotton.', price: 15000, images: [P('motion-black')], colors: [BLACK], stock: 40, isNew: false, collectionIds: ['col-essentials', 'col-drop001'], createdAt: ago(2) }),
  tee({ id: 'p-2', name: 'Phantom Tee', slug: 'phantom-tee', description: 'A skeletal hand tears through the fabric. Oversized fit, heavyweight cotton, screen-printed graphic. Available in three colorways.', price: 17000,
    images: [P('phantom-black'), P('phantom-white'), P('phantom-purple')],
    colors: [withImage(BLACK, 'phantom-black'), withImage(WHITE, 'phantom-white'), withImage(PURPLE, 'phantom-purple')], stock: 36, isNew: false, collectionIds: ['col-street'], createdAt: ago(3) }),
  tee({ id: 'p-3', name: 'Nocturne Tee', slug: 'nocturne-tee', description: 'A razor-legged spider under an arched Nocturne wordmark. Oversized, drop-shoulder, heavyweight cotton.', price: 17000,
    images: [P('nocturne-red'), P('nocturne-white')],
    colors: [withImage(RED, 'nocturne-red'), withImage(WHITE, 'nocturne-white')], stock: 30, isNew: false, collectionIds: ['col-street'], createdAt: ago(4) }),
  tee({ id: 'p-4', name: 'Swaguu Tee', slug: 'swaguu-tee', description: 'Skate-park attitude. Full-colour front graphic with arched Swaguu lettering on a black heavyweight tee.', price: 18000, images: [P('swaguu-black')], colors: [BLACK], stock: 24, isNew: false, collectionIds: ['col-street'], createdAt: ago(5) }),
  tee({ id: 'p-5', name: 'Get Rich Or Die Tryin Tee', slug: 'get-rich-or-die-tryin-tee', description: 'Gothic lettering, heavy ink. Oversized fit in soft-washed cotton.', price: 15000, images: [P('get-rich-white')], colors: [WHITE], stock: 22, isNew: false, collectionIds: ['col-street'], createdAt: ago(10) }),
  tee({ id: 'p-6', name: 'No Risk No Story Tee', slug: 'no-risk-no-story-tee', description: 'Brush-stroke type with a claw-mark slash in red. Oversized fit, drop shoulder.', price: 17000, images: [P('no-risk-white')], colors: [WHITE], stock: 26, isNew: false, collectionIds: ['col-street'], createdAt: ago(12) }),
  tee({ id: 'p-7', name: 'We Are Who We Are Tee', slug: 'we-are-who-we-are-tee', description: 'Split-face graphic with stacked block lettering. Classic fit, black cotton.', price: 15000, images: [P('we-are-black')], colors: [BLACK], stock: 20, isNew: false, collectionIds: ['col-archive'], createdAt: ago(20) }),
  tee({ id: 'p-8', name: 'La Casa Side Print Tee', slug: 'la-casa-side-print-tee', description: 'Asymmetric side-print graphic with vertical lettering. Classic fit, black cotton.', price: 15000, images: [P('la-casa-black')], colors: [BLACK], stock: 18, isNew: false, collectionIds: ['col-archive'], createdAt: ago(25) }),
  tee({ id: 'p-9', name: 'XX Drip Tee', slug: 'xx-drip-tee', description: 'Dripping X-eyed smile across the chest. Oversized, drop shoulder, white heavyweight cotton.', price: 15000, images: [P('xx-white')], colors: [WHITE], stock: 28, isNew: false, collectionIds: ['col-street'], createdAt: ago(15) }),
  tee({ id: 'p-10', name: 'Anonymous Tee', slug: 'anonymous-tee', description: 'Hooded figure and geometric symbols in red and white on black. Oversized fit.', price: 13000, images: [P('anonymous-black')], colors: [BLACK], stock: 3, isNew: false, collectionIds: ['col-archive'], createdAt: ago(30) }),
  tee({ id: 'p-11', name: 'Life Is Short Tee', slug: 'life-is-short-tee', description: 'Minimal clock-hand typography. Clean, quiet, everyday white tee.', price: 15000, images: [P('life-white')], colors: [WHITE], stock: 45, isNew: false, collectionIds: ['col-essentials'], createdAt: ago(40) }),
  tee({ id: 'p-12', name: 'Beyond Time Tee', slug: 'beyond-time-tee', description: 'A reaper walks toward a shattered hourglass. Large-format ink-wash print on a white tee.', price: 30000, images: [P('beyond-time-white')], colors: [WHITE], stock: 15, isNew: false, collectionIds: ['col-archive'], createdAt: ago(6) }),
];

export const seedContent = {
  hero: {
    image: placeholder('Campaign Hero', 1, '16:9'),
    eyebrow: 'DROP 001 / CAMPAIGN',
    headline: 'CREATING PATH TO MOVE.',
    subtext: 'Streetwear designed for those who refuse to stand still.',
  },
  promo: {
    enabled: true,
    text: 'DROP 001 IS LIVE — LIMITED PIECES, NEVER RESTOCKED',
    linkLabel: 'SHOP DROP 001',
    linkUrl: '/collections/drop-001',
    image: P('motion-emblem-oversized'),
    title: 'DROP 001',
    description: 'Signature MOTION emblem pieces and front-to-back graphic statements. Limited numbers, never restocked.',
  },
  about: {
    headline: "WE DON'T FOLLOW MOVEMENT. WE CREATE IT.",
    story: 'MOTION began as a sketchbook and a stubborn idea: that streetwear could carry the energy of the city without shouting. Every piece is cut, tested and refined until it moves the way you do.\n\nWe build heavyweight fabrics, considered silhouettes and graphics with intent — made in small runs, so what you wear stays yours.',
    philosophy: 'Restraint is the loudest statement. We design in black, bone, crimson and white, and let fit, fabric and form do the talking. Nothing unnecessary. Nothing borrowed.',
    represents: 'Motion is momentum — the walk to the studio, the late train home, the leap into something new. MOTION represents the ones who never wait for permission to move.',
    images: [P('motion-inclined-black', 'png'), P('alien-hustle-tee'), P('risk-takers-white')],
  },
};

export const SIZE_GUIDE = {
  tops: {
    title: 'Tops (T-Shirts, Hoodies, Sweatshirts)',
    columns: ['Size', 'Chest (in)', 'Length (in)', 'Shoulder (in)'],
    rows: [['S', '42', '27', '19'], ['M', '44', '28', '20'], ['L', '46', '29', '21'], ['XL', '48', '30', '22'], ['XXL', '50', '31', '23']],
  },
  pants: {
    title: 'Pants',
    columns: ['Size', 'Waist (in)', 'Hip (in)', 'Inseam (in)'],
    rows: [['28', '28', '38', '30'], ['30', '30', '40', '30'], ['32', '32', '42', '31'], ['34', '34', '44', '31'], ['36', '36', '46', '32']],
  },
};
