import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { BookingModel, type BookingDocument } from '../models/Booking.js';

type EmailStatus = 'disabled' | 'sent' | 'failed' | 'skipped';

interface BookingEmailContent {
  subject: string;
  text: string;
  html: string;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function display(value: string | null | undefined, fallback = 'Not provided'): string {
  return value?.trim() || fallback;
}

function bookingRows(booking: BookingDocument): Array<[string, string]> {
  const customer = booking.customer;
  if (!customer) throw new Error('Booking customer snapshot is missing');
  const customerName = `${customer.firstName} ${customer.lastName}`.trim();
  const services = booking.selectedServices.map((item) => item.name).join(', ');
  const products = booking.selectedProducts.map((item) => item.name).join(', ');
  const textures = booking.preferredTextures.join(', ');
  const colours = booking.selectedColours.join(', ');
  const requestedServices = [services, products, textures].filter(Boolean).join(' | ');
  return [
    ['Booking reference', booking.reference],
    ['Customer name', customerName],
    ['Phone', customer.phone],
    ['Email', display(customer.email)],
    ['Property type', booking.propertyType],
    ['Property address', booking.propertyAddress],
    ['Services / finishes', display(requestedServices)],
    ['Selected colours', display(colours)],
    ['Approximate area', display(booking.approxArea)],
    ['Preferred consultation', booking.preferredDate
      ? `${booking.preferredDate} — ${booking.preferredTime}`
      : `No date selected — ${booking.preferredTime}`],
    ['Notes', display(booking.notes)],
    ['Status', booking.status],
  ];
}

export function buildBookingEmailContent(
  booking: BookingDocument,
  recipient: 'founder' | 'customer',
): BookingEmailContent {
  const rows = bookingRows(booking);
  const subject = recipient === 'founder'
    ? `New COLOUR TONE Enquiry — ${booking.reference}`
    : `COLOUR TONE enquiry received — ${booking.reference}`;
  const intro = recipient === 'founder'
    ? 'A new COLOUR TONE enquiry has been saved.'
    : 'Thank you for contacting COLOUR TONE. Your enquiry has been received.';
  const closing = recipient === 'founder'
    ? ''
    : 'Your consultation is not confirmed yet. Our team will contact you to agree a date and time.';
  const text = [intro, '', ...rows.map(([label, value]) => `${label}: ${value}`), '', closing]
    .filter(Boolean)
    .join('\n');
  const htmlRows = rows
    .map(([label, value]) => `<tr><th style="text-align:left;padding:8px 12px;border-bottom:1px solid #eee">${escapeHtml(label)}</th><td style="padding:8px 12px;border-bottom:1px solid #eee">${escapeHtml(value)}</td></tr>`)
    .join('');
  const html = `<div style="font-family:Arial,sans-serif;color:#1e1e1e"><p>${escapeHtml(intro)}</p><table style="border-collapse:collapse;width:100%;max-width:680px">${htmlRows}</table>${closing ? `<p>${escapeHtml(closing)}</p>` : ''}</div>`;
  return { subject, text, html };
}

function smtpConfigured(): boolean {
  return Boolean(env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASSWORD && env.FOUNDER_EMAIL);
}

async function claimNotification(
  booking: BookingDocument,
  recipient: 'founder' | 'customer',
): Promise<boolean> {
  const field = recipient === 'founder' ? 'emailNotification.founderStatus' : 'emailNotification.customerStatus';
  const claimed = await BookingModel.findOneAndUpdate(
    { _id: booking._id, [field]: 'pending' },
    { $set: { [field]: 'sending' } },
    { new: true },
  );
  return Boolean(claimed);
}

async function markNotification(
  booking: BookingDocument,
  recipient: 'founder' | 'customer',
  status: 'sent' | 'failed' | 'skipped',
): Promise<void> {
  const prefix = recipient === 'founder' ? 'founder' : 'customer';
  await BookingModel.updateOne(
    { _id: booking._id },
    {
      $set: {
        [`emailNotification.${prefix}Status`]: status,
        ...(status === 'sent' ? { [`emailNotification.${prefix}SentAt`]: new Date() } : {}),
        ...(status === 'failed' ? { [`emailNotification.${prefix}FailedAt`]: new Date() } : {}),
      },
    },
  );
}

async function sendBookingEmail(
  booking: BookingDocument,
  recipient: 'founder' | 'customer',
): Promise<EmailStatus> {
  if (!smtpConfigured()) return 'disabled';
  const customer = booking.customer;
  if (!customer) return 'failed';
  if (recipient === 'customer' && !customer.email) {
    await markNotification(booking, recipient, 'skipped');
    return 'skipped';
  }
  if (!(await claimNotification(booking, recipient))) return 'skipped';

  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
  });
  const content = buildBookingEmailContent(booking, recipient);
  const to = recipient === 'founder' ? env.FOUNDER_EMAIL! : customer.email!;
  try {
    await transporter.sendMail({
      from: env.SMTP_USER,
      to,
      subject: content.subject,
      text: content.text,
      html: content.html,
    });
    await markNotification(booking, recipient, 'sent');
    return 'sent';
  } catch (error) {
    await markNotification(booking, recipient, 'failed');
    throw error;
  }
}

export async function notifyBookingByEmail(booking: BookingDocument): Promise<void> {
  if (!smtpConfigured()) return;
  const recipients: Array<'founder' | 'customer'> = ['founder', 'customer'];
  for (const recipient of recipients) {
    try {
      await sendBookingEmail(booking, recipient);
    } catch {
      console.error(`COLOUR TONE ${recipient} email notification failed`);
    }
  }
}

export { smtpConfigured };
