import { describe, it, expect } from 'vitest';
import { cleanJson } from '../app';

describe('cleanJson', () => {
  it('handles clean json with no fences', () => {
    const input = '{"verdict": "REAL"}';
    expect(cleanJson(input)).toBe('{"verdict": "REAL"}');
  });

  it('removes markdown json fences', () => {
    const input = '```json\n{"verdict": "REAL"}\n```';
    expect(cleanJson(input)).toBe('{"verdict": "REAL"}');
  });

  it('removes plain code fences', () => {
    const input = '```\n{"verdict": "REAL"}\n```';
    expect(cleanJson(input)).toBe('{"verdict": "REAL"}');
  });

  it('is case-insensitive to JSON keyword', () => {
    const input = '```JSON\n{"verdict": "REAL"}\n```';
    expect(cleanJson(input)).toBe('{"verdict": "REAL"}');
  });

  it('trims extra whitespace', () => {
    const input = '   ```json   \n   {"verdict": "REAL"}   \n   ```   ';
    expect(cleanJson(input)).toBe('{"verdict": "REAL"}');
  });
});
