import { motion } from 'motion/react';
import { Image as ImageIcon, Mic, MessageSquare, FileText, Link2, AlertTriangle } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import type { EvidenceItem } from '../types';

const CATEGORY_ICON: Record<string, React.ReactNode> = {
  visual: <ImageIcon className="w-4 h-4" />,
  audio: <Mic className="w-4 h-4" />,
  text: <MessageSquare className="w-4 h-4" />,
  metadata: <FileText className="w-4 h-4" />,
  network: <Link2 className="w-4 h-4" />,
};

const SEVERITY_STYLE: Record<string, { bg: string; dot: string }> = {
  high: { bg: 'border-red-300 dark:border-red-700/40 bg-red-500/10 dark:bg-red-950/20 text-red-700 dark:text-red-200', dot: 'bg-red-500' },
  medium: { bg: 'border-yellow-300 dark:border-yellow-700/40 bg-yellow-500/10 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-200', dot: 'bg-yellow-500' },
  low: { bg: 'border-slate-300 dark:border-slate-700/40 bg-slate-500/10 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300', dot: 'bg-slate-500' },
};

const SEVERITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

/**
 * The "explainability layer": shows *why* the AI reached its verdict as
 * structured, categorized, severity-ranked evidence instead of a flat list.
 * Falls back to wrapping plain red_flags strings for legacy/local records
 * that pre-date this field.
 */
export function ExplainabilityPanel({ evidence, fallbackFlags }: { evidence?: EvidenceItem[]; fallbackFlags?: string[] }) {
  const { t } = useLang();

  const items: EvidenceItem[] = evidence && evidence.length > 0
    ? evidence
    : (fallbackFlags || []).map((finding) => ({ category: 'text' as const, finding, severity: 'medium' as const }));

  if (items.length === 0) {
    return <p className="text-green-600 dark:text-green-400 text-sm">{t.noEvidence}</p>;
  }

  const sorted = [...items].sort((a, b) => (SEVERITY_ORDER[a.severity] ?? 3) - (SEVERITY_ORDER[b.severity] ?? 3));

  return (
    <ul className="space-y-2">
      {sorted.map((item, i) => {
        const style = SEVERITY_STYLE[item.severity] || SEVERITY_STYLE.low;
        return (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className={`flex items-start gap-3 p-3 rounded-xl border backdrop-blur-sm ${style.bg} transition-all hover:scale-[1.01]`}
          >
            {/* Category icon with color dot */}
            <div className="flex items-center gap-1.5 mt-0.5 flex-shrink-0">
              <span className={`w-2 h-2 rounded-full ${style.dot} shadow-[0_0_4px_currentColor]`} />
              <span className="opacity-80">
                {CATEGORY_ICON[item.category] || <AlertTriangle className="w-4 h-4" />}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium break-words">{item.finding}</p>
              {item.location && <p className="text-xs opacity-70 mt-0.5">📍 {item.location}</p>}
            </div>

            <span className={`text-[10px] uppercase tracking-wider font-bold mt-0.5 flex-shrink-0 px-2 py-0.5 rounded-full ${style.bg}`}>
              {item.severity}
            </span>
          </motion.li>
        );
      })}
    </ul>
  );
}
