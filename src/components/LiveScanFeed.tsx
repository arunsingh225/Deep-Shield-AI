import { useMemo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, RefreshCw, Video, FileText, MessageSquare, Link2, Mic, ShieldAlert, ShieldCheck } from 'lucide-react';
import { isDangerVerdict } from '../types';
import type { ScanResult } from '../types';
import { timeAgo } from '../lib/utils';

const TYPE_ICON: Record<string, React.ReactNode> = {
  'Media File': <Video className="w-5 h-5" />,
  'Voice Clone': <Mic className="w-5 h-5" />,
  'Document': <FileText className="w-5 h-5" />,
  'Text/Message': <MessageSquare className="w-5 h-5" />,
  'URL': <Link2 className="w-5 h-5" />,
};

const THREAT_BORDER: Record<string, string> = {
  true: 'border-l-red-500',
  false: 'border-l-emerald-500',
};

export function LiveScanFeed({ history }: { history: ScanResult[] }) {
  const recentScans = useMemo(() => [...history].reverse().slice(0, 10), [history]);

  // Auto-refresh relative times every 30s
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass rounded-2xl overflow-hidden flex flex-col h-full">
      <div className="p-5 sm:p-6 border-b border-slate-800/50 flex items-center justify-between">
        <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" /> Live Scan Feed
        </h3>
        <span className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-cyan-400 glass-cyan px-2 py-1 flex-shrink-0 rounded-full">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse drop-shadow-[0_0_5px_#22d3ee]" />
          LIVE
        </span>
      </div>
      <div className="p-4 flex-1 h-[350px] overflow-y-auto custom-scrollbar">
        <div className="space-y-2.5 h-full">
          <AnimatePresence mode="popLayout">
            {recentScans.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-slate-500 py-12"
              >
                <RefreshCw className="w-8 h-8 mb-4 animate-spin opacity-50" />
                <p className="animate-pulse">Awaiting first scan...</p>
              </motion.div>
            ) : (
              recentScans.map((item) => {
                const isThreat = isDangerVerdict(item.verdict);
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border-l-4 glass-light transition-colors gap-3 sm:gap-0
                      ${THREAT_BORDER[String(isThreat)]}
                      ${isThreat ? 'text-red-100' : 'text-emerald-100'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`shrink-0 p-2.5 rounded-lg ${isThreat ? 'bg-red-900/30 text-red-400' : 'bg-emerald-900/30 text-emerald-400'}`}>
                        {TYPE_ICON[item.type] || <Link2 className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                          <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider ${isThreat ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                            {item.verdict}
                          </span>
                          <span className={`text-[10px] sm:text-xs font-mono font-medium ${isThreat ? 'text-red-300' : 'text-emerald-300'}`}>Conf: {item.confidence}%</span>
                          {typeof item.trust_score === 'number' && (
                            <span className={`text-[10px] sm:text-xs font-mono font-medium ${isThreat ? 'text-red-300' : 'text-emerald-300'}`}>Trust: {item.trust_score}</span>
                          )}
                        </div>
                        <div className="text-xs flex items-center gap-1.5 font-medium">
                          {isThreat ? <ShieldAlert className="w-3.5 h-3.5 text-red-500" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
                          <span className={isThreat ? 'text-red-200' : 'text-emerald-200'}>Level: {item.threat_level}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right sm:text-right flex sm:flex-col justify-between sm:justify-end items-center sm:items-end w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-800/40 text-xs font-mono">
                      <span className="opacity-50 tracking-widest">{timeAgo(item.date)}</span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
