import { BookingDetails, CartItem } from '../types';

function addField(parts: string[], label: string, value: string | undefined) {
  const trimmed = value?.trim();
  if (trimmed) parts.push(`${label}: ${trimmed}`);
}

export function buildBookingWhatsAppMessage(
  details: BookingDetails,
  bookingReference: string,
  items: CartItem[],
): string {
  const parts = [
    'Hello COLOUR TONE, I would like to enquire about a painting project.',
  ];

  addField(parts, 'Booking Reference', bookingReference);
  addField(parts, 'Customer Name', `${details.firstName} ${details.lastName}`);
  addField(parts, 'Email', details.email);
  addField(parts, 'Phone', details.phone);
  addField(parts, 'Property Address', details.propertyAddress);
  addField(parts, 'Property Type', details.propertyType);
  addField(parts, 'Square Footage', details.approxArea);
  addField(parts, 'Selected Service', details.selectedServices.join(', '));
  addField(parts, 'Selected Textures', details.preferredTextures.join(', '));
  addField(parts, 'Selected Products', items.map(({ product, quantity }) => `${product.name} (quantity: ${quantity})`).join(', '));
  addField(parts, 'Selected Colours', details.selectedColours?.join(', '));
  addField(
    parts,
    'Preferred Consultation',
    details.preferredDate
      ? `${details.preferredDate}${details.preferredTime ? ` (${details.preferredTime})` : ''}`
      : details.preferredTime,
  );
  addField(parts, 'Additional Details', details.notes);
  parts.push('Please help me arrange a consultation. I will review this message and press Send in WhatsApp.');

  return parts.join('\n');
}
