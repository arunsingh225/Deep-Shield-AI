import { describe, it, expect } from 'vitest';
import { timeAgo, generateVerificationID, fileToBase64 } from '../lib/utils';

describe('timeAgo', () => {
  it('formats seconds correctly', () => {
    const now = Date.now();
    expect(timeAgo(new Date(now - 1000).toISOString())).toBe('Just now');
    expect(timeAgo(new Date(now - 5000).toISOString())).toBe('5 seconds ago');
  });

  it('formats minutes correctly', () => {
    const now = Date.now();
    expect(timeAgo(new Date(now - 3 * 60 * 1000).toISOString())).toBe('3 mins ago');
  });

  it('formats hours correctly', () => {
    const now = Date.now();
    expect(timeAgo(new Date(now - 4 * 60 * 60 * 1000).toISOString())).toBe('4 hours ago');
  });

  it('formats days correctly', () => {
    const now = Date.now();
    expect(timeAgo(new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString())).toBe('2 days ago');
  });
});

describe('generateVerificationID', () => {
  it('returns a string starting with DSA-YYYY-IND', () => {
    const id = generateVerificationID();
    const currentYear = new Date().getFullYear();
    expect(id).toMatch(new RegExp(`^DSA-${currentYear}-IND-[A-Z0-9]+-[A-Z0-9]+$`));
  });
});

describe('fileToBase64', () => {
  it('converts a File object to base64 string', async () => {
    const blob = new Blob(['hello world'], { type: 'text/plain' });
    const file = new File([blob], 'test.txt', { type: 'text/plain' });
    const base64 = await fileToBase64(file);
    // 'hello world' in base64 is 'aGVsbG8gd29ybGQ='
    expect(base64).toBe('aGVsbG8gd29ybGQ=');
  });
});
