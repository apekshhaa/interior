import 'dotenv/config';
import { z } from 'zod';

const optionalValue = z.preprocess(
  (value) => value === '' ? undefined : value,
  z.string().optional(),
);

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  SESSION_SECRET: z.string().min(32),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  SESSION_TTL_DAYS: z.coerce.number().int().positive().default(7),
  SMTP_HOST: optionalValue,
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: optionalValue,
  SMTP_PASSWORD: optionalValue,
  FOUNDER_EMAIL: z.preprocess((value) => value === '' ? undefined : value, z.string().email().optional()),
  MSG91_AUTH_KEY: optionalValue,
  MSG91_TEMPLATE_ID: optionalValue,
  MSG91_SENDER_ID: optionalValue,
  FOUNDER_PHONE: optionalValue,
});

export const env = envSchema.parse({
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  FRONTEND_URL: process.env.FRONTEND_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  SESSION_TTL_DAYS: process.env.SESSION_TTL_DAYS,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  FOUNDER_EMAIL: process.env.FOUNDER_EMAIL,
  MSG91_AUTH_KEY: process.env.MSG91_AUTH_KEY,
  MSG91_TEMPLATE_ID: process.env.MSG91_TEMPLATE_ID,
  MSG91_SENDER_ID: process.env.MSG91_SENDER_ID,
  FOUNDER_PHONE: process.env.FOUNDER_PHONE,
});
