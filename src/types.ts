// --- Shared App Types ---

export type Page = 'hero' | 'deepfake' | 'voice' | 'document' | 'scam' | 'dashboard' | 'url';

export type LangType = 'en' | 'hi';

export type EvidenceCategory = 'visual' | 'audio' | 'text' | 'metadata' | 'network';
export type Severity = 'low' | 'medium' | 'high';

/** A single piece of evidence behind a verdict — the "explainability layer". */
export type EvidenceItem = {
  category: EvidenceCategory;
  finding: string;
  severity: Severity;
  /** Optional pointer to where the evidence was found, e.g. "0:32", "top-right corner", "line 2" */
  location?: string;
};

export type Verdict = 'REAL' | 'FAKE' | 'GENUINE' | 'SUSPICIOUS' | 'SAFE' | 'DANGEROUS' | 'CLONED';
export type ThreatLevel = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ConfidenceBand = 'LOW' | 'MEDIUM' | 'HIGH';

export type ScanResult = {
  id: string;
  type: string;
  date: string;
  verdict: Verdict;
  confidence: number;
  /**
   * 0-100 overall trustworthiness score, oriented so 100 = fully safe/genuine
   * and 0 = fully malicious/fake (unlike `confidence`, which is the model's
   * confidence in whichever verdict it picked, regardless of direction).
   */
  trust_score: number;
  confidence_band: ConfidenceBand;
  threat_level: ThreatLevel;
  /** Flat strings, derived from `evidence` server-side for backward compatibility (reports, certificates). */
  red_flags: string[];
  /** Structured, categorized evidence behind the verdict. May be empty on legacy/local-only records. */
  evidence?: EvidenceItem[];
  explanation_hindi?: string;
  explanation_english: string;
  recommendation: string;
  scam_type?: string;
  impersonating?: string;
};

export const DANGER_VERDICTS: Verdict[] = ['FAKE', 'SUSPICIOUS', 'DANGEROUS', 'CLONED'];
export const isDangerVerdict = (v: Verdict | string) => DANGER_VERDICTS.includes(v as Verdict);
