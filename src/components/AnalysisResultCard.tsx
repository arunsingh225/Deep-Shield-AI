import { motion } from 'motion/react';
import { AlertOctagon, CheckCircle, AlertTriangle, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { ScanResult } from '../types';
import { isDangerVerdict } from '../types';
import { TrustScoreGauge } from './TrustScoreGauge';
import { ExplainabilityPanel } from './ExplainabilityPanel';
import { CybercrimeAction } from './CybercrimeAction';
import { CertificateAction } from './CertificateAction';

/** Particle burst for safe verdicts */
function VerdictSparkles({ color }: { color: string }) {
  const sparkles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 120,
    y: (Math.random() - 0.5) * 80,
    size: Math.random() * 6 + 3,
    delay: Math.random() * 0.3,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 1, scale: 0, x: '50%', y: '50%' }}
          animate={{ opacity: 0, scale: 1, x: `calc(50% + ${s.x}px)`, y: `calc(50% + ${s.y}px)` }}
          transition={{ duration: 0.8, delay: s.delay, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 ${s.size * 2}px ${color}`,
          }}
        />
      ))}
    </div>
  );
}

export function AnalysisResultCard({ result }: { result: ScanResult }) {
  const isDanger = isDangerVerdict(result.verdict);
  const [analysisExpanded, setAnalysisExpanded] = useState(true);

  const colorObj = isDanger ? {
    border: 'border-red-500/60',
    bg: 'bg-red-950/10',
    glow: 'glow-red',
    text: 'text-red-500',
    sparkle: '#ef4444',
    icon: AlertOctagon,
  } : {
    border: 'border-green-500/60',
    bg: 'bg-green-950/10',
    glow: 'glow-green',
    text: 'text-green-500',
    sparkle: '#22c55e',
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
      className={`absolute inset-0 border ${colorObj.border} glass ${colorObj.glow} rounded-2xl p-6 overflow-y-auto custom-scrollbar`}
    >
      {/* Sparkle burst */}
      <VerdictSparkles color={colorObj.sparkle} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700/50 pb-4 mb-4 relative">
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Analysis Verdict</h3>
          <div className="flex items-center gap-3 verdict-burst">
            <Icon className={`w-8 h-8 ${colorObj.text}`} />
            <span className={`text-4xl font-black tracking-tight ${colorObj.text}`}>{result.verdict}</span>
          </div>
          <p className="text-sm text-slate-400 font-mono mt-1">Model confidence: {result.confidence}%</p>
        </div>
        <TrustScoreGauge score={trustScore} band={confidenceBand} />
      </div>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <span className="text-sm text-slate-400">Threat Level:</span>
        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider
          ${result.threat_level === 'CRITICAL' || result.threat_level === 'HIGH'
            ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.3)]'
            : result.threat_level === 'MEDIUM'
              ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-black'
              : 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.3)]'
          }
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
          <h4 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" /> Evidence & Explainability
          </h4>
          <ExplainabilityPanel evidence={result.evidence} fallbackFlags={result.red_flags} />
        </div>

        {/* Collapsible AI Analysis */}
        <div>
          <button
            onClick={() => setAnalysisExpanded(!analysisExpanded)}
            className="w-full text-lg font-bold text-slate-100 mb-2 flex items-center justify-between gap-2 hover:text-cyan-400 transition-colors"
          >
            <span>AI Analysis</span>
            {analysisExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {analysisExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="glass-light p-4 rounded-xl space-y-3"
            >
              <p className="text-slate-300 text-sm leading-relaxed"><span className="text-cyan-400 font-semibold text-xs uppercase tracking-widest mr-2">EN</span> {result.explanation_english}</p>
              {result.explanation_hindi && (
                <p className="text-slate-400 text-sm leading-relaxed border-t border-slate-800 pt-3"><span className="text-green-400 font-semibold text-xs uppercase tracking-widest mr-2">HI</span> {result.explanation_hindi}</p>
              )}
            </motion.div>
          )}
        </div>

        <div>
          <h4 className="text-lg font-bold text-slate-100 mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-500" /> Recommendation
          </h4>
          <div className="glass-cyan p-4 rounded-xl mb-6">
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
