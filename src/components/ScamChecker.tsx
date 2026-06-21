import { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, X, RefreshCw, Search, Shield } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { analyzeScam } from '../lib/api';
import { ScanningAnimation } from './ScanningAnimation';
import { AnalysisResultCard } from './AnalysisResultCard';
import type { ScanResult } from '../types';

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
        <h2 className="text-3xl font-bold text-white tracking-tight mb-2 flex items-center justify-center gap-3">
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
              className="w-full h-[300px] bg-slate-900 border border-slate-700 rounded-2xl p-4 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
              placeholder="Paste the suspicious message here...&#10;&#10;e.g., 'Dear customer, your SBI account PAN link is pending. Your account will be blocked today. Click link: http://sbi-kyc-update.xyz'"
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-describedby={error ? 'scam-error' : undefined}
            />
            {text && (
              <button
                onClick={() => setText('')}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"
                aria-label="Clear text"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={!text.trim() || isScanning}
              className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all
                ${!text.trim() || isScanning
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
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
            <p id="scam-error" className="text-red-400 text-sm" role="alert">{error}</p>
          )}
        </div>

        <div className="flex flex-col relative h-full min-h-[400px]">
          {isScanning ? (
            <ScanningAnimation type="document" />
          ) : result ? (
            <AnalysisResultCard result={result} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-900/40 rounded-2xl border border-slate-800/50 p-8 text-center text-slate-500">
              <Shield className="w-16 h-16 mb-4 opacity-50" />
              <p>{t.resultsWillAppear}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
