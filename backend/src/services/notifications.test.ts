import { describe, expect, it } from 'vitest';
import { BookingModel } from '../models/Booking.js';
import { buildBookingEmailContent } from './notifications.js';

describe('booking email notifications', () => {
  it('includes the submitted enquiry details in both email formats', () => {
    const booking = new BookingModel({
      reference: 'CT-TEST01',
      customerId: '507f1f77bcf86cd799439011',
      customer: {
        firstName: 'Test',
        lastName: 'Customer',
        phone: '+91 9000000000',
        email: 'customer@example.com',
      },
      selectedServices: [{ name: 'Interior Painting' }],
      selectedProducts: [],
      propertyAddress: 'Test address',
      propertyType: 'Residential',
      approxArea: '900 sq ft',
      preferredTextures: ['Travertine'],
      selectedColours: ['Warm Sand (#D9C2A6)'],
      preferredDate: '2030-01-15',
      preferredTime: 'Morning',
      notes: 'Test enquiry',
      status: 'pending',
    });

    const founderEmail = buildBookingEmailContent(booking, 'founder');
    const customerEmail = buildBookingEmailContent(booking, 'customer');

    expect(founderEmail.subject).toContain('CT-TEST01');
    expect(founderEmail.text).toContain('Warm Sand (#D9C2A6)');
    expect(founderEmail.html).toContain('Test enquiry');
    expect(customerEmail.text).toContain('not confirmed yet');
    expect(customerEmail.html).toContain('CT-TEST01');
  });
});
