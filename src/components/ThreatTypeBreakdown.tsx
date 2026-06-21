import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';
import { isDangerVerdict } from '../types';
import type { ScanResult } from '../types';

const CATEGORIES = [
  { type: 'Media File', label: 'Deepfakes', color: 'bg-indigo-500' },
  { type: 'Voice Clone', label: 'Voice Clones', color: 'bg-fuchsia-500' },
  { type: 'Document', label: 'Fake Documents', color: 'bg-emerald-500' },
  { type: 'Text/Message', label: 'Scam Messages', color: 'bg-orange-500' },
  { type: 'URL', label: 'Dangerous URLs', color: 'bg-rose-500' },
];

export function ThreatTypeBreakdown({ history }: { history: ScanResult[] }) {
  const maxTotal = Math.max(history.length, 1);

  const breakdownData = useMemo(() => {
    return CATEGORIES.map((item) => {
      const count = history.filter((h) => h.type === item.type).length;
      const threatCount = history.filter(
        (h) => h.type === item.type && isDangerVerdict(h.verdict),
      ).length;
      const pct = Math.round((count / maxTotal) * 100) || 0;
      return {
        ...item,
        count,
        threatCount,
        pct,
      };
    });
  }, [history, maxTotal]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-full shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="p-6 border-b border-slate-800 bg-slate-900/50">
        <h3 className="font-bold text-lg text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" /> Threat Breakdown
        </h3>
      </div>
      <div className="p-6 space-y-6 flex-1 bg-slate-950/30">
        {breakdownData.map((item) => {
          return (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300 font-medium">{item.label}</span>
                <span className="text-slate-500">
                  <span className="text-slate-200 font-bold">{item.threatCount} threats</span> / {item.count} total
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.pct}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className={`h-full ${item.color} shadow-[0_0_10px_currentColor]`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
