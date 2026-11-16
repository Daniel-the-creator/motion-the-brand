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

/**
 * Resolves the image URL for a given color on a product.
 * - Uses `colorObj.image` when distinct images are assigned to colors.
 * - If all colors were saved pointing to the same first image (or have no image)
 *   and the product has multiple gallery images, maps colorIndex -> product.images[colorIndex].
 */
export function resolveColorImage(product, colorObj, colorIndex = 0) {
  const images = product?.images || [];
  const colors = product?.colors || [];
  if (!colorObj) return images[0] || '';

  const allSameImage =
    colors.length > 1 &&
    colors.every((c) => !c.image || c.image === images[0]);

  if (!allSameImage && colorObj.image) {
    return colorObj.image;
  }

  return images[colorIndex] || colorObj.image || images[0] || '';
}

/**
 * Computes booking / pre-order status & countdown for limited slot drops.
 */
export function getBookingState(product, nowMs = Date.now()) {
  if (!product?.isBooking) return null;
  const endsAtStr = product.bookingEndsAt || '2026-12-15T23:59:59';
  const endsAtMs = new Date(endsAtStr).getTime();
  const diff = Math.max(0, endsAtMs - nowMs);
  const expired = nowMs > endsAtMs;
  const daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minsLeft = Math.floor((diff / (1000 * 60)) % 60);
  const totalSlots = product.bookingSlots || 15;
  const remainingSlots = Math.max(0, product.stock ?? totalSlots);

  return {
    isBooking: true,
    expired,
    deadlineLabel: product.bookingDeadline || 'December 15',
    endsAtStr,
    daysLeft,
    hoursLeft,
    minsLeft,
    totalSlots,
    remainingSlots,
  };
}

