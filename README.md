# MOTION — Streetwear storefront

React + Vite + Tailwind CSS + Framer Motion + React Router + Supabase.

## Run

```bash
npm install
npm run dev
```

Works immediately in **demo mode** (seed products, data saved in your browser). Admin is at `/admin`.

## Replace your branding

| What | Where |
|---|---|
| Logo | Replace `public/brand/logo.svg` (or change `LOGO_SRC` in `src/config/images.js` to e.g. `/brand/logo.png`) |
| Hero image, promo banner, about images | Admin → **Site content** |
| Product images | Admin → **Products** → upload (first image = main) |
| Collection covers | Admin → **Collections** |
| WhatsApp number, socials, contact info | `src/config/site.js` (or `VITE_WHATSAPP_NUMBER` in `.env`) — format `2348012345678` |
| Size guide tables | `SIZE_GUIDE` in `src/data/seed.js` |

## Enable Supabase (real database + secure admin)

1. Create a project at supabase.com.
2. SQL Editor → run `supabase/schema.sql` (tables, Row Level Security, `motion-media` storage bucket).
3. Authentication → Users → **Add user** (your admin email + password).
4. Run: `insert into admin_users (user_id) select id from auth.users where email = 'you@example.com';`
5. Copy `.env.example` to `.env` and fill `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (Project Settings → API → **anon** key).
6. Restart `npm run dev`. Optionally add the seed products via Admin.

**Security:** only the public anon key is used in the browser. The service-role key is never needed or used. Public visitors can only read; writes/uploads require a signed-in user listed in `admin_users`, enforced by RLS on the database.

## WhatsApp checkout

`src/utils/whatsapp.js` builds the order message and a `https://wa.me/<number>?text=<encoded>` link. The customer reviews and sends the message themselves; no payment is claimed.

## Structure

```
src/
  config/     site.js (WhatsApp, socials), images.js (logo, placeholders)
  context/    Catalog, Cart (localStorage), Auth, UI
  services/   api.js (only file that talks to Supabase/demo store)
  data/       seed.js (sample products, collections, content)
  components/ layout, product, cart, home, admin, ui
  pages/      Home, Shop, ProductDetails, Collections, About, Contact, Shipping, Admin
  utils/      format.js, whatsapp.js
supabase/schema.sql
```
