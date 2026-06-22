import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Activity, Video, Mic, FileText, MessageSquare, Link2 } from 'lucide-react';
import { isDangerVerdict } from '../types';
import type { ScanResult } from '../types';

const CATEGORIES = [
  { type: 'Media File', label: 'Deepfakes', icon: Video, gradient: 'from-indigo-500 to-indigo-600' },
  { type: 'Voice Clone', label: 'Voice Clones', icon: Mic, gradient: 'from-fuchsia-500 to-fuchsia-600' },
  { type: 'Document', label: 'Fake Documents', icon: FileText, gradient: 'from-emerald-500 to-emerald-600' },
  { type: 'Text/Message', label: 'Scam Messages', icon: MessageSquare, gradient: 'from-orange-500 to-orange-600' },
  { type: 'URL', label: 'Dangerous URLs', icon: Link2, gradient: 'from-rose-500 to-rose-600' },
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
    <div className="glass rounded-2xl overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-800/50">
        <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" /> Threat Breakdown
        </h3>
      </div>
      <div className="p-6 space-y-5 flex-1">
        {breakdownData.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="group">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-300 font-medium flex items-center gap-2">
                  <Icon className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  {item.label}
                </span>
                <span className="text-slate-500 text-xs font-mono">
                  <span className="text-slate-200 font-bold">{item.threatCount} threats</span> / {item.count} total
                </span>
              </div>
              <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.pct}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className={`h-full bg-gradient-to-r ${item.gradient} rounded-full relative`}
                  style={{ boxShadow: '0 0 10px currentColor' }}
                >
                  {/* Animated stripe pattern */}
                  <div className="absolute inset-0 gradient-bar-stripe rounded-full" />
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
