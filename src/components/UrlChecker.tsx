import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Link2, AlertOctagon, RefreshCw, Lock, Shield, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { analyzeUrl } from '../lib/api';
import { ScanningAnimation } from './ScanningAnimation';
import { AnalysisResultCard } from './AnalysisResultCard';
import type { ScanResult } from '../types';

const SAMPLE_URLS = [
  { label: '🏦 Fake Bank', url: 'http://sbi-netbanking-login.xyz/secure' },
  { label: '📦 Fake Delivery', url: 'http://india-post-tracking.net/parcel?id=IN2026' },
  { label: '🎰 Lottery Scam', url: 'http://g00gle-prize-winner.com/claim' },
];

function UrlProtocolBadge({ url }: { url: string }) {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const isHttps = trimmed.startsWith('https://');
  const isHttp = trimmed.startsWith('http://');

  if (isHttps) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-green-950/50 text-green-400 border border-green-800/50">
        <CheckCircle className="w-3 h-3" /> HTTPS
      </span>
    );
  }
  if (isHttp) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-yellow-950/50 text-yellow-400 border border-yellow-800/50">
        <AlertTriangle className="w-3 h-3" /> HTTP
      </span>
    );
  }
  return null;
}

export function UrlChecker({ onScanComplete }: { onScanComplete: (r: ScanResult) => void }) {
  const { t } = useLang();
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const protocolBadge = useMemo(() => <UrlProtocolBadge url={url} />, [url]);

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
        <h2 className="text-3xl font-bold text-slate-100 tracking-tight mb-2 flex items-center justify-center gap-3">
          <Link2 className="w-8 h-8 text-cyan-400" />
          {t.checkUrlTitle}
        </h2>
        <p className="text-slate-400">{t.checkUrlDesc}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex-1 min-h-[260px] glass rounded-2xl p-4 flex flex-col focus-within:border-cyan-500/30 focus-within:ring-1 focus-within:ring-cyan-500/30 transition-all">
            {/* Protocol badge + label */}
            <div className="flex items-center gap-2 mb-2">
              <label htmlFor="url-input" className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                URL Input
              </label>
              {protocolBadge}
            </div>
            <textarea
              id="url-input"
              className="flex-1 bg-transparent border-none text-slate-300 placeholder:text-slate-600 resize-none outline-none custom-scrollbar font-mono text-sm"
              placeholder={t.pasteUrlPlaceholder}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              aria-describedby={error ? 'url-error' : undefined}
            />
          </div>

          {/* Quick-paste sample URL buttons */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-slate-500 flex items-center gap-1 mr-1">
              <Zap className="w-3 h-3" /> Try sample:
            </span>
            {SAMPLE_URLS.map((sample) => (
              <button
                key={sample.label}
                onClick={() => setUrl(sample.url)}
                className="text-xs px-3 py-1.5 rounded-lg glass-light text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
              >
                {sample.label}
              </button>
            ))}
          </div>

          {error && (
            <div id="url-error" className="p-4 bg-red-500/10 border border-red-200 dark:bg-red-950/50 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-500 flex items-center gap-3" role="alert">
              <AlertOctagon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!url.trim() || isScanning}
            className={`w-full py-4 rounded-xl font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-3
              ${!url.trim() ? 'bg-slate-800 text-slate-500 cursor-not-allowed' :
                isScanning ? 'glass-cyan text-cyan-400 neon-pulse' :
                'btn-gradient text-white'
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
