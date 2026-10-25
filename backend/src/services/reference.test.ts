import { describe, expect, it } from 'vitest';
import { createBookingReference } from './reference.js';

describe('booking references', () => {
  it('creates unique human-readable references', () => {
    const first = createBookingReference();
    const second = createBookingReference();
    expect(first).toMatch(/^CT-\d{4}-[A-F0-9]{8}$/);
    expect(second).toMatch(/^CT-\d{4}-[A-F0-9]{8}$/);
    expect(first).not.toBe(second);
  });
});
