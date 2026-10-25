import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import session from 'express-session';
import request from 'supertest';
import { sendFounderSms } from './services/sms.js';

process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/colour-tone-tests';
process.env.FRONTEND_URL = 'http://localhost:3000';
process.env.SESSION_SECRET = 'test-session-secret-that-is-long-enough';
process.env.NODE_ENV = 'test';

describe('authentication and bookings API', () => {
  let mongo: MongoMemoryServer;
  let app: import('express').Express;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
    const imported = await import('./app.js');
    app = imported.createApp({ sessionStore: new session.MemoryStore() });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });

  it('signs up, restores the session, and rejects duplicate email', async () => {
    const agent = request.agent(app);
    const signup = await agent.post('/api/auth/signup').send({
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '+91 9000000000',
      password: 'securePass1',
      confirmPassword: 'securePass1',
    });
    expect(signup.status).toBe(201);
    expect(signup.body.user.email).toBe('test@example.com');
    expect(signup.body.user.passwordHash).toBeUndefined();

    const me = await agent.get('/api/auth/me');
    expect(me.status).toBe(200);
    expect(me.body.user.name).toBe('Test Customer');

    const duplicate = await request(app).post('/api/auth/signup').send({
      name: 'Other Customer',
      email: 'TEST@example.com',
      phone: '+91 9111111111',
      password: 'securePass1',
      confirmPassword: 'securePass1',
    });
    expect(duplicate.status).toBe(409);
  });

  it('rejects protected booking access and persists an authenticated booking', async () => {
    const unauthorized = await request(app).post('/api/bookings').send({});
    expect(unauthorized.status).toBe(401);

    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'securePass1',
    });
    const created = await agent.post('/api/bookings').send({
      firstName: 'Test',
      lastName: 'Customer',
      phone: '+91 9000000000',
      propertyAddress: '12 Coastal Road, Mangalore',
      propertyType: 'Residential',
      approxArea: '',
      selectedServices: ['Interior Painting'],
      selectedProducts: [],
      preferredTextures: ['Travertine'],
      selectedColours: ['Warm Sand (#D9C2A6)'],
      preferredDate: '',
      preferredTime: 'Morning',
      notes: 'Living room feature wall',
    });
    expect(created.status).toBe(201);
    expect(created.body.booking.reference).toMatch(/^CT-/);

    const history = await agent.get('/api/bookings/my');
    expect(history.status).toBe(200);
    expect(history.body.bookings).toHaveLength(1);

    const cancelled = await agent
      .patch(`/api/bookings/${created.body.booking._id}/cancel`)
      .send();
    expect(cancelled.status).toBe(200);
    expect(cancelled.body.booking.status).toBe('cancelled');
  });

  it('accepts a second independent enquiry and returns field-specific validation errors', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'securePass1',
    });
    const second = await agent.post('/api/bookings').send({
      firstName: 'Second',
      lastName: 'Customer',
      phone: '+91 9000000001',
      email: 'second@example.com',
      propertyAddress: '14 Coastal Road, Mangalore',
      propertyType: 'Commercial',
      approxArea: '900 sq ft',
      selectedServices: ['Exterior Painting'],
      selectedProducts: [],
      preferredTextures: [],
      selectedColours: [],
      preferredDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
      preferredTime: 'Afternoon',
      notes: '',
    });
    expect(second.status).toBe(201);
    expect(second.body.booking.reference).not.toBeUndefined();

    const invalid = await agent.post('/api/bookings').send({
      firstName: '',
      lastName: 'Customer',
      phone: '1',
      propertyAddress: 'x',
      propertyType: 'Residential',
      preferredTime: 'Morning',
    });
    expect(invalid.status).toBe(400);
    expect(invalid.body.error).toBe('Validation failed');
    expect(invalid.body.details.firstName).toBeDefined();
    expect(invalid.body.details.phone).toBeDefined();
  });

  it('keeps SMS disabled without provider configuration', async () => {
    const booking = (await mongoose.connection.collection('bookings').findOne()) as never;
    expect(await sendFounderSms(booking)).toBe('disabled');
  });
});
