import { useMemo } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Activity, ShieldAlert, ShieldCheck, AlertOctagon, Database, Smartphone } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { isDangerVerdict } from '../types';
import type { ScanResult } from '../types';
import { AnimatedCounter } from './AnimatedCounter';
import { IndiaThreatMap } from './IndiaThreatMap';
import { ThreatTypeBreakdown } from './ThreatTypeBreakdown';
import { LiveScanFeed } from './LiveScanFeed';

/** Tiny inline sparkline SVG from recent history */
function MiniSparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return null;
  const max = Math.max(...values, 1);
  const w = 80;
  const h = 28;
  const points = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - (v / max) * h}`).join(' ');

  return (
    <svg width={w} height={h} className="mt-2 opacity-60">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Glow line underneath */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.2"
        filter="blur(3px)"
      />
    </svg>
  );
}

const STAT_CARDS = [
  { key: 'total', icon: Activity, color: '#06b6d4', gradient: 'from-cyan-500/10', borderColor: 'border-cyan-500/20' },
  { key: 'threats', icon: ShieldAlert, color: '#ef4444', gradient: 'from-red-500/10', borderColor: 'border-red-500/20' },
  { key: 'safe', icon: ShieldCheck, color: '#22c55e', gradient: 'from-green-500/10', borderColor: 'border-green-500/20' },
  { key: 'ratio', icon: AlertOctagon, color: '#f97316', gradient: 'from-orange-500/10', borderColor: 'border-orange-500/20' },
] as const;

export function Dashboard({ history, isCloudSynced }: { history: ScanResult[]; isCloudSynced: boolean }) {
  const { t } = useLang();

  const fakesCount = useMemo(() => history.filter(h => isDangerVerdict(h.verdict)).length, [history]);
  const safeCount = useMemo(() => history.length - fakesCount, [history.length, fakesCount]);
  const threatRatio = useMemo(() => history.length > 0 ? (fakesCount / history.length) * 100 : 0, [fakesCount, history.length]);

  // Sparkline data — last 8 scans' trust scores
  const sparklineData = useMemo(() => {
    return history.slice(0, 8).map(h => h.trust_score ?? 50).reverse();
  }, [history]);

  const statValues = [history.length, fakesCount, safeCount, threatRatio];
  const statLabels = [t.totalScans, t.threatsDetected, t.safeAssets, 'Threat Ratio'];
  const statSuffixes = ['', '', '', '%'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-5xl mx-auto space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold text-slate-100 tracking-tight mb-2 flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-cyan-400" />
            {t.threatDashboard}
          </h2>
          <p className="text-slate-400">{t.monitoring}</p>
        </div>
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border whitespace-nowrap
          ${isCloudSynced ? 'glass-cyan text-cyan-400' : 'glass-light text-slate-400'}`}
        >
          {isCloudSynced ? <Database className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          {isCloudSynced ? t.cloudSynced : t.localOnly}
        </span>
      </div>

      {/* Stat Cards with staggered entrance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAT_CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative glass rounded-2xl p-6 overflow-hidden card-hover ${card.borderColor}`}
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} to-transparent`} style={{ backgroundColor: card.color, opacity: 0.4 }} />

              {/* Icon glow */}
              <div className="absolute top-4 right-4 opacity-10" aria-hidden="true">
                <Icon className="w-16 h-16" style={{ color: card.color }} />
              </div>

              <div className="flex items-center gap-3 mb-2 relative z-10">
                <Icon className="w-5 h-5" style={{ color: card.color }} />
                <h3 className="text-slate-400 font-medium">{statLabels[i]}</h3>
              </div>
              <p className="text-4xl font-bold relative z-10" style={{ color: card.color }}>
                <AnimatedCounter value={statValues[i]} />{statSuffixes[i]}
              </p>

              {/* Mini sparkline */}
              <MiniSparkline values={sparklineData} color={card.color} />
            </motion.div>
          );
        })}
      </div>

      {/* India Threat Map */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800/50 flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-100">{t.indiaThreatMap}</h3>
          <span className="text-xs font-mono text-slate-500 glass-light px-2 py-1 rounded-full">SIMULATED DEMO</span>
        </div>
        <div className="p-6 flex justify-center bg-slate-950/30 min-h-[400px] relative overflow-hidden">
          <IndiaThreatMap />
        </div>
      </div>

      {/* Breakdown + Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ThreatTypeBreakdown history={history} />
        <LiveScanFeed history={history} />
      </div>
    </motion.div>
  );
}
