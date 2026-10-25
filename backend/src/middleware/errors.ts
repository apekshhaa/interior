import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { Error as MongooseError } from 'mongoose';

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const notFound: RequestHandler = (_req, _res, next) => {
  next(new HttpError(404, 'Route not found'));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({ error: 'Validation failed', details: error.flatten().fieldErrors });
    return;
  }
  if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message });
    return;
  }
  if ((error as { code?: number }).code === 11000) {
    res.status(409).json({ error: 'A record with that value already exists' });
    return;
  }
  if (error instanceof MongooseError) {
    res.status(503).json({ error: 'The booking service is temporarily unavailable. Please try again shortly.' });
    return;
  }
  console.error('Unhandled request error', error instanceof Error ? error.message : error);
  res.status(500).json({ error: 'Internal server error' });
};
