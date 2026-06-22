// DeepShield AI — Express Application Setup
// dotenv: load .env in local dev; on Vercel env vars are injected natively.
// dotenv.config() is a no-op when .env is absent — safe for all environments.
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';
import { GoogleGenAI } from '@google/genai';
import { ZodError } from 'zod';

import { logger } from './logger';
import {
  MediaBodySchema,
  ScamBodySchema,
  UrlBodySchema,
  GeminiResponseSchema,
  type ValidatedGeminiResponse,
} from './validators';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || apiKey === 'your_gemini_api_key_here') {
  logger.warn('GEMINI_API_KEY is not set — /api/analyze/* requests will fail until configured.');
}
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
export const PORT = Number(process.env.PORT) || 8787;
export const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';
export const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX) || 50;

// ---------------------------------------------------------------------------
// Express setup
// ---------------------------------------------------------------------------

export const app = express();

// Security headers (CSP, X-Frame-Options, etc.)
app.use(helmet());

// Rate limiting — protects against quota abuse
app.use(
  '/api/',
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15-minute window
    max: RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please wait 15 minutes before trying again.' },
  }),
);

// CORS — restrict to known origins
app.use(
  cors({
    origin: ALLOWED_ORIGIN === '*' ? true : ALLOWED_ORIGIN,
    methods: ['GET', 'POST'],
  }),
);

// Body parser — 25MB limit for base64 images/video
app.use(express.json({ limit: '25mb' }));

// Request ID middleware for log correlation
app.use((req, _res, next) => {
  (req as any).requestId = uuidv4();
  next();
});

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const DANGER_VERDICTS = new Set<string>(['FAKE', 'SUSPICIOUS', 'DANGEROUS', 'CLONED']);

