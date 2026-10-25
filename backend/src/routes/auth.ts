import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.js';
import { signupSchema, loginSchema } from '../validators/auth.js';
import { HttpError } from '../middleware/errors.js';

export const authRouter = Router();

const publicUser = (user: InstanceType<typeof UserModel>) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
});

authRouter.post('/signup', async (req, res, next) => {
  try {
    const input = signupSchema.parse(req.body);
    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await UserModel.create({
      name: input.name,
      email: input.email,
      phone: input.phone,
      passwordHash,
      role: 'customer',
    });
    await establishSession(req, user.id);
    res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/login', async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);
    const user = await UserModel.findOne({ email: input.email }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
      throw new HttpError(401, 'Invalid email or password');
    }
    await establishSession(req, user.id, input.rememberMe);
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/logout', (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
      return;
    }
    res.clearCookie('colour_tone.sid');
    res.status(204).send();
  });
});

authRouter.get('/me', async (req, res, next) => {
  try {
    if (!req.session.userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    const user = await UserModel.findById(req.session.userId);
    if (!user) {
      req.session.destroy(() => undefined);
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

async function establishSession(req: Parameters<import('express').RequestHandler>[0], userId: string, rememberMe = false) {
  await new Promise<void>((resolve, reject) => {
    req.session.regenerate((error) => (error ? reject(error) : resolve()));
  });
  req.session.userId = userId;
  if (rememberMe) {
    req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30;
  }
}
