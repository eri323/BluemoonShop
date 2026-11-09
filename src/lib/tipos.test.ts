import { describe, expect, it } from 'vitest';
import { formatoCOP } from './tipos';

describe('formatoCOP', () => {
  it('formatea miles con punto y sin decimales', () => {
    expect(formatoCOP(65000)).toBe('$65.000');
  });

  it('formatea millones', () => {
    expect(formatoCOP(1234567)).toBe('$1.234.567');
  });
});