/** Strip markdown fences that Gemini sometimes wraps around JSON. */
export function cleanJson(text: string): string {
  let raw = text.trim();
  raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/, '');
  raw = raw.replace(/```\s*$/, '');
  return raw.trim();
}

/** Compute a 0-100 trust score (100 = safe) and a confidence band from the verdict + confidence. */
export function computeTrust(verdict: string, confidence: number) {
  const c = Math.max(0, Math.min(100, Number(confidence) || 0));
  const trust_score = DANGER_VERDICTS.has(verdict) ? Math.round(100 - c) : Math.round(c);
  const confidence_band: 'LOW' | 'MEDIUM' | 'HIGH' =
    c >= 85 ? 'HIGH' : c >= 60 ? 'MEDIUM' : 'LOW';
  return { trust_score, confidence_band };
}

/** Assemble the final ScanResult shape returned to the client. */
export function finalize(raw: ValidatedGeminiResponse, type: string) {
  const evidence = raw.evidence ?? [];
  const { trust_score, confidence_band } = computeTrust(raw.verdict, raw.confidence);
  return {
    id: uuidv4().slice(0, 9),
    date: new Date().toISOString(),
    type,
    verdict: raw.verdict,
    confidence: raw.confidence,
    trust_score,
    confidence_band,
    threat_level: raw.threat_level,
    evidence,
    red_flags: evidence.map((e: { finding: string }) => e.finding),
    explanation_hindi: raw.explanation_hindi,
    explanation_english: raw.explanation_english,
    recommendation: raw.recommendation,
    scam_type: raw.scam_type,
    impersonating: raw.impersonating,
  };
}

const EVIDENCE_SCHEMA = `"evidence": [
    { "category": "visual|audio|text|metadata|network", "finding": "short specific finding", "severity": "low|medium|high", "location": "optional: timestamp, region, or text location" }
  ]`;

/**
 * Call Gemini and validate the response with Zod.
 * Retries once on transient failures with a 1-second backoff.
 */
async function askGemini(
  prompt: string,
  part: { inlineData: { data: string; mimeType: string } } | { text: string },
  requestId: string,
): Promise<ValidatedGeminiResponse> {
  const MAX_RETRIES = 1;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: [prompt, part],
      });

      if (!response.text) throw new Error('Empty response from AI');

      const parsed = JSON.parse(cleanJson(response.text));
      return GeminiResponseSchema.parse(parsed);
    } catch (err: any) {
      if (attempt < MAX_RETRIES) {
        logger.warn('Gemini call failed, retrying...', {
          requestId,
          attempt: attempt + 1,
          error: err.message,
        });
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }

  throw new Error('Exhausted retries');
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.post('/api/analyze/media', async (req, res) => {
  const requestId = (req as any).requestId;
  try {
    const { base64Data, mimeType } = MediaBodySchema.parse(req.body);

    const prompt = `You are DeepShield AI, India's top deepfake detection system.
Analyze this media file (image or video) for signs of AI manipulation, deepfake generation, or digital tampering. Check for: unnatural eye blinking, facial boundary artifacts, lighting inconsistencies, pixel-level anomalies, unnatural skin texture, audio-visual sync issues.
ALWAYS return ONLY raw JSON (no markdown fences) in this exact shape:
{
  "verdict": "REAL" | "FAKE",
  "confidence": 0-100,
  "threat_level": "SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  ${EVIDENCE_SCHEMA},
  "explanation_hindi": "simple explanation in Hindi",
  "explanation_english": "simple explanation in English",
  "recommendation": "what user should do next"
}
If media looks completely natural, set verdict="REAL", threat_level="SAFE", evidence=[].`;

    const parsed = await askGemini(prompt, { inlineData: { data: base64Data, mimeType } }, requestId);
    logger.info('Media analysis complete', { requestId, verdict: parsed.verdict });
    res.json(finalize(parsed, 'Media File'));
  } catch (err: any) {
    handleRouteError(res, err, 'analyze/media', requestId);
  }
});

app.post('/api/analyze/voice', async (req, res) => {
  const requestId = (req as any).requestId;
  try {
    const { base64Data, mimeType } = MediaBodySchema.parse(req.body);

    const prompt = `You are DeepShield AI's voice clone & synthetic audio detector.
Analyze this audio clip specifically for AI voice cloning or speech synthesis (distinct from generic deepfake video/image checks). Check for: speaker embedding anomalies, unnatural prosody/rhythm, synthesis/vocoder artifacts, spectral inconsistencies, unnatural breathing patterns, background-noise discontinuities, robotic or metallic timbre.
ALWAYS return ONLY raw JSON (no markdown fences) in this exact shape:
{
  "verdict": "REAL" | "CLONED",
  "confidence": 0-100,
  "threat_level": "SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  ${EVIDENCE_SCHEMA},
  "explanation_hindi": "simple explanation in Hindi",
  "explanation_english": "simple explanation in English",
  "recommendation": "what user should do next"
}
If the voice sounds genuinely human with no synthesis markers, set verdict="REAL", threat_level="SAFE", evidence=[].`;

    const parsed = await askGemini(prompt, { inlineData: { data: base64Data, mimeType } }, requestId);
    logger.info('Voice analysis complete', { requestId, verdict: parsed.verdict });
    res.json(finalize(parsed, 'Voice Clone'));
  } catch (err: any) {
    handleRouteError(res, err, 'analyze/voice', requestId);
  }
});

app.post('/api/analyze/document', async (req, res) => {
  const requestId = (req as any).requestId;
  try {
    const { base64Data, mimeType } = MediaBodySchema.parse(req.body);

    const prompt = `You are DeepShield AI document verification system.
Analyze this document image for signs of forgery or tampering. Check: font consistency, logo authenticity, QR code validity, color gradients, hologram indicators, layout standards, text alignment, government watermarks.
ALWAYS return ONLY raw JSON (no markdown fences) in this exact shape:
{
  "verdict": "GENUINE" | "SUSPICIOUS",
  "confidence": 0-100,
  "threat_level": "SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  ${EVIDENCE_SCHEMA},
  "explanation_hindi": "simple explanation in Hindi",
  "explanation_english": "simple explanation in English",
  "recommendation": "what user should do next"
}`;

    const parsed = await askGemini(prompt, { inlineData: { data: base64Data, mimeType } }, requestId);
    logger.info('Document analysis complete', { requestId, verdict: parsed.verdict });
    res.json(finalize(parsed, 'Document'));
  } catch (err: any) {
    handleRouteError(res, err, 'analyze/document', requestId);
  }
});

app.post('/api/analyze/scam', async (req, res) => {
  const requestId = (req as any).requestId;
  try {
    const { text } = ScamBodySchema.parse(req.body);

    const prompt = `You are DeepShield AI scam detection system for Indian users.
Analyze this text/message/call transcript for scam patterns. Check for: urgency manipulation, fake government impersonation, UPI fraud patterns, KYC scam language, lottery fraud, job scam patterns, loan fraud, romance scam, electricity bill scam.
ALWAYS return ONLY raw JSON (no markdown fences) in this exact shape:
{
  "verdict": "REAL" | "FAKE",
  "confidence": 0-100,
  "threat_level": "SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "scam_type": "e.g. UPI Fraud / Extortion",
  ${EVIDENCE_SCHEMA},
  "explanation_hindi": "simple explanation in Hindi",
  "explanation_english": "simple explanation in English",
  "recommendation": "what user should do next, step by step"
}
If it looks like a normal legitimate message, set verdict="REAL", threat_level="SAFE", evidence=[].`;

    const parsed = await askGemini(prompt, { text }, requestId);
    logger.info('Scam analysis complete', { requestId, verdict: parsed.verdict });
    res.json(finalize(parsed, 'Text/Message'));
  } catch (err: any) {
    handleRouteError(res, err, 'analyze/scam', requestId);
  }
});

app.post('/api/analyze/url', async (req, res) => {
  const requestId = (req as any).requestId;
  try {
    const { url } = UrlBodySchema.parse(req.body);

    const prompt = `You are DeepShield AI URL safety analyzer for Indian users.
Analyze this URL for signs of phishing, fraud, or cybercrime. Check for: fake banking sites, UPI fraud pages, government impersonation, brand misspelling, suspicious TLDs, HTTP usage for sensitive sites.
ALWAYS return ONLY raw JSON (no markdown fences) in this exact shape:
{
  "verdict": "SAFE" | "DANGEROUS",
  "confidence": 0-100,
  "threat_level": "SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "impersonating": "what brand/org it fakes, or empty string",
  ${EVIDENCE_SCHEMA},
  "explanation_hindi": "Hindi explanation",
  "explanation_english": "English explanation",
  "recommendation": "what user should do"
}`;

    const parsed = await askGemini(prompt, { text: url }, requestId);
    logger.info('URL analysis complete', { requestId, verdict: parsed.verdict });
    res.json(finalize(parsed, 'URL'));
  } catch (err: any) {
    handleRouteError(res, err, 'analyze/url', requestId);
  }
});

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, uptime: process.uptime(), timestamp: new Date().toISOString() }),
);

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------

function handleRouteError(res: express.Response, err: any, route: string, requestId: string) {
  if (err instanceof ZodError) {
    const messages = err.issues.map((e) => `${e.path.join('.')}: ${e.message}`);
    logger.warn('Validation error', { requestId, route, errors: messages });
    return res.status(400).json({ error: 'Validation failed', details: messages });
  }

  logger.error('Route error', { requestId, route, error: err.message, stack: err.stack });
  res.status(500).json({ error: err.message || 'Analysis failed' });
}
