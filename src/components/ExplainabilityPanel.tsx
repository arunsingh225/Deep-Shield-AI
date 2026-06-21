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

const SEVERITY_STYLE: Record<string, string> = {
  high: 'border-red-700/50 bg-red-950/30 text-red-200',
  medium: 'border-yellow-700/50 bg-yellow-950/30 text-yellow-200',
  low: 'border-slate-700/50 bg-slate-900/40 text-slate-300',
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
    return <p className="text-green-400 text-sm">{t.noEvidence}</p>;
  }

  const sorted = [...items].sort((a, b) => (SEVERITY_ORDER[a.severity] ?? 3) - (SEVERITY_ORDER[b.severity] ?? 3));

  return (
    <ul className="space-y-2">
      {sorted.map((item, i) => (
        <li
          key={i}
          className={`flex items-start gap-3 p-3 rounded-lg border ${SEVERITY_STYLE[item.severity] || SEVERITY_STYLE.low}`}
        >
          <span className="mt-0.5 opacity-80 flex-shrink-0">
            {CATEGORY_ICON[item.category] || <AlertTriangle className="w-4 h-4" />}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium break-words">{item.finding}</p>
            {item.location && <p className="text-xs opacity-70 mt-0.5">📍 {item.location}</p>}
          </div>
          <span className="text-[10px] uppercase tracking-wider font-bold opacity-70 mt-0.5 flex-shrink-0">
            {item.severity}
          </span>
        </li>
      ))}
    </ul>
  );
}
