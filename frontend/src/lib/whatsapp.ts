const configuredNumber = import.meta.env.VITE_WHATSAPP_NUMBER?.trim() || '';

export function getWhatsAppNumber(): string | null {
  return /^\d{8,15}$/.test(configuredNumber) ? configuredNumber : null;
}

export function buildWhatsAppUrl(message: string): string | null {
  const number = getWhatsAppNumber();
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : null;
}

export function buildSmsUrl(message: string): string | null {
  const number = getWhatsAppNumber();
  return number ? `sms:+${number}?body=${encodeURIComponent(message)}` : null;
}
