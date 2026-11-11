/**
 * Data service — the ONLY place that talks to Supabase (or the local demo store).
 * Components use the context/hooks, never this file directly.
 *
 * With VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY set -> Supabase.
 * Without them -> local demo mode (seed data + localStorage), so the site runs out of the box.
 */
import { supabase, isSupabaseConfigured, STORAGE_BUCKET } from '../lib/supabase';
import { seedProducts, seedCategories, seedCollections, seedContent } from '../data/seed';
import { SITE } from '../config/site';
import { slugify, uid } from '../utils/format';

const LOCAL_KEY = 'motion_store_db_v5';
const AUTH_SESSION_KEY = 'motion_admin_session_v1';
const AUTH_PWD_KEY = 'motion_admin_pwd_v1';
const authListeners = new Set();

function notifyAuth(user) {
  authListeners.forEach((cb) => cb(user));
}

/* ---------- row mapping (snake_case DB <-> camelCase app) ---------- */
const productFromRow = (r) => ({
  id: r.id, name: r.name, slug: r.slug, description: r.description || '',
  price: Number(r.price), categoryId: r.category_id, images: r.images || [],
  sizes: r.sizes || [], colors: r.colors || [], stock: r.stock ?? 0,
  isNew: !!r.is_new, collectionIds: r.collection_ids || [], createdAt: r.created_at,
});
const productToRow = (p) => ({
  id: p.id, name: p.name, slug: p.slug, description: p.description, price: p.price,
  category_id: p.categoryId || null, images: p.images, sizes: p.sizes, colors: p.colors,
  stock: p.stock, is_new: p.isNew, collection_ids: p.collectionIds,
});
const categoryFromRow = (r) => ({ id: r.id, name: r.name, slug: r.slug, sortOrder: r.sort_order ?? 0 });
const categoryToRow = (c) => ({ id: c.id, name: c.name, slug: c.slug, sort_order: c.sortOrder ?? 0 });
const collectionFromRow = (r) => ({ id: r.id, name: r.name, slug: r.slug, description: r.description || '', coverImage: r.cover_image || '', sortOrder: r.sort_order ?? 0 });
const collectionToRow = (c) => ({ id: c.id, name: c.name, slug: c.slug, description: c.description, cover_image: c.coverImage, sort_order: c.sortOrder ?? 0 });

/* ---------- local demo store ---------- */
function readLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* fall through to seed */ }
  return { products: seedProducts, categories: seedCategories, collections: seedCollections, content: seedContent, subscribers: [] };
}
function writeLocal(db) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(db));
  } catch {
    throw new Error('Browser storage is full. Use smaller images or connect Supabase.');
  }
}
const upsertLocal = (list, item) => (list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? item : x)) : [...list, item]);

const assertOk = ({ error }) => { if (error) throw new Error(error.message); };

/* ---------- catalog ---------- */
export async function fetchCatalog() {
  if (!isSupabaseConfigured) {
    return readLocal();
  }
  const [p, c, col, content] = await Promise.all([
    supabase.from('products').select('*').order('created_at', { ascending: false }),
    supabase.from('categories').select('*').order('sort_order'),
    supabase.from('collections').select('*').order('sort_order'),
    supabase.from('site_content').select('*'),
  ]);
  [p, c, col, content].forEach(assertOk);
  const contentMap = { ...seedContent };
  (content.data || []).forEach((row) => { contentMap[row.key] = { ...seedContent[row.key], ...row.value }; });
  return {
    products: p.data.map(productFromRow),
    categories: c.data.map(categoryFromRow),
    collections: col.data.map(collectionFromRow),
    content: contentMap,
  };
}

export async function saveProduct(input) {
  const product = {
    ...input,
    id: input.id || uid(),
    slug: input.slug || slugify(input.name),
    createdAt: input.createdAt || new Date().toISOString(),
  };
  if (!isSupabaseConfigured) {
    const db = readLocal();
    writeLocal({ ...db, products: upsertLocal(db.products, product) });
    return product;
  }
  const { data, error } = await supabase.from('products').upsert(productToRow(product)).select().single();
  if (error) throw new Error(error.message);
  return productFromRow(data);
}

export async function deleteProduct(id) {
  if (!isSupabaseConfigured) {
    const db = readLocal();
    return writeLocal({ ...db, products: db.products.filter((p) => p.id !== id) });
  }
  assertOk(await supabase.from('products').delete().eq('id', id));
}

export async function saveCategory(input) {
  const cat = { ...input, id: input.id || uid(), slug: input.slug || slugify(input.name) };
  if (!isSupabaseConfigured) {
    const db = readLocal();
    writeLocal({ ...db, categories: upsertLocal(db.categories, cat) });
    return cat;
  }
  assertOk(await supabase.from('categories').upsert(categoryToRow(cat)));
  return cat;
}

export async function deleteCategory(id) {
  if (!isSupabaseConfigured) {
    const db = readLocal();
    return writeLocal({
      ...db,
      categories: db.categories.filter((c) => c.id !== id),
      products: db.products.map((p) => (p.categoryId === id ? { ...p, categoryId: null } : p)),
    });
  }
  assertOk(await supabase.from('categories').delete().eq('id', id));
}

