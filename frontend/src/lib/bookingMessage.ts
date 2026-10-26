export interface SavedBookingForWhatsApp {
  reference: string;
  customer: {
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
  };
  propertyAddress: string;
  propertyType: string;
  approxArea?: string;
  selectedServices: Array<{ name: string; quantity?: number }>;
  selectedProducts: Array<{ name: string; quantity?: number }>;
  preferredTextures: string[];
  selectedColours: string[];
  preferredDate?: string;
  preferredTime: string;
  notes?: string;
}

function addField(parts: string[], label: string, value: string | undefined | null) {
  const trimmed = value?.trim();
  if (trimmed) parts.push(`${label}: ${trimmed}`);
}

export function buildBookingWhatsAppMessage(
  booking: SavedBookingForWhatsApp,
): string {
  const parts = [
    'Hello COLOUR TONE, I would like to enquire about a painting project.',
  ];

  addField(parts, 'Booking Reference', booking.reference);
  addField(parts, 'Customer Name', `${booking.customer.firstName} ${booking.customer.lastName}`);
  addField(parts, 'Email', booking.customer.email);
  addField(parts, 'Phone', booking.customer.phone);
  addField(parts, 'Property Address', booking.propertyAddress);
  addField(parts, 'Property Type', booking.propertyType);
  addField(parts, 'Square Footage', booking.approxArea);
  addField(parts, 'Selected Services', booking.selectedServices.map((item) => item.name).join(', '));
  addField(parts, 'Selected Products', booking.selectedProducts.map((item) => `${item.name}${item.quantity ? ` (quantity: ${item.quantity})` : ''}`).join(', '));
  addField(parts, 'Selected Textures', booking.preferredTextures.join(', '));
  addField(parts, 'Selected Colours', booking.selectedColours.join(', '));
  addField(
    parts,
    'Preferred Consultation',
    booking.preferredDate
      ? `${booking.preferredDate}${booking.preferredTime ? ` (${booking.preferredTime})` : ''}`
      : booking.preferredTime,
  );
  addField(parts, 'Additional Details', booking.notes);
  parts.push('Please help me arrange a consultation. I will review this message and press Send in WhatsApp.');

  return parts.join('\n');
}
