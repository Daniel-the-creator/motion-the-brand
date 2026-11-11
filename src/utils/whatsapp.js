import { SITE } from '../config/site';
import { formatPrice } from './format';

/** Builds the plain-text order message from cart items. */
export function buildOrderMessage(items) {
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const lines = items.map((item, idx) => {
    const parts = [`${idx + 1}. ${item.name}`];
    if (item.size) parts.push(`   Size: ${item.size}`);
    if (item.color) parts.push(`   Color: ${item.color}`);
    parts.push(`   Quantity: ${item.quantity}`);
    parts.push(`   Price: ${formatPrice(item.price)} each`);
    parts.push(`   Subtotal: ${formatPrice(item.price * item.quantity)}`);
    return parts.join('\n');
  });

  return [
    'Hello MOTION,',
    '',
    'I would like to place an order.',
    '',
    'ORDER DETAILS:',
    '',
    lines.join('\n\n'),
    '',
    `TOTAL: ${formatPrice(total)}`,
    '',
    'Please confirm availability and provide payment details.',
    '',
    'Thank you.',
  ].join('\n');
}

export function buildWhatsAppUrl(message, number = SITE.whatsappNumber) {
  let digits = String(number).replace(/\D/g, '');
  // Convert local Nigerian 11-digit number (e.g. 07045678882) to international 234 format
  if (digits.length === 11 && digits.startsWith('0')) {
    digits = `234${digits.slice(1)}`;
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function whatsappLink(text = 'Hello MOTION,') {
  return buildWhatsAppUrl(text);
}

/** Builds the pre-filled WhatsApp message when a client joins the newsletter. */
export function buildNewsletterMessage(email) {
  return [
    'Hello MOTION,',
    '',
    'I would like to join the MOTION newsletter for upcoming drops and updates.',
    '',
    `Email: ${email}`,
    '',
    'Thank you.',
  ].join('\n');
}

/** Opens WhatsApp with the order. Returns false if the cart is empty. */
export function checkoutViaWhatsApp(items) {
  if (!items.length) return false;
  const url = buildWhatsAppUrl(buildOrderMessage(items));
  // location.href is more reliable than window.open on mobile (popup blockers)
  window.location.href = url;
  return true;
}