export async function saveCollection(input) {
  const col = { ...input, id: input.id || uid(), slug: input.slug || slugify(input.name) };
  if (!isSupabaseConfigured) {
    const db = readLocal();
    writeLocal({ ...db, collections: upsertLocal(db.collections, col) });
    return col;
  }
  assertOk(await supabase.from('collections').upsert(collectionToRow(col)));
  return col;
}

export async function deleteCollection(id) {
  if (!isSupabaseConfigured) {
    const db = readLocal();
    return writeLocal({
      ...db,
      collections: db.collections.filter((c) => c.id !== id),
      products: db.products.map((p) => ({ ...p, collectionIds: p.collectionIds.filter((x) => x !== id) })),
    });
  }
  assertOk(await supabase.from('collections').delete().eq('id', id));
  // detach from products (array column has no FK)
  const { data } = await supabase.from('products').select('id, collection_ids').contains('collection_ids', [id]);
  await Promise.all((data || []).map((r) =>
    supabase.from('products').update({ collection_ids: r.collection_ids.filter((x) => x !== id) }).eq('id', r.id)));
}

export async function saveContent(key, value) {
  if (!isSupabaseConfigured) {
    const db = readLocal();
    return writeLocal({ ...db, content: { ...db.content, [key]: value } });
  }
  assertOk(await supabase.from('site_content').upsert({ key, value }));
}

/* ---------- images ---------- */
function compressToDataUrl(file, maxSize = 1400, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read image file.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('Invalid image file.'));
      image.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

/** Uploads an image and returns its public URL. */
export async function uploadImage(file, folder = 'products') {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.');
  if (file.size > 10 * 1024 * 1024) throw new Error('Image must be under 10MB.');
  if (!isSupabaseConfigured) return compressToDataUrl(file);
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const path = `${folder}/${uid()}.${ext}`;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, { cacheControl: '31536000', contentType: file.type });
  if (error) throw new Error(error.message);
  return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

/* ---------- newsletter ---------- */
export async function subscribeNewsletter(email) {
  if (!isSupabaseConfigured) {
    const db = readLocal();
    if (db.subscribers?.includes(email)) return;
    return writeLocal({ ...db, subscribers: [...(db.subscribers || []), email] });
  }
  const { error } = await supabase.from('newsletter_subscribers').insert({ email });
  if (error && error.code !== '23505') throw new Error(error.message); // ignore duplicates
}

export async function fetchSubscribers() {
  if (!isSupabaseConfigured) return (readLocal().subscribers || []).map((email) => ({ email }));
  const { data, error } = await supabase.from('newsletter_subscribers').select('email, created_at').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function resetDemoData() {
  if (!isSupabaseConfigured) localStorage.removeItem(LOCAL_KEY);
}

/* ---------- auth ---------- */
function getExpectedPassword() {
  try {
    return localStorage.getItem(AUTH_PWD_KEY) || SITE.admin.defaultPassword;
  } catch {
    return SITE.admin.defaultPassword;
  }
}

export async function signIn(email, password) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();
  if (!normalizedEmail || !cleanPassword) {
    throw new Error('Please enter both your admin email and password.');
  }

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password: cleanPassword });
    if (error) throw new Error(error.message);
    return data.user;
  }

  const isAllowedEmail = SITE.admin.emails.includes(normalizedEmail);
  const expectedPassword = getExpectedPassword();
  if (!isAllowedEmail) {
    throw new Error('This email is not registered as an administrator.');
  }
  if (cleanPassword !== expectedPassword && password !== expectedPassword) {
    throw new Error('Incorrect admin password.');
  }

  const sessionUser = {
    id: 'admin-local',
    email: normalizedEmail,
    role: 'admin',
    signedInAt: new Date().toISOString(),
  };
  sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionUser));
  notifyAuth(sessionUser);
  return sessionUser;
}

export async function signOut() {
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  notifyAuth(null);
  if (isSupabaseConfigured) await supabase.auth.signOut();
}

export async function updateAdminPassword(currentPassword, newPassword) {
  if (!newPassword || newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters.');
  }
  if (isSupabaseConfigured) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error(error.message);
    return;
  }
  const expected = getExpectedPassword();
  if (currentPassword !== expected) {
    throw new Error('Current password is incorrect.');
  }
  localStorage.setItem(AUTH_PWD_KEY, newPassword);
}

/** Returns true if the current session belongs to an authorized admin. */
export async function checkIsAdmin(user) {
  if (!user) return false;
  if (!isSupabaseConfigured) {
    return SITE.admin.emails.includes((user.email || '').toLowerCase());
  }
  const { data, error } = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle();
  return (!error && !!data) || SITE.admin.emails.includes((user.email || '').toLowerCase());
}

export function onAuthChange(callback) {
  authListeners.add(callback);
  let unsubSupabase = () => {};
  if (isSupabaseConfigured) {
    const { data } = supabase.auth.onAuthStateChange((_e, session) => callback(session?.user ?? null));
    unsubSupabase = () => data.subscription.unsubscribe();
  }
  return () => {
    authListeners.delete(callback);
    unsubSupabase();
  };
}

export async function getCurrentUser() {
  if (isSupabaseConfigured) {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) return data.session.user;
  }
  try {
    const raw = sessionStorage.getItem(AUTH_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

