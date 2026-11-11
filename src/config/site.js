/**
 * Central site configuration.
 * Change the values here — nothing else in the codebase needs editing.
 */
export const SITE = {
  name: 'MOTION',
  tagline: 'BUILT TO MOVE.',

  // WhatsApp number (07045678882 -> 2347045678882 in international format for wa.me).
  // Can also be overridden with VITE_WHATSAPP_NUMBER in .env
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '2347045678882',

  currency: { code: 'NGN', symbol: '₦', locale: 'en-NG' },

  contact: {
    email: 'danielilesanmi04@gmail.com',
    phone: '0704 567 8882',
    address: 'Lagos, Nigeria',
  },

  social: {
    instagram: 'https://instagram.com/that_boy_diles',
    tiktok: 'https://tiktok.com/@that_boy_diles',
  },

  // Show a "low stock" hint at or below this number
  lowStockThreshold: 5,

  // Authorized admin credentials (can also be overridden via VITE_ADMIN_EMAIL / VITE_ADMIN_PASSWORD in .env)
  admin: {
    emails: [
      (import.meta.env.VITE_ADMIN_EMAIL || 'danielilesanmi@gmail.com').toLowerCase(),
      'danielilesanmi@gmail.com',
      'danieililesanmi@gmail.com',
      'danielilesanmi04@gmail.com',
      'danieililesanmi04@gmail.com',
      'admin@motion.com',
    ],
    defaultPassword: import.meta.env.VITE_ADMIN_PASSWORD || 'MotionAdmin2026!',
  },
};
