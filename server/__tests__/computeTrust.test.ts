import { describe, it, expect } from 'vitest';
import { computeTrust } from '../app';

describe('computeTrust', () => {
  it('handles dangerous verdicts correctly', () => {
    // FAKE with 80% confidence -> trust score 20
    expect(computeTrust('FAKE', 80)).toEqual({
      trust_score: 20,
      confidence_band: 'MEDIUM',
    });

    // CLONED with 95% confidence -> trust score 5, high confidence band
    expect(computeTrust('CLONED', 95)).toEqual({
      trust_score: 5,
      confidence_band: 'HIGH',
    });
  });

  it('handles safe/genuine verdicts correctly', () => {
    // REAL with 90% confidence -> trust score 90, high confidence
    expect(computeTrust('REAL', 90)).toEqual({
      custom_trust_score: undefined, // wait, our computeTrust doesn't return custom_trust_score, let's match exact fields:
      trust_score: 90,
      confidence_band: 'HIGH',
    });

    // GENUINE with 50% confidence -> trust score 50, low confidence
    expect(computeTrust('GENUINE', 50)).toEqual({
      trust_score: 50,
      confidence_band: 'LOW',
    });
  });

  it('clamps confidence to 0-100 range', () => {
    expect(computeTrust('REAL', 150)).toEqual({
      trust_score: 100,
      confidence_band: 'HIGH',
    });

    expect(computeTrust('REAL', -10)).toEqual({
      trust_score: 0,
      confidence_band: 'LOW',
    });
  });

  it('handles NaN/invalid confidence values', () => {
    expect(computeTrust('REAL', NaN)).toEqual({
      trust_score: 0,
      confidence_band: 'LOW',
    });
  });
});
