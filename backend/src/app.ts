import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { authRouter } from './routes/auth.js';
import { adminBookingsRouter, bookingsRouter } from './routes/bookings.js';
import { errorHandler, notFound } from './middleware/errors.js';

function usesSecureSession(environment: Pick<typeof env, 'NODE_ENV' | 'FRONTEND_URL'>) {
  return environment.NODE_ENV === 'production' || environment.FRONTEND_URL.startsWith('https://');
}

export function getSessionCookieOptions(environment: Pick<typeof env, 'NODE_ENV' | 'FRONTEND_URL' | 'SESSION_TTL_DAYS'>) {
  const secureSession = usesSecureSession(environment);

  return {
    httpOnly: true,
    secure: secureSession,
    sameSite: secureSession ? ('none' as const) : ('lax' as const),
    path: '/',
    maxAge: environment.SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
  };
}

export function createApp(options: { sessionStore?: session.Store } = {}): express.Express {
  const app = express();
  app.set('trust proxy', usesSecureSession(env) ? 1 : 0);
  app.use(helmet());
  app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
  app.use(express.json({ limit: '100kb' }));
  app.use(
    session({
      name: 'colour_tone.sid',
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: options.sessionStore || MongoStore.create({ mongoUrl: env.MONGODB_URI, ttl: env.SESSION_TTL_DAYS * 24 * 60 * 60 }),
      cookie: getSessionCookieOptions(env),
    }),
  );

  app.get('/api/health', (_req, res) => {
    const ready = mongoose.connection.readyState === 1;
    res.status(ready ? 200 : 503).json({ status: ready ? 'ok' : 'unavailable' });
  });
  app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-7', legacyHeaders: false }), authRouter);
  app.use('/api/bookings', bookingsRouter);
  app.use('/api/admin/bookings', adminBookingsRouter);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
