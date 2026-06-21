import { describe, it, expect } from 'vitest';
import {
  MediaBodySchema,
  ScamBodySchema,
  UrlBodySchema,
  GeminiResponseSchema,
} from '../validators';

describe('MediaBodySchema', () => {
  it('passes on valid media body', () => {
    const valid = { base64Data: 'dGVzdA==', mimeType: 'image/png' };
    expect(MediaBodySchema.safeParse(valid).success).toBe(true);
  });

  it('fails on empty/missing fields', () => {
    expect(MediaBodySchema.safeParse({}).success).toBe(false);
    expect(MediaBodySchema.safeParse({ base64Data: '', mimeType: 'image/png' }).success).toBe(false);
  });

  it('fails on invalid MIME type format', () => {
    const invalid = { base64Data: 'dGVzdA==', mimeType: 'not-a-mime' };
    expect(MediaBodySchema.safeParse(invalid).success).toBe(false);
  });
});

describe('ScamBodySchema', () => {
  it('passes on valid text', () => {
    expect(ScamBodySchema.safeParse({ text: 'this is a KYC scam message' }).success).toBe(true);
  });

  it('fails on empty/missing text', () => {
    expect(ScamBodySchema.safeParse({ text: '' }).success).toBe(false);
    expect(ScamBodySchema.safeParse({}).success).toBe(false);
  });
});

describe('UrlBodySchema', () => {
  it('passes on valid URL', () => {
    expect(UrlBodySchema.safeParse({ url: 'https://cybercrime.gov.in' }).success).toBe(true);
  });

  it('fails on empty/missing URL', () => {
    expect(UrlBodySchema.safeParse({ url: '' }).success).toBe(false);
  });
});

describe('GeminiResponseSchema', () => {
  it('passes on valid response payload', () => {
    const valid = {
      verdict: 'REAL',
      confidence: 90,
      threat_level: 'SAFE',
      explanation_english: 'Everything is authentic.',
      recommendation: 'Nothing needed.',
      evidence: [],
    };
    expect(GeminiResponseSchema.safeParse(valid).success).toBe(true);
  });

  it('correctly catches errors and sets defaults', () => {
    const incomplete = {
      verdict: 'FAKE',
      confidence: 85,
    };
    const result = GeminiResponseSchema.parse(incomplete);
    expect(result.threat_level).toBe('MEDIUM'); // defaults/catches to MEDIUM
    expect(result.explanation_english).toBe('Analysis complete.'); // default
    expect(result.recommendation).toBe('No specific recommendation.'); // default
    expect(result.evidence).toEqual([]);
  });

  it('validates evidence structures', () => {
    const payload = {
      verdict: 'FAKE',
      confidence: 90,
      evidence: [
        {
          category: 'visual',
          finding: 'Lighting anomaly around facial boundaries',
          severity: 'high',
        },
      ],
    };
    const result = GeminiResponseSchema.parse(payload);
    expect(result.evidence[0].category).toBe('visual');
    expect(result.evidence[0].severity).toBe('high');
  });
});
