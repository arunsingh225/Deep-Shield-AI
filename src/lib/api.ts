import type { ScanResult } from '../types';

// In dev, Vite proxies /api -> the local Express server (see vite.config.ts).
// In production, set VITE_API_BASE_URL to wherever the server is deployed.
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function postJSON(path: string, body: unknown): Promise<ScanResult> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error || `Request failed (${res.status})`);
  }

  return res.json();
}

export function analyzeMedia(base64Data: string, mimeType: string) {
  return postJSON('/analyze/media', { base64Data, mimeType });
}

export function analyzeVoice(base64Data: string, mimeType: string) {
  return postJSON('/analyze/voice', { base64Data, mimeType });
}

export function analyzeDocument(base64Data: string, mimeType: string) {
  return postJSON('/analyze/document', { base64Data, mimeType });
}

export function analyzeScam(text: string) {
  return postJSON('/analyze/scam', { text });
}

export function analyzeUrl(url: string) {
  return postJSON('/analyze/url', { url });
}
