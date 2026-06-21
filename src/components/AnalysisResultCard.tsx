import { motion } from 'motion/react';
import { AlertOctagon, CheckCircle, AlertTriangle, Shield } from 'lucide-react';
import type { ScanResult } from '../types';
import { isDangerVerdict } from '../types';
import { TrustScoreGauge } from './TrustScoreGauge';
import { ExplainabilityPanel } from './ExplainabilityPanel';
import { CybercrimeAction } from './CybercrimeAction';
import { CertificateAction } from './CertificateAction';

export function AnalysisResultCard({ result }: { result: ScanResult }) {
  const isDanger = isDangerVerdict(result.verdict);
  const colorObj = isDanger ? {
    border: 'border-red-500',
    bg: 'bg-red-950/20',
    glow: 'glow-red',
    text: 'text-red-500',
    icon: AlertOctagon,
  } : {
    border: 'border-green-500',
    bg: 'bg-green-950/20',
    glow: 'glow-green',
    text: 'text-green-500',
    icon: CheckCircle,
  };

  const Icon = colorObj.icon;
  // Legacy localStorage records (saved before this upgrade) won't have trust_score/confidence_band yet.
  const trustScore = result.trust_score ?? (isDanger ? 100 - result.confidence : result.confidence);
  const confidenceBand = result.confidence_band;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className={`absolute inset-0 border-2 ${colorObj.border} ${colorObj.bg} ${colorObj.glow} rounded-2xl p-6 overflow-y-auto custom-scrollbar`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700/50 pb-4 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Analysis Verdict</h3>
          <div className="flex items-center gap-3">
            <Icon className={`w-8 h-8 ${colorObj.text}`} />
            <span className={`text-4xl font-black tracking-tight ${colorObj.text}`}>{result.verdict}</span>
          </div>
          <p className="text-sm text-slate-400 font-mono mt-1">Model confidence: {result.confidence}%</p>
        </div>
        <TrustScoreGauge score={trustScore} band={confidenceBand} />
      </div>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <span className="text-sm text-slate-400">Threat Level:</span>
        <span className={`px-3 py-1 rounded text-xs font-bold tracking-wider
          ${result.threat_level === 'CRITICAL' || result.threat_level === 'HIGH' ? 'bg-red-500 text-white' :
            result.threat_level === 'MEDIUM' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'}
        `}>
          {result.threat_level}
        </span>
        {result.scam_type && (
          <span className="ml-auto text-sm font-semibold bg-red-900/50 text-red-300 px-3 py-1 rounded-full border border-red-800">
            {result.scam_type}
          </span>
        )}
        {result.impersonating && (
          <span className="ml-2 text-sm font-semibold bg-orange-900/50 text-orange-300 px-3 py-1 rounded-full border border-orange-800 flex items-center gap-1">
            <AlertOctagon className="w-3 h-3" /> Faking: {result.impersonating}
          </span>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <h4 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" /> Evidence & Explainability
          </h4>
          <ExplainabilityPanel evidence={result.evidence} fallbackFlags={result.red_flags} />
        </div>

        <div>
          <h4 className="text-lg font-bold text-white mb-2">AI Analysis</h4>
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700 space-y-3">
            <p className="text-slate-300 text-sm leading-relaxed"><span className="text-cyan-400 font-semibold text-xs uppercase tracking-widest mr-2">EN</span> {result.explanation_english}</p>
            {result.explanation_hindi && (
              <p className="text-slate-400 text-sm leading-relaxed border-t border-slate-800 pt-3"><span className="text-green-400 font-semibold text-xs uppercase tracking-widest mr-2">HI</span> {result.explanation_hindi}</p>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-500" /> Recommendation
          </h4>
          <div className="bg-cyan-950/30 border border-cyan-900 p-4 rounded-xl mb-6">
            <p className="text-cyan-100 font-medium">{result.recommendation}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-slate-700/50 pt-6">
        {isDanger ? <CybercrimeAction result={result} /> : <CertificateAction result={result} />}
      </div>
    </motion.div>
  );
}
