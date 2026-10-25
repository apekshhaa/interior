import crypto from 'node:crypto';

export function createBookingReference(): string {
  return `CT-${new Date().getFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}
