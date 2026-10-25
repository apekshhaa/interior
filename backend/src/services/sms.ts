import { env } from '../config/env.js';
import { BookingModel } from '../models/Booking.js';
import type { BookingDocument } from '../models/Booking.js';

const MSG91_FLOW_URL = 'https://control.msg91.com/api/v5/flow/';

function configured(): boolean {
  return Boolean(env.MSG91_AUTH_KEY && env.MSG91_TEMPLATE_ID && env.MSG91_SENDER_ID && env.FOUNDER_PHONE);
}

function founderMobile(): string {
  const raw = env.FOUNDER_PHONE!.replace(/\D/g, '');
  return raw.startsWith('91') ? raw : `91${raw}`;
}

function serviceName(booking: BookingDocument): string {
  return booking.selectedServices?.map((service) => service.name).filter(Boolean).join(', ') || 'General enquiry';
}

export async function sendFounderSms(booking: BookingDocument): Promise<'disabled' | 'sent' | 'duplicate'> {
  if (!configured()) return 'disabled';
  if (!booking.customer) throw new Error('Booking customer snapshot is missing');

  const claimed = await BookingModel.findOneAndUpdate(
    { _id: booking._id, 'smsNotification.status': 'pending' },
    { $set: { 'smsNotification.status': 'sending' } },
    { new: true },
  );
  if (!claimed) return 'duplicate';

  const customerName = `${booking.customer.firstName} ${booking.customer.lastName}`.trim();
  try {
    const response = await fetch(MSG91_FLOW_URL, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        authkey: env.MSG91_AUTH_KEY!,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        template_id: env.MSG91_TEMPLATE_ID,
        sender: env.MSG91_SENDER_ID,
        mobiles: founderMobile(),
        VAR1: booking.reference,
        VAR2: customerName,
        VAR3: serviceName(booking),
        VAR4: booking.propertyType,
        VAR5: booking.preferredDate || 'Flexible',
      }),
    });

    if (!response.ok) {
      throw new Error(`MSG91 returned HTTP ${response.status}`);
    }

    const payload = (await response.json().catch(() => ({}))) as { request_id?: string; message?: string };
    await BookingModel.updateOne(
      { _id: booking._id },
      {
        $set: {
          'smsNotification.status': 'sent',
          'smsNotification.providerMessageId': payload.request_id || payload.message || 'accepted',
          'smsNotification.sentAt': new Date(),
        },
      },
    );
    return 'sent';
  } catch (error) {
    await BookingModel.updateOne(
      { _id: booking._id },
      { $set: { 'smsNotification.status': 'failed', 'smsNotification.failedAt': new Date() } },
    );
    throw error;
  }
}
