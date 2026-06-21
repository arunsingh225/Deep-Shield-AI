/**
 * Zod schemas for runtime input/output validation.
 *
 * Why: TypeScript types are erased at runtime. The server was previously
 * accepting arbitrary user input and casting Gemini responses with `as`.
 * Zod gives us runtime guarantees so malformed data never silently passes.
 */
import { z } from 'zod';

// ---------------------------------------------------------------------------
// Request body schemas (validate user input before touching Gemini)
// ---------------------------------------------------------------------------

/** Base64-encoded media payload — used by /analyze/media, /voice, /document */
export const MediaBodySchema = z.object({
  base64Data: z
    .string()
    .min(1, 'base64Data is required')
    .max(35_000_000, 'File too large (max ~25MB base64)'), // base64 is ~33% larger than raw
  mimeType: z
    .string()
    .min(1, 'mimeType is required')
    .regex(/^(image|video|audio|application)\/.+$/, 'Invalid MIME type format'),
});

/** Text payload — used by /analyze/scam */
export const ScamBodySchema = z.object({
  text: z
    .string()
    .min(1, 'text is required')
    .max(50_000, 'Text too long (max 50,000 characters)'),
});

/** URL payload — used by /analyze/url */
export const UrlBodySchema = z.object({
  url: z
    .string()
    .min(1, 'url is required')
    .max(2_048, 'URL too long (max 2048 characters)'),
});

// ---------------------------------------------------------------------------
// Gemini response schema (validate AI output before trusting it)
// ---------------------------------------------------------------------------

const EvidenceItemSchema = z.object({
  category: z.enum(['visual', 'audio', 'text', 'metadata', 'network']).catch('text'),
  finding: z.string().max(500).default('No details provided'),
  severity: z.enum(['low', 'medium', 'high']).catch('medium'),
  location: z.string().max(200).optional(),
});

export const GeminiResponseSchema = z.object({
  verdict: z.enum(['REAL', 'FAKE', 'GENUINE', 'SUSPICIOUS', 'SAFE', 'DANGEROUS', 'CLONED']),
  confidence: z.number().min(0).max(100),
  threat_level: z.enum(['SAFE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).catch('MEDIUM'),
  evidence: z.array(EvidenceItemSchema).max(20).optional().default([]),
  explanation_hindi: z.string().max(5000).optional(),
  explanation_english: z.string().max(5000).default('Analysis complete.'),
  recommendation: z.string().max(5000).default('No specific recommendation.'),
  scam_type: z.string().max(128).optional(),
  impersonating: z.string().max(128).optional(),
});

export type ValidatedGeminiResponse = z.infer<typeof GeminiResponseSchema>;
