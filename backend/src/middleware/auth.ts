import type { RequestHandler } from 'express';
import { HttpError } from './errors.js';
import { UserModel } from '../models/User.js';

export const requireAuth: RequestHandler = async (req, _res, next) => {
  try {
    if (!req.session.userId) throw new HttpError(401, 'Authentication required');
    const user = await UserModel.findById(req.session.userId).select('_id name email phone role');
    if (!user) {
      req.session.destroy(() => undefined);
      throw new HttpError(401, 'Authentication required');
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export const requireAdmin: RequestHandler = (req, _res, next) => {
  if (req.user?.role !== 'admin') {
    next(new HttpError(403, 'Administrator access required'));
    return;
  }
  next();
};
