import { useState } from 'react';
import { motion } from 'motion/react';
import { Link2, AlertOctagon, RefreshCw, Lock, Shield } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { analyzeUrl } from '../lib/api';
import { ScanningAnimation } from './ScanningAnimation';
import { AnalysisResultCard } from './AnalysisResultCard';
import type { ScanResult } from '../types';

export function UrlChecker({ onScanComplete }: { onScanComplete: (r: ScanResult) => void }) {
  const { t } = useLang();
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setIsScanning(true);
    setError(null);
    setResult(null);

    try {
      const parsed = await analyzeUrl(url);
      setResult(parsed);
      onScanComplete(parsed);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to analyze URL.');
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
          <Link2 className="w-8 h-8 text-cyan-400" />
          {t.checkUrlTitle}
        </h2>
        <p className="text-slate-400">{t.checkUrlDesc}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex-1 min-h-[300px] bg-slate-900 border border-slate-700/50 rounded-2xl p-4 flex flex-col focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/50 transition-all">
            <label htmlFor="url-input" className="sr-only">
              Paste suspicious URL
            </label>
            <textarea
              id="url-input"
              className="flex-1 bg-transparent border-none text-slate-300 placeholder:text-slate-600 resize-none outline-none custom-scrollbar"
              placeholder={t.pasteUrlPlaceholder}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              aria-describedby={error ? 'url-error' : undefined}
            />
          </div>

          {error && (
            <div id="url-error" className="p-4 bg-red-950/50 border border-red-900/50 rounded-xl text-red-500 flex items-center gap-3" role="alert">
              <AlertOctagon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!url.trim() || isScanning}
            className={`w-full py-4 rounded-xl font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-3
              ${!url.trim() ? 'bg-slate-800 text-slate-500 cursor-not-allowed' :
                isScanning ? 'bg-cyan-900 text-cyan-400 border border-cyan-800 glow-cyan' :
                'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
              }`}
          >
            {isScanning ? (
              <><RefreshCw className="w-5 h-5 animate-spin" /> {t.analyzing}</>
            ) : (
              <><Lock className="w-5 h-5" /> {t.scanUrl}</>
            )}
          </button>
        </div>

        <div className="relative min-h-[400px] flex rounded-2xl overflow-hidden">
          {isScanning ? (
            <ScanningAnimation type="media" />
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
