import { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, X, RefreshCw, Search, Shield, Zap } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { analyzeScam } from '../lib/api';
import { ScanningAnimation } from './ScanningAnimation';
import { AnalysisResultCard } from './AnalysisResultCard';
import type { ScanResult } from '../types';

const SAMPLE_MESSAGES = [
  {
    label: '🏦 Fake KYC',
    text: 'Dear customer, your SBI account PAN link is pending. Your account will be blocked today. Click link to update immediately: http://sbi-kyc-update.xyz',
  },
  {
    label: '🎁 Lottery Scam',
    text: 'Congratulations! You won ₹25,00,000 in Jio Lucky Draw 2026! Claim now by sending your Aadhaar and bank details to this WhatsApp: +91 98765 43210',
  },
  {
    label: '⚡ Bill Scam',
    text: 'URGENT: Your electricity connection will be disconnected today due to pending bill of ₹4,832. Pay now via this link to avoid disconnection: http://bill-pay-india.net/urgent',
  },
];

export function ScamChecker({ onScanComplete }: { onScanComplete: (r: ScanResult) => void }) {
  const { t } = useLang();
  const [text, setText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setIsScanning(true);
    setError(null);
    setResult(null);

    try {
      const parsed = await analyzeScam(text);
      setResult(parsed);
      onScanComplete(parsed);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to analyze text.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="mb-8 text-left sm:text-center">
        <h2 className="text-3xl font-bold text-slate-100 tracking-tight mb-2 flex items-center justify-center gap-3">
          <MessageSquare className="w-8 h-8 text-cyan-400" />
          {t.scamTitle}
        </h2>
        <p className="text-slate-400">{t.scamDesc}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <label htmlFor="scam-text-input" className="sr-only">
              Paste suspicious message
            </label>
            <textarea
              id="scam-text-input"
              className="w-full h-[260px] glass rounded-2xl p-4 text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none placeholder:text-slate-600"
              placeholder="Paste the suspicious message here...&#10;&#10;e.g., 'Dear customer, your SBI account PAN link is pending. Your account will be blocked today. Click link: http://sbi-kyc-update.xyz'"
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-describedby={error ? 'scam-error' : undefined}
            />
            {text && (
              <button
                onClick={() => setText('')}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
                aria-label="Clear text"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Character count */}
            <div className="absolute bottom-3 right-4 text-xs font-mono text-slate-600">
              {text.length} chars
            </div>
          </div>

          {/* Quick-paste sample buttons */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-slate-500 flex items-center gap-1 mr-1">
              <Zap className="w-3 h-3" /> Try sample:
            </span>
            {SAMPLE_MESSAGES.map((sample) => (
              <button
                key={sample.label}
                onClick={() => setText(sample.text)}
                className="text-xs px-3 py-1.5 rounded-lg glass-light text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
              >
                {sample.label}
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={!text.trim() || isScanning}
              className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all
                ${!text.trim() || isScanning
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'btn-gradient text-white'
                }`}
            >
              {isScanning ? (
                <><RefreshCw className="w-5 h-5 animate-spin" /> {t.analyzing}</>
              ) : (
                <><Search className="w-5 h-5" /> {t.analyzeMsg}</>
              )}
            </button>
          </div>
          {error && (
            <p id="scam-error" className="text-red-600 dark:text-red-400 text-sm" role="alert">{error}</p>
          )}
        </div>

        <div className="flex flex-col relative h-full min-h-[400px]">
          {isScanning ? (
            <ScanningAnimation type="document" />
          ) : result ? (
            <AnalysisResultCard result={result} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center glass rounded-2xl p-8 text-center text-slate-500">
              <Shield className="w-16 h-16 mb-4 opacity-50" />
              <p>{t.resultsWillAppear}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
