import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL || 'https://ubdnxxkbgpisgigadcnk.supabase.co';
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_pnn1dvMyvAiuBFFtXSXWfA_QuXqZ2hf';

/** True when Supabase env vars are present. Otherwise the app runs in local demo mode. */
export const isSupabaseConfigured = Boolean(url && anonKey);

// Only the public anon key is ever used in the browser. Security is enforced by RLS (see supabase/schema.sql).
export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;

export const STORAGE_BUCKET = 'motion-media';

