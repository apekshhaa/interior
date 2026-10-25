import { z } from 'zod';

const lineItem = z.object({
  id: z.string().min(1).max(100),
  name: z.string().min(1).max(200),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive().max(100),
});

export const createBookingSchema = z.object({
  firstName: z.string().trim().min(2).max(80),
  lastName: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(7).max(30),
  email: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().trim().toLowerCase().email().max(254).optional(),
  ),
  propertyAddress: z.string().trim().min(5).max(500),
  propertyType: z.enum(['Residential', 'Commercial']),
  approxArea: z.string().trim().max(100).default(''),
  selectedServices: z.array(z.union([z.string().trim().min(1).max(120), lineItem])).max(30).default([]),
  selectedProducts: z.array(lineItem).max(50).default([]),
  preferredTextures: z.array(z.string().trim().min(1).max(120)).max(30).default([]),
  selectedColours: z.array(z.string().trim().min(1).max(160)).max(30).default([]),
  preferredDate: z.string().trim().max(30).default(''),
  preferredTime: z.string().trim().min(1).max(120),
  notes: z.string().trim().max(2000).default(''),
});

export const idSchema = z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) });
