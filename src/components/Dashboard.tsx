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

export function Dashboard({ history, isCloudSynced }: { history: ScanResult[]; isCloudSynced: boolean }) {
  const { t } = useLang();

  const fakesCount = useMemo(() => history.filter(h => isDangerVerdict(h.verdict)).length, [history]);
  const safeCount = useMemo(() => history.length - fakesCount, [history.length, fakesCount]);
  const threatRatio = useMemo(() => history.length > 0 ? (fakesCount / history.length) * 100 : 0, [fakesCount, history.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-5xl mx-auto space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-cyan-400" />
            {t.threatDashboard}
          </h2>
          <p className="text-slate-400">{t.monitoring}</p>
        </div>
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono border whitespace-nowrap
          ${isCloudSynced ? 'bg-cyan-950/30 border-cyan-900/50 text-cyan-400' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
        >
          {isCloudSynced ? <Database className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          {isCloudSynced ? t.cloudSynced : t.localOnly}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-cyan-500" />
            <h3 className="text-slate-400 font-medium">{t.totalScans}</h3>
          </div>
          <p className="text-4xl font-bold text-white"><AnimatedCounter value={history.length} /></p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 glow-red">
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <h3 className="text-slate-400 font-medium">{t.threatsDetected}</h3>
          </div>
          <p className="text-4xl font-bold text-red-500"><AnimatedCounter value={fakesCount} /></p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 glow-green">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <h3 className="text-slate-400 font-medium">{t.safeAssets}</h3>
          </div>
          <p className="text-4xl font-bold text-green-500"><AnimatedCounter value={safeCount} /></p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertOctagon className="w-5 h-5 text-orange-500" />
            <h3 className="text-slate-400 font-medium">Threat Ratio</h3>
          </div>
          <p className="text-4xl font-bold text-orange-500">
            <AnimatedCounter value={threatRatio} />%
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-lg text-white">{t.indiaThreatMap}</h3>
          <span className="text-xs font-mono text-slate-500 bg-slate-800 px-2 py-1 rounded">SIMULATED DEMO</span>
        </div>
        <div className="p-6 flex justify-center bg-slate-950 min-h-[400px] relative overflow-hidden">
          <IndiaThreatMap />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ThreatTypeBreakdown history={history} />
        <LiveScanFeed history={history} />
      </div>
    </motion.div>
  );
}
