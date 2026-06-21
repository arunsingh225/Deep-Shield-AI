import { describe, it, expect } from 'vitest';
import { isDangerVerdict, type Verdict } from '../types';

describe('isDangerVerdict', () => {
  it('returns true for dangerous verdicts', () => {
    const dangerous: Verdict[] = ['FAKE', 'SUSPICIOUS', 'DANGEROUS', 'CLONED'];
    dangerous.forEach((v) => {
      expect(isDangerVerdict(v)).toBe(true);
    });
  });

  it('returns false for safe/genuine/real verdicts', () => {
    const safe = ['REAL', 'GENUINE', 'SAFE'];
    safe.forEach((v) => {
      expect(isDangerVerdict(v)).toBe(false);
    });
  });

  it('returns false for unknown strings', () => {
    expect(isDangerVerdict('UNKNOWN')).toBe(false);
    expect(isDangerVerdict('')).toBe(false);
  });
});
