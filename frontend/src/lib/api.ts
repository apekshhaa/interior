import { BookingDetails, CartItem, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

interface ApiErrorPayload {
  error?: string;
  details?: Record<string, string[]>;
}

export class ApiError extends Error {
  constructor(public status: number, message: string, public details?: Record<string, string[]>) {
    super(message);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
  } catch {
    throw new ApiError(
      0,
      'The booking service is unavailable. Please start the backend and check its MongoDB connection, then try again.',
    );
  }
  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ApiErrorPayload;
    const fieldMessages = payload.details
      ? Object.entries(payload.details)
          .flatMap(([field, messages]) => messages.map((message) => `${field}: ${message}`))
          .join(' ')
      : '';
    throw new ApiError(
      response.status,
      fieldMessages || payload.error || 'Request failed',
      payload.details,
    );
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const authApi = {
  me: () => request<{ user: User }>('/auth/me'),
  signup: (input: { name: string; email: string; phone: string; password: string; confirmPassword: string }) =>
    request<{ user: User }>('/auth/signup', { method: 'POST', body: JSON.stringify(input) }),
  login: (input: { email: string; password: string; rememberMe: boolean }) =>
    request<{ user: User }>('/auth/login', { method: 'POST', body: JSON.stringify(input) }),
  logout: () => request<void>('/auth/logout', { method: 'POST' }),
};

export const bookingApi = {
  create: (details: BookingDetails, items: CartItem[]) =>
    request<{ booking: { reference: string } }>('/bookings', {
      method: 'POST',
      body: JSON.stringify({
        ...details,
        selectedProducts: items.map(({ product, quantity }) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity,
        })),
      }),
    }),
  listMine: () => request<{ bookings: unknown[] }>('/bookings/my'),
};
