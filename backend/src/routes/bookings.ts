import { Router } from 'express';
import { BookingModel } from '../models/Booking.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { HttpError } from '../middleware/errors.js';
import { createBookingSchema, idSchema } from '../validators/booking.js';
import { createBookingReference } from '../services/reference.js';
import { notifyBookingByEmail } from '../services/notifications.js';
import { sendFounderSms } from '../services/sms.js';

export const bookingsRouter = Router();
bookingsRouter.use(requireAuth);

bookingsRouter.post('/', async (req, res, next) => {
  try {
    const input = createBookingSchema.parse(req.body);
    if (input.preferredDate && input.preferredDate < new Date().toISOString().slice(0, 10)) {
      throw new HttpError(400, 'Preferred visit date cannot be in the past');
    }
    const selectedServices = input.selectedServices.map((service) =>
      typeof service === 'string' ? { id: service, name: service, price: 0, quantity: 1 } : service,
    );
    const booking = await BookingModel.create({
      reference: createBookingReference(),
      customerId: req.user!._id,
      customer: {
        firstName: input.firstName,
        lastName: input.lastName,
        ...(input.email ? { email: input.email } : {}),
        phone: input.phone,
      },
      ...input,
      selectedServices,
    });
    void notifyBookingByEmail(booking);
    void sendFounderSms(booking).catch(() => {
      console.error('Founder SMS notification failed');
    });
    res.status(201).json({ booking });
  } catch (error) {
    next(error);
  }
});

bookingsRouter.get('/my', async (req, res, next) => {
  try {
    const bookings = await BookingModel.find({ customerId: req.user!._id }).sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    next(error);
  }
});

bookingsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = idSchema.parse(req.params);
    const booking = await BookingModel.findOne({ _id: id, customerId: req.user!._id });
    if (!booking) throw new HttpError(404, 'Booking not found');
    res.json({ booking });
  } catch (error) {
    next(error);
  }
});

bookingsRouter.patch('/:id/cancel', async (req, res, next) => {
  try {
    const { id } = idSchema.parse(req.params);
    const booking = await BookingModel.findOne({ _id: id, customerId: req.user!._id });
    if (!booking) throw new HttpError(404, 'Booking not found');
    if (!['pending', 'confirmed'].includes(booking.status)) {
      throw new HttpError(409, 'This booking cannot be cancelled');
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json({ booking });
  } catch (error) {
    next(error);
  }
});

export const adminBookingsRouter = Router();
adminBookingsRouter.use(requireAuth, requireAdmin);

adminBookingsRouter.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const [bookings, total] = await Promise.all([
      BookingModel.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      BookingModel.countDocuments(),
    ]);
    res.json({ bookings, pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) } });
  } catch (error) {
    next(error);
  }
});

adminBookingsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = idSchema.parse(req.params);
    const booking = await BookingModel.findById(id);
    if (!booking) throw new HttpError(404, 'Booking not found');
    res.json({ booking });
  } catch (error) {
    next(error);
  }
});

adminBookingsRouter.patch('/:id/status', async (req, res, next) => {
  try {
    const { id } = idSchema.parse(req.params);
    const requestedStatus = req.body?.status;
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(requestedStatus)) {
      throw new HttpError(400, 'Invalid booking status');
    }
    const booking = await BookingModel.findById(id);
    if (!booking) throw new HttpError(404, 'Booking not found');
    const allowed: Record<string, string[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['completed', 'cancelled'],
      completed: [],
      cancelled: [],
    };
    if (!allowed[booking.status].includes(requestedStatus)) {
      throw new HttpError(409, 'Invalid booking status transition');
    }
    booking.status = requestedStatus;
    await booking.save();
    res.json({ booking });
  } catch (error) {
    next(error);
  }
});
